<template>
    <div class="statistic-container" v-else >
        <div class="statistic-header">
            <div class="statistic-back-btn" @click="$router.back()">
                <tab-icon alt="关闭"/>
            </div>
            <div class="statistic-title">统计数据</div>
        </div>
        <div class="statistic-content" :style="`height:${insets.heightPanel}px`">

            <div class="statistic-diary">
                <statistic-info/>
                <statistic-charts/>
            </div>

            <div class="statistic-user">
                <statistic-users/>
            </div>

        </div>
    </div>
</template>

<script>
import list from "@/page/List"
import Navbar from "@/components/Navbar"
import {mapGetters, mapMutations, mapState} from 'vuex'
import ChartPie from "@/components/charts/chartPie";
import StatisticInfo from "@/page/statistics/diary/StatisticInfo";
import TabIcon from "@/components/TabIcon";
import StatisticCharts from "@/page/statistics/diary/StatisticCharts";
import statisticApi from "@/api/statisticApi";
import StatisticUsers from "@/page/statistics/users/StatisticUsers";

export default {
    name: 'StatisticsMain',
    components: {
        StatisticUsers,
        StatisticCharts,
        TabIcon,
        StatisticInfo,
        ChartPie,
        Navbar,
        list
    },
    computed: {
        ...mapState(['insets', 'isShowSearchBar', 'statisticsCategory', 'statisticsYear']),
        ...mapGetters(['isInMobileMode', 'categoryMap']),

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
        ...mapMutations([
            'SET_DATA_ARRAY_CATEGORY',
            'SET_DATA_ARRAY_YEAR',
            'SET_STATISTICS_YEAR',
            'SET_STATISTICS_CATEGORY',
            'SET_STATISTICS_YEAR'
        ]),

        // 获取日记统计信息
        getStatistic() {
            statisticApi.category()
                .then(res => {
                    this.SET_STATISTICS_CATEGORY(res.data)
                    this.setDataArrayCategory(res.data)
                })
            statisticApi.year()
                .then(res => {
                    this.SET_STATISTICS_YEAR(res.data)
                    this.setDataArrayYear(res.data)
                })
        },
        setDataArrayYear(statisticsYear){
            if (statisticsYear){
                let data = statisticsYear.reverse().map(year => {
                    return {
                        name: year.year,
                        value: year.count
                    }
                })
                this.SET_DATA_ARRAY_YEAR(data)
            }
        },
        setDataArrayCategory(statisticsCategory){
            let keys = Object.keys(statisticsCategory)
            keys = keys.filter(item =>  item !== 'amount' && item !== 'shared')
            let data =  keys.map(key => {
                return {
                    name: this.categoryMap.get(key),
                    value: statisticsCategory[key]
                }
            })
            this.SET_DATA_ARRAY_CATEGORY(data)
        }
    }
}

</script>

<style lang="scss" scoped>
@import "../../assets/scss/plugin";
.back-btn{
    background-color: $bg-menu;
}

</style>
