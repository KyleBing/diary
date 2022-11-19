<template>
    <router-view v-if="categoryAll.length > 0"/>
</template>
<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import utility from "@/utility";
import diaryApi from "@/api/diaryApi";
export default {
    created() {
        // 日记项目载入后，隐藏 preloading
        document.querySelector('.preloading').style.display = 'none'
    },
    mounted() {
        this.getCategoryAll()
        // 初始化 LocalStorage 存储对象
        let diaryConfig = utility.getDiaryConfig()
        this.SET_FILTERED_CATEGORIES(diaryConfig.filteredCategories)
        this.SET_KEYWORD(diaryConfig.keywords)
        this.SET_DATE_FILTER(diaryConfig.dateFilter)
        this.SET_IS_FILTER_SHARED(diaryConfig.isFilterShared)

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
    },
    computed: {
        ...mapState(['categoryAll'])
    },
    methods: {
        ...mapMutations([
            'SET_INSETS',
            'SET_KEYWORD',
            'SET_DATE_FILTER',
            'SET_FILTERED_CATEGORIES',
            'SET_CATEGORY_ALL',
            'SET_IS_FILTER_SHARED'
        ]),
        getCategoryAll() {
            diaryApi
                .categoryAllGet()
                .then(res => {
                    this.SET_CATEGORY_ALL(res.data)
                })
        },
    }
}
</script>

<style lang="scss">
@import "assets/scss/diary";
</style>

