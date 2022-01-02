import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "@/store/mutations";

Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      insets: {
         windowsHeight: window.innerHeight,
         windowsWidth: window.innerWidth,
         heightPanel: window.innerHeight - 45, // 除 navbar 的高度
      },
      statisticsCategory: {}, // 统计信息
      statisticsYear: {}, // 统计信息

      isFilterShared: false, // 是否筛选共享的日记
      dateFilter: '', // 日期筛选
      keyword: '', // 搜索关键字
      filteredCategories: [], // 筛选的类别

      isShowSearchBar: false, //

      currentDiary: null, // 当前日记
      diaryNeedToBeSaved: false, // 日记需要被存储
      diaryNeedToBeRecovered: false, // 取消当前编辑的日记
      diaryEditorContentHasChanged: false, // 日记内容已经变化
      diaryListShowedInFullStyle: false, // 日记列表是否显示为全部内容
      listNeedBeReload: false, // 是否刷新列表
      editLogoImg: false, // 编辑页LOGO
      listOperation:{}, // 列表页的操作，增删改操作，一般不再重新加载列表

      categoryAll : [
         {name: '生活', nameEn: 'life'},
         {name: '学习', nameEn: 'study'},
         {name: '工作', nameEn: 'work'},
         {name: '运动', nameEn: 'sport'},
         {name: '游戏', nameEn: 'game'},
         {name: '电影', nameEn: 'film'},
         {name: '大事', nameEn: 'bigevent'},
         {name: '周报', nameEn: 'week'},
         {name: '文章', nameEn: 'article'}
      ],
   },
   getters: {
      isInMobileMode(state){
         return state.insets.windowsWidth < state.insets.windowsHeight
      }
   },
   mutations
})
