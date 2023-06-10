<template>
    <div>
        <navbar/>
        <!-- 横屏时 -->
        <div class="diary">
            <div class="diary-hole-container" :style="`height:${insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from "./navbar/Navbar"
import {mapGetters, mapMutations, mapState} from 'vuex'
import statisticApi from "../api/statisticApi";

export default {
    name: 'Hole',
    components: {
        Navbar,
    },
    computed: {
        ...mapState(['insets', 'isShowSearchBar']),
        ...mapGetters(['isInMobileMode', 'categoryNameMap'])
    },
    mounted() {
        this.getStatistic() // 载入统计信息
    },
    watch: {
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
            'SET_STATISTICS_CATEGORY',
            'SET_STATISTICS_YEAR',
            'SET_DATA_ARRAY_CATEGORY',
            'SET_DATA_ARRAY_YEAR',
            'SET_CATEGORY_ALL',
        ]),
        // 获取日记统计信息
        getStatistic() {
            statisticApi
                .category()
                .then(res => {
                    this.SET_STATISTICS_CATEGORY(res.data)
                    this.setDataArrayCategory(res.data)
                })
            statisticApi
                .year()
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
                    name: this.categoryNameMap.get(key),
                    value: statisticsCategory[key]
                }
            })
            this.SET_DATA_ARRAY_CATEGORY(data)
        }
    }
}

</script>

<style lang="scss" scoped>
.diary-list-container-mobile{
    width: 100%;
}
</style>
