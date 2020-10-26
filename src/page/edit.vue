<template>
   <div class="body-normal" :style="'min-height:' + heightBg + 'px'">
      <!-- navbar -->
      <nav class="navbar" id="navbar">
         <div class="navbar-btn-group left">
            <img alt="返回" @click="goBack" src="img/tabicon/back.svg">
         </div>
         <div class="navbar-btn-group right">
            <img @click="createDiary" alt="新建" src="img/tabicon/add.svg">
            <img @click="saveDiary" alt="保存" src="img/tabicon/done.svg">
         </div>
         <div class="brand">
            <a @click="switchContentPanel"><img :src="logoImageUrl" alt="日记"></a>
         </div>
      </nav>

      <!--content-->
      <div class="container" id="this">
         <textarea id="diary-editor-title" class="diary-editor-title" placeholder="一句话，概括你的一天" v-model="title"></textarea>
         <textarea v-show="contentEditorShowed" id="diary-editor-content" class="diary-editor-content" placeholder="日记详细内容，如果你有很多要写的" v-model="content"></textarea>
         <div class="diary-input-group">
            <label for="date">日期</label>
            <date-picker :editable="false"
                         v-model="date"
                         :confirm="true"
                         :default-value="new Date()"
                         placeholder="---- -- --"
                         input-class="date"
                         :clearable="false" id="date" type="datetime"/>
         </div>

         <div class="diary-input-group">
            <label for="temperature">气温 ℃</label>
            <input placeholder="--" class="temperature" type="number" name="temperature" id="temperature" v-model="temperature">
         </div>

         <category-selector @change="setCategory" />
         <weather-selector @change="setWeather"/>
      </div>
   </div>
</template>

<script>
   import utility from "../utility";
   import categorySelector from "../components/categorySelector";
   import weatherSelector from "../components/weatherSelector";
   import DatePicker from 'vue2-datepicker';
   import 'vue2-datepicker/locale/zh-cn';
   import 'vue2-datepicker/index.css';

   export default {
      data() {
         return {
            isNew: true,
            contentEditorShowed: false,

            id: "",
            title: "",
            titleOrigin: "",
            content: "",
            contentOrigin: "",
            date: '',
            weather: '',
            temperature: '-273',
            heightBg: 0,

            logoImageUrl: 'img/logo.svg'
         }
      },
      components: {categorySelector, weatherSelector, DatePicker},
      mounted() {
         this.heightBg = window.innerHeight;
         this.id = this.$route.query.id;

         // this.date = new Date();
         // 标签关闭提醒
         window.onbeforeunload = () => {
            if (this.diaryHasChanged) {
               return "日记内容已改变，显示提示框"
            }
         };
         this.isNew = !(this.$route.query.id);
         if (this.isNew) {
            // 新建日记
            this.id = '';
            this.date = new Date();
            this.title = '';
            this.content = '';
            this.category = 'life';
            this.temperature = '';
            this.weather = 'sunny'
            this.updateDiaryIcon();
         } else {
            // 编辑日记
            utility.getData(utility.URL.diaryOperation, {
               'type': 'query',
               'diaryId': this.id
            }).then(res => {
               if (res.data.length > 0) {
                  let diary = res.data[0];
                  this.category = diary.category;
                  this.date = new Date(diary.date);
                  this.temperature = diary.temperature;
                  this.weather = diary.weather;
                  this.title = diary.title;
                  this.titleOrigin = diary.title;
                  this.content = diary.content;
                  this.contentOrigin = diary.content;
                  this.temperature = diary.temperature === '-273' ? '' : diary.temperature;
                  if (diary.content) {
                     this.contentEditorShowed = true;
                  }
               } else {
                  this.$router.back();
               }
            })


         }
      },

      watch: {
         title: function () {
            this.updateDiaryIcon();
         },
         content: function () {
            this.updateDiaryIcon();
         },
         contentEditorShowed: function () {
            this.updateDiaryIcon();
         },
      },
      methods: {
         goBack() {
            this.$router.back()
         },
         setCategory(data){
            this.category = data
         },
         setWeather(data){
            this.weather = data
         },
         updateDiaryIcon() {
            if (this.diaryHasChanged) {
               this.logoImageUrl = this.contentEditorShowed ? 'img/logo_content.svg' : 'img/logo_title.svg'
            } else {
               this.logoImageUrl = this.contentEditorShowed ? 'img/logo_content_saved.svg' : 'img/logo_title_saved.svg'
            }
         },
         saveDiary() {
            if (this.title.trim().length === 0) {
               this.title = ''; // clear content
               utility.popMessage(utility.POP_MSG_TYPE.warning, '内容未填写', null);
               return;
            }

            if (this.temperature !== '' && !/^-?\d{1,2}$/.test(this.temperature)) {
               utility.popMessage(utility.POP_MSG_TYPE.warning, '温度格式不正确', null);
               return
            }
            let queryData = {
               diaryId: this.id,
               diaryTitle: this.title,
               diaryContent: this.content ? this.content : null,
               diaryCategory: this.category,
               diaryTemperature: this.temperature === '' ? -273 : this.temperature,
               diaryWeather: this.weather,
               diaryDate: utility.dateFormatter(this.date),
               type: this.isNew ? 'add' : 'modify'
            };

            utility.postData(utility.URL.diaryOperation, queryData).then(res => {
               // 成功后更新 origin 字符串
               this.titleOrigin = this.title;
               this.contentOrigin = this.content;
               this.updateDiaryIcon();

               utility.popMessage(utility.POP_MSG_TYPE.success, res.info); // 提示
               if (res.data) {
                  this.isNew = false;
                  this.id = res.data[0].id
               }
            })
         },

         switchContentPanel(){
            this.contentEditorShowed = !this.contentEditorShowed
         },
         createDiary() {
            this.isNew = true;
            this.title = '';
            this.titleOrigin = '';
            this.content = '';
            this.contentOrigin = '';
            this.id = '';
            this.category = "life";
            this.temperature = '';
            this.weather = "sunny";
         },
      },
      computed: {
         diaryHasChanged() {
            return this.title !== this.titleOrigin || this.content !== this.contentOrigin
         }
      },
   }
</script>

<style lang="scss">
   // 重置 Vue2-datepicker 样式
   .mx-icon-clear, .mx-icon-calendar{
      display: none;
   }
</style>