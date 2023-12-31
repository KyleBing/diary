<template>
    <div>
        <Navbar/>
        <!-- 横屏时 -->
        <div class="diary">
            <div class="diary-hole-container" :style="`height:${storeProject.insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import statisticApi from "../api/statisticApi.ts";
import {useProjectStore} from "../pinia";
const storeProject = useProjectStore()
import { onMounted } from "vue";
import Navbar from "./navbar/Navbar.vue";

onMounted(()=>{
    getStatistic()
})


// 获取日记统计信息
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
        storeProject.dataArrayYear = statisticsYear.reverse().map(year => {
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
