<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated faceOut"
    >
        <div class="statistic-charts" v-if="isShow">
           <chart-line-trend
               v-if="weatherStatisticData.length > 0"
               :height="400"
               :combine-data="weatherStatisticData"/>
        </div>
    </transition>
</template>

<script>
import {mapState} from "vuex"
import ChartPie from "@/components/charts/ChartPie"
import ChartBar from "@/components/charts/ChartBar"
import StatisticPanel from "@/page/statistics/StatisticPanel"
import statisticApi from "../../../api/statisticApi";
import ChartLineTrend from "./ChartLineTrend";
import utility from "../../../utility";

export default {
    name: "StatisticWeather",
    components: {ChartLineTrend, StatisticPanel, ChartBar, ChartPie},
    computed: {
        ...mapState(['statisticsCategory', 'statisticsYear','dataArrayCategory', 'dataArrayYear']),
    },
    data(){
        return {
            isShow: false,
            weatherStatisticData: []
        }
    },
    mounted() {
        this.isShow = true
        this.getWeatherData()
    },
    methods: {
        getWeatherData(){
            statisticApi
                .weather()
                .then(res => {
                    let tempData = res.data.map(item => {
                        item.temperature = item.temperature === -273 ? null: item.temperature
                        item.date = utility.dateFormatter(new Date(item.date))
                        item.temperature_outside = item.temperature_outside === -273? null: item.temperature_outside
                        return item
                    })
                    this.weatherStatisticData = tempData
                })
        }
    }
}
</script>

<style scoped lang="scss">
</style>
