<template>
    <div>
        <navbar/>

        <!-- 竖屏时 -->
        <div class="diary" v-if="isInMobileMode" :style="`height:${insets.heightPanel}px`">
            <div ref="diaryList" class="diary-list-container diary-list-container-mobile"
                 :style="`height:${insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>

        <!-- 横屏时 -->
        <div class="diary" v-else>
            <div ref="diaryList" class="diary-list-container" :style="`height:${insets.heightPanel}px`">
                <List/>
            </div>
            <div class="diary-container" :style="`height:${insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import List from "@/page/list/List"
import Navbar from "@/framework/Navbar"
import {mapGetters, mapMutations, mapState} from 'vuex'
import statisticApi from "@/api/statisticApi";
import diaryApi from "@/api/diaryApi";

export default {
    name: 'Index',
    components: {
        Navbar,
        List
    },
    computed: {
        ...mapState(['insets', 'isShowSearchBar']),
        ...mapGetters(['isInMobileMode', 'categoryNameMap'])
    },
    mounted() {
        console.log('$route.path: ',this.$route.path)
        if(this.$route.path === '/' || this.$route.path === undefined){
            if (this.isInMobileMode){
                this.$router.push({name: 'List'})
            } else {
                this.$router.push({name: 'Edit'})
            }
        }

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
