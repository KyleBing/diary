<template>
    <div class="year-container" v-if="storeProject.statisticsYear.length > 0">
        <div class="year" v-for="(year,indexYear) in storeProject.statisticsYear" :key="indexYear">
            <div class="year-header">
                <span>{{ year.year }}</span>
                <sup class="count">{{ year.count }}</sup>
            </div>
            <div class="year-list">
                <div :class="['year-month-item', {active: monthChosen === month.id}]"
                     v-for="(month, indexMonth) in year.months"
                     @click="monthClicked(month.id)"
                     :key="indexMonth">
                    <p class="month">{{ month.month }}</p>
                    <span class="month-count">{{ month.count }}</span>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="year-tip"> - 空 - </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {getDiaryConfigFromLocalStorage} from "../../../utility.ts";
import {useProjectStore} from "../../../pinia";

const storeProject = useProjectStore()

const monthChosen = ref('')
onMounted(()=>{
    monthChosen.value = getDiaryConfigFromLocalStorage().dateFilter || ''
})

watch(monthChosen, newValue => {
    storeProject.dateFilter = newValue
})

function monthClicked(id) {
    if (id === monthChosen.value) {
        monthChosen.value = ''
    } else {
        monthChosen.value = id
    }
}
</script>

<style lang="scss" scoped>
@import "year-selector";
</style>
