<template>
    <div class="clock">
        <div class="weekday">{{lunarObject.ncWeek}}</div>
        <div class="lunar">{{lunarObject.IMonthCn}}{{lunarObject.IDayCn}}</div>
        <div class="date">{{lunarObject.cMonth}}.{{lunarObject.cDay}}</div>
        <div>{{time}}</div>
    </div>

</template>

<script lang="ts" setup>
import calendar from "js-calendar-converter";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {dateFormatter} from "../../utility.ts";

let weekMap = new Map()
weekMap.set('0', '周期日')
weekMap.set('1', '周期一')
weekMap.set('2', '周期二')
weekMap.set('3', '周期三')
weekMap.set('4', '周期四')
weekMap.set('5', '周期五')
weekMap.set('6', '周期六')

const time = ref('')
const lunarObject = ref({})
const intervalHandleClock = ref(null)

onMounted(()=>{
    clockStart()
    lunarObject.value = calendar.solar2lunar()
})

onBeforeUnmount(()=>{
    clockStop()
})

function clockStart(){
    let timeNow = new Date()
    time.value = dateFormatter(timeNow, 'hh:mm')
    clockStop()
    intervalHandleClock.value = setInterval(()=>{
        timeNow = new Date()
        time.value =  dateFormatter(timeNow, 'hh:mm')
    }, 1000)
}
function clockStop(){
    clearInterval(intervalHandleClock.value)
    intervalHandleClock.value = null
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
.clock{
    font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
    height: $height-navbar;
    align-items: center;
    justify-content: center;
    display: flex;
    color: transparentize(white, 0.4);
    font-size: $fz-main;
    > *{
        padding: 0 5px;
    }
    .date{}
    .week{}
    .time{}
}


</style>
