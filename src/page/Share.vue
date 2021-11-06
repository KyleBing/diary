<template>
   <div class="share-container">
      <div class="share" :style="`min-height:${heightShare}px`">
         <div class="share-head" v-if="diary.title">
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

         <!-- NO DIARY -->
         <div v-else class="no-diary">
            <p>无此日记</p>
            <router-link to="../">点此返回《标题日记》主页</router-link>
         </div>

         <div class="divider" v-if="diary.content"></div>

         <!--CONTENT-->
         <div class="share-content" v-html="diary.contentHtml"></div>
         <!--TODO: 来自谁的日记-->
      </div>
   </div>
</template>

<script>
import utility from "../utility"

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
         this.id = this.$route.params.id
      }
      this.heightShare = window.innerWidth > 375 ? window.innerHeight - 60 - 100 : window.innerHeight
      window.onresize = () => {
         this.heightShare = window.innerWidth > 375 ? window.innerHeight - 60 - 100 : window.innerHeight
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
            let diary = res.data
            this.diary = diary
            this.dateObj = utility.formatDate(diary.date)
            document.title = '日记 - ' + this.dateObj.dateFull // 变更标题
            if (this.diary.content){
               let contentArray = diary.content.split('\n')
               let contentHtml = ""
               contentArray.forEach(item => {
                  contentHtml += `<p>${item}</p>`
               })
               this.diary.contentHtml = contentHtml
            }
            this.diary.temperature = utility.temperatureProcessSTC(diary.temperature)
            this.diary.temperatureOutside = utility.temperatureProcessSTC(diary.temperature_outside)
            this.diary.categoryName = utility.CATEGORIES[diary.category]
         })
         .catch(() => {
            this.diary = {}
         })
      }
   }
}

</script>
