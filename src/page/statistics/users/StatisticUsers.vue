<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated faceOut"
    >
        <div class="statistic-user" v-if="showUserStatisticInfo">
            <div class="user-list">
                <statistic-panel title="日记用户">
                    <table>
                        <thead>
                        <tr>
                            <th class="">ID</th>
                            <th class="text-left">用户名</th>
                            <th class="">最后访问时间</th>
                            <th class="text-center hide-in-mobile">注册时间</th>
                            <th>日记</th>
                            <th>码表</th>
                            <th>路书</th>
                            <th>同步次数</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in usersDiary" :key="item.uid">
                            <td  class="number id">{{ item.uid }}</td>
                            <td :class="['text-left', 'name', dateTextLevel(item.last_visit_time)]">{{ item.nickname }}</td>
                            <td :class="[ 'text-right', 'number', dateTextLevel(item.last_visit_time_string) ]">
                                {{ item.last_visit_time_string.substring(0, item.last_visit_time_string.length - 8) }}
                            </td>
                            <td class="text-right number hide-in-mobile">
                                {{ item.register_time_string.substring(0, item.register_time_string.length - 8) }}
                            </td>
                            <td class="number">{{ item.count_diary }}</td>
                            <td class="number">{{ item.count_dict }}</td>
                            <td class="number">{{ item.count_map_route }}</td>
                            <td class="number">{{ item.sync_count }}</td>
                        </tr>
                        </tbody>
                    </table>
                </statistic-panel>
                <statistic-panel title="五笔码表用户">
                    <table>
                        <thead>
                        <tr>
                            <th class="">ID</th>
                            <th class="text-left">用户名</th>
                            <th class="">最后访问时间</th>
                            <th class="text-center hide-in-mobile">注册时间</th>
                            <th>日记</th>
                            <th>码表</th>
                            <th>路书</th>
                            <th>同步次数</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in usersDict" :key="item.uid">
                            <td class="number">{{ item.uid }}</td>
                            <td :class="['text-left', 'name', dateTextLevel(item.last_visit_time)]">{{ item.nickname }}</td>
                            <td :class="[ 'text-right', 'number', dateTextLevel(item.last_visit_time_string) ]">
                                {{ item.last_visit_time_string.substring(0, item.last_visit_time_string.length - 8) }}
                            </td>
                            <td class="text-right number hide-in-mobile">
                                {{ item.register_time_string.substring(0, item.register_time_string.length - 8) }}
                            </td>
                            <td class="number">{{ item.count_diary }}</td>
                            <td class="number">{{ item.count_dict }}</td>
                            <td class="number">{{ item.count_map_route }}</td>
                            <td class="number">{{ item.sync_count }}</td>
                        </tr>
                        </tbody>
                    </table>
                </statistic-panel>
                <statistic-panel title="路书用户">
                    <table>
                        <thead>
                        <tr>
                            <th class="">ID</th>
                            <th class="text-left">用户名</th>
                            <th class="">最后访问时间</th>
                            <th class="text-center hide-in-mobile">注册时间</th>
                            <th>日记</th>
                            <th>码表</th>
                            <th>路书</th>
                            <th>同步次数</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in usersMapRoute" :key="item.uid">
                            <td class="number">{{ item.uid }}</td>
                            <td :class="['text-left', 'name', dateTextLevel(item.last_visit_time)]">{{ item.nickname }}</td>
                            <td :class="[ 'text-right', 'number', dateTextLevel(item.last_visit_time_string) ]">
                                {{ item.last_visit_time_string.substring(0, item.last_visit_time_string.length - 8) }}
                            </td>
                            <td class="text-right number hide-in-mobile">
                                {{ item.register_time_string.substring(0, item.register_time_string.length - 8) }}
                            </td>
                            <td class="number">{{ item.count_diary }}</td>
                            <td class="number">{{ item.count_dict }}</td>
                            <td class="number">{{ item.count_map_route }}</td>
                            <td class="number">{{ item.sync_count }}</td>
                        </tr>
                        </tbody>
                    </table>
                </statistic-panel>
            </div>
            <statistic-panel title="用户日记数量">
                <chart-bar title="" width-init="100%" :data="chartDataDiary"/>
            </statistic-panel>
        </div>
    </transition>
</template>

<script>
import {mapState} from "vuex";
import StatisticPanel from "../../../page/statistics/StatisticPanel";
import statisticApi from "../../../api/statisticApi";
import ChartBar from "../../../components/charts/ChartBar";
import utility from "../../../utility";
import Moment from "moment";
import projectConfig from "../../../projectConfig";

export default {
    name: "StatisticUsers",
    components: {ChartBar, StatisticPanel},
    computed: {
        ...mapState(['statisticsCategory', 'statisticsYear', 'dataArrayCategory', 'dataArrayYear']),

    },
    data(){
        return {
            users: [],
            usersDiary: [], // 日记用户
            usersDict: [], // 码表用户
            usersMapRoute: [], // 路书用户

            chartDataDiary: [],
            chartDataDict: [],

            showUserStatisticInfo: false // 是否显示这个用户信息统计面板
        }
    },
    mounted() {
        if (utility.getAuthorization().email === projectConfig.adminEmail){
            this.getStatisticUsers()
        }
    },
    methods: {
        // 根据最后访问的时间，对比现在的时间，生成对应的颜色 class
        dateTextLevel(dateString){
            let date = new Moment(dateString) // yyyy MM-dd  hh:mm 补全时间字符串
            let now = new Moment()
            let distance =  now.diff(date, 'day')
            if ( distance < 7) {
                return `date-level-${distance}`
            } else {
                return `date-level-dead`
            }
        },
        getStatisticUsers(){
            statisticApi
                .users()
                .then(res => {
                    this.showUserStatisticInfo = true
                    this.users = res.data.map(item => {
                        item.register_time_string = utility.dateFormatter(new Date(item.register_time), )
                        item.last_visit_time_string = utility.dateFormatter(new Date(item.last_visit_time), )
                        return item
                    })

                    this.usersDiary = this.users.filter(user => user.count_diary > 0)
                    this.usersDict = this.users.filter(user => user.count_dict > 0)
                    this.usersMapRoute = this.users.filter(user => user.count_map_route > 0)

                    this.chartDataDiary = res.data
                        .map(item => {
                            return {
                                name: item.nickname,
                                value: item.count_diary
                            }
                        })
                        .filter(item => item.value > 0) // 过滤日记数量为 0 的用户
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
@import "statistic-users";
</style>
