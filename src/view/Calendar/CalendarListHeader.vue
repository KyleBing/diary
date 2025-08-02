<template>
    <div class="calendar-list-header">
        <div class="calendar-list-header-title">{{ title }}</div>
        <div class="calendar-list-header-week">{{ weekday }}</div>
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
@import "../../scss/plugin";

.calendar-list-header{
    font-size: $fz-list-header;
    text-align: left;
    background-color: $bg-light;
    line-height: $height-header;
    font-family: "Galvji", sans-serif;
    color: black;
    font-weight: bold;
    text-shadow: 1px 1px 0 rgba(0,0,0,0.1);
    padding: 0 20px 10px;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .calendar-list-header-title{
        font-size: $fz-big;
    }
    .calendar-list-header-week{
        color: $text-date;
        font-size: $fz-list-header;
    }
}

// Mobile
@media (max-width: $grid-separate-width-sm) {
    .calendar-list-header {
        font-size: $fz-list-header-mobile;
    }
}

@media (prefers-color-scheme: dark) {
    .list-header{
        border-color: $dark-border !important;
        background-color: $dark-list-header-bg !important;
        @include border-radius($radius-mobile);
        color: white !important;
        &.big{
            margin: 0 10px;
        }
    }
}




</style>
