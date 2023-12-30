<template>
    <div>
        <Navbar/>

        <!-- 竖屏时 -->
        <div class="diary" v-if="storeProject.isInMobileMode" :style="`height:${storeProject.insets.heightPanel}px`">
            <div ref="refDiaryList" class="diary-list-container diary-list-container-mobile"
                 :style="`height:${storeProject.insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>

        <!-- 横屏时 -->
        <div class="diary" v-else>
            <div ref="refDiaryList" class="diary-list-container" :style="`height:${storeProject.insets.heightPanel}px`">
                <List/>
            </div>
            <div class="diary-container" :style="`height:${storeProject.insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import List from "../page/list/List.vue"
import Navbar from "./navbar/Navbar.vue"
import statisticApi from "../api/statisticApi.ts";

import {useProjectStore} from "../pinia";
const storeProject = useProjectStore()
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
const refDiaryList = ref()

onMounted(() => {
    console.log('route.path: ',route.path)
    if(route.path === '/' || route.path === ""){ // TODO: 看是否会遇到
        if (storeProject.isInMobileMode){
            router.push({name: 'List'})
        } else {
            router.push({name: 'EditNew'})
        }
    }
    getStatistic() // 载入统计信息
})

watch(storeProject.isShowSearchBar, newValue => {
    if (newValue){
        refDiaryList.value.scrollTo(0, 0)
    } else {

    }
})

function getStatistic() {
    statisticApi
        .category()
        .then(res => {
            storeProject.statisticsCategory = res.data
            setDataArrayCategory(res.data)
        })
    statisticApi
        .year()
        .then(res => {
            storeProject.statisticsYear = res.data
            setDataArrayYear(res.data)
        })
}
function setDataArrayYear(statisticsYear){
    if (statisticsYear){
        storeProject.dataArrayYear = statisticsYear.reverse()
                                                    .map(year => {
                                                        return {
                                                            name: year.year,
                                                            value: year.count
                                                        }
                                                    })
    }
}
function setDataArrayCategory(statisticsCategory){
    let keys = Object.keys(statisticsCategory)
    keys = keys.filter(item =>  item !== 'amount' && item !== 'shared')
    storeProject.dataArrayCategory = keys.map(key => {
                                            return {
                                                name: storeProject.categoryNameMap.get(key),
                                                value: statisticsCategory[key]
                                            }
                                        })
}

</script>

<style lang="scss" scoped>
.diary-list-container-mobile{
    width: 100%;
}
</style>
