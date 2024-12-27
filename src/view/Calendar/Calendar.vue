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
                                <div class="indicator" :style="`background-color:${item.color || item.highlight.color}`"></div>
                                <span >{{item.popover.label}}</span>
                            </div>
                        </div>
                    </template>
                </Calendar>

            </div>

            <div class="operation-panel">
                <ButtonSmall @click="loadCalendarPeriod" class="mb-2">日历 - 经期</ButtonSmall>
                <ButtonSmall @click="getDiaries">日历 - 日记</ButtonSmall>
            </div>
        </div>


    </div>
</template>

<script lang="ts" setup>
import PageHeader from "../../framework/pageHeader/PageHeader.vue"

import {useProjectStore} from "@/pinia";
const projectStore = useProjectStore();
import {nextTick, onMounted, ref, watch} from "vue";
import {Calendar} from 'v-calendar';
import diaryApi from "@/api/diaryApi.ts";
import {dateProcess, EnumWeekDayShort} from "@/utility.ts";
import {DiaryEntity, DiarySearchParams} from "@/view/DiaryList/Diary.ts";
import {storeToRefs} from "pinia";
import ButtonSmall from "@/components/ButtonSmall.vue";
import {CalendarAttribute} from "@/view/Calendar/VCalendar.ts";

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
    pageSize: 500, // 单页请求条数
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
                diary.categoryString = projectStore.categoryNameMap.get(diary.category)
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
                            backgroundColor: projectStore.categoryObjectMap.get(item.category).color
                        }
                    },
                    color: projectStore.categoryObjectMap.get(item.category).color,
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

const initPage = ref({year: 2024, month: 1, day: 1})
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
function loadCalendarPeriod(){
    diaryApi
        .getDiaryWithTitleKeyword({keyword: '经期记录'})
        .then(res => {
            if (res.data.content){
                let periodConfig = {
                    key: 'period',
                    highlight: {

                        start: {fillMode: 'light', color: EnumCalendarColor.red,},
                        base: {fillMode: 'light', color: EnumCalendarColor.red,},
                        end: {fillMode: 'light', color: EnumCalendarColor.red,},
                    },
                    dates: [
                        // {start: new Date('2024-12-20'), end: new Date('2024-12-27')},
                    ],
                    popover: {
                        label: '过往',
                        visibility: 'focus',
                    }
                }

                periodConfig.dates = res.data.content
                    .split('\n')
                    .map((item: string) => {
                        let tempDataArray = item.split(',')
                        return {
                            start: new Date(tempDataArray[0]),
                            end: new Date(tempDataArray[1]),
                        }
                    })
                attributes.value = CONFIG_PERIOD
                    .concat(periodConfig)
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
        .catch(err => {
            attributes.value = []
        })
}

const CONFIG_PERIOD = [
    {
        key: 'period-next',
        highlight: {

            start: {fillMode: 'outline', color: EnumCalendarColor.purple,},
            base: {fillMode: 'light', color: EnumCalendarColor.purple,},
            end: {fillMode: 'outline', color: EnumCalendarColor.purple,},
        },
        dates: [
            {start: new Date('2025-01-17'), end: new Date('2025-01-24')},
        ],
        popover: {
            label: '将来',
            visibility: 'focus',
        }
    },
    {
        key: 'vacation',
        highlight: {

            start: {fillMode: 'light', color: EnumCalendarColor.green,},
            base: {fillMode: 'light', color: EnumCalendarColor.green,},
            end: {fillMode: 'light', color: EnumCalendarColor.green,},
        },
        dates: [
            {start: new Date('2024-12-02'), end: new Date('2024-12-03')},
            {start: new Date('2025-01-02'), end: new Date('2025-01-03')},
        ],
        popover: {
            label: '🥰',
            visibility: 'hover',
        }
    },]

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
