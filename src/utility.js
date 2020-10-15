import $ from 'jquery'
import axios from 'axios'
import VueCookie from 'vue-cookie'

const BASE_URL = '/api'


let URL = {
   userOperation: BASE_URL + '/userOperation.php',
   diaryOperation: BASE_URL + '/diaryOperation.php'
};

const COOKIE_NAME = {
   email: 'diaryEmail',
   token: 'diaryToken',
   username: 'diaryUsername',
   uid: 'diaryUid',
   category: 'diaryCategories',
   keyword: 'keyword',
   options: {expires: 7, path: '/'}
};


// 设置cookie
function setAuthorization(email, token, username, uid) {
   VueCookie.set(COOKIE_NAME.email, email, COOKIE_NAME.options);
   VueCookie.set(COOKIE_NAME.token, token, COOKIE_NAME.options);
   VueCookie.set(COOKIE_NAME.username, username, COOKIE_NAME.options);
   VueCookie.set(COOKIE_NAME.uid, uid, COOKIE_NAME.options);
}

// 获取cookie
function getAuthorization() {
   let email = VueCookie.set(COOKIE_NAME.email);
   let token = VueCookie.set(COOKIE_NAME.token);
   let username = VueCookie.set(COOKIE_NAME.username);
   let uid = VueCookie.set(COOKIE_NAME.uid);
   if (email === undefined || token === undefined) {
      if (location.pathname.indexOf('login.html') < 0) {
         location = FrontURL.login;
      }
      return false;
   } else {
      return {
         email: email,
         token: token,
         username: username,
         uid: uid
      }
   }
}


// 删除cookie
function deleteAuthorization() {
   VueCookie.remove(COOKIE_NAME.email, {path: '/'});
   VueCookie.remove(COOKIE_NAME.token, {path: '/'});
   VueCookie.remove(COOKIE_NAME.username, {path: '/'});
   VueCookie.remove(COOKIE_NAME.uid, {path: '/'});
}

const CATEGORIES_ALL = ["life", "study", "work", "sport", "game", "film", "bigevent", "week", "article"];

const POP_MSG_TYPE = {
   success: "success",
   warning: "warning",
   danger: "danger",
   default: "default"
};

// Prompt 提示
function popMessage(type, title, callback = () => {
}, timeout = 1.5) {
   let popClass = 'pop-msg-' + type;
   let template = ` <div class="pop-msg animated-fast slideInDown ${popClass}">
                        <h3>${title}</h3>
                    </div>`;
   $('body').append(template);

   setTimeout(() => {
      $('.pop-msg')
         .removeClass('slideInDown')
         .addClass('slideOutUp');
      setTimeout(() => {
         $('.pop-msg')
            .hide()
            .remove();
      }, 300); // 对应 css 中的动画时间
      if (callback) {
         callback()
      }
   }, 1000 * timeout);
}


function postData(url, queryData) {
   return new Promise(function (resolve, reject) {
      axios.post(url, queryData)
         .then(res => {
            if (res.data.success) {
               resolve(res.data)
            } else {
               popMessage(POP_MSG_TYPE.danger, res.data.info )
            }
         }).catch(() => {
         reject()
      })
   })
}

const WEEKDAY = {0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六',};


// 格式化时间，输出字符串
function dateFormatter(date, formatString) {
   formatString = formatString ? formatString : 'yyyy-MM-dd hh:mm:ss';
   let dateRegArray = {
      "M+": date.getMonth() + 1,                      // 月份
      "d+": date.getDate(),                           // 日
      "h+": date.getHours(),                          // 小时
      "m+": date.getMinutes(),                        // 分
      "s+": date.getSeconds(),                        // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3),    // 季度
      "S": date.getMilliseconds()                     // 毫秒
   };
   if (/(y+)/.test(formatString)) {
      formatString = formatString.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
   }
   for (let section in dateRegArray) {
      if (new RegExp("(" + section + ")").test(formatString)) {
         formatString = formatString.replace(RegExp.$1, (RegExp.$1.length === 1) ? (dateRegArray[section]) : (("00" + dateRegArray[section]).substr(("" + dateRegArray[section]).length)));
      }
   }
   return formatString;
}

/****************************
 * 获取地址栏get数据
 *
 * @return 有值的时候返回一个包含所有参数的对象
 * @return 无值的时候，返回 `false`
 ****************************/
function getSearchData() {
   let searchString = location.search;
   if (searchString) {
      let obj = {};
      searchString = searchString.substring(1, searchString.length);
      let tempArray = searchString.split('&');
      tempArray.forEach(item => {
         obj[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);
      });
      return obj;
   } else {
      return false;
   }
}

export default {
   URL,COOKIE_NAME,POP_MSG_TYPE,CATEGORIES_ALL,
   setAuthorization, popMessage, postData
}
