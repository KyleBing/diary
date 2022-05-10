<template>
    <div class="statistic-charts">
        <div class="chart-category">
            <chart-pie :data="dataCategory" title="类别数据"/>
            <chart-bar :data="dataCategory" title="类别数据"/>
        </div>
        <div class="chart-year">
            <chart-pie :data="dataYear" title="年份数据"/>
            <chart-bar :data="dataYear" title="年份数据"/>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import ChartPie from "@/components/charts/chartPie";
import ChartBar from "@/components/charts/ChartBar";

export default {
    name: "StatisticCharts",
    components: {ChartBar, ChartPie},
    computed: {
        ...mapState(['statisticsCategory', 'statisticsYear',]),
        ...mapGetters(['categoryMap']),
        dataYear(){
            return this.statisticsYear.reverse().map(year => {
                return {
                    name: year.year,
                    value: year.count
                }
            })
        },
        dataCategory(){
            let tempData = {}
            Object.assign(tempData, this.statisticsCategory)
            return Object.keys(tempData).filter(item => {
                return item !== 'amount' && item !== 'shared'
            }).map(key => {
                return {
                    name: this.categoryMap.get(key),
                    value: this.statisticsCategory[key]
                }
            })
        }
    },
    methods: {

    }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/plugin";
.statistic-charts{
    display: flex;
    justify-content: flex-start;
    height: 100%;
    flex-shrink: 0;
    background-color: $bg-light;
    @include border-radius($radius-pc);
    padding: 20px 40px;
    color: $color-main;
    font-size: $fz-big;
}

</style>
