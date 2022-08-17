<template>
    <div class="statistic-user" v-if="showUserStatisticInfo">
        <statistic-panel  class="user-list" title="用户数据概览">
            <table>
                <thead>
                <tr>
                    <th class="text-left">用户名</th>
                    <th>日记</th>
                    <th>码表</th>
                    <th class="text-center">最后访问时间</th>
                    <th class="text-center hide-in-mobile">注册时间</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in users" :key="item.uid">
                    <td :class="['text-left', dateTextLevel(item.last_visit_time)]">{{item.nickname}}</td>
                    <td class="number">{{ item.count_diary }}</td>
                    <td class="number">{{ item.count_dict }}</td>
                    <td :class="[
                        'text-right',
                        'number',
                        dateTextLevel(item.last_visit_time)
                        ]"
                    >{{ item.last_visit_time }}</td>
                    <td class="text-right number hide-in-mobile">{{ item.register_time }}</td>
                </tr>
                </tbody>

            </table>
        </statistic-panel>
        <statistic-panel title="用户日记数量">
            <chart-bar title="" width-init="100%" :data="chartDataDiary"/>
        </statistic-panel>
    </div>
</template>

<script>
import {mapState} from "vuex";
import StatisticPanel from "@/page/statistics/StatisticPanel";
import statisticApi from "@/api/statisticApi";
import ChartBar from "@/components/charts/ChartBar";
import utility from "@/utility";
import Moment from "moment";

export default {
    name: "StatisticUsers",
    components: {ChartBar, StatisticPanel},
    computed: {
        ...mapState(['statisticsCategory', 'statisticsYear', 'dataArrayCategory', 'dataArrayYear']),

    },
    data(){
        return {
            users: [],
            chartDataDiary: [],
            chartDataDict: [],

            showUserStatisticInfo: false // 是否显示这个用户信息统计面板
        }
    },
    mounted() {
        this.getStatisticUsers()
    },
    methods: {
        // 根据最后访问的时间，对比现在的时间，生成对应的颜色 class
        dateTextLevel(dateString){
            let date = new Moment(dateString)
            let now = new Moment()
            let distance =  now.diff(date, 'day')
            if ( distance < 7) {
                return `date-level-${distance}`
            } else {
                return `date-level-dead`
            }
        },
        getStatisticUsers(){
            statisticApi.users()
                .then(res => {
                    this.showUserStatisticInfo = true
                    this.users = res.data.map(item => {
                        item.register_time = utility.dateFormatter(new Date(item.register_time), 'yyyy MM-dd  hh:mm')
                        item.last_visit_time = utility.dateFormatter(new Date(item.last_visit_time), 'yyyy MM-dd  hh:mm')
                        return item
                    })
                    this.chartDataDiary = res.data.map(item => {
                        return {
                            name: item.nickname,
                            value: item.count_diary
                        }
                    })
                    this.chartDataDict = res.data.map(item => {
                        return {
                            name: item.nickname,
                            value: item.count_dict
                        }
                    })
                })
                .catch(err => {
                    this.showUserStatisticInfo = false
                })
        }
    }
}
</script>

<style scoped lang="scss">
@use "sass:color";
@import "../../../assets/scss/plugin";


.user-list{
    flex-grow: 1;
    table{
        max-width: 100%;
    }
    tr{
        &:nth-child(even){
            td{
                background-color: $bg-light-td;
            }
        }
        &:hover{
            td{
                background-color: $bg-light-td-hover;
            }
        }
    }
    th, td{
        text-align: right;
        font-size: $fz-list-content;
        padding: 5px 10px;
        &.highlight{
            color: $color-main!important;
        }
    }
    th{
        font-weight: bold;
        color: $text-content;
    }
    td{
        color: $text-content;
    }
}


@for $item from 0 through 7 {
    .date-level-#{$item}{
        color: color.change($red, $hue: -20deg * $item) !important;
    }
}

.date-level-dead{
    color: $text-title;
}

@media (min-width: $grid-separate-width-big) and (max-width: $grid-separate-width-max) {

}

@media (max-width: $grid-separate-width-sm) {
    .statistic-user{
        flex-flow: column nowrap;
        &>*{
            width: 100%;
        }
    }
    .user-list{
        table{
            width: 100%;
        }
        th, td{
            padding: 2px;
        }
    }
}


@media (prefers-color-scheme: dark) {
    .user-list {
        table {
        }
        tr {
            &:nth-child(even) {
                td {
                    background-color: $dark-list-bg;
                }
            }
            &:hover {
                td {
                    background-color: $dark-list-bg-active;
                }
            }
        }
    }
}




</style>
