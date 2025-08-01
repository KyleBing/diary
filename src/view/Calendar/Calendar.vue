<template>
    <div class="statistic-container">
        <PageHeader title="日历"/>

        <div class="calendar-container" :style="`height:${projectStore.insets.heightPanel}px`">

            <div class="calendar" :style="`height:${projectStore.insets.heightPanel - 40}px`">
                <Calendar
                    timezone="Asia/Hong_Kong"
                    show-weeknumbers
                    title-position="center"
                    :initial-page="initPage"
                    :attributes="attributes"
                    locale="zh"
                    :first-day-of-week="1"
                    :rows="3"
                    :columns="4"
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

            <div class="operation-panel">
                <ButtonSmall @click="getShowingCalendarDiaries" class="mb-2">日历 - 日记</ButtonSmall>
                <ButtonSmall @click="loadCalendarPeriod" class="mb-2">日历 - 经期</ButtonSmall>
                <ButtonSmall v-if="periodDiary?.id" @click="router.push({name: 'Edit', params: {id: periodDiary.id}})" class="mb-2">编辑经期日历</ButtonSmall>

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import PageHeader from "../../framework/pageHeader/PageHeader.vue"

import {useProjectStore} from "@/pinia/useProjectStore.ts";
const projectStore = useProjectStore();
import {nextTick, onMounted, ref, watch} from "vue";
import {Calendar} from 'v-calendar';
import diaryApi from "../../api/diaryApi.ts";
import {dateProcess, EnumWeekDayShort} from "@/utility.ts";
import {DiaryEntity, DiaryEntityFromServerCategoryOnly, DiaryEntityFromServerTitleOnly, DiarySearchParams, DiarySearchParamsForCalendar} from "@/view/DiaryList/Diary.ts";
import {storeToRefs} from "pinia";
import ButtonSmall from "@/components/ButtonSmall.vue";
import {CalendarAttribute, CalendarEntity} from "@/view/Calendar/VCalendar.ts";
import Moment from "moment";

import {useRouter} from "vue-router";
import jsYaml from "js-yaml"
import { useStatisticStore } from "@/pinia/useStatisticStore";

const router = useRouter()

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
const diaries = ref<Array<DiaryEntity>>([])
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
function getShowingCalendarDiaries() {
    formSearch.value.pageNo = 1
    formSearch.value.keywords = JSON.stringify(projectStore.keywords)
    formSearch.value.categories = JSON.stringify(projectStore.filteredCategories)
    formSearch.value.filterShared = projectStore.isFilterShared ? 1 : 0
    diaries.value = []

    isLoading.value = true
    diaryApi
        .lietCategoryOnly(formSearch.value)
        .then(res => {
            isLoading.value = false
            diaries.value = res.data.map((diary: DiaryEntityFromServerCategoryOnly) => {
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

            diaries.value.forEach(item => {
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
const focusedDayDiaries = ref<Array<DiaryEntity>>([])
function getDiaryListOfDay(day: Date) {
    diaryApi
    .listTitleOnly({
        dateStart: Moment(day).format('YYYY-MM-DD'),
        dateEnd: Moment(day).format('YYYY-MM-DD'),
        keywords: JSON.stringify(projectStore.keywords),
    })
    .then(res => {
        focusedDayDiaries.value = res.data.map((diary: DiaryEntityFromServerTitleOnly) => {
            diary.categoryString = useStatisticStore().categoryNameMap.get(diary.category)
            diary.weekday = dateProcess(diary.date).weekday
            diary.weekdayShort = EnumWeekDayShort[new Date(diary.date).getDay()]
            diary.dateString = dateProcess(diary.date).date
            diary.color = useStatisticStore().categoryObjectMap.get(diary.category).color
            return diary
        })
    })
}


onMounted(() => {
    getShowingCalendarDiaries()
    // 为初始页面初始化日期范围
    onPageChange(initPage.value)
})


const {isListNeedBeReload} = storeToRefs(projectStore)
watch(isListNeedBeReload, newValue => {
    if (newValue) {
        attributes.value = []
        nextTick(()=>{
            getShowingCalendarDiaries()
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
    console.log('onPageChange', data)
    
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
        getShowingCalendarDiaries()
    }
}
const attributes = ref<Array<CalendarAttribute>>([{
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
},])


/**
 * 经期数据
 */
const periodDiary = ref<DiaryEntity>()
function loadCalendarPeriod(){
    diaryApi
        .getDiaryWithTitleKeyword({keyword: '经期记录'})
        .then(res => {
            periodDiary.value = res.data
            if (res.data.content){

                let calendars = jsYaml.load(res.data.content).calendars as Array<CalendarEntity>
                console.log(calendars)
                let calendarConfigArray = calendars.map(calendar => {
                    return {
                        key: calendar.name,
                        highlight: {
                            start: {fillMode: 'light', color: EnumCalendarColor[calendar.color],},
                            base: {fillMode: 'light', color: EnumCalendarColor[calendar.color],},
                            end: {fillMode: 'light', color: EnumCalendarColor[calendar.color],},
                        },
                        dates: calendar.dates.map(dates => {
                            return {
                                start: dates[0],
                                end: dates[1],
                            }
                        }),
                        popover: {
                            label: calendar.name,
                            visibility: 'hover',
                        }
                    }
                })

                console.log(calendarConfigArray)
                attributes.value = []
                    .concat(calendarConfigArray)
                    .concat( {
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
                    },)
            }
        })
        .catch(() => {
            attributes.value = []
        })
}



</script>

<style lang="scss">
@import "../../scss/plugin";

.calendar-container{
    padding: 20px;
    flex-shrink: 0;
    display: flex;
    justify-content: flex-start;
    overflow-y: auto;
}
.calendar{
    overflow-y: auto;

}
.operation-panel{
    margin-left: 30px;
}

.popover-list{
    padding: 5px;
    font-size: $fz-small;

    .popover-list-item{
        padding: 1px 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .indicator{
            margin-right: 5px;
            display: block;
            @include border-radius(10px);
            width: 12px;
            height: 4px;
        }
    }
}

</style>
