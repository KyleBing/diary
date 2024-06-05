<template>
    <div class="date-selector">
        <div class="date-set-item">
            <div class="button-date-change" @click="dateMove(-1)">
                <div>&lt;</div>
            </div>
            <DatePicker
                locale="zh"
                v-model="modelDate"
                mode="dateTime"
                is24hr
                :attributes="attrs"
                :popover="popoverOptions"
            >
                <template #default="{ togglePopover }">
                    <div class="datetime" @click="togglePopover">
                        <div class="date">{{dateFormatter(modelDate, 'yyyy.MM.dd')}}</div>
                        <div class="time">{{dateFormatter(modelDate, 'hh:mm')}}</div>
                    </div>
                </template>
                <template #footer>
                    <div class="p-2">
                        <div class="btn btn-active" @click="moveToday">今天</div>
                    </div>
                </template>
            </DatePicker>

            <div class="button-date-change" @click="dateMove(1)">
                <div>&gt;</div>
            </div>
        </div>
        <div class="date-meta">
            <div class="lunar">{{lunarObject.IMonthCn}}{{lunarObject.IDayCn}}</div>
            <div class="weekday">{{lunarObject.ncWeek}}</div>
        </div>
    </div>

</template>

<script lang="ts" setup>
import calendar from "js-calendar-converter" // 农历数据
import Moment from "moment/moment";
import { onMounted, ref, watch} from "vue";
import {LunarDateEntity} from "@/entity/LunarDate.ts";

import {DatePicker} from 'v-calendar';
import 'v-calendar/style.css';
import {dateFormatter} from "@/utility.ts";
import {PopoverOptions} from "v-calendar/dist/types/src/utils/popovers";

const emit = defineEmits(["dayChange"])
const modelDate = defineModel<Date>({ // v-model value
    required: true
})


// 显示时获取当前时间的农历值
onMounted(()=>{
    lunarObject.value = calendar.solar2lunar(
        modelDate.value.getFullYear(),
        modelDate.value.getMonth() + 1,
        modelDate.value.getDate()
    )
})

/**
 *  Calendar option
 */
const lunarObject = ref<LunarDateEntity>({})
const popoverOptions = ref<PopoverOptions>({
    visibility: 'click',
    placement: "auto"
})
const attrs = ref([
    {
        key: 'today',
        // highlight: true,
        dot: true, // 点状
        dates: new Date(),
    },
])

function moveToday() {
    // refCalendar.value.move(new Date())
    modelDate.value = new Date()
}

/**
 * Watches
 */

watch(modelDate, (newValue, oldValue) => {
    lunarObject.value = calendar.solar2lunar(
        newValue.getFullYear(),
        newValue.getMonth() + 1,
        newValue.getDate()
    )

    // 判断是否日期有变，day 有变，emit dayChange, 附带是否为今天的标识
    let dateMomentDiary = Moment(newValue)
    let dateMomentDiaryOrigin = Moment(oldValue)
    if ( dateMomentDiary.isSame(dateMomentDiaryOrigin, 'day')){
    } else {
        if (dateMomentDiary.isSame(new Date(), 'day')){
            emit('dayChange', true)
        } else {
            emit('dayChange', false)
        }
    }
})

function mouseWheelScrolled(event){
    event.preventDefault()
    if (event.ctrlKey){
        if (event.deltaY > 10){
            dateMove(1)
        } else if (event.deltaY < -10) {
            dateMove(-1)
        }
    } else {
        if (event.deltaY > 10){
            dateTimeMove(1)
        } else if (event.deltaY < -10) {
            dateTimeMove(-1)
        }
    }
}
// 日期前后移动
function dateMove(step: -1|0|1) {
    switch (step) {
        case -1:
        case 1:
            let dateTemp = Moment(modelDate.value)
            dateTemp.add(step, 'day')
            modelDate.value = dateTemp.toDate()
            break;
        case 0:
            modelDate.value = new Date()
            break;
    }
}
// 日期前后移动
function dateTimeMove(step: -1|0|1) {
    switch (step) {
        case -1:
        case 1:
            let dateTemp = Moment(modelDate.value)
            dateTemp.add(step, 'hour')
            modelDate.value = dateTemp.toDate()
            break;
        case 0:
            modelDate.value = new Date()
            break;
    }
}
</script>

<style lang="scss">
@use "sass:math";
@import "../../scss/plugin";

.date-selector{
    display: flex;
    width: 100%;
    flex-flow: column nowrap;
}

$height: 40px;

.datetime{
    align-items: flex-end;
    display: flex;
    justify-content: center;
    font-family: 'SF UI Display', sans-serif;
    color: $text-content;
    text-align: center;
    background-color: transparent;
    width: 100%;
    font-size: 28px;
    padding: math.div($height - 40, 2) ;
    cursor: ns-resize;
    .date{
    }
    .time{
        color: $text-label;
        margin-left: 10px;
    }
}

.date-set-item{
    padding: 0 5px;
    box-sizing: content-box;
    height: $height;
    width: 100%;
    @include border-radius($radius-mobile);
    position: relative;
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    .button-date-change{
        @include transition(opacity 0.3s);
        display: flex;
        opacity: 0;
        color: $text-subtitle;
        flex-shrink: 0;
        @extend .btn-like;
        @include border-radius(50px);
        justify-content: center;
        align-items: center;
        height: 30px;
        width: 30px;
        cursor: pointer;
        &:hover{
            color: $text-title;
            background-color: $color-main;
            border: 1px solid $orange;
        }
    }
    &:hover{
        background-color: $bg-light;
        border-color: $color-border-highlight;
        .button-date-change{
            @include transition(opacity 0.3s);
            opacity: 1;
        }
        input{
            color: black;
        }
    }
}


.date-meta{
    width: 100%;
    padding: 0 20% 20px;
    margin-bottom: 15px;
    display: flex;
    font-size: $fz-main;
    justify-content: space-between;
    color: $text-label;
    border-bottom: 1px solid $color-border;
    .lunar{}
    .weekday{}
}



@media (min-width: $grid-separate-width-md) and (max-width: $grid-separate-width-big) {
    .date-selector{
        width: 50%;
        .date-set-item{

        }
        .date-meta{
            justify-content: flex-start;
            padding: 0;
            border: none;
            .lunar{
                margin-right: 20px;
            }
        }
    }
}
// MOBILE
@media (max-width: $grid-separate-width-md) {
    .date-selector {
        width: 100%;
    }
}


// DARK
@media (prefers-color-scheme: dark) {
    .datetime{
        color: $dark-text-title;
        .date{
        }
        .time{
            color: $dark-text-subtitle;
        }
    }
    .date-set-item{
        .button-date-change{
            color: $dark-text-subtitle;
            flex-shrink: 0;
            @extend .btn-like;
            @include border-radius(50px);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            width: 30px;
            cursor: pointer;
            &:hover{
                color: $text-title;
                background-color: $color-main;
                border: 1px solid $orange;
            }
        }
        &:hover{
            background-color: $dark-bg;

        }

    }

    .date-meta{
        border-bottom-color: $dark-border;
    }
}



</style>
