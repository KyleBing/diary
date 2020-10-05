import axios from 'axios'

let URL = {
    userOperation:  'http://192.168.31.31/diary/portal/userOperation.php',
    diaryOperation: 'http://192.168.31.31/diary/portal/diaryOperation.php'
};

let FrontURL = {
    login:  'login.html',
    index:  'index.html',
    edit:   'edit.html'
};

const categories = ['life','study','work','sport','game','film','bigevent','other'];
const COOKIE = {
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
    $.cookie(COOKIE.email,email,COOKIE.options);
    $.cookie(COOKIE.token,token,COOKIE.options);
    $.cookie(COOKIE.username,username,COOKIE.options);
    $.cookie(COOKIE.uid,uid,COOKIE.options);
}

// 获取cookie
function getAuthorization() {
    let email = $.cookie(COOKIE.email);
    let token = $.cookie(COOKIE.token);
    let username = $.cookie(COOKIE.username);
    let uid = $.cookie(COOKIE.uid);
    if (email === undefined || token === undefined){
        if (location.pathname.indexOf('login.html') < 0){
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
    $.removeCookie(COOKIE.email,{path: '/'});
    $.removeCookie(COOKIE.token,{path: '/'});
    $.removeCookie(COOKIE.username,{path: '/'});
    $.removeCookie(COOKIE.uid,{path: '/'});
}

const AllCategories = ["life","study","work","sport","game","film","bigevent","week", "article"];

const PopMessageType = {
    success:    "success",
    warning:    "warning",
    danger:     "danger",
    default:    "default"
};

// Prompt 提示
function popMessage(type, title, callback = ()=>{}, timeout = 1.5){
    var popClass = 'popMessage-'+type;
    let template = ` <div class="popMessage animated-fast slideInDown ${popClass}">
                        <h3>${title}</h3>
                    </div>`;
    $('body').append(template);

    setTimeout(() => {
        $('.popMessage')
            .removeClass('slideInDown')
            .addClass('slideOutUp');
        setTimeout(()=>{
            $('.popMessage')
                .hide()
                .remove();
        }, 300); // 对应 css 中的动画时间
        if(callback){
            callback()
        }
    },1000 * timeout);
}


let API = {
    getData: (url, queryData, onSuccess, onError, onComplate) => {
        let authorizationKey = getAuthorization();
        if (authorizationKey){
            $.ajax({
                url: url,
                dataType: 'json',
                method: 'GET',
                success:(data) => {
                    onSuccess && onSuccess(data)
                },
                error: (xhr) => {
                    console.log(xhr);
                    onError && onError(data)
                },
                onComplate: (xhr) => {
                    onComplate && onComplate(xhr)
                }
            })
        } else {
            location = FrontURL.login;
        }
    },

    setData: (url, queryData, onSuccess, onError, onComplate) => {
        let authorizationKey = getAuthorization();
        if (authorizationKey){
            $.ajax({
                url: url,
                dataType: 'json',
                method: 'POST',
                success:(data) => {
                    onSuccess && onSuccess(data)
                },
                error: (xhr) => {
                    console.log(xhr);
                    onError && onError(data)
                },
                onComplate: (xhr) => {
                    onComplate && onComplate(xhr)
                }
            })
        } else {
            location = FrontURL.login;
        }
    }
};

const WEEKDAY = {0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六',};


// 格式化时间，输出字符串
function dateFormatter (date, formatString) {
    formatString = formatString? formatString : 'yyyy-MM-dd hh:mm:ss';
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
function getSearchData(){
    let searchString = location.search;
    if (searchString){
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
    axios,
    URL
}
