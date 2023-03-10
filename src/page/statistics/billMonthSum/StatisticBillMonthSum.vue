<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated faceOut"
    >
        <div class="statistic-charts" v-if="isShow">
           <chart-bar-of-bill-month
               v-if="weatherStatisticData.length > 0"
               :height="400"
               :combine-data="weatherStatisticData"/>
        </div>
    </transition>
</template>

<script>
import {mapState} from "vuex"
import statisticApi from "../../../api/statisticApi";
import ChartBarOfBillMonth from "./ChartBarOfBillMonth";

export default {
    name: "StatisticBillMonthSum",
    components: {ChartBarOfBillMonth},
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
                .monthSum()
                .then(res => {
                    this.weatherStatisticData = res.data.map(item => {
                        item.sumOutput = Math.abs(item.sumOutput)
                        item.date = item.month_id
                        return item
                    })
                })
        }
    }
}
</script>

<style scoped lang="scss">
</style>
