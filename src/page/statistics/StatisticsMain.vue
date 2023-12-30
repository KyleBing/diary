<template>
    <div class="statistic-container" :style="`height: ${storeProject.insets.windowsHeight}px`">

        <!-- Header -->
        <PageHeader title="统计数据">
            <div class="main-statistic">
                <div class="main-statistic-item">
                    <div class="label">共享</div> <div class="number value">{{ storeProject.statisticsCategory.shared}}</div>
                </div>
                <div class="main-statistic-item">
                    <div class="label">总计</div> <div class="number value">{{ storeProject.statisticsCategory.amount }}</div>
                </div>
            </div>
        </PageHeader>

        <div v-if="isLoading" class="pt-8 pb-8">
            <Loading :loading="isLoading"/>
        </div>
        <div v-else class="statistic-content" :style="`height:${storeProject.insets.heightPanel}px`">

            <div class="statistic-user">
                <StatisticUsers/>
            </div>

            <div class="statistic-diary">
                <StatisticCharts/>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import statisticApi from "../../api/statisticApi.js"
import PageHeader from "../../framework/pageHeader/PageHeader.vue"
import Loading from "../../components/Loading.vue"
import StatisticUsers from "./users/StatisticUsers.vue";
import StatisticCharts from "./diary/StatisticCharts.vue";

import {useProjectStore} from "../../pinia";
const storeProject = useProjectStore()
import {onMounted, ref} from "vue";


const isLoading = ref(false)

onMounted(()=>{
    getStatistic()
})

// 获取日记统计信息
function getStatistic() {
    statisticApi
        .category()
        .then(res => {
            storeProject.statisticsCategory = res.data
            let keys = Object.keys(res.data)
            keys = keys.filter(item =>  item !== 'amount' && item !== 'shared')
            storeProject.dataArrayCategory =  keys.map(key => {
                return {
                    name: storeProject.categoryNameMap.get(key),
                    key: key,
                    value: res.data[key]
                }
            })
        })
    statisticApi
        .year()
        .then(res => {
            storeProject.statisticsYear = res.data
            if (res.data){
                storeProject.dataArrayYear = res.data.reverse().map(year => {
                    return {
                        name: year.year,
                        value: year.count
                    }
                })
            }
        })
}

</script>

<style lang="scss" scoped>
@import "../../scss/plugin";
.back-btn{
    background-color: $bg-menu;
}

.main-statistic{
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;
    .main-statistic-item{
        margin-right: 20px;
        flex-flow: row nowrap;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .label{
            font-size: $fz-title;
            margin-right: 10px;
        }
        .value{
            font-size: $fz-title;
        }
    }
}

</style>
