<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated faceOut"
    >
        <div class="statistic-charts" v-if="isShow">
           <ChartBarOfBillMonth
               v-if="billMonthStatisticData.length > 0"
               :height="400"
               :combine-data="billMonthStatisticData"/>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import statisticApi from "@/api/statisticApi.ts";
import ChartBarOfBillMonth from "./ChartBarOfBillMonth.vue";

import {onMounted, ref} from "vue";

const isShow = ref(false)
const billMonthStatisticData = ref([])

onMounted(()=>{
    isShow.value = true
    getWeatherData()
})

function getWeatherData(){
    statisticApi
        .monthSum()
        .then(res => {
            billMonthStatisticData.value = res.data.map(item => {
                item.sumOutput = Math.abs(item.sumOutput)
                item.date = item.month_id
                return item
            })
        })
}
</script>

<style scoped lang="scss">
</style>
