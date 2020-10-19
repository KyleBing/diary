<template>
   <div class="body-normal" :style="'min-height:' + heightBg + 'px'">
      <!-- navbar -->
      <nav class="navbar" id="navbar">
         <div class="navbar-btn-group left">
            <img alt="返回" @click="goBack" src="img/tabicon/back.svg">
         </div>
         <div class="navbar-btn-group right">
            <img alt="添加" src="img/tabicon/edit.svg">
         </div>
         <div class="brand">
            <a><img src="img/logo.svg" alt="日记"></a>
         </div>
      </nav>

      <!--content-->
      <div class="container" id="this">
         <textarea id="diary-editor-title" class="diary-editor-title" placeholder="一句话，概括你的一天" v-model="diary.title"></textarea>
         <textarea v-show="contentEditorShowed" id="diary-editor-content" class="diary-editor-content" placeholder="日记详细内容，如果你有很多要写的" v-model="diary.content"></textarea>
         <div class="diary-input-group">
            <label for="date">日期</label>
            <date-picker :editable="false"
                         :confirm="true"
                         :default-value="diary.date? diary.date : new Date()"
                         placeholder="---- -- --"
                         :input-class="date"
                         :clearable="false" id="date" v-model="date" type="datetime"/>
         </div>

         <div class="diary-input-group">
            <label for="temperature">气温 ℃</label>
            <input placeholder="--" class="temperature" type="number" name="temperature" id="temperature" v-model="diary.temperature">
         </div>

         <category-selector @change="setCategory" />
         <weather-selector @change="setWeather"/>
      </div>
   </div>
</template>

<script>
   import $ from 'jquery'
   import utility from "../utility";
   import categorySelector from "../components/categorySelector";
   import weatherSelector from "../components/weatherSelector";
   import DatePicker from 'vue2-datepicker';
   import 'vue2-datepicker/locale/zh-cn';
   import 'vue2-datepicker/index.css';

   export default {
      data() {
         return {
            diary: {},
            btns: ['close','save'],
            isNew: true,
            contentEditorShowed: false,
            id: "",
            date: '',
            title: "",
            titleOrigin: "",
            content: "",
            contentOrigin: "",
            category: "life",
            temperature: '',
            weather: "sunny",

            heightBg: 0
         }
      },
      components: {categorySelector, weatherSelector, DatePicker},
      mounted() {
         this.heightBg = window.innerHeight;
         this.id = this.$route.query.id;

         utility.getData(utility.URL.diaryOperation, {
            'type': 'query',
            'diaryId': this.id
         }).then(res => {
            if (res.data.length > 0) {
               this.diary = res.data[0];
            } else {
               this.$router.back();
            }
         })

         // this.date = new Date();
         // 标签关闭提醒
         window.onbeforeunload = () => {
            if (this.diaryHasChanged) {
               return "日记内容已改变，显示提示框"
            }
         };
         this.isNew = !Boolean(location.search);
         if (this.isNew) {
            // 新建日记
            this.id = '';
            this.date = utility.dateFormatter(new Date(), 'yyyy-MM-dd hh:mm');
            this.title = '';
            this.content = '';
            this.category = 'life';
            this.temperature = '';
            this.weather = 'sunny'
         } else {
            // 编辑日记
            $.ajax({
               url: URL.diaryOperation,
               dataType: 'json',
               data: {
                  type: 'query',
                  diaryId: getSearchData().id
               },
               success: data => {
                  if (data.success) {
                     let diary = data.data[0];
                     this.id = diary.id;
                     this.title = diary.title;
                     this.titleOrigin = diary.title;
                     this.content = diary.content;
                     this.contentOrigin = diary.content;
                     this.date = diary.date.substring(0, 16);
                     this.category = diary.category;
                     this.temperature = diary.temperature === '-273' ? '' : diary.temperature;
                     this.weather = diary.weather;
                     if (diary.content) {
                        this.contentEditorShowed = true;
                     }
                  }
               }
            });
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
               navbar.logoImageUrl = this.contentEditorShowed ? 'img/logo_content.svg' : 'img/logo_title.svg'
            } else {
               navbar.logoImageUrl = this.contentEditorShowed ? 'img/logo_content_saved.svg' : 'img/logo_title_saved.svg'
            }
         },
         saveDiary() {
            let that = this;
            if (this.title.trim().length === 0) {
               this.title = ''; // clear content
               utility.popMessage(utility.POP_MSG_TYPE.warning, '内容未填写', null);
               return;
            }
            if (this.date.trim().length === 0) {
               utility.popMessage(utility.POP_MSG_TYPE.warning, '日期未填写', null);
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
               diaryDate: this.date,
               type: this.isNew ? 'add' : 'modify'
            };

            utility.postData(utility.URL.diaryOperation, queryData).then(res => {
               // 成功后更新 origin 字符串
               this.titleOrigin = this.title;
               this.contentOrigin = this.content;
               this.updateDiaryIcon();

               that.diaryHasSaved = true;
               utility.popMessage(utility.POP_MSG_TYPE.success, res.info); // 提示
               if (res.data) {
                  this.isNew = false;
                  this.id = res.data[0].id
               }
            })
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
         showContentEditor() {
            this.contentEditorShowed = !this.contentEditorShowed;
         }
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