<template>
    <div class="clock">
        <div>{{clock.date}}</div>
        <div>{{clock.week}}</div>
        <div>{{clock.time}}</div>
    </div>

</template>

<script>
let weekMap = new Map()
weekMap.set('0', '周期日')
weekMap.set('1', '周期一')
weekMap.set('2', '周期二')
weekMap.set('3', '周期三')
weekMap.set('4', '周期四')
weekMap.set('5', '周期五')
weekMap.set('6', '周期六')

import utility from "../../utility"

export default {
    name: "Clock",
    data(){
        return{
            clock: {
                date: '',
                week: '',
                time: ''
            }
        }
    },
    mounted() {
        this.clockStart()
    },
    beforeUnmount() {
        this.clockStop()
    },
    methods:{
        clockStart(){
            let timeNow = new Date()
            this.clock = {
                date: utility.dateFormatter(timeNow, 'MM.dd'),
                week: weekMap.get(String(timeNow.getDay())),
                time:  utility.dateFormatter(timeNow, 'hh:mm'),
            }
            this.clockStop()
            this.intervalHandleClock = setInterval(()=>{
                timeNow = new Date()
                this.clock = {
                    date: utility.dateFormatter(timeNow, 'MM.dd'),
                    week: weekMap.get(String(timeNow.getDay())),
                    time:  utility.dateFormatter(timeNow, 'hh:mm'),
                }
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
    font-weight: bold;
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
