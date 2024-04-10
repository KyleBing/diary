<template>
    <div class="clock">
        <div class="weekday">{{lunarObject!.ncWeek}}</div>
        <div class="lunar">{{lunarObject!.IMonthCn}}{{lunarObject!.IDayCn}}</div>
        <div class="date">{{lunarObject!.cMonth}}.{{lunarObject!.cDay}}</div>
        <div>{{time}}</div>
    </div>

</template>

<script lang="ts" setup>
import calendar from "js-calendar-converter";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {dateFormatter} from "@/utility.ts";

const time = ref('')
const lunarObject = ref<LunarObject>()
const intervalHandleClock = ref<null | number>()  // handle time out


interface LunarObject {
    Animal: string,  //  "兔"
    IDayCn: string,  //  "初十"
    IMonthCn: string,  //  "九月"
    Term: null | string,  //  null
    astro: string,  //  "天蝎座"
    cDay: number,  //  1
    cMonth: number,  //  11
    cYear: number,  //  1987
    gzDay: string,  //  "甲寅"
    gzMonth: string,  //  "庚戌"
    gzYear: string,  //  "丁卯"
    isLeap: boolean,  //  false
    isTerm: boolean,  //  false
    isToday: boolean,  //  false
    lDay: number,  //  10
    lMonth: number,  //  9
    lYear: number,  //  1987
    nWeek: number,  //  7
    ncWeek: string  //  星期日
}

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
