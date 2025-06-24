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
                    :columns="4">
                    <template #day-popover="{ day, dayTitle, attributes, format, masks}">
                        <div class="popover-list">
                            <div
                                class="popover-list-item"
                                v-for="(item, index) in attributes as Array<CalendarAttribute>" :key="index">
                                <div class="indicator"
                                     :style="`background-color:${item.color || item.highlight.color}`"/>
                                <span >{{item.popover.label}}</span>
                            </div>
                        </div>
                    </template>
                </Calendar>

            </div>

            <div class="operation-panel">
                <ButtonSmall @click="getDiaries" class="mb-2">日历 - 日记</ButtonSmall>
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
import {DiaryEntity, DiarySearchParams} from "@/view/DiaryList/Diary.ts";
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
const formSearch = ref<DiarySearchParams>({
    keywords: '',
    pageNo: 1,
    pageSize: 1000, // 单页请求条数
    categories: '',
    filterShared: 0, // 1 是筛选，0 是不筛选
    dateFilterString: '' // 日记年月筛选
})
const isLoading =  ref(false)
function getDiaries() {
    formSearch.value.pageNo = 1
    formSearch.value.keywords = JSON.stringify(projectStore.keywords)
    formSearch.value.categories = JSON.stringify(projectStore.filteredCategories)
    formSearch.value.dateFilterString = projectStore.dateFilterString
    formSearch.value.filterShared = projectStore.isFilterShared ? 1 : 0
    diaries.value = []

    isLoading.value = true
    diaryApi
        .listTitleOnly(formSearch.value)
        .then(res => {
            isLoading.value = false

            diaries.value = res.data.map((diary: DiaryEntity) => {
                if (diary.content) {
                    diary.contentHtml = diary.content.replace(/\n/g, '<br/>')
                }
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


onMounted(() => {
    getDiaries()
})


const {isListNeedBeReload} = storeToRefs(projectStore)
watch(isListNeedBeReload, newValue => {
    if (newValue) {
        attributes.value = []
        nextTick(()=>{
            getDiaries()
        })
    }
})

const initPage = ref({
    year: Moment().add(-5, 'month').get('years'),
    month: Moment().add(-5, 'month').get('months'),
    day: 1
})
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


onMounted(()=>{

})





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
