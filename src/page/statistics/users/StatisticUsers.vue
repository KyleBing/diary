<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated faceOut"
    >
        <div class="statistic-user" v-if="showUserStatisticInfo">
            <div class="user-list" v-if="storeProject.isAdminUser">
                <StatisticPanel title="日记用户">
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
                </StatisticPanel>
                <StatisticPanel title="五笔码表用户">
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
                </StatisticPanel>
                <StatisticPanel title="路书用户">
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
                </StatisticPanel>
            </div>

            <!--用户日记数量柱状图-->
            <StatisticPanel title="用户日记数量">
                <ChartBar title="" :data="chartDataDiary"/>
            </StatisticPanel>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import StatisticPanel from "../../../page/statistics/StatisticPanel.vue";
import statisticApi from "../../../api/statisticApi.ts";
import ChartBar from "../../../components/charts/ChartBar.vue";
import Moment from "moment";

import {computed, ComputedRef, onMounted, ref} from "vue";
import {useProjectStore} from "../../../pinia";
import {dateFormatter} from "../../../utility.ts";
const storeProject = useProjectStore()

onMounted(()=>{
    getStatisticUsers()
})

const users = ref([])
const usersDiary = ref([]) // 日记用户
const usersDict = ref([]) // 码表用户
const usersMapRoute = ref([]) // 路书用户

const chartDataDiary = ref([])
const chartDataDict = ref([])

const showUserStatisticInfo = ref(false) // 是否显示这个用户信息统计面板


// 根据最后访问的时间，对比现在的时间，生成对应的颜色 class
function dateTextLevel(dateString: string){
    let date = Moment(dateString) // yyyy MM-dd  hh:mm 补全时间字符串
    let now = Moment()
    let distance =  now.diff(date, 'day')
    if ( distance < 7) {
        return `date-level-${distance}`
    } else {
        return `date-level-dead`
    }
}
function getStatisticUsers(){
    statisticApi
        .users()
        .then(res => {
            showUserStatisticInfo.value = true
            users.value = res.data.map(item => {
                item.register_time_string = dateFormatter(new Date(item.register_time), )
                item.last_visit_time_string = dateFormatter(new Date(item.last_visit_time), )
                return item
            })

            usersDiary.value = users.value.filter(user => user.count_diary > 0)
            usersDict.value = users.value.filter(user => user.count_dict > 0)
            usersMapRoute.value = users.value.filter(user => user.count_map_route > 0)

            chartDataDiary.value = res.data
                .map(item => {
                    return {
                        name: item.nickname,
                        value: item.count_diary
                    }
                })
                .filter(item => item.value > 0) // 过滤日记数量为 0 的用户
                .sort((a,b) => b.value - a.value)
            chartDataDict.value = res.data.map(item => {
                return {
                    name: item.nickname,
                    value: item.count_dict
                }
            })
        })
        .catch(() => {
            showUserStatisticInfo.value = false
        })
}
</script>

<style scoped lang="scss">
@import "statistic-users";
</style>
