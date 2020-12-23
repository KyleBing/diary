<template>
   <!--content-->
   <div class="share" :style="'min-height: ' + heightBg + 'px'">
      <div class="share-head">
         <div class="share-title">
            <h2>{{ diary.title }}</h2>
         </div>
         <div class="share-date">
            <div class="above">
               <h3>{{dateObj.timeName}} </h3>
               <div :class="[`share-category-${diary.category}`, 'share-category']"><span>{{ diary.categoryName }}</span></div>
            </div>
            <div class="bottom">{{dateObj.date}} {{dateObj.weekday}}</div>
         </div>

         <!--META-->
         <div class="share-meta">
            <div class="weather">
               <img v-if="diary.weather" :src="`img/weather/${diary.weather}_active.svg`" :alt="diary.weather"></div>
            <div class="temperature" v-if="diary.temperature && diary.temperatureOutside">
               <span v-if="diary.temperature">{{ diary.temperature }}</span>
               <span v-if="diary.temperature && diary.temperatureOutside"> / </span>
               <span v-if="diary.temperatureOutside">{{ diary.temperatureOutside }}</span>
            </div>
            <div class="temperature" v-else>
               <span v-if="diary.temperature">{{ diary.temperature }} ℃</span>
            </div>
         </div>
      </div>

      <!--CONTENT-->
      <div class="share-content" v-html="diary.content"></div>
      <!--TODO: 来自谁的日记-->
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
         heightBg: 0
      }
   },
   mounted() {
      this.heightBg = window.innerHeight - 40 * 2; // 去除上下的 margin
      this.id = this.$route.query.id;
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
         this.diary.temperature = diary.temperature === '-273' ? '' : diary.temperature;
         this.diary.temperatureOutside = diary.temperature_outside === '-273' ? '' : diary.temperature_outside;
         this.diary.categoryName = utility.CATEGORIES[diary.category];
      })
   },
}

</script>
