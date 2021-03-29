import Vue from 'vue'
import Vuex from 'vuex'
import utility from "@/utility";
Vue.use(Vuex)
export default  new Vuex.Store({
   state: {
      statisticsCategory: {}, // 统计信息
      statisticsYear: {}, // 统计信息
      dateFilter: '', // 日期筛选
      keyword: utility.queryData.keyword, // 搜索关键字
      searchBarShowed: !!utility.queryData.keyword, // 搜索栏显示
      categoriesFilterInfo: {
         categories: utility.queryData.categories || utility.CATEGORIES_ALL,
         filterShared: utility.queryData.filterShared
      }, // 已选的日记筛选类别
      currentDiary: null, // 当前日记
      diaryNeedToBeSaved: false, // 日记需要被存储
      diaryNeedToBeRecovered: false, // 取消当前编辑的日记
      diaryEditorContentHasChanged: false, // 日记内容已经变化
      diaryListShowedInFullStyle: false, // 日记列表是否显示为全部内容
      heightWindow: window.innerHeight,
      heightPanel: window.innerHeight - 45, // window height
      listNeedBeReload: false, // 是否刷新列表
      editLogoImg: false, // 编辑页LOGO
      listOperation:{}, // 列表页的操作，增删改操作，一般不再重新加载列表
   },
   mutations: {
      setStatistics(state, payload){
         state.statisticsCategory = payload.category
         state.statisticsYear = payload.year
      },
      setCategoriesFilterInfo (state, payload){
         state.categoriesFilterInfo = payload
         utility.queryData.categories = payload.categories // categories 变化时保存
         utility.queryData.filterShared = payload.filterShared // categories 变化时保存
      },
      setKeyword (state, payload){
         state.keyword = payload
         utility.queryData.keyword = payload
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
      setHeightPanel(state, payload){
         state.heightPanel = payload
      },
      setListNeedBeReload(state, payload){
         state.listNeedBeReload = payload
      },
      setEditLogoImg(state, payload){
         state.editLogoImg = payload
      },
      setHeightWindow(state, payload){
         state.heightWindow = payload
      },
      setListOperation(state, payload){
         state.listOperation = payload
      },
      setDiaryNeedToBeRecovered(state, payload){
         state.diaryNeedToBeRecovered = payload
      },
      setDiaryEditorContentHasChanged(state, payload){
         state.diaryEditorContentHasChanged = payload
      },
      setDateFilter(state, payload){
         state.dateFilter = payload
      },
   }
})