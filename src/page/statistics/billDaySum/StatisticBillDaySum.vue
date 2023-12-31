<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated faceOut"
    >
        <div class="statistic-charts" v-if="isShow">
           <ChartBarOfBillDay
               v-if="billStatisticData.length > 0"
               :height="400"
               :combine-data="billStatisticData"/>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import statisticApi from "../../../api/statisticApi.ts";
import ChartBarOfBillDay from "./ChartBarOfBillDay.vue";
import {onMounted, ref} from "vue";
import {dateFormatter} from "../../../utility.ts";

const isShow = ref(false)
const billStatisticData = ref([])

onMounted(()=>{
    isShow.value = true
    getBillData()
})

function getBillData(){
    statisticApi
        .daySum()
        .then(res => {
            billStatisticData.value = res.data.map(item => {
                item.sumOutput = Math.abs(item.sumOutput)
                item.date = dateFormatter(new Date(item.date), 'yyyy-MM-dd')
                return item
            })
        })
}
</script>

<style scoped lang="scss">
</style>
