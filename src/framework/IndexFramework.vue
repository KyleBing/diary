<template>
    <div>
        <Navbar/>

        <!-- 竖屏时 -->
        <div class="diary" v-if="projectStore.isInMobileMode" :style="`height:${projectStore.insets.heightPanel}px`">
            <div ref="refDiaryList" class="diary-list-container diary-list-container-mobile"
                 :style="`height:${projectStore.insets.heightPanel}px`">
                <RouterView/>
            </div>
        </div>

        <!-- 横屏时 -->
        <div class="diary" v-else>
            <div ref="refDiaryList" class="diary-list-container" :style="`height:${projectStore.insets.heightPanel}px`">
                <List/>
            </div>
            <div class="diary-container" :style="`height:${projectStore.insets.heightPanel}px`">
                <RouterView/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import List from "@/view/DiaryList/List.vue"
import Navbar from "./navbar/Navbar.vue"

import {useProjectStore} from "../pinia/useProjectStore.ts";
const projectStore = useProjectStore()
import {useStatisticStore} from "../pinia/useStatisticStore.ts";
import {onMounted, ref, watch} from "vue";
import {storeToRefs} from "pinia";
const refDiaryList = ref()

onMounted(() => {
    useStatisticStore().getStatistic() // 载入统计信息
})

const { isShowSearchBar } = storeToRefs(projectStore)
watch(isShowSearchBar, newValue => {
    if (newValue){
        refDiaryList.value.scrollTo(0, 0)
    } else {

    }
})


</script>

<style lang="scss" scoped>
.diary-list-container-mobile{
    width: 100%;
}
</style>
