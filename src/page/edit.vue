<template>
   <div class="diary-edit" :style="`min-height: ${heightPanel}px`">
      <!--content-->
      <div class="editor-title">
         <textarea class="title" id="diary-editor-title" placeholder="一句话，概括你的一天" v-model="diary.title"></textarea>
      </div>
      <div class="editor-content">
         <textarea class="content" placeholder="日记详细内容，如果你有很多要写的" v-model="diary.content"></textarea>
      </div>
      <div class="editor-form-group">
         <div class="editor-form-input">
            <div class="editor-input-group">
               <label for="date">日期</label>
               <date-picker :editable="false"
                            v-model="diary.date"
                            :confirm="true"
                            :default-value="new Date()"
                            placeholder="---- -- --"
                            input-class="date"
                            :clearable="false" id="date" type="datetime"/>
            </div>
            <div class="editor-input-group">
               <label for="temperature">身处 ℃</label>
               <input placeholder="--" class="temperature" type="number" name="temperature" id="temperature" v-model="diary.temperature">
            </div>
            <div class="editor-input-group">
               <label for="temperatureOutside">室外 ℃</label>
               <input placeholder="--" class="temperature" type="number" name="temperature" id="temperatureOutside" v-model="diary.temperatureOutside">
            </div>
            <div class="editor-input-group">
               <label for="shareState">共享</label>
               <div class="input">
                  <input class="share" type="checkbox" name="share" id="shareState" v-model="diary.isPublic">
                  <label class="switch" for="shareState"></label>
               </div>
            </div>
         </div>
         <category-selector class="editor-form-category" :category="diary.category" @change="setCategory"/>
         <weather-selector class="editor-form-weather" :weather="diary.weather" @change="setWeather"/>
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
   import { mapState, mapMutations } from 'vuex'

   export default {
      name: 'Edit',
      data() {
         return {
            isNew: true,
            diary: {
               id: "",
               title: "",
               content: "",
               isPublic: false,
               date: new Date(),
               weather: 'sunny',
               category: 'life',
               temperature: '',
               temperatureOutside: '',
            },
            diaryOrigin: { // 不需要跟上面一样，但需要有提交声明好的属性，不然后面无法对比其值
               id: "",
               title: "",
               content: "",
               isPublic: false,
               date: new Date(),
               weather: 'sunny',
               category: 'life',
               temperature: '',
               temperatureOutside: '',
            },
            logoImageUrl: 'img/logo.svg'
         }
      },
      components: { categorySelector, weatherSelector, DatePicker },
      mounted() {
         // 网页标签关闭前提醒
         window.onbeforeunload = () => {
            if (this.diaryHasChanged) {
               return "日记内容已改变，显示提示框"
            }
         };
         this.isNew = !(this.$route.params.id);
         if (this.isNew) {
            // 新建日记
            this.createDiary()

            this.updateDiaryIcon();
         } else {
            this.diary.id = this.$route.params.id;
            this.getDiary(this.$route.params.id)
         }
      },
      beforeRouteLeave(to, from, next){
         // 在跳转到其它页面之前判断日记是否已保存
         if (this.diaryHasChanged){
            utility.popMessage(utility.POP_MSG_TYPE.warning, '有未保存的修改内容', next(false))
         } else {
            next()
         }
      },
      computed: {
         diaryHasChanged() {
            return (this.diary.title       !== this.diaryOrigin.title ||
            this.diary.content            !== this.diaryOrigin.content ||
            this.diary.category           !== this.diaryOrigin.category ||
            this.diary.temperature        !== this.diaryOrigin.temperature ||
            this.diary.temperatureOutside !== this.diaryOrigin.temperatureOutside ||
            this.diary.weather            !== this.diaryOrigin.weather ||
            this.diary.isPublic           !== this.diaryOrigin.isPublic)
         },
         ...mapState(['currentDiary', 'diaryNeedToBeSaved', 'heightPanel', 'editLogoImg'])
      },

      watch: {
         $route(to){
            if (to.params.id){
               this.getDiary(to.params.id);
            } else {
               this.createDiary()
            }
         },
         diary: {
            handler(){
               this.updateDiaryIcon()
            },
            deep: true
         },
         diaryNeedToBeSaved(){
            if (this.diaryNeedToBeSaved) {
               this.saveDiary()
            }
         }
      },
      methods: {
         ...mapMutations([
            'setEditLogoImg',
            'setDiaryNeedToBeSaved',
            'setListNeedBeReload',
            'setListOperation'
         ]),
         goBack() {
            this.$router.back()
         },
         setCategory(data){
            this.diary.category = data
         },
         setWeather(data){
            this.diary.weather = data
         },
         updateDiaryIcon() {
            if (this.diaryHasChanged) {
               this.setEditLogoImg(this.diary.content ? 'img/logo_content.svg' : 'img/logo_title.svg')
            } else {
               this.setEditLogoImg(this.diary.content ? 'img/logo_content_saved.svg' : 'img/logo_title_saved.svg')
            }
         },
         getDiary(id){
            // 编辑日记
            utility.getData(utility.URL.diaryOperation, {
               'type': 'query',
               'diaryId': id
            }).then(res => {
               let diary                      =  res.data;
               this.diary.category            =  diary.category;
               this.diary.date                =  new Date(diary.date.replace(' ', 'T')); // safari 只识别 2020-10-27T14:35:33 格式的日期
               this.diary.weather             =  diary.weather;
               this.diary.title               =  diary.title;
               this.diary.content             =  diary.content;
               this.diary.isPublic            =  diary.is_public === '1';
               this.diary.temperature         =  utility.temperatureProcessSTC(diary.temperature);
               this.diary.temperatureOutside  =  utility.temperatureProcessSTC(diary.temperature_outside);
               Object.assign(this.diaryOrigin, this.diary); // 不能直接赋值，赋值的是它的引用
            }).catch(()=>{
               this.$router.back();
            })
         },
         saveDiary() {
            if (this.diary.title.trim().length === 0) {
               this.diary.title = ''; // clear content
               utility.popMessage(utility.POP_MSG_TYPE.warning, '内容未填写', null);
               this.setDiaryNeedToBeSaved(false); // 未能成功保存时，复位 diaryNeedToBeSaved 标识
               return;
            }
            if (this.diary.temperature !== '' && !/^-?\d{1,2}$/.test(this.diary.temperature)) {
               utility.popMessage(utility.POP_MSG_TYPE.warning, '室内温度格式不正确', null);
               this.setDiaryNeedToBeSaved(false);
               return
            }
            if (this.diary.temperatureOutside !== '' && !/^-?\d{1,2}$/.test(this.diary.temperatureOutside)) {
               utility.popMessage(utility.POP_MSG_TYPE.warning, '室外温度格式不正确', null);
               this.setDiaryNeedToBeSaved(false);
               return
            }
            let queryData = {
               diaryId                 : this.diary.id,
               diaryTitle              : this.diary.title,
               diaryContent            : this.diary.content || null,
               diaryCategory           : this.diary.category,
               diaryTemperature        : utility.temperatureProcessCTS(this.diary.temperature),
               diaryTemperatureOutside : utility.temperatureProcessCTS(this.diary.temperatureOutside),
               diaryWeather            : this.diary.weather,
               diaryPublic             : this.diary.isPublic ? '1' : '0',
               diaryDate               : utility.dateFormatter(this.diary.date),
               type                    : this.isNew ? 'add' : 'modify'
            };

            utility.postData(utility.URL.diaryOperation, queryData)
               .then(res => {
                  utility.popMessage(utility.POP_MSG_TYPE.success, res.info, () => {
                     // 成功后更新 origin 字符串
                     Object.assign(this.diaryOrigin, this.diary)
                     this.updateDiaryIcon(); // 更新 navbar icon
                     this.setDiaryNeedToBeSaved(false);
                     // this.setListNeedBeReload(true);
                     this.setListOperation({type: 'change', diary: this.convertToServerVersion()}) // 向列表发送动作
                     if (res.data){ // 如果是新建日记，跳转到对应路由
                        this.$router.push('/edit/' + res.data.id)
                     }
                  })
               })
               .catch(() => {
                  this.setDiaryNeedToBeSaved(false);
               })
         },
         createDiary() {
            this.isNew =  true;
            this.diary = {
               id: "",
               title: "",
               content: "",
               isPublic: false,
               date: this.diary.date || new Date(), // 本页面新建时，保留之前日记的时间，因为可能一次性补全很多之前的日记
               weather: 'sunny',
               category: 'life',
               temperature: '',
               temperatureOutside: '',
            }
            // 新建日记时也记录原始数据
            Object.assign(this.diaryOrigin, this.diary)
         },
         convertToServerVersion(){ // 转换为数据库格式的日记
            let date = utility.dateFormatter(this.diary.date);
            return {
               id: this.diary.id,
               date: date,
               title: this.diary.title,
               content: this.diary.content,
               temperature: utility.temperatureProcessCTS(this.diary.temperature),
               temperature_outside: utility.temperatureProcessCTS(this.diary.temperatureOutside),
               weather: this.diary.weather,
               category: this.diary.category,
               date_create: date,
               date_modify: "",
               is_public: this.diary.isPublic ? '1': '0'
            }
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