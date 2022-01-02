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
        this.SET_KEYWORD(diaryConfig.keyword)

        window.onresize = () => {
            this.SET_INSETS({
                windowsHeight: window.innerHeight,
                windowsWidth: window.innerWidth,
                heightPanel: window.innerHeight - 45, // 除 navbar 的高度
            })
        }
    },
    methods: {
        ...mapMutations(['SET_INSETS', 'SET_KEYWORD','SET_FILTERED_CATEGORIES'])
    }
}
</script>

<style lang="scss">
@import "./scss/diary";
</style>

