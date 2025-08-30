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
                    @did-move="onPageChange">
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

            <!-- 操作面板 -->
            <div class="calendar-operation-panel p-4">
                <ButtonSmall 
                    v-if="periodDiary?.id" 
                    @click="router.push({name: 'Edit', params: {id: periodDiary.id}})" 
                    class="mb-2">编辑经期日历</ButtonSmall>
            </div>

            <div class="calendar-operation-panel" v-if="calendarCol === 1">
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
import {EntityDiaryForm} from "@/view/DiaryList/Diary.ts";
import {storeToRefs} from "pinia";
import ButtonSmall from "@/components/ButtonSmall.vue";
import {CalendarAttribute, CalendarEntity} from "@/view/Calendar/VCalendar.ts";
import Moment from "moment";
import Edit from "@/view/Edit/Edit.vue";

import {useRouter, useRoute} from "vue-router";
import jsYaml from "js-yaml"

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


// 鼠标点击某个天时，获取该天的日记列表
const focusedDayDiaries = ref<Array<EntityDiaryForm>>([])

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



onMounted(() => {
    loadCalendarPeriod()
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


/**
 * 经期数据
 */
const periodDiary = ref<EntityDiaryForm>()
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

                // 如果有选中的日期，重新添加选中日期的高亮
                if (currentFocusedDay.value) {
                    updateSelectedDateHighlight(currentFocusedDay.value.date)
                }
            }
        })
        .catch(() => {
            attributes.value = []
            // 如果有选中的日期，重新添加选中日期的高亮
            if (currentFocusedDay.value) {
                updateSelectedDateHighlight(currentFocusedDay.value.date)
            }
        })
}



</script>

<style lang="scss">
@import "./calendar.scss"

</style>
