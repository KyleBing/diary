<template>
    <div class="year-container" v-if="years.length > 0">
        <div class="year" v-for="(year,indexYear) in years" :key="indexYear">
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

<script>
import {mapState, mapMutations} from 'vuex'
import utility from "@/utility"

export default {
    name: "YearSelector",
    data() {
        return {
            monthChosen: ''
        }
    },
    mounted() {
        this.monthChosen = utility.getDiaryConfig().dateFilter || ''
    },
    watch: {
        monthChosen() {
            let diaryConfig = utility.getDiaryConfig()
            diaryConfig.dateFilter = this.monthChosen
            utility.setDiaryConfig(diaryConfig)
            this.SET_DATE_FILTER(this.monthChosen)
        }
    },
    computed: {
        ...mapState({
            years: 'statisticsYear'
        })
    },
    methods: {
        ...mapMutations(['SET_DATE_FILTER']),
        monthClicked(id) {
            if (id === this.monthChosen) {
                this.monthChosen = ''
            } else {
                this.monthChosen = id
            }
        }
    }
}
</script>
