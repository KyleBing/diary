<template>
   <div class="diary-edit" :style="'min-height:' + heightBg + 'px'">
      <!--content-->
      <div class="container" id="this">
         <div class="editor-title">
            <textarea id="diary-editor-title" placeholder="一句话，概括你的一天" v-model="title"></textarea>
         </div>
         <div class="editor-content">
            <textarea v-show="contentEditorShowed" class="diary-editor-content" placeholder="日记详细内容，如果你有很多要写的" v-model="content"></textarea>
         </div>
         <div class="editor-input-group">
            <label for="date">日期</label>
            <date-picker :editable="false"
                         v-model="date"
                         :confirm="true"
                         :default-value="new Date()"
                         placeholder="---- -- --"
                         input-class="date"
                         :clearable="false" id="date" type="datetime"/>
         </div>
         <div class="editor-input-group">
            <label for="temperature">身处 ℃</label>
            <input placeholder="--" class="temperature" type="number" name="temperature" id="temperature" v-model="temperature">
         </div>
         <div class="editor-input-group">
            <label for="temperatureOutside">室外 ℃</label>
            <input placeholder="--" class="temperature" type="number" name="temperature" id="temperatureOutside" v-model="temperatureOutside">
         </div>
         <div class="editor-input-group">
            <label for="shareState">共享</label>
            <div class="input">
               <input class="share" type="checkbox" name="share" id="shareState" v-model="isPublic">
               <label class="switch" for="shareState"></label>
            </div>
         </div>
         <category-selector @change="setCategory" />
         <weather-selector :weather="weather" @change="setWeather"/>
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
            isPublic: false,
            date: '',
            weather: '',
            temperature: '-273',
            temperatureOutside: '-273',
            heightBg: 0,
            logoImageUrl: 'img/logo.svg'
         }
      },
      components: {categorySelector, weatherSelector, DatePicker},
      mounted() {
         this.heightBg = window.innerHeight;

         // this.date = new Date();
         // 标签关闭提醒
         window.onbeforeunload = () => {
            if (this.diaryHasChanged) {
               return "日记内容已改变，显示提示框"
            }
         };
         this.isNew = !(this.$route.params.id);
         if (this.isNew) {
            // 新建日记
            this.id = '';
            this.date = new Date();
            this.title = '';
            this.content = '';
            this.category = 'life';
            this.temperature = '';
            this.temperatureOutside = '';
            this.weather = 'sunny'
            this.updateDiaryIcon();
         } else {
            this.getDiary(this.$route.params.id)
         }
      },

      watch: {
         $route(to){
            this.getDiary(to.params.id);
         },
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

         getDiary(id){
            this.id = id;
            // 编辑日记
            utility.getData(utility.URL.diaryOperation, {
               'type': 'query',
               'diaryId': id
            }).then(res => {
               if (res.data.length > 0) {
                  let diary                =  res.data[0];
                  this.category            =  diary.category;
                  this.date                =  new Date(diary.date.replace(' ', 'T')); // safari 只识别 2020-10-27T14:35:33 格式的日期
                  this.weather             =  diary.weather;
                  this.title               =  diary.title;
                  this.titleOrigin         =  diary.title;
                  this.content             =  diary.content;
                  this.contentOrigin       =  diary.content;
                  this.isPublic            =  diary.is_public === '1';
                  this.temperature         =  diary.temperature === '-273' ? '' : diary.temperature;
                  this.temperatureOutside  =  diary.temperature_outside === '-273' ? '' : diary.temperature_outside;
                  if (diary.content) {
                     this.contentEditorShowed = true;
                  }
               } else {
                  this.$router.back();
               }
            })
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
            if (this.temperature !== '' && !/^-?\d{1,2}$/.test(this.temperature)) {
               utility.popMessage(utility.POP_MSG_TYPE.warning, '温度格式不正确', null);
               return
            }
            let queryData = {
               diaryId                 : this.id,
               diaryTitle              : this.title,
               diaryContent            : this.content || null,
               diaryCategory           : this.category,
               diaryTemperature        : this.temperature === '' ? -273 : this.temperature,
               diaryTemperatureOutside : this.temperatureOutside === '' ? -273 : this.temperatureOutside,
               diaryWeather            : this.weather,
               diaryPublic             : this.isPublic ? '1' : '0',
               diaryDate               : utility.dateFormatter(this.date),
               type                    : this.isNew ? 'add' : 'modify'
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
            this.isNew               =  true;
            this.title               =  '';
            this.titleOrigin         =  '';
            this.content             =  '';
            this.contentOrigin       =  '';
            this.id                  =  '';
            this.isPublic              =  false;
            this.category            =  'life';
            this.temperature         =  '';
            this.temperatureOutside  =  '';
            this.weather             =  'sunny';
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