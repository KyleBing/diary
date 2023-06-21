<template>
    <div class="clock">
        <div class="weekday">{{lunarObject.ncWeek}}</div>

        <div class="date">{{lunarObject.cMonth}}/{{lunarObject.cDay}}</div>
        <div class="lunar">{{lunarObject.IMonthCn}}{{lunarObject.IDayCn}}</div>
        <div>{{time}}</div>
    </div>

</template>

<script>
import calendar from "js-calendar-converter";
import utility from "../../utility"



let weekMap = new Map()
weekMap.set('0', '周期日')
weekMap.set('1', '周期一')
weekMap.set('2', '周期二')
weekMap.set('3', '周期三')
weekMap.set('4', '周期四')
weekMap.set('5', '周期五')
weekMap.set('6', '周期六')


export default {
    name: "Clock",
    data(){
        return{
            time: '',
            lunarObject: {}
        }
    },
    mounted() {
        this.clockStart()
        this.lunarObject = calendar.solar2lunar()
    },
    beforeUnmount() {
        this.clockStop()
    },
    methods:{
        clockStart(){
            let timeNow = new Date()
            this.time = utility.dateFormatter(timeNow, 'hh:mm')
            this.clockStop()
            this.intervalHandleClock = setInterval(()=>{
                timeNow = new Date()
                this.time =  utility.dateFormatter(timeNow, 'hh:mm')
            }, 1000)
        },
        clockStop(){
            clearInterval(this.intervalHandleClock)
        },
    }
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
    color: transparentize(white, 0.1);
    font-size: $fz-main;
    > *{
        padding: 0 5px;
    }
    .date{
    }
    .week{}
    .time{
    }
}


</style>
