import Vue from 'vue'
import Vuex from 'vuex'
import utility from "@/utility";
import mutations from "@/store/mutations";

Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      heightWindow: window.innerHeight,
      heightPanel: window.innerHeight - 45, // window height
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
      listNeedBeReload: false, // 是否刷新列表
      editLogoImg: false, // 编辑页LOGO
      listOperation:{}, // 列表页的操作，增删改操作，一般不再重新加载列表
   },
   mutations
})