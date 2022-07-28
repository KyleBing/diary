<template>
    <div class="statistic-info">
        <div class="info-list-group">
            <statistic-panel title="年份统计">
                <div class="info-list">
                    <div class="info-item" v-for="year in dataArrayYear">
                        <div class="key">{{ year.name }}</div>
                        <div class="value">{{ year.value }}</div>
                    </div>
                </div>
            </statistic-panel>

            <statistic-panel title="类别统计">
                <div class="info-list">
                    <div class="info-item" v-for="year in dataArrayCategory">
                        <div class="key">{{ year.name }}</div>
                        <div class="value">{{ year.value }}</div>
                    </div>
                </div>
            </statistic-panel>
        </div>

    </div>
</template>

<script>
import {mapState} from "vuex";
import StatisticPanel from "@/page/statistics/StatisticPanel";

export default {
    name: "StatisticInfo",
    components: {StatisticPanel},
    computed: {
        ...mapState(['statisticsCategory', 'statisticsYear', 'dataArrayCategory', 'dataArrayYear']),
    }
}
</script>

<style scoped lang="scss">
</style>
