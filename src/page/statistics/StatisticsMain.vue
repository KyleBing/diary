<template>
    <div class="statistic-container">
        <page-header title="统计数据">
            <div class="main-statistic">
                <div class="main-statistic-item">
                    <div class="label">共享</div> <div class="number value">{{ statisticsCategory.shared}}</div>
                </div>
                <div class="main-statistic-item">
                    <div class="label">总计</div> <div class="number value">{{ statisticsCategory.amount }}</div>
                </div>
            </div>
        </page-header>
        <div class="statistic-content" :style="`height:${insets.heightPanel}px`">
            <div class="statistic-diary">
                <statistic-charts/>
            </div>

            <div class="statistic-user">
                <statistic-users/>
            </div>

        </div>
    </div>
</template>

<script>
import list from "@/page/list/List"
import Navbar from "@/framework/Navbar"
import {mapGetters, mapMutations, mapState} from 'vuex'
import ChartPie from "@/components/charts/ChartPie";
import StatisticInfo from "@/page/statistics/diary/StatisticInfo";
import TabIcon from "@/components/TabIcon";
import StatisticCharts from "@/page/statistics/diary/StatisticCharts";
import statisticApi from "@/api/statisticApi";
import StatisticUsers from "@/page/statistics/users/StatisticUsers";
import diaryApi from "@/api/diaryApi";
import PageHeader from "@/framework/PageHeader";

export default {
    name: 'StatisticsMain',
    components: {
        PageHeader,
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
        this.getCategoryAll()
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
            'SET_STATISTICS_YEAR',
            'SET_CATEGORY_MAP',
            'SET_CATEGORY_ALL'
        ]),

        getCategoryAll(){
            diaryApi.categoryAllGet()
                .then(res => {
                    this.SET_CATEGORY_ALL(res.data)
                    let tempMap = new Map()
                    res.data.forEach(category => {
                        tempMap.set(category.name_en, category)
                    })
                    this.SET_CATEGORY_MAP(tempMap)
                    this.getStatistic()
                })
        },

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
                    key: key,
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

.main-statistic{
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;
    .main-statistic-item{
        margin-right: 20px;
        flex-flow: row nowrap;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .label{
            font-size: $fz-title;
            margin-right: 10px;
        }
        .value{
            font-size: $fz-title;
        }
    }
}

</style>
