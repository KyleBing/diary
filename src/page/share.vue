<template>
   <div class="share-container">
      <div class="share" :style="`min-height:${heightShare}px`">
         <div class="share-head">
            <!--head-->
            <div class="share-title">
               <h2>{{ diary.title}}</h2>
            </div>
            <div class="share-date">
               <div class="above">
                  <h3>{{dateObj.weekday}} </h3>
                  <div :class="[`share-category-${diary.category}`, 'share-category']">
                     <span>{{ diary.categoryName }}</span>
                  </div>
               </div>
               <div class="bottom">{{dateObj.dateFull}}</div>
            </div>

            <!--META-->
            <div class="share-meta">
               <div class="weather">
                  <img v-if="diary.weather"
                       :src="`img/weather/${diary.weather}_active.svg`"
                       :alt="diary.weather">
               </div>
               <div class="temperature" v-if="diary.temperature && diary.temperatureOutside">
                  <span v-if="diary.temperature">{{ diary.temperature }}</span>
                  <span v-if="diary.temperature && diary.temperatureOutside"> / </span>
                  <span v-if="diary.temperatureOutside">{{ diary.temperatureOutside }}</span>
               </div>
               <div class="temperature" v-else>
                  <span v-if="diary.temperature">{{ diary.temperature }} ℃</span>
               </div>
            </div>
            <!--end of head-->
         </div>

         <div class="divider" v-if="diary.content"></div>

         <!--CONTENT-->
         <div class="share-content" v-html="diary.content"></div>
         <!--TODO: 来自谁的日记-->
      </div>
   </div>
</template>

<script>
import utility from "../utility";

export default {
   data() {
      return {
         showToast: false,
         id: '',
         diary: {},
         dateObj: {},
         heightShare: 0
      }
   },
   mounted() {
      if (this.$route.params.id) {
         this.id = this.$route.params.id;
      }
      this.heightShare = window.innerHeight - 60 - 100
      window.onresize = () => {
         this.heightShare = window.innerHeight - 60 - 100
      }
   },
   watch:{
      $route(to){
         if (to.params.id) {
            this.id = to.params.id
         }
      },
      id(){
         utility.getData(utility.URL.shareContent, {
            'type': 'query',
            'diaryId': this.id
         }).then(res => {
            let diary = res.data;
            this.diary = diary;
            this.dateObj = utility.formateDate(diary.date);
            let contentArray = diary.content.split('\n');
            let contentHtml = "";
            contentArray.forEach(item => {
               contentHtml += `<p>${item}</p>`
            });
            this.diary.content = contentHtml;
            this.diary.temperature = utility.processTemperature(diary.temperature);
            this.diary.temperatureOutside = utility.processTemperature(diary.temperature_outside);
            this.diary.categoryName = utility.CATEGORIES[diary.category];
         })
      }
   }
}

</script>