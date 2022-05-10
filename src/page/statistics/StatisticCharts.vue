<template>
    <div class="statistic-charts">
        <statistic-panel>
            <chart-pie :data="dataArrayCategory" title="类别数据"/>
            <chart-bar :data="dataArrayCategory" title="类别数据"/>
        </statistic-panel>
        <statistic-panel>
            <chart-pie :data="dataArrayYear" title="年份数据"/>
            <chart-bar :data="dataArrayYear" title="年份数据"/>
        </statistic-panel>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import ChartPie from "@/components/charts/chartPie";
import ChartBar from "@/components/charts/ChartBar";
import StatisticPanel from "@/page/statistics/StatisticPanel";

export default {
    name: "StatisticCharts",
    components: {StatisticPanel, ChartBar, ChartPie},
    computed: {
        ...mapState(['statisticsCategory', 'statisticsYear',]),
        ...mapGetters(['dataArrayCategory', 'dataArrayYear']),
    },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/plugin";
.statistic-charts{
    display: flex;
    justify-content: flex-start;
    height: 100%;
    flex-shrink: 0;
    color: $color-main;
}

</style>
