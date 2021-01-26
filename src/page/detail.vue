<template>
   <!--content-->
   <div class="diary-detail" id="diaryDetail">
      <!--META-->
      <div class="diary-meta">
         <div class="date">{{diary.date}}</div>
         <div class="weather"><img v-if="diary.weather" :src="`img/weather/${diary.weather}_active.svg`" :alt="diary.weather"></div>
         <div class="temperature" v-if="diary.temperature && diary.temperatureOutside">
            <span v-if="diary.temperature">{{diary.temperature}}</span>
            <span v-if="diary.temperature && diary.temperatureOutside"> / </span>
            <span v-if="diary.temperatureOutside">{{diary.temperatureOutside}}</span>
         </div>
         <div class="temperature" v-else>
            <span v-if="diary.temperature">{{diary.temperature}} ℃</span>
         </div>
         <div :class="[`detail-category-${diary.category}`, 'detail-category']"><span>{{diary.categoryName}}</span></div>
      </div>
      <!--TITLE-->
      <div class="diary-title">
         <h2>{{diary.title}}</h2>
      </div>

      <!--CONTENT-->
      <div class="diary-content" v-html="diary.content"></div>
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
         }
      },
      mounted() {
         this.id = this.$route.params.id;
         this.showDiary(this.id);
      },
      watch: {
         $route(to){
            this.showDiary(to.params.id);
         }
      },
      methods: {
         goBack () {
            this.$router.back()
         },
         show () {
            this.showToast = true
         },
         hide () {
            this.showToast = false
         },
         showDiary(id){
            utility.getData(utility.URL.diaryOperation, {
               'type': 'query',
               'diaryId': id
            }).then(res => {
               let diary = res.data;
               this.diary = diary;
               this.$store.commit('setCurrentDiary', diary); // 设置 store: currentDiary
               let dateOjb = utility.formateDate(diary.date);
               document.title = '日记 - ' + dateOjb.dateFull; // 变更当前标签的 Title
               this.diary.date = dateOjb.date + ' ' +  dateOjb.weekday + ' ' + dateOjb.timeName + ' ' + dateOjb.time;
               if (diary.content){
                  let contentArray = diary.content.split('\n');
                  let contentHtml = "";
                  contentArray.forEach(item => {
                     contentHtml += `<p>${item}</p>`
                  });
                  this.diary.content = contentHtml;
               }
               this.diary.temperature = diary.temperature === '-273' ? '' : diary.temperature;
               this.diary.temperatureOutside = diary.temperature_outside === '-273' ? '' : diary.temperature_outside;
               this.diary.categoryName = utility.CATEGORIES[diary.category];
            })
            .catch(()=>{
               this.$router.back();
            })
         },
      }
   }

</script>
