import Vue from 'vue'
import Vuex from 'vuex'
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
Vue.prototype.$version = 'v6.20'

Vue.use(Vuex)

const store = new Vuex.Store({
   state: {
      keyword: utility.keyword.get(),
      searchBarShowed: !!utility.keyword.get(),
      categoriesChecked: utility.getCategories() || utility.CATEGORIES_ALL
   },
   mutations: {
      changeCategoriesChecked (state, payload){
         state.categoriesChecked = payload
         utility.saveCategories(payload) // categories 变化时保存
      },
      changeKeyword (state, payload){
         state.keyword = payload
         utility.keyword.set(payload)
      },
      changeSearchBarState (state, payload){
         state.searchBarShowed = payload
      }
   }
})


new Vue({
   router,
   render: h => h(App),
   store
}).$mount('#app')

Vue.config.devtools = true; // Vue Devtools Chrome 插件支持

document.addEventListener("touchstart", function() {},false);





