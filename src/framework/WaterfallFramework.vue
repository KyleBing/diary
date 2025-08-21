<template>
    <div>
        <Navbar/>
        <!-- 横屏时 -->
        <div class="diary">
            <div class="diary-waterfall-container" :style="`height:${projectStore.insets.heightPanel}px`">
                <RouterView/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import statisticApi from "../api/statisticApi.ts";
import {useProjectStore} from "../pinia/useProjectStore.ts";
const projectStore = useProjectStore()
import { onMounted } from "vue";
import Navbar from "./navbar/Navbar.vue";
import {useStatisticStore} from "@/pinia/useStatisticStore.ts";
const statisticStore = useStatisticStore()
onMounted(()=>{
    getStatistic()
})


// 获取日记统计信息
function getStatistic() {
    statisticApi
        .category()
        .then(res => {
            statisticStore.statisticsCategory = res.data
            setDataArrayCategory(res.data)
        })
    statisticApi
        .year()
        .then(res => {
            statisticStore.statisticsYear = res.data
            setDataArrayYear(res.data)
        })
}
function setDataArrayYear(statisticsYear){
    if (statisticsYear){
        statisticStore.dataArrayYear = statisticsYear.reverse().map(year => {
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
    statisticStore.dataArrayCategory = keys.map(key => {
        return {
            name: statisticStore.categoryNameMap.get(key),
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
