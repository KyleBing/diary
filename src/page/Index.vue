<template>
    <div>
        <navbar/>

        <div class="diary" v-if="isInMobileMode" :style="`height:${insets.heightPanel}px`">
            <div ref="diaryList" class="diary-list-container diary-list-container-mobile"
                 :style="`height:${insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>

        <div class="diary" v-else>
            <div ref="diaryList" class="diary-list-container" :style="`height:${insets.heightPanel}px`">
                <list/>
            </div>
            <div class="diary-container" :style="`height:${insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import list from "@/page/List"
import Navbar from "@/components/Navbar"
import {mapGetters, mapState} from 'vuex'

export default {
    name: 'Index',
    components: {
        Navbar,
        list
    },
    computed: {
        ...mapState(['insets', 'isShowSearchBar']),
        ...mapGetters(['isInMobileMode'])
    },
    mounted() {
        if (this.isInMobileMode){
            this.$router.push('/list')
        } else {
            this.$router.push('/edit')
        }
    },
    watch:{
        // 搜索按钮点击时，滚动到最顶部
        isShowSearchBar(newValue){
            if (newValue){
                this.$refs.diaryList.scrollTo(0, 0)
            } else {

            }
        },
    }
}

</script>

<style lang="scss" scoped>
.diary-list-container-mobile{
    width: 100%;
}
</style>
