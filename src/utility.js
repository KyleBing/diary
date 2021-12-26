import $ from 'jquery'
import axios from 'axios'
import VueCookie from 'vue-cookie'
import qs from 'qs'
import Vue from 'vue'

const BASE_URL = process.env.NODE_ENV === 'development' ? '/api/': '../diary-portal/'

const global = {
   heightNavbar: 45,
   diaryPath: 'diary-pc'
}

let URL = {
   userOperation: BASE_URL + 'userOperation.php',
   diaryOperation: BASE_URL + 'diaryOperation.php',
   shareContent: BASE_URL + 'getShareContent.php'
}

const COOKIE_NAME = {
   email        : 'diaryEmail',
   token        : 'diaryToken',
   username     : 'diaryUsername',
   uid          : 'diaryUid',
   category     : 'diaryCategories',
   keyword      : 'diaryKeyword',
   filterShared : 'diaryFilterShared',
   dateRange    : 'diaryDateRange',
   options      : {expires : 7, path : '/', SameSite : 'Strict'}
}


// 设置cookie
function setAuthorization(email, token, username, uid) {
   VueCookie.set(COOKIE_NAME.email, email, COOKIE_NAME.options)
   VueCookie.set(COOKIE_NAME.token, token, COOKIE_NAME.options)
   VueCookie.set(COOKIE_NAME.username, username, COOKIE_NAME.options)
   VueCookie.set(COOKIE_NAME.uid, uid, COOKIE_NAME.options)
}

// 刷新 cookie 过期时间
function renewAuthorization() {
   let authentication = getAuthorization()
   if (authentication.token) {
      VueCookie.set(COOKIE_NAME.email, authentication.email, COOKIE_NAME.options)
      VueCookie.set(COOKIE_NAME.token, authentication.token, COOKIE_NAME.options)
      VueCookie.set(COOKIE_NAME.username, authentication.username, COOKIE_NAME.options)
      VueCookie.set(COOKIE_NAME.uid, authentication.uid, COOKIE_NAME.options)
   }
}

// 获取cookie
function getAuthorization() {
   let email = VueCookie.get(COOKIE_NAME.email)
   let token = VueCookie.get(COOKIE_NAME.token)
   let username = VueCookie.get(COOKIE_NAME.username)
   let uid = VueCookie.get(COOKIE_NAME.uid)
   return {
      email: email,
      token: token,
      username: username,
      uid: uid
   }
}

// 删除cookie
function deleteAuthorization() {
   VueCookie.delete(COOKIE_NAME.email, {path: '/'})
   VueCookie.delete(COOKIE_NAME.token, {path: '/'})
   VueCookie.delete(COOKIE_NAME.username, {path: '/'})
   VueCookie.delete(COOKIE_NAME.uid, {path: '/'})
}



// Prompt 提示
function popMessage(type, title, callback = () => {
}, timeout = 1.5) {
   let popClass = 'pop-msg-' + type
   let template = ` <div class="pop-msg animated-fast slideInDown ${popClass}">
                        <h3>${title}</h3>
                    </div>`
   $('body').append(template)

   setTimeout(() => {
      $('.pop-msg')
         .removeClass('slideInDown')
         .addClass('slideOutUp')
      setTimeout(() => {
         $('.pop-msg')
            .hide()
            .remove()
      }, 300); // 对应 css 中的动画时间
      if (callback) {
         callback()
      }
   }, 1000 * timeout)
}


// request network
function postData(url, queryData) {
   return new Promise(function (resolve, reject) {
      axios.post(url, qs.stringify(queryData))
         .then(res => {
            if (res.data.success) {
               renewAuthorization()
               resolve(res.data)
            } else {
               reject(res)
               popMessage(POP_MSG_TYPE.danger, res.data.info )
               if (!res.data.logined){
                  Vue.$router.push('/login')
               }
            }
         }).catch(() => {
         reject()
      })
   })
}

function getData(url, queryData) {
   return new Promise(function (resolve, reject) {
      axios.get(url, {params: queryData})
         .then(res => {
            if (res.data.success) {
               renewAuthorization()
               resolve(res.data)
            } else {
               popMessage(POP_MSG_TYPE.danger, res.data.info, reject)
            }
         }).catch(() => {
         reject()
      })
   })
}


// CONST
const CATEGORIES_ALL = ["life", "study", "work", "sport", "game", "film", "bigevent", "week", "article"]
const POP_MSG_TYPE = {
   success: "success",
   warning: "warning",
   danger: "danger",
   default: "default"
}
const WEEKDAY = {0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六',}
const WEATHER = [
    {title : 'sunny' ,        name : '晴'} ,
    {title : 'cloudy' ,       name : '多云'} ,
    {title : 'overcast' ,     name : '阴'} ,
    {title : 'sprinkle' ,     name : '小雨'} ,
    {title : 'rain' ,         name : '雨'} ,
    {title : 'thunderstorm' , name : '暴雨'} ,
    {title : 'snow' ,         name : '雪'} ,
    {title : 'fog' ,          name : '雾'} ,
    {title : 'tornado' ,      name : '龙卷风'} ,
    {title : 'smog' ,         name : '雾霾'} ,
    {title : 'sandstorm' ,    name : '沙尘暴'} ,

]
const CATEGORIES = {
   life: '生活',
   study: '学习',
   film: '电影',
   game: '游戏',
   work: '工作',
   sport: '运动',
   bigevent: '大事',
   week: '周报',
   article: '文章',
}

// 格式化时间，输出字符串
function dateFormatter(date, formatString) {
   formatString = formatString || 'yyyy-MM-dd hh:mm:ss'
   let dateRegArray = {
      "M+": date.getMonth() + 1,                      // 月份
      "d+": date.getDate(),                           // 日
      "h+": date.getHours(),                          // 小时
      "m+": date.getMinutes(),                        // 分
      "s+": date.getSeconds(),                        // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3),    // 季度
      "S": date.getMilliseconds()                     // 毫秒
   }
   if (/(y+)/.test(formatString)) {
      formatString = formatString.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
   }
   for (let section in dateRegArray) {
      if (new RegExp("(" + section + ")").test(formatString)) {
         formatString = formatString.replace(RegExp.$1, (RegExp.$1.length === 1) ? (dateRegArray[section]) : (("00" + dateRegArray[section]).substr(("" + dateRegArray[section]).length)))
      }
   }
   return formatString
}

function formatDate(dateString) {
   let year = Number(dateString.substring(0,4))
   let month = Number(dateString.substring(5,7))
   let day = Number(dateString.substring(8,10))
   let hour = Number(dateString.substring(11,13))
   let time = dateString.substring(11,16)
   let date = new Date(year, month - 1, day)
   let week = date.getDay()
   let timeArea = ''
   if (hour >= 23 && hour < 24 || hour <= 3 && hour >= 0) {
      timeArea = '深夜'
   } else if (hour >= 19 && hour < 23) {
      timeArea = '晚上'
   } else if (hour >= 14 && hour < 19) {
      timeArea = '傍晚'
   } else if (hour >= 11 && hour < 14) {
      timeArea = '中午'
   } else if (hour >= 6 && hour < 11) {
      timeArea = '早上'
   } else if (hour >= 3 && hour < 6) {
      timeArea = '凌晨'
   }

   return {
      weekday: WEEKDAY[week],
      date:`${month}月${day}日`,
      dateFull: `${year}年${month}月${day}日`,
      timeName: timeArea,
      time: time
   }
}

function temperatureProcessSTC(temperature){
   return temperature === '-273' ? '' : temperature
}

function temperatureProcessCTS(temperature){
   return temperature === '' ? '-273' : temperature
}


function getDiaryConfig(){
   let diaryConfigString = localStorage.getItem('DiaryConfig')
   if (diaryConfigString){
      return JSON.parse(diaryConfigString)
   } else {
      return {
         isFilterShared: false, // 是否筛选共享日记
         keyword: '', // 关键词
         filteredCategories: CATEGORIES_ALL, // 筛选的日记类别
         dateRange: '' // 日记范围
      }
   }
}

function setDiaryConfig(newValue){
   localStorage.setItem('DiaryConfig', JSON.stringify(newValue))
}


export default {
   URL,COOKIE_NAME,POP_MSG_TYPE,CATEGORIES, WEEKDAY, WEATHER,
   getAuthorization,
   setAuthorization,
   popMessage,
   postData,
   getData,
   formatDate,
   dateFormatter,
   deleteAuthorization,
   global,
   temperatureProcessSTC,
   temperatureProcessCTS,
   getDiaryConfig, setDiaryConfig
}
