<template>
    <router-view/>
</template>
<script>
import {mapMutations} from "vuex";
import utility from "@/utility";
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
    },
    methods: {
        ...mapMutations(['SET_INSETS', 'SET_KEYWORD','SET_FILTERED_CATEGORIES'])
    }
}
</script>

<style lang="scss">
@import "assets/scss/diary";
</style>

