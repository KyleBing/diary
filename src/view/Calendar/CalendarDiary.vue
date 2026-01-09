<template>
    <div class="statistic-container">

        <PageHeader title="日历"/>

        <div class="calendar-container" :style="`height:${projectStore.insets.heightPanel}px`">

            <!-- 日历本体 -->
            <div class="calendar"
                :style="`height:${projectStore.insets.heightPanel}px; overflow-y: auto;`"
            >
                <Calendar
                    timezone="Asia/Hong_Kong"
                    show-weeknumbers
                    title-position="center"
                    :initial-page="initPage"
                    :attributes="attributes"
                    locale="zh"
                    :first-day-of-week="1"
                    :rows="calendarRow"
                    :columns="calendarCol"
                    @dayclick="getDiaryListOfDay"
                    @did-move="onPageChange">
                    <template #day-popover="{ day, dayTitle, attributes, format, masks}">
                        <div class="popover-list">
                            <div
                                class="popover-list-item"
                                v-for="(item, index) in focusedDayDiaries" :key="index">
                                <div class="indicator"
                                     :style="`background-color:${item.color || item.highlight.color}`"/>
                                <span >{{item.title}}</span>
                            </div>
                        </div>
                    </template>
                </Calendar>
            </div>


            <!-- 日记列表 -->
            <div class="calendar-diary-list pl-2 pr-2"
                :style="`height:${projectStore.insets.heightPanel}px; overflow-y: auto;`">

                <CalendarListHeader
                    v-if="currentFocusedDay"
                    :date="currentFocusedDay.id"
                />
                <div v-if="focusedDayDiaries.length > 0">
                    <DiaryListItemLong
                        @click="diaryListItemLongClicked(item)"
                        v-for="item in focusedDayDiaries"
                        :key="item.id"
                        :isActive="route.params.id === String(item.id)"
                        :category="item.category"
                        :diary="item"
                        :isShowDate="false"
                        :isShowWeek="false"
                    />
                </div>
                <div v-else class="p-2">
                    <Loading :loading="isLoadingFocusedDayDiaries"/>
                </div>
            </div>

            <div class="calendar-operation-panel" v-if="calendarCol !== 4">
                <Edit></Edit>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import PageHeader from "@/framework/pageHeader/PageHeader.vue"

import {useProjectStore} from "@/pinia/useProjectStore.ts";
const projectStore = useProjectStore();
import {nextTick, onMounted, ref, watch} from "vue";
import {Calendar} from 'v-calendar';
import diaryApi from "@/api/diaryApi.ts";
import {dateProcess, EnumWeekDayShort} from "@/utility.ts";
import {EntityDiaryForm, EntityDiaryFromServerCategoryOnly, DiarySearchParamsForCalendar} from "@/view/DiaryList/Diary.ts";
import {storeToRefs} from "pinia";
import {CalendarAttribute} from "@/view/Calendar/VCalendar.ts";
import Moment from "moment";
import DiaryListItemLong from "@/view/DiaryList/DiaryListItemLong/DiaryListItemLong.vue";
import CalendarListHeader from "@/view/Calendar/CalendarListHeader.vue";
import Edit from "@/view/Edit/Edit.vue";

import {useRouter, useRoute} from "vue-router";
import { useStatisticStore } from "@/pinia/useStatisticStore";
import Loading from "@/components/Loading.vue";

interface CalendarDay {
    id: string, // 2025-08-02
    date: Date,
    day: number,
    month: number,
    year: number,
    weekday: number,
}

const router = useRouter()
const route = useRoute()

const currentFocusedDay = ref<CalendarDay>()

const calendarRow = ref(3)
const calendarCol = ref(4)

enum EnumCalendarColor {
    'gray' = 'gray',
    'red' = 'red',
    'orange' = 'orange',
    'yellow' = 'yellow',
    'green' = 'green',
    'teal' = 'teal',
    'blue' = 'blue',
    'indigo' = 'indigo',
    'purple' = 'purple',
    'pink' = 'pink'
}

/**
 * Diary List
 */
const diaryList = ref<Array<EntityDiaryForm>>([])
const formSearch = ref<DiarySearchParamsForCalendar>({
    keywords: '',
    pageNo: 1,
    pageSize: 1000, // 单页请求条数
    categories: '',
    filterShared: 0, // 1 是筛选，0 是不筛选
    dateFilterString: '', // 日记年月筛选

    dateStart: Moment().startOf('year').format('YYYY-MM-DD'),  // 2025-01-01
    dateEnd: Moment().endOf('year').format('YYYY-MM-DD')  // 2025-12-31
})
const isLoading =  ref(false)

// 获取显示的日历日记列表
function getAllShowingCalendarDiaries() {
    formSearch.value.pageNo = 1
    formSearch.value.keywords = JSON.stringify(projectStore.keywords)
    formSearch.value.categories = JSON.stringify(projectStore.filteredCategories)
    formSearch.value.filterShared = projectStore.isFilterShared ? 1 : 0
    diaryList.value = []

    isLoading.value = true
    diaryApi
        .listCategoryOnly(formSearch.value)
        .then(res => {
            isLoading.value = false
            diaryList.value = res.data.map((diary: EntityDiaryFromServerCategoryOnly) => {
                diary.categoryString = useStatisticStore().categoryNameMap.get(diary.category)
                diary.weekday = dateProcess(diary.date).weekday
                diary.weekdayShort = EnumWeekDayShort[new Date(diary.date).getDay()]
                diary.dateString = dateProcess(diary.date).date
                return diary
            })

            attributes.value = []

            attributes.value = [{
                key: '今天',
                highlight: {
                    fillMode: 'solid',
                    color: EnumCalendarColor.red
                },
                dates: new Date(),
                popover: {
                    label: '今天',
                    visibility: 'focus',
                    hideIndicator: false, // 隐藏不同类别标识
                }
            }]

            // 如果有选中的日期，重新添加选中日期的高亮
            if (currentFocusedDay.value) {
                updateSelectedDateHighlight(currentFocusedDay.value.date)
            }

            diaryList.value.forEach(item => {
                attributes.value.push({
                    key: item.id,
                    bar: {
                        style: {
                            backgroundColor: useStatisticStore().categoryObjectMap.get(item.category).color
                        }
                    },
                    color: useStatisticStore().categoryObjectMap.get(item.category).color,
                    dates: new Date(item.date),
                    popover: {
                        label: item.title,
                        visibility: 'click',
                        hideIndicator: false, // 隐藏弹窗中不同条目的类别标识，在条目前面的标识
                    }
                },)
            })
        })
        .finally(() => {
            // 列表加载完成后设置列表重载： false
            projectStore.isListNeedBeReload = false
        })
}


// 鼠标点击某个天时，获取该天的日记列表
const focusedDayDiaries = ref<Array<EntityDiaryForm>>([])
const isLoadingFocusedDayDiaries = ref(false)
function getDiaryListOfDay(day: CalendarDay) {

    calendarCol.value = 4
    console.log('getDiaryListOfDay', day)
    currentFocusedDay.value = day

    // 更新选中的日期高亮
    updateSelectedDateHighlight(day.date)

    isLoadingFocusedDayDiaries.value = true
    focusedDayDiaries.value = []  // 清空列表
    diaryApi
        .listAll({
            dateStart: Moment(day.date).format('YYYY-MM-DD'),
            dateEnd: Moment(day.date).format('YYYY-MM-DD'),
            keywords: JSON.stringify(projectStore.keywords),
            categories: JSON.stringify(projectStore.filteredCategories),
            dateFilterString: projectStore.dateFilterString,
            filterShared: projectStore.isFilterShared ? 1 : 0,
        })
        .then(res => {
            focusedDayDiaries.value = res.data.map(diary => {
                if (diary.content) {
                    diary.contentHtml = diary.content.replace(/\n/g, '<br/>')
                }
                diary.categoryString = useStatisticStore().categoryNameMap.get(diary.category)
                diary.weekday = dateProcess(diary.date).weekday
                diary.weekdayShort = EnumWeekDayShort[new Date(diary.date).getDay()]
                diary.dateString = dateProcess(diary.date).date
                diary.color = useStatisticStore().categoryObjectMap.get(diary.category).color
                return diary
            })
        })
        .finally(() => {
            isLoadingFocusedDayDiaries.value = false
        })
}

// 更新选中日期的高亮显示
function updateSelectedDateHighlight(selectedDate: Date) {
    // 找到现有的选中日期属性并更新，或者添加新的
    const selectedDateIndex = attributes.value.findIndex(attr => attr.key === '选中的日期')

    if (selectedDateIndex !== -1) {
        // 更新现有的选中日期属性
        attributes.value[selectedDateIndex].dates = selectedDate
    } else {
        // 添加新的选中日期属性
        attributes.value.push({
            key: '选中的日期',
            highlight: {
                fillMode: 'solid',
                color: EnumCalendarColor.blue
            },
            dates: selectedDate
        })
    }
}

// 日记列表点击
function diaryListItemLongClicked(item: EntityDiaryForm) {
    calendarCol.value = 2
    router.push({
        name: 'CalendarEdit',
        params: {id: item.id}
    })
}


onMounted(() => {
    getAllShowingCalendarDiaries()
    // 为初始页面初始化日期范围
    onPageChange(initPage.value)
})


const {isListNeedBeReload} = storeToRefs(projectStore)
watch(isListNeedBeReload, newValue => {
    if (newValue) {
        attributes.value = []
        nextTick(()=>{
            getAllShowingCalendarDiaries()
        })
    }
})

const initPage = ref({
    year: Moment().get('years'),
    month: Moment().startOf('year').get('months') + 1,
    day: 1
})

// 跟踪当前页面和日期范围
const minDate = ref<Date>()
const maxDate = ref<Date>()

// 处理日历页面滑动时的变化
function onPageChange(data: any) {

    let minDateValue: Date
    let maxDateValue: Date

    // 检查数据类型并相应处理
    if (Array.isArray(data)) {
        // 数组格式：包含所有显示的月份
        const firstMonth = data[0]
        const lastMonth = data[data.length - 1]

        const firstMonthDate = Moment().year(firstMonth.year).month(firstMonth.month - 1).startOf('month')
        const lastMonthDate = Moment().year(lastMonth.year).month(lastMonth.month - 1).endOf('month')

        minDateValue = firstMonthDate.toDate()
        maxDateValue = lastMonthDate.toDate()

        console.log('日历页面已更改 (数组格式):', {
            monthsCount: data.length,
            firstMonth,
            lastMonth,
            dateRange: `${firstMonthDate.format('YYYY-MM-DD')} 到 ${lastMonthDate.format('YYYY-MM-DD')}`
        })
    } else {
        // 对象格式：忽略

    }

    minDate.value = minDateValue
    maxDate.value = maxDateValue

    // 可选择为新日期范围重新加载数据
    updateDateRangeForSearch()
}

// 可选：根据当前日期范围更新搜索参数
function updateDateRangeForSearch() {
    if (minDate.value && maxDate.value) {
        formSearch.value.dateStart = Moment(minDate.value).format('YYYY-MM-DD')
        formSearch.value.dateEnd = Moment(maxDate.value).format('YYYY-MM-DD')

        // 可选择为新范围重新加载日记数据
        getAllShowingCalendarDiaries()
    }
}
const attributes = ref<Array<CalendarAttribute>>([
    {
        key: '今天',
        highlight: {
            fillMode: 'solid',
            color: EnumCalendarColor.red
        },
        dates: new Date(),
        popover: {
            label: '今天',
            visibility: 'hover',
            hideIndicator: true, // 隐藏不同类别标识
        }
    }
])



</script>

<style lang="scss">
@import "./calendar.scss"
</style>
