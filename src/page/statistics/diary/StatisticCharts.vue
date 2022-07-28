<template>
    <div class="statistic-charts">
        <statistic-panel title="类别数据">
            <div class="statistic-group">
                <div class="info-list">
                    <div class="info-item" v-for="year in dataArrayCategory">
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
                    <div class="info-item" v-for="year in dataArrayYear">
                        <div class="key">{{ year.name }}</div>
                        <div class="value">{{ year.value }}</div>
                    </div>
                </div>
                <chart-pie :data="dataArrayYear" title=""/>
                <chart-bar :data="dataArrayYear" title=""/>
            </div>

        </statistic-panel>
    </div>
</template>

<script>
import {mapState} from "vuex";
import ChartPie from "@/components/charts/ChartPie";
import ChartBar from "@/components/charts/ChartBar";
import StatisticPanel from "@/page/statistics/StatisticPanel";

export default {
    name: "StatisticCharts",
    components: {StatisticPanel, ChartBar, ChartPie},
    computed: {
        ...mapState(['statisticsCategory', 'statisticsYear','dataArrayCategory', 'dataArrayYear']),
    },
}
</script>

<style scoped lang="scss">
@import "statistic-charts";
</style>
