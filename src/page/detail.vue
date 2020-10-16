<template>

   <div class="body-white">
      <nav-bar/>
      <div class="diary-detail" id="diaryDetail">
         <!--META-->
         <div class="diary-meta">
            <div class="date">{{diary.date}}</div>
            <div class="weather">
               <img v-if="diary.weather" :src="`img/weather/${diary.weather}_active.svg`" :alt="diary.weather"></div>
            <div class="temperature"><span>{{diary.temperature}}</span>℃</div>
            <div :class="[`detail-category-${diary.category}`, 'detail-category']"><span>{{diary.categoryName}}</span>
            </div>
         </div>
         <!--TITLE-->
         <div class="diary-title">
            <h2>{{diary.title}}</h2>
         </div>

         <!--CONTENT-->
         <div class="diary-content" v-html="diary.content"></div>
      </div>


   </div>
</template>

<script>
   import utility from "../utility";
   import navBar from "../components/navbar";

   export default {
      data(){
         return {
            diary: null
         }
      },
      components:{
         navBar
      },
      mounted() {
         utility.getData(utility.URL.diaryOperation, {
            'type': 'query',
            'diaryId': 1376
         }).then(res => {
            let diary = res.data[0];
            this.diary = diary;
            this.diary.date = utility.formateDate(diary.date);
            let contentArray = diary.content.split('\n');
            let contentHtml = "";
            contentArray.forEach(item => {
               contentHtml += `<p>${item}</p>`
            });
            this.diary.content = contentHtml;
            this.diary.temperature = diary.temperature === '-273' ? '' : diary.temperature;
            this.diary.categoryName = utility.CATEGORIES[diary.category];
         })
      }
   }

</script>
