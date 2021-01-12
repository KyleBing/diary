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
      keyword: utility.keyword.get(), // 搜索关键字
      searchBarShowed: !!utility.keyword.get(), // 搜索栏显示
      categoriesChecked: utility.getCategories() || utility.CATEGORIES_ALL, // 已选的日记筛选类别
      currentDiary: null, // 当前日记
      diaryNeedToBeSaved: false, // 日记需要被存储
      diaryListShowedInFullStyle: false, // 日记列表是否显示为全部内容
      heightPanel: window.innerHeight - 45, // window height
      listNeedBeReload: false, // 是否刷新列表
      editLogoImg: false, // 编辑页是否已经保存
   },
   mutations: {
      setCategoriesChecked (state, payload){
         state.categoriesChecked = payload
         utility.saveCategories(payload) // categories 变化时保存
      },
      setKeyword (state, payload){
         state.keyword = payload
         utility.keyword.set(payload)
      },
      setSearchBarState (state, payload){
         state.searchBarShowed = payload
      },
      setCurrentDiary (state, payload){
         state.currentDiary = payload
      },
      setDiaryNeedToBeSaved (state, payload){
         state.diaryNeedToBeSaved = payload
      },
      setDiaryListShowedInFullStyle (state, payload){
         state.diaryListShowedInFullStyle = payload
      },
      setWindowHeight(state, payload){
         state.heightPanel = payload
      },
      setListNeedBeReload(state, payload){
         state.listNeedBeReload = payload
      },
      setEditLogoImg(state, payload){
         state.editLogoImg = payload
      },
   }
})


new Vue({
   router,
   render: h => h(App),
   store
}).$mount('#app')

Vue.config.devtools = true; // Vue Devtools Chrome 插件支持

document.addEventListener("touchstart", function() {},false);