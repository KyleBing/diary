<template>
    <div class="statistic-container" v-else :style="`height:${insets.windowsHeight}px`">
        <div class="statistic-header">
            <div class="statistic-back-btn" @click="$router.back()">
                <tab-icon alt="关闭"/>
            </div>
            <div class="statistic-title">统计数据</div>
        </div>
        <div class="statistic-content">

            <statistic-info/>
            <statistic-charts/>
        </div>
    </div>
</template>

<script>
import list from "@/page/List"
import Navbar from "@/components/Navbar"
import {mapGetters, mapState} from 'vuex'
import ChartPie from "@/components/charts/chartPie";
import StatisticInfo from "@/page/statistics/StatisticInfo";
import TabIcon from "@/components/TabIcon";
import StatisticCharts from "@/page/statistics/StatisticCharts";
import statisticApi from "@/api/statisticApi";

export default {
    name: 'StatisticsMain',
    components: {
        StatisticCharts,
        TabIcon,
        StatisticInfo,
        ChartPie,
        Navbar,
        list
    },
    computed: {
        ...mapState(['insets', 'isShowSearchBar', 'statisticsCategory', 'statisticsYear']),
        ...mapGetters(['isInMobileMode']),

    },
    mounted() {
        this.getStatistic()
    },
    watch:{
        // 搜索按钮点击时，滚动到最顶部
        isShowSearchBar(newValue){
            if (newValue){
                this.$refs.diaryList.scrollTo(0, 0)
            } else {

            }
        },
    },
    methods: {
        getStatistic() {
            statisticApi.category()
                .then(res => {
                    this.SET_STATISTICS_CATEGORY(res.data)
                })
            statisticApi.year()
                .then(res => {
                    this.SET_STATISTICS_YEAR(res.data)
                })
        },
    }
}

</script>

<style lang="scss" scoped>
@import "../../assets/scss/plugin";
.back-btn{
    background-color: $bg-menu;
}

</style>
