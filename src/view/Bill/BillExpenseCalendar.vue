<template>
    <div class="bill-calendar-layout">
        <aside class="bill-calendar-side">
            <button
                type="button"
                v-for="year in availableYears"
                :key="year"
                :class="['year-selector-item', {checked: selectedYear === year}]"
                @click="selectYear(year)"
            >
                {{ year }}
            </button>
            <div class="bill-calendar-legend">
                <span>多</span>
                <i v-for="step in 5" :key="step" :style="{background: heatColor((6 - step) / 5)}"/>
                <span>少</span>
            </div>
            <div class="bill-calendar-side-sum number" v-if="yearSpend">{{ yearSpend.toFixed(0) }}</div>
        </aside>
        <div class="bill-calendar-main">
            <Loading v-if="isLoading" :loading="isLoading"/>
            <div v-else class="bill-calendar-body">
                <div class="bill-calendar-grid">
                    <section v-for="month in months" :key="month.month" class="bill-calendar-month">
                        <header>
                            <span>{{ month.name }}</span>
                            <span class="number expense" v-if="month.spend">{{ compactAmount(month.spend) }}</span>
                        </header>
                        <div class="weekdays">
                            <span v-for="label in weekLabels" :key="label">{{ label }}</span>
                        </div>
                        <div class="days">
                            <button
                                v-for="(cell, index) in month.cells"
                                :key="month.month + '-' + index"
                                type="button"
                                :class="['day', {pad: !cell, active: cell && selectedKey === cell.key, quiet: cell && !cell.diary}]"
                                :style="cell && cell.diary ? {background: heatColor(cell.level)} : undefined"
                                :disabled="!cell || !cell.diary"
                                :title="cell && cell.spend ? String(cell.spend.toFixed(0)) : undefined"
                                @click="cell && selectDay(cell)"
                            >
                                <template v-if="cell">
                                    <span class="num">{{ cell.day }}</span>
                                    <span v-if="cell.spend" class="spend">{{ compactAmount(cell.spend) }}</span>
                                </template>
                            </button>
                        </div>
                    </section>
                </div>
                <aside class="bill-calendar-detail" v-if="selected">
                    <div class="detail-date">{{ selected.label }}</div>
                    <div class="detail-sum">
                        <span>收入 <b class="text-income">{{ formatSigned(selected.day.sumIncome) }}</b></span>
                        <span>支出 <b class="text-expense">{{ formatSigned(selected.day.sumOutput) }}</b></span>
                    </div>
                    <table>
                        <tr v-for="(item, index) in selected.day.items" :key="index">
                            <td>{{ item.item }}</td>
                            <td class="number">{{ item.price.toFixed(projectStore.moneyAccuracy) }}</td>
                        </tr>
                    </table>
                    <ButtonSmall @click="openDiary">打开这篇账单</ButtonSmall>
                </aside>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import billApi from "@/api/billApi.ts"
import ButtonSmall from "@/components/ButtonSmall.vue"
import Loading from "@/components/Loading.vue"
import {popMessage} from "@/utility.ts"
import {useProjectStore} from "@/pinia/useProjectStore.ts"
import {EntityBillDay, EntityBillMonth, MonthNameMap} from "@/view/Bill/Bill.ts"
import {computed, onMounted, ref} from "vue"
import {useRouter} from "vue-router"

interface DayCell {
    key: string
    day: number
    spend: number
    level: number
    diary?: EntityBillDay
}

const weekLabels = ['一', '二', '三', '四', '五', '六', '日']
const projectStore = useProjectStore()
const router = useRouter()
const isLoading = ref(false)
const selectedYear = ref(new Date().getFullYear())
const billYearData = ref<EntityBillMonth[]>([])
const selectedKey = ref('')

const availableYears = computed(() => {
    const yearNow = new Date().getFullYear()
    return Array.from({length: yearNow - 2022 + 1}, (_, index) => yearNow - index)
})

const dayMap = computed(() => {
    const map = new Map<string, EntityBillDay>()
    for (const month of billYearData.value) {
        for (const day of month.days) {
            const key = dayKey(day.date)
            if (key) map.set(key, day)
        }
    }
    return map
})

const maxSpend = computed(() => {
    let max = 0
    dayMap.value.forEach(day => {
        max = Math.max(max, spendOf(day))
    })
    return max || 1
})

const yearSpend = computed(() => {
    let sum = 0
    dayMap.value.forEach(day => {
        sum += spendOf(day)
    })
    return sum
})

const months = computed(() => {
    return Array.from({length: 12}, (_, index) => {
        const month = index + 1
        const monthKey = String(month).padStart(2, '0')
        const first = new Date(selectedYear.value, index, 1)
        const lead = (first.getDay() + 6) % 7
        const count = new Date(selectedYear.value, month, 0).getDate()
        const cells: Array<DayCell | null> = Array.from({length: lead}, () => null)
        let spend = 0
        for (let day = 1; day <= count; day++) {
            const key = `${selectedYear.value}-${monthKey}-${String(day).padStart(2, '0')}`
            const diary = dayMap.value.get(key)
            const daySpend = diary ? spendOf(diary) : 0
            spend += daySpend
            cells.push({
                key,
                day,
                spend: daySpend,
                level: diary ? Math.sqrt(daySpend / maxSpend.value) : 0,
                diary,
            })
        }
        return {
            month: monthKey,
            name: MonthNameMap.get(monthKey) || monthKey,
            spend,
            cells,
        }
    })
})

const selected = computed(() => {
    const day = dayMap.value.get(selectedKey.value)
    if (!day) return null
    const date = parseDiaryDate(day.date)
    const label = date
        ? `${date.getMonth() + 1}月${date.getDate()}日 ${weekLabels[(date.getDay() + 6) % 7]}`
        : selectedKey.value
    return {day, label}
})

onMounted(() => {
    loadYear()
})

function selectYear(year: number) {
    selectedYear.value = year
    selectedKey.value = ''
    loadYear()
}

function loadYear() {
    isLoading.value = true
    billApi
        .sorted({years: String(selectedYear.value), keyword: ''})
        .then(res => {
            billYearData.value = res.data || []
        })
        .catch(err => popMessage('warning', err.message))
        .finally(() => {
            isLoading.value = false
        })
}

function selectDay(cell: DayCell) {
    if (!cell.diary) return
    selectedKey.value = cell.key
}

function openDiary() {
    const id = selected.value?.day.id
    if (!id) return
    router.push({name: 'Edit', params: {id}})
}

function spendOf(day: EntityBillDay) {
    return Math.abs(Math.min(day.sumOutput || 0, 0))
}

function heatColor(level: number) {
    const alpha = 0.08 + Math.min(Math.max(level, 0), 1) * 0.82
    return `rgba(1, 166, 122, ${alpha})`
}

function compactAmount(value: number) {
    const amount = Math.abs(value)
    if (amount >= 10000) {
        return `${(amount / 10000).toFixed(1).replace(/\.0$/, '')}万`
    }
    return String(Math.round(amount))
}

function formatSigned(value: number) {
    if (!value) return '~'
    const text = value.toFixed(projectStore.moneyAccuracy)
    return value > 0 ? `+${text}` : text
}

function dayKey(raw: string) {
    const date = parseDiaryDate(raw)
    if (!date) return ''
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${date.getFullYear()}-${month}-${day}`
}

function parseDiaryDate(raw: string) {
    if (!raw) return null
    const text = String(raw).trim()
    const normalized = text.includes('T') ? text : text.replace(' ', 'T')
    const parsed = new Date(normalized)
    if (!Number.isNaN(parsed.getTime())) return parsed
    const matched = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (!matched) return null
    return new Date(Number(matched[1]), Number(matched[2]) - 1, Number(matched[3]))
}
</script>

<style lang="scss">
@use "bill" as *;
</style>
