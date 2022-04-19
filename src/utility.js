import axios from 'axios'
import VueCookie from 'vue-cookie'
import qs from 'qs'
import Vue from 'vue'
import store from './store'

const BASE_URL = process.env.NODE_ENV === 'development' ? '/api/': '../diary-portal/'

const global = {
   heightNavbar: 45,
}


const COOKIE_NAME = {
   email        : 'diaryEmail',
   token        : 'diaryToken',
   username     : 'diaryUsername',
   uid          : 'diaryUid',
   options      : {expires : 7, path : '/', SameSite : 'Strict'}
}


// 设置 authorization
function setAuthorization(email, token, username, uid) {
   localStorage.setItem('DiaryAuthorization', JSON.stringify({
      email,token,username,uid
   }))
}

// 获取 authorization
function getAuthorization() {
   return JSON.parse(localStorage.getItem('DiaryAuthorization'))
}

// 删除 authorization
function deleteAuthorization() {
   localStorage.removeItem('DiaryAuthorization')
}



// Prompt 提示
function popMessage(
    type,
    title,
    callback = () => {},
    timeout = 1.5) {
   let popClass = 'pop-msg-' + type
   let msgEl = document.createElement('div')
   msgEl.classList.add('pop-msg', 'animated-fast', 'slideInDown', popClass)
   let msgTitle = document.createElement('h3')
   msgTitle.innerText = title
   msgEl.append(msgTitle)
   $('body').append(msgEl)

   setTimeout(() => {
      msgEl.classList.replace('slideInDown', 'slideOutUp')
      setTimeout(() => {
         msgEl.remove()
      }, 300); // 对应 css 中的动画时间
      if (callback) {
         callback()
      }
   }, 1000 * timeout)
}

function $(selector){
   return document.querySelector(selector)
}



// CONST
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

// 格式化时间，输出字符串
function dateFormatter(date, formatString) {
   formatString = formatString || 'yyyy-MM-dd hh:mm:ss'
   let dateRegArray = {
      "M+": date.getMonth() + 1,                      // 月份
      "d+": date.getDate(),                           // 日
      "h+": date.getHours(),                          // 小时
      "m+": date.getMinutes(),                        // 分
      "s+": date.getSeconds(),                        // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
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
      year: year,
      weekday: WEEKDAY[week],
      date:`${month}月${day}日`,
      dateFull: `${year}年${month}月${day}日`,
      dateFullSlash: `${year}/${month}/${day}`,
      timeName: timeArea,
      time: time
   }
}

function temperatureProcessSTC(temperature){
   return temperature === -273 ? '' : temperature
}

function temperatureProcessCTS(temperature){
   return temperature === '' ? -273 : temperature
}


function getDiaryConfig(){
   let diaryConfigString = localStorage.getItem('DiaryConfig')
   if (diaryConfigString){
      return JSON.parse(diaryConfigString)
   } else {
      return {
         isFilterShared: false, // 是否筛选共享日记
         keywords: [], // 关键词
         filteredCategories: store.state.categoryAll.map(item => item.nameEn), // 筛选的日记类别
         dateRange: '' // 日记范围
      }
   }
}

function setDiaryConfig(newValue){
   localStorage.setItem('DiaryConfig', JSON.stringify(newValue))
}
function deleteDiaryConfig(newValue){
   localStorage.removeItem('DiaryConfig')
}


export default {
   URL,COOKIE_NAME, WEEKDAY, WEATHER,
   getAuthorization,
   setAuthorization,
   popMessage,
   formatDate,
   dateFormatter,
   deleteAuthorization,
   global,
   temperatureProcessSTC,
   temperatureProcessCTS,
   getDiaryConfig, setDiaryConfig, deleteDiaryConfig
}
