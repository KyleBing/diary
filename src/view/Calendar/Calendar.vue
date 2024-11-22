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
        highlight: EnumCalendarColor.green,
        dates: new Date(),
    },
    {
        key: 'period',
        highlight: {

            start: {fillMode: 'outline', color: EnumCalendarColor.red,},
            base: {fillMode: 'light', color: EnumCalendarColor.red,},
            end: {fillMode: 'outline', color: EnumCalendarColor.red,},
        },
        dates: [
            {
                start: new Date('2024-10-01'),
                end: new Date('2024-10-07')
            },
            {
                start: new Date('2024-10-23'),
                end: new Date('2024-10-31')
            },
        ],
        popover: {
            label: '过往',
            visibility: 'focus',
        }
    },
    {
        key: 'period-next',
        highlight: {

            start: {fillMode: 'outline', color: EnumCalendarColor.red,},
            base: {fillMode: 'light', color: EnumCalendarColor.red,},
            end: {fillMode: 'outline', color: EnumCalendarColor.red,},
        },
        dates: [
            {
                start: new Date('2024-11-24'),
                end: new Date('2024-11-31')
            },
        ],
        popover: {
            label: '过往',
            visibility: 'focus',
        }
    },
    {
        key: 'vocation',
        highlight: {

            start: {fillMode: 'outline', color: EnumCalendarColor.green,},
            base: {fillMode: 'light', color: EnumCalendarColor.green,},
            end: {fillMode: 'outline', color: EnumCalendarColor.green,},
        },
        dates: [
            {
                start: new Date('2024-12-01'),
                end: new Date('2024-12-03')
            },
        ],
        popover: {
            label: '假期',
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
