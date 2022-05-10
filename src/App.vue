<template>
    <router-view/>
</template>
<script>
import {mapGetters, mapMutations} from "vuex";
import utility from "@/utility";
import statisticApi from "@/api/statisticApi";
export default {
    mounted() {
        // 初始化 LocalStorage 存储对象
        let diaryConfig = utility.getDiaryConfig()
        this.SET_FILTERED_CATEGORIES(diaryConfig.filteredCategories)
        this.SET_KEYWORD(diaryConfig.keywords)

        window.onresize = () => {
            this.SET_INSETS({
                windowsHeight: window.innerHeight,
                windowsWidth: window.innerWidth,
                heightPanel: window.innerHeight - 45, // 除 navbar 的高度
            })
        }

        // 旧版本数据清除
        if (diaryConfig.hasOwnProperty('keyword')){ // keyword 是旧版数据，已改为 keywords: []
            utility.deleteDiaryConfig()
        }
        this.getStatistic() // 载入统计信息
    },
    computed: {
        ...mapGetters(['categoryMap']),
    },
    methods: {
        ...mapMutations([
            'SET_INSETS',
            'SET_KEYWORD',
            'SET_FILTERED_CATEGORIES',
            'SET_STATISTICS_CATEGORY',
            'SET_STATISTICS_YEAR',
            'SET_DATA_ARRAY_CATEGORY',
            'SET_DATA_ARRAY_YEAR',
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

<style lang="scss">
@import "assets/scss/diary";
</style>

