<template>
    <div>
        <Navbar/>
        <RouterView/>
    </div>
</template>

<script lang="ts" setup>
import Navbar from "./navbar/Navbar.vue"
import statisticApi from "../api/statisticApi.ts";

import {useProjectStore} from "../pinia";
const projectStore = useProjectStore()
import {onMounted, ref, watch} from "vue";
import {storeToRefs} from "pinia";

const refDiaryList = ref()

onMounted(() => {
    getStatistic() // 载入统计信息
})

const { isShowSearchBar } = storeToRefs(projectStore)
watch(isShowSearchBar, newValue => {
    if (newValue){
        refDiaryList.value.scrollTo(0, 0)
    } else {

    }
})

function getStatistic() {
    statisticApi
        .category()
        .then(res => {
            projectStore.statisticsCategory = res.data
            setDataArrayCategory(res.data)
        })
    statisticApi
        .year()
        .then(res => {
            projectStore.statisticsYear = res.data
            setDataArrayYear(res.data)
        })
}
function setDataArrayYear(statisticsYear){
    if (statisticsYear){
        projectStore.dataArrayYear = statisticsYear.reverse()
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
    projectStore.dataArrayCategory = keys.map(key => {
                                            return {
                                                name: projectStore.categoryNameMap.get(key),
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
