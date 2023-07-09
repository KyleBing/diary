<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated faceOut"
    >
        <div class="statistic-charts" v-if="isShow">
            <statistic-panel title="类别数据">
                <div class="statistic-group">
                    <div class="info-list">
                        <div class="info-list-item" v-for="year in dataArrayCategory">
                            <div class="key">{{ year.name }}</div>
                            <div class="value">{{ year.value }}</div>
                        </div>
                    </div>
                    <chart-pie :data="dataArrayCategory" title=""/>
                    <chart-bar :data="dataArrayCategory" title=""/>
                </div>
            </statistic-panel>
            <statistic-panel title="年份数据">
                <div class="statistic-group">
                    <div class="info-list">
                        <div class="info-list-item" v-for="year in dataArrayYear">
                            <div class="key">{{ year.name }}</div>
                            <div class="value">{{ year.value }}</div>
                        </div>
                    </div>
                    <chart-pie :data="dataArrayYear" title=""/>
                    <chart-bar :data="dataArrayYear" title=""/>
                </div>
            </statistic-panel>

            <statistic-panel title="温度趋势">
                <statistic-weather/>
            </statistic-panel>

            <statistic-panel title="账单趋势 - 日">
                <statistic-bill-day-sum/>
            </statistic-panel>

            <statistic-panel title="账单趋势 - 月">
                <statistic-bill-month-sum/>
            </statistic-panel>

        </div>
    </transition>
</template>

<script>
import {mapState} from "vuex"
import ChartPie from "../../../components/charts/ChartPie"
import ChartBar from "../../../components/charts/ChartBar"
import StatisticPanel from "../../../page/statistics/StatisticPanel"
import StatisticWeather from "../weather/StatisticWeather";
import StatisticBillDaySum from "../billDaySum/StatisticBillDaySum";
import StatisticBillMonthSum from "../billMonthSum/StatisticBillMonthSum";

export default {
    name: "StatisticCharts",
    components: {StatisticBillMonthSum, StatisticBillDaySum, StatisticWeather, StatisticPanel, ChartBar, ChartPie},
    computed: {
        ...mapState(['statisticsCategory', 'statisticsYear','dataArrayCategory', 'dataArrayYear']),
    },
    data(){
        return {
            isShow: false
        }
    },
    mounted() {
        this.isShow = true
    }
}
</script>

<style scoped lang="scss">
@import "statistic-charts";
</style>
