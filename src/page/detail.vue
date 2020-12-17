<template>

   <div class="body-white">
      <!-- navbar -->
      <nav class="navbar" id="navbar">
         <div class="navbar-btn-group left">
            <img alt="返回" @click="goBack" src="img/tabicon/back.svg">
         </div>
         <div class="navbar-btn-group right">
            <img alt="删除" @click="show" src="img/tabicon/delete.svg"/>
            <router-link :to="'/edit?id=' + id"><img alt="添加" src="img/tabicon/edit.svg"></router-link>
         </div>
      </nav>

      <!--content-->
      <div class="diary-detail" id="diaryDetail" :style="'min-height: ' + heightBg + 'px'">
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


     <!--TOAST-->
      <div id="toast" class="fadeIn animated-fast" v-show="showToast">
         <div class="toast">
            <div class="toast-header">确定删除吗</div>
            <div class="toast-body"></div>
            <div class="toast-footer">
               <div class="btn-cancel" @click="hide">取消</div>
               <div class="btn-confirm" @click="deleteCurrentDiary">确定</div>
            </div>
         </div>
         <div class="mask"></div>
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
            heightBg: 0
         }
      },
      mounted() {
         this.heightBg = window.innerHeight
         this.id = this.$route.query.id;
         utility.getData(utility.URL.diaryOperation, {
            'type': 'query',
            'diaryId': this.id
         }).then(res => {
            if (res.data.length > 0) {
               let diary = res.data[0];
               this.diary = diary;
               let dateOjb = utility.formateDate(diary.date);
               this.diary.date = dateOjb.date + ' ' +  dateOjb.weekday + ' ' + dateOjb.timeName + ' ' + dateOjb.time;
               let contentArray = diary.content.split('\n');
               let contentHtml = "";
               contentArray.forEach(item => {
                  contentHtml += `<p>${item}</p>`
               });
               this.diary.content = contentHtml;
               this.diary.temperature = diary.temperature === '-273' ? '' : diary.temperature;
               this.diary.temperatureOutside = diary.temperature_outside === '-273' ? '' : diary.temperature_outside;
               this.diary.categoryName = utility.CATEGORIES[diary.category];
            } else {
               this.$router.back();
            }
         })
      },
      methods: {
         goBack() {
            this.$router.back()
         },
         show: function () {
            this.showToast = true
         },
         hide: function () {
            this.showToast = false
         },
         deleteCurrentDiary: function () {
            let that = this;
            let queryData = {
               diaryId: this.id,
               type: 'delete'
            };
            utility.postData(utility.URL.diaryOperation, queryData)
               .then(res => {
                  that.hide();
                  utility.popMessage(utility.POP_MSG_TYPE.success, res.info, () => {
                     this.$router.push('/')
                  }, 1) // 删除成功后等待时间不要太长
               })
         }
      }
   }

</script>
