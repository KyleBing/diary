<template>
    <div class="calendar-list-header">
        <div class="calendar-list-header-title">{{ title }} {{ weekday }}</div>
    </div>
</template>

<script lang="ts" setup>
import { dateProcess } from "@/utility";
import { computed } from "vue";

const props = defineProps<{
    date: string
}>()

const title = computed(() => {
    return `${dateProcess(props.date).year}年${dateProcess(props.date).month}月${dateProcess(props.date).day}日`
})
const weekday = computed(() => {
    return dateProcess(props.date).weekday
})

</script>

<style scoped lang="scss">
@use "../../scss/plugin" as *;

.calendar-list-header{
    text-align: left;
    background-color: transparent;
    line-height: 1.3;
    font-family: "Galvji", sans-serif;
    color: black;
    font-weight: bold;
    padding: 0 2px 8px;
    height: auto;
    gap: 8px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    white-space: nowrap;
    .calendar-list-header-title{
        font-size: 15px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .calendar-list-header-week{
        color: $text-date;
        font-size: 13px;
        font-weight: normal;
        flex-shrink: 0;
    }
}

// Mobile
@media (max-width: $grid-separate-width-sm) {
    .calendar-list-header {
        font-size: $fz-list-header-mobile;
    }
}

@media (prefers-color-scheme: dark) {
    .calendar-list-header{
        border-color: $dark-border !important;
        background-color: transparent;
        border-radius: $radius-mobile;
        color: white !important;
        .calendar-list-header-title{
        }
        .calendar-list-header-week{
            color: $dark-text-subtitle;
        }
        &.big{
            margin: 0 10px;
        }
    }
}




</style>
