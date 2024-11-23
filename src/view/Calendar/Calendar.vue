<template>
    <div class="statistic-container">
        <PageHeader title="日历"/>

        <div class="bill-content" :style="`height:${storeProject.insets.heightPanel}px`">
            <Calendar
                title-position="center"
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

const attributes = ref([
    {
        key: 'start',
        dates: new Date('2024-01-01'),
    },
    {
        key: 'today',
        highlight: {
            fillMode: 'light',
            color: EnumCalendarColor.red
        },
        dot: {
            color: EnumCalendarColor.red
        },
        dates: new Date(),
    },
    {
        key: 'period',
        highlight: {

            start: {fillMode: 'light', color: EnumCalendarColor.red,},
            base: {fillMode: 'light', color: EnumCalendarColor.red,},
            end: {fillMode: 'light', color: EnumCalendarColor.red,},
        },
        dates: [
            {start: new Date('2024-10-01'), end: new Date('2024-10-07')},
            {start: new Date('2024-10-23'), end: new Date('2024-10-31')},
            {start: new Date('2024-09-06'), end: new Date('2024-09-12')},
            {start: new Date('2024-08-11'), end: new Date('2024-08-17')},
            {start: new Date('2024-07-20'), end: new Date('2024-07-26')},
            {start: new Date('2024-06-25'), end: new Date('2024-07-01')},
            {start: new Date('2024-05-04'), end: new Date('2024-05-10')},
            {start: new Date('2024-04-09'), end: new Date('2024-04-14')},
            {start: new Date('2024-03-13'), end: new Date('2024-03-19')},
            {start: new Date('2024-02-15'), end: new Date('2024-02-21')},
            {start: new Date('2024-01-20'), end: new Date('2024-01-26')},
        ],
        popover: {
            label: '过往',
            visibility: 'focus',
        }
    },
    {
        key: 'period-next',
        highlight: {

            start: {fillMode: 'outline', color: EnumCalendarColor.purple,},
            base: {fillMode: 'light', color: EnumCalendarColor.purple,},
            end: {fillMode: 'outline', color: EnumCalendarColor.purple,},
        },
        dates: [
            {
                start: new Date('2024-11-24'),
                end: new Date('2024-11-30')
            },
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
            {
                start: new Date('2024-12-01'),
                end: new Date('2024-12-03')
            },
        ],
        popover: {
            label: '🥰',
            visibility: 'hover',
        }
    },
])

onMounted(()=>{
})


</script>

<style lang="scss">
@import "../../scss/plugin";

</style>
