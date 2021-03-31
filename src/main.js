import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'
import routes from './route';
import App from './App.vue'
import utility from "./utility";

Vue.config.productionTip = false

const router = new Router({
   // mode: 'history', // 由于该项目是二级目录，使用 history 会导致开发与布署的地址不一
   routes
})

router.beforeEach((to, from, next) => {
   if (to.name !== 'login' && to.name !== 'register' && to.name !== 'share'){
      if (utility.getAuthorization().email){
         next()
      } else {
         utility.popMessage(utility.POP_MSG_TYPE.warning, '未登录，请先登录...', () => {
            next('/login')
         })
      }
   } else {
      next()
   }
})

Vue.use(Router);
Vue.use(VueCookie);

Vue.prototype.$version = 'v7.10'

import store from "@/store"


new Vue({
   router,
   store,
   render: h => h(App)
}).$mount('#app')

Vue.config.devtools = true; // Vue Devtools Chrome 插件支持
document.addEventListener("touchstart", function() {},false); // 使移动端支持 :hover 样式