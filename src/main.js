import Vue from 'vue'
import App from './App.vue'
import utility from "./utility"
import Moment from "moment"

// 全局配置 moment，设置星期的第一天为 星期一
Moment.locale('zh', {
   week: {
      dow: 1
   }
})

// cookie
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

// store
import store from "@/store"

// icons
import icons from "@/assets/img/SvgIcons"
Vue.prototype.$icons = icons

// popMsg
Vue.prototype.$popMessage = utility.popMessage

// router
import router from "./router"

new Vue({
   router,
   store,
   render: h => h(App)
}).$mount('#app')


// 开发相关
Vue.config.productionTip = false
Vue.config.devtools = true  // Vue Devtools Chrome 插件支持
document.addEventListener("touchstart", function() {},false) // 使移动端支持 :hover 样式
