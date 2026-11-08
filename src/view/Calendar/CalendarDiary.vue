<template>
    <div class="statistic-container diary-calendar-page" :style="`height:${projectStore.insets.heightPanel}px`">
        <div class="diary-calendar-layout">
            <!-- 年份：上为年，下为当年日记数 -->
            <aside class="diary-calendar-side">
                <button
                    type="button"
                    class="year-selector-item today"
                    :class="{checked: selectedKey === todayKey}"
                    @click="goToday"
                >今天</button>
                <button
                    type="button"
                    v-for="year in availableYears"
                    :key="year"
                    :class="['year-selector-item', {checked: selectedYear === year}]"
                    @click="selectYear(year)"
                >
                    <span class="year-num">{{ year }}</span>
                    <span class="year-count">{{ yearCountMap.get(year) || 0 }}</span>
                </button>
            </aside>

            <div class="diary-calendar-main">
                <div class="diary-calendar-grid">
                    <Loading v-if="isLoadingYear" :loading="isLoadingYear"/>
                    <section v-for="month in months" :key="month.month" class="diary-calendar-month">
                        <header>{{ month.name }}</header>
                        <div class="weekdays">
                            <span v-for="label in weekLabels" :key="label">{{ label }}</span>
                        </div>
                        <div class="days">
                            <button
                                v-for="(cell, index) in month.cells"
                                :key="month.month + '-' + index"
                                type="button"
                                :class="['day', {
                                    pad: !cell,
                                    today: cell && cell.key === todayKey,
                                    active: cell && cell.key === selectedKey,
                                    quiet: cell && !cell.count,
                                }]"
                                :disabled="!cell"
                                @click="cell && selectDay(cell.key)"
                            >
                                <template v-if="cell">
                                    <span class="num">{{ cell.day }}</span>
                                    <span class="bars" v-if="cell.colors.length">
                                        <i
                                            v-for="(color, colorIndex) in cell.colors"
                                            :key="colorIndex"
                                            :style="{background: color}"
                                        />
                                    </span>
                                </template>
                            </button>
                        </div>
                    </section>
                </div>

                <!-- 当日目录，或编辑器；年历宽度不随点开日记收缩 -->
                <aside class="diary-calendar-detail">
                    <div v-if="isEditing" class="diary-calendar-editor">
                        <div class="diary-calendar-editor-bar">
                            <button type="button" class="diary-calendar-back" @click="backToDayList">当日日记</button>
                        </div>
                        <Edit/>
                    </div>
                    <div v-else-if="isViewing" class="diary-calendar-viewer">
                        <div class="diary-calendar-editor-bar">
                            <button type="button" class="diary-calendar-back" @click="backToDayList">当日日记</button>
                            <button type="button" class="diary-calendar-back" @click="editCurrent">编辑</button>
                        </div>
                        <Detail compact/>
                    </div>
                    <template v-else>
                        <CalendarListHeader
                            v-if="selectedKey"
                            :date="selectedKey"
                        />
                        <Loading v-if="isLoadingDay" :loading="isLoadingDay"/>
                        <template v-else>
                            <button
                                v-for="item in focusedDayDiaries"
                                :key="item.id"
                                type="button"
                                class="diary-calendar-item"
                                @click="openDiary(item.id)"
                            >
                                <i :style="{background: statisticStore.getCategoryColor(item.category)}"/>
                                <span class="meta">{{ displayCategory(item.category) }}</span>
                                <span class="title">{{ displayTitle(item.title) }}</span>
                            </button>
                            <div class="diary-calendar-empty">
                                <p v-if="!focusedDayDiaries.length">这一天还没有日记</p>
                                <ButtonSmall @click="createDiaryForSelectedDay">写这一天</ButtonSmall>
                            </div>
                        </template>
                    </template>
                </aside>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import diaryApi from "@/api/diaryApi.ts";
import {EntityDiaryFromServerTitleOnly, DiarySearchParamsForCalendar} from "@/view/DiaryList/Diary.ts";
import {storeToRefs} from "pinia";
import Moment from "moment";
import CalendarListHeader from "@/view/Calendar/CalendarListHeader.vue";
import Edit from "@/view/Edit/Edit.vue";
import Detail from "@/view/Detail/Detail.vue";
import {useRouter, useRoute} from "vue-router";
import {useStatisticStore} from "@/pinia/useStatisticStore";
import Loading from "@/components/Loading.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";
import {MonthNameMap} from "@/view/Bill/Bill.ts";

interface DayCell {
    key: string
    day: number
    colors: string[]
    count: number
}

const weekLabels = ['一', '二', '三', '四', '五', '六', '日']
const projectStore = useProjectStore()
const statisticStore = useStatisticStore()
const router = useRouter()
const route = useRoute()

const selectedYear = ref(Moment().year())
const selectedKey = ref(Moment().format('YYYY-MM-DD'))
const isLoadingYear = ref(false)
const isLoadingDay = ref(false)
const yearDiaryMarks = ref<Array<{id: number, date: string, category: string}>>([])
const focusedDayDiaries = ref<Array<EntityDiaryFromServerTitleOnly>>([])

const todayKey = computed(() => Moment().format('YYYY-MM-DD'))
const preferDayList = ref(false)
const isViewing = computed(() => !preferDayList.value && route.name === 'CalendarDetail')
const isEditing = computed(() =>
    !preferDayList.value && (
        route.name === 'CalendarEdit' || (route.query.new === '1' && typeof route.query.date === 'string')
    )
)

const yearCountMap = computed(() => {
    const map = new Map<number, number>()
    statisticStore.statisticsYear.forEach(item => {
        map.set(Number(item.year), item.count)
    })
    return map
})

const availableYears = computed(() => {
    const years = new Set<number>([Moment().year()])
    statisticStore.statisticsYear.forEach(item => years.add(Number(item.year)))
    return Array.from(years).sort((a, b) => b - a)
})

// 按日记一条竖标，最多 8 条
const dayMarkMap = computed(() => {
    const map = new Map<string, {categories: string[], count: number}>()
    yearDiaryMarks.value.forEach(item => {
        const key = dayKey(item.date)
        if (!key) return
        const current = map.get(key) || {categories: [], count: 0}
        current.count += 1
        if (current.categories.length < 8) {
            current.categories.push(item.category)
        }
        map.set(key, current)
    })
    return map
})

const months = computed(() => {
    return Array.from({length: 12}, (_, index) => {
        const month = index + 1
        const monthKey = String(month).padStart(2, '0')
        const first = new Date(selectedYear.value, index, 1)
        const lead = (first.getDay() + 6) % 7
        const count = new Date(selectedYear.value, month, 0).getDate()
        const cells: Array<DayCell | null> = Array.from({length: lead}, () => null)
        for (let day = 1; day <= count; day++) {
            const key = `${selectedYear.value}-${monthKey}-${String(day).padStart(2, '0')}`
            const mark = dayMarkMap.value.get(key)
            cells.push({
                key,
                day,
                count: mark?.count || 0,
                colors: (mark?.categories || []).map(category => statisticStore.getCategoryColor(category)),
            })
        }
        // 补满 6 行，月份卡片等高
        while (cells.length < 42) {
            cells.push(null)
        }
        return {
            month: monthKey,
            name: MonthNameMap.get(monthKey) || `${month}月`,
            cells,
        }
    })
})

onMounted(() => {
    getYearDiaryMarks()
    loadDayDiaries(selectedKey.value)
    syncCreateQueryDate()
})

// navbar 新建只有 new=1，补上当前选中日期再打开编辑器
function syncCreateQueryDate() {
    if (route.query.new === '1' && typeof route.query.date !== 'string') {
        router.replace({
            query: {
                new: '1',
                date: selectedKey.value,
            },
        })
    }
}

function selectYear(year: number) {
    selectedYear.value = year
    selectedKey.value = year === Moment().year()
        ? todayKey.value
        : `${year}-01-01`
    getYearDiaryMarks()
    loadDayDiaries(selectedKey.value)
}

function goToday() {
    const year = Moment().year()
    selectedYear.value = year
    selectedKey.value = todayKey.value
    getYearDiaryMarks()
    loadDayDiaries(selectedKey.value)
}

function selectDay(key: string) {
    selectedKey.value = key
    loadDayDiaries(key)
    // 编辑态点日期：立刻切回当日目录，不依赖路由离开守卫
    if (Boolean(route.params.id) || route.query.new === '1') {
        preferDayList.value = true
        backToDayList()
    }
}

function openDiary(id: number) {
    preferDayList.value = false
    router.push({
        name: 'CalendarDetail',
        params: {id},
    })
}

function editCurrent() {
    const id = route.params.id
    if (!id) return
    preferDayList.value = false
    router.push({
        name: 'CalendarEdit',
        params: {id},
    })
}

// 按当前选中日期新建，年历保持全年网格
function createDiaryForSelectedDay() {
    preferDayList.value = false
    router.push({
        name: 'Calendar',
        query: {
            new: '1',
            date: selectedKey.value,
        },
    })
}

function backToDayList() {
    router.push({name: 'Calendar'})
}

function displayCategory(category: string) {
    return statisticStore.categoryNameMap.get(category) || category
}

function displayTitle(title: string) {
    if (!title) return '无标题'
    if (projectStore.isHideContent) {
        return title.replace(/[^，。 \n]/g, '*')
    }
    return title
}

function dayKey(raw: string | Date | number) {
    if (!raw) return ''
    return Moment(raw).format('YYYY-MM-DD')
}

function getYearDiaryMarks() {
    const formSearch: DiarySearchParamsForCalendar = {
        keywords: JSON.stringify(projectStore.keywords),
        pageNo: 1,
        pageSize: 9999,
        categories: JSON.stringify(projectStore.filteredCategories),
        filterShared: projectStore.isFilterShared ? 1 : 0,
        timeStart: Moment(`${selectedYear.value}-01-01`).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        timeEnd: Moment(`${selectedYear.value}-12-31`).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    }
    isLoadingYear.value = true
    diaryApi
        .listCategoryOnly(formSearch)
        .then(res => {
            yearDiaryMarks.value = (res.data || []).map(item => ({
                id: item.id,
                date: String(item.date),
                category: item.category,
            }))
        })
        .finally(() => {
            isLoadingYear.value = false
            projectStore.isListNeedBeReload = false
        })
}

function loadDayDiaries(key: string) {
    if (!key) return
    isLoadingDay.value = true
    focusedDayDiaries.value = []
    diaryApi
        .listTitleOnly({
            timeStart: Moment(key).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            timeEnd: Moment(key).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            keywords: JSON.stringify(projectStore.keywords),
            categories: JSON.stringify(projectStore.filteredCategories),
            filterShared: projectStore.isFilterShared ? 1 : 0,
            pageNo: 1,
            pageSize: 99,
        })
        .then(res => {
            focusedDayDiaries.value = res.data || []
        })
        .finally(() => {
            isLoadingDay.value = false
        })
}

const {isListNeedBeReload, listOperation} = storeToRefs(projectStore)
watch(isListNeedBeReload, newValue => {
    if (newValue) {
        nextTick(() => {
            getYearDiaryMarks()
            loadDayDiaries(selectedKey.value)
        })
    }
})

// 保存后刷新色点和当日目录
watch(listOperation, () => {
    getYearDiaryMarks()
    loadDayDiaries(selectedKey.value)
})

watch(() => route.query.new, () => {
    if (route.query.new === '1') preferDayList.value = false
    syncCreateQueryDate()
})
watch(() => route.params.id, id => {
    if (id) preferDayList.value = false
})
</script>

<style lang="scss">
@use "./calendar" as *
</style>
