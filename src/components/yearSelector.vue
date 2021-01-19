<template>
   <div class="year-container">
      <div class="year" v-for="(year,indexYear) in years" :key="indexYear">
         <div class="year-header">{{year.year}}</div>
         <div class="year-list">
            <div :class="['year-month-item', {active: monthChosen === month.id}]"
                 v-for="(month, indexMonth) in year.months"
                 @click="monthClicked(month.id)"
                 :key="indexMonth">
               <p class="month">{{month.month}}</p>
               <span class="month-count">{{month.count}}</span>
            </div>
         </div>
      </div>
   </div>

</template>

<script>
import { mapState } from 'vuex'
import utility from "@/utility";

export default {
   name: "yearSelector",
   data() {
      return {
         monthChosen: ''
      }
   },
   mounted() {
      this.monthChosen = utility.queryData.dateRange || ''
   },
   watch: {
      monthChosen(){
         // this.$emit('change', this.monthChosen);
         utility.queryData.dateRange = this.monthChosen
      }
   },
   computed: {
      ...mapState({
         years: 'statisticsYear'
      })
   },
   methods: {
      monthClicked(id){
         this.monthChosen = id;
      }
   }
}
</script>