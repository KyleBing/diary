<template>
    <div class="statistic-container">
        <PageHeader title="日历"/>

        <div class="bill-content" :style="`height:${storeProject.insets.heightPanel}px`">
            <Calendar
                timezone="Asia/Hong_Kong"
                show-weeknumbers
                title-position="center"
                :initial-page="initPage"
                :attributes="attributes"
                locale="zh"
                :first-day-of-week="1"
                :rows="3"
                :columns="4"/>
        </div>

    </div>
</template>

<script lang="ts" setup>
import PageHeader from "../../framework/pageHeader/PageHeader.vue"

import {useProjectStore} from "@/pinia";
const storeProject = useProjectStore();
import {onMounted, ref} from "vue";
import {Calendar} from 'v-calendar';
import ButtonNormal from "@/components/ButtonNormal.vue";
import Button from "@/components/Button.vue";
import diaryApi from "@/api/diaryApi.ts";
import {dateProcess, EnumWeekDayShort} from "@/utility.ts";
import {DiaryEntity, DiarySearchParams} from "@/view/DiaryList/Diary.ts";

const projectStore = useProjectStore()

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
    pageSize: 100, // 单页请求条数
    categories: '',
    filterShared: 0, // 1 是筛选，0 是不筛选
    dateFilterString: '' // 日记年月筛选
})

function getDiaries() {
    diaryApi
        .list(formSearch.value)
        .then(res => {
            let newDiariesList = res.data.map((diary: DiaryEntity) => {
                if (diary.content) {
                    diary.contentHtml = diary.content.replace(/\n/g, '<br/>')
                }
                diary.categoryString = storeProject.categoryNameMap.get(diary.category)
                diary.weekday = dateProcess(diary.date).weekday
                diary.weekdayShort = EnumWeekDayShort[new Date(diary.date).getDay()]
                diary.dateString = dateProcess(diary.date).date
                return diary
            })

            // diary operation
            diaries.value = diaries.value.concat(newDiariesList)

            diaries.value.forEach(item => {
                attributes.value.push({
                    key: item.id,
                    bar: {
                        style: {
                            backgroundColor: projectStore.categoryObjectMap.get(item.category).color
                        }
                    },
                    dates: new Date(item.date),
                    popover: {
                        label: item.title,
                        visibility: 'click',
                        hideIndicator: false, // 隐藏不同类别标识
                    }
                },)
            })
        })
        .finally(() => {
            // 列表加载完成后设置列表重载： false
            storeProject.isListNeedBeReload = false
        })
}


onMounted(() => {
    getDiaries()
})

const initPage = ref({year: 2024, month: 1, day: 1})
const attributes = ref([
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
    },
    // {
    //     key: 'period',
    //     highlight: {
    //
    //         start: {fillMode: 'light', color: EnumCalendarColor.red,},
    //         base: {fillMode: 'light', color: EnumCalendarColor.red,},
    //         end: {fillMode: 'light', color: EnumCalendarColor.red,},
    //     },
    //     dates: [
    //         {start: new Date('2024-10-01'), end: new Date('2024-10-07')},
    //         {start: new Date('2024-10-23'), end: new Date('2024-10-31')},
    //         {start: new Date('2024-09-06'), end: new Date('2024-09-12')},
    //         {start: new Date('2024-08-11'), end: new Date('2024-08-17')},
    //         {start: new Date('2024-07-20'), end: new Date('2024-07-26')},
    //         {start: new Date('2024-06-25'), end: new Date('2024-07-01')},
    //         {start: new Date('2024-05-04'), end: new Date('2024-05-10')},
    //         {start: new Date('2024-04-09'), end: new Date('2024-04-14')},
    //         {start: new Date('2024-03-13'), end: new Date('2024-03-19')},
    //         {start: new Date('2024-02-15'), end: new Date('2024-02-21')},
    //         {start: new Date('2024-01-20'), end: new Date('2024-01-26')},
    //     ],
    //     popover: {
    //         label: '过往',
    //         visibility: 'focus',
    //     }
    // },
    // {
    //     key: 'period-next',
    //     highlight: {
    //
    //         start: {fillMode: 'outline', color: EnumCalendarColor.purple,},
    //         base: {fillMode: 'light', color: EnumCalendarColor.purple,},
    //         end: {fillMode: 'outline', color: EnumCalendarColor.purple,},
    //     },
    //     dates: [
    //         {start: new Date('2024-11-24'), end: new Date('2024-11-30')},
    //         {start: new Date('2024-12-18'), end: new Date('2024-12-25')},
    //     ],
    //     popover: {
    //         label: '将来',
    //         visibility: 'focus',
    //     }
    // },
    // {
    //     key: 'vacation',
    //     highlight: {
    //
    //         start: {fillMode: 'light', color: EnumCalendarColor.green,},
    //         base: {fillMode: 'light', color: EnumCalendarColor.green,},
    //         end: {fillMode: 'light', color: EnumCalendarColor.green,},
    //     },
    //     dates: [
    //         {start: new Date('2024-12-01'), end: new Date('2024-12-03')},
    //     ],
    //     popover: {
    //         label: '🥰',
    //         visibility: 'hover',
    //     }
    // },
])

onMounted(()=>{
})


</script>

<style lang="scss">
@import "../../scss/plugin";

</style>
