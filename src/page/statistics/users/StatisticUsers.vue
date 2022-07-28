<template>
    <div class="statistic-user" v-if="showUserStatisticInfo">
        <statistic-panel  class="user-list" title="用户数据概览">
            <table>
                <thead>
                <tr>
                    <th class="left">用户名</th>
                    <th>日记</th>
                    <th>码表</th>
                    <th class="hide-in-mobile">注册时间</th>
                    <th>最后访问时间</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in users" :key="item.uid">
                    <td class="left">{{item.nickname}}</td>
                    <td>{{ item.count_diary }}</td>
                    <td>{{ item.count_dict }}</td>
                    <td class="hide-in-mobile">{{ item.register_time }}</td>
                    <td :class="['right', {'highlight': item.register_time !== item.last_visit_time}]">{{ item.last_visit_time }}</td>
                </tr>
                </tbody>

            </table>


        </statistic-panel>
        <statistic-panel title="用户日记数量">
            <chart-bar title="" :data="chartDataDiary"/>
        </statistic-panel>
    </div>
</template>

<script>
import {mapState} from "vuex";
import StatisticPanel from "@/page/statistics/StatisticPanel";
import statisticApi from "@/api/statisticApi";
import ChartBar from "@/components/charts/ChartBar";
import utility from "@/utility";

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
        getStatisticUsers(){
            statisticApi.users()
                .then(res => {
                    this.showUserStatisticInfo = true
                    this.users = res.data.map(item => {
                        item.register_time = utility.dateFormatter(new Date(item.register_time), 'yyyy.MM.dd hh:mm')
                        item.last_visit_time = utility.dateFormatter(new Date(item.last_visit_time), 'yyyy.MM.dd hh:mm')
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
@import "../../../assets/scss/plugin";
.statistic-user{
    flex-shrink: 0;
    flex-grow: 1;
    display: flex;
    flex-flow: row nowrap;
}

.user-list{
    flex-grow: 1;
    table{
        width: 100%;
    }
    th, td{
        text-align: right;
        font-size: $fz-list-content;
        padding: 5px 5px;
        &.left{
            text-align: left;
        }
        &.right{
            text-align: left;
        }
        &.highlight{
            color: $color-main;
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
        th, td{
            padding: 2px;
        }
    }
}





</style>
