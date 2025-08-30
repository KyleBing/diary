<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated faceOut"
    >
        <div class="statistic-charts" v-if="isShow">
           <ChartLineTrend
               v-if="weatherStatisticData.length > 0"
               :height="400"
               :combine-data="weatherStatisticData"/>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import statisticApi from "@/api/statisticApi.ts";
import ChartLineTrend from "./ChartLineTrend.vue";
import {onMounted, ref} from "vue";
import {dateFormatter} from "@/utility.ts";

const isShow = ref(false)
const weatherStatisticData = ref([])

onMounted(()=>{
    isShow.value = true
    getWeatherData()
})

function getWeatherData(){
    statisticApi
        .weather()
        .then(res => {
            let tempData = res.data.map(item => {
                let temperature = item.temperature === -273 ? null: item.temperature
                let date = dateFormatter(new Date(item.date), 'yyyy-MM-dd')
                let temperature_outside = item.temperature_outside === -273? null: item.temperature_outside
                return [date, temperature, temperature_outside]
            })
            weatherStatisticData.value = tempData
        })
}
</script>

<style scoped lang="scss">
</style>
