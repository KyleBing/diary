<template>
    <MenuPanelContainer>
        <div class="year-container" v-if="statisticStore.statisticsYear.length > 0">
            <div class="year" v-for="(year,indexYear) in statisticStore.statisticsYear" :key="indexYear">
                <div class="year-header">
                    <span>{{ year.year }}</span>
                    <sup class="count">{{ year.count }}</sup>
                </div>
                <div class="year-list">
                    <div :class="['year-month-item', {active: projectStore.dateFilterString === month.id}]"
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
    </MenuPanelContainer>
</template>

<script lang="ts" setup>
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import MenuPanelContainer from "@/framework/MenuPanelContainer.vue";
import { useStatisticStore } from "@/pinia/useStatisticStore.ts";
const projectStore = useProjectStore()
const statisticStore = useStatisticStore()

function monthClicked(monthId: string) {
    if (monthId === projectStore.dateFilterString) {
        projectStore.SET_DATE_FILTER_STRING('')
    } else {
        projectStore.SET_DATE_FILTER_STRING(monthId)
    }
}
</script>

<style lang="scss" scoped>
@import "year-selector";
</style>
