<template>
    <div class="statistic-container">
        <PageHeader title="年度 TOP5"/>
        <div class="bill-content bill-year-top5-content" :style="`height:${projectStore.insets.heightPanel}px`">
            <div class="bill-year-top5-toolbar">
                <div class="year-selector">
                    <button
                        type="button"
                        v-for="year in availableYears"
                        :key="year"
                        :class="['year-selector-item', { checked: selectedYear === year }]"
                        @click="selectYear(year)"
                    >
                        {{ year }}
                    </button>
                </div>
            </div>

            <Loading v-if="isLoading" :loading="isLoading"/>

            <div v-else class="bill-top5-year-grid">
                <div
                    v-for="monthCard in monthCards"
                    :key="monthCard.month"
                    class="bill-top5-month-card"
                >
                    <div class="bill-top5-month-title">
                        <span class="month-name">{{ monthCard.monthName }}</span>
                        <span
                            v-if="monthCard.hasData"
                            class="top5-diff number"
                            :class="monthCard.top5Diff >= 0 ? 'text-income' : 'text-expense'"
                        >
                            {{ formatTop5Diff(monthCard.top5Diff) }}
                        </span>
                    </div>
                    <BillTop5Display
                        title="支出 TOP 5"
                        type="outcome"
                        :items="monthCard.outcomeTop5"
                        :month-data="monthCard.monthData"
                    />
                    <BillTop5Display
                        title="收入 TOP 5"
                        type="income"
                        :items="monthCard.incomeTop5"
                        :month-data="monthCard.monthData"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import billApi from "@/api/billApi.ts"
import Loading from "@/components/Loading.vue"
import PageHeader from "@/framework/pageHeader/PageHeader.vue"
import BillTop5Display from "@/view/Bill/BillTop5Display.vue"
import {EntityBillMonth, EntityBillTop5Item, MonthNameMap} from "@/view/Bill/Bill.ts"
import {popMessage} from "@/utility.ts"
import {useProjectStore} from "@/pinia/useProjectStore.ts"
import {computed, onMounted, ref} from "vue"
import {useRoute} from "vue-router"

interface MonthTop5Card {
    month: string
    monthName: string
    incomeTop5: Array<EntityBillTop5Item>
    outcomeTop5: Array<EntityBillTop5Item>
    top5Diff: number
    hasData: boolean
    monthData?: EntityBillMonth
}

const projectStore = useProjectStore()
const route = useRoute()

const isLoading = ref(false)
const selectedYear = ref(new Date().getFullYear())
const billYearData = ref<Array<EntityBillMonth>>([])

const availableYears = computed(() => {
    const yearNow = new Date().getFullYear()
    return Array.from({length: yearNow - 2022 + 1}, (_, index) => yearNow - index)
})

const monthCards = computed<Array<MonthTop5Card>>(() => {
    const monthMap = new Map<string, EntityBillMonth>()
    billYearData.value
        .filter(item => item.month_id.startsWith(String(selectedYear.value)))
        .forEach(item => monthMap.set(item.month, item))

    return Array.from({length: 12}, (_, index) => {
        const month = String(index + 1).padStart(2, '0')
        const monthData = monthMap.get(month)
        const incomeTop5 = monthData?.incomeTop5 ?? []
        const outcomeTop5 = monthData?.outcomeTop5 ?? []
        const incomeSum = sumTop5Block(incomeTop5)
        const outcomeSum = sumTop5Block(outcomeTop5)
        return {
            month,
            monthName: MonthNameMap.get(month) ?? month,
            incomeTop5,
            outcomeTop5,
            top5Diff: incomeSum - outcomeSum,
            hasData: incomeTop5.length > 0 || outcomeTop5.length > 0,
            monthData,
        }
    })
})

function sumTop5Block(items: Array<EntityBillTop5Item>): number {
    return items.reduce((sum, item) => sum + Math.abs(item.price), 0)
}

function formatTop5Diff(diff: number): string {
    const value = diff.toFixed(projectStore.moneyAccuracy)
    return diff > 0 ? `+${value}` : value
}

onMounted(() => {
    const queryYear = Number(route.query.year)
    if (queryYear >= 2022 && queryYear <= new Date().getFullYear()) {
        selectedYear.value = queryYear
    }
    loadData()
})

function selectYear(year: number) {
    if (selectedYear.value === year) {
        return
    }
    selectedYear.value = year
    loadData()
}

function loadData() {
    isLoading.value = true
    billApi
        .sorted({
            years: String(selectedYear.value),
            keyword: '',
        })
        .then(res => {
            isLoading.value = false
            billYearData.value = res.data
        })
        .catch(err => {
            isLoading.value = false
            popMessage('warning', err.message)
        })
}
</script>

<style lang="scss">
@use "sass:color" as color;
@use "../../scss/plugin" as *;
@use "bill" as *;

.bill-year-top5-content{
    display: flex;
    flex-flow: column nowrap;
}

.bill-year-top5-toolbar{
    flex-shrink: 0;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: 8px;
    padding: 16px 20px;
    background-color: white;
    border-bottom: 1px solid $color-border-light;
    .year-selector{
        display: flex;
        flex-flow: row wrap;
        gap: 6px;
    }
    .year-selector-item{
        border: 1px solid transparent;
        @extend .btn-like;
        background-color: $bg-light;
        color: $text-title;
        padding: 5px 10px;
        border-radius: $radius-mobile;
        font-size: $fz-main;
        cursor: pointer;
        &.checked{
            border-color: $orange;
            background-color: color.adjust($color-main, $lightness: 20%);
            font-weight: bold;
        }
    }
}

.bill-top5-year-grid{
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    padding: 20px;
    align-content: start;
}

.bill-top5-month-card{
    background-color: white;
    border: 1px solid $color-border-bill;
    border-radius: $radius-pc;
    padding: 14px 16px;
    .bill-top5-month-title{
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 12px;
        font-family: serif;
        font-size: $fz-title;
        font-weight: bold;
        margin-bottom: 10px;
        padding-bottom: 8px;
        border-bottom: 1px solid $color-border-light;
        color: $text-title;
        .month-name{
            flex-shrink: 0;
        }
        .top5-diff{
            flex-shrink: 0;
            font-family: "JetBrainsMonoDiary", sans-serif;
            font-size: $fz-main;
        }
    }
}

@media (max-width: $grid-separate-width-sm) {
    .bill-year-top5-toolbar{
        padding: 10px;
    }
    .bill-top5-year-grid{
        grid-template-columns: 1fr;
        padding: 10px;
    }
}

@media (prefers-color-scheme: dark) {
    .bill-year-top5-toolbar{
        background-color: $dark-bg-dark;
        border-bottom-color: $dark-border;
        .year-selector-item{
            background-color: $dark-bg;
            color: $dark-text-title;
            &.checked{
                background-color: color.adjust($color-main, $lightness: -10%);
            }
        }
    }
    .bill-top5-month-card{
        background-color: $dark-bg-dark;
        border-color: $dark-border;
        .bill-top5-month-title{
            color: $dark-text-title;
            border-bottom-color: $dark-border;
        }
    }
}
</style>
