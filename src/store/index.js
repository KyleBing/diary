import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "@/store/mutations";
import svgIcons from "@/assets/img/SvgIcons";

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
      keywords: [], // 搜索关键字
      filteredCategories: [], // 筛选的类别

      isShowSearchBar: false, // 搜索栏显示
      isHideContent: false, // 是否显示列表内容

      currentDiary: null, // 当前日记
      diaryNeedToBeSaved: false, // 日记需要被存储
      diaryNeedToBeRecovered: false, // 取消当前编辑的日记
      diaryEditorContentHasChanged: false, // 日记内容已经变化
      diaryListShowedInFullStyle: false, // 日记列表是否显示为全部内容
      listNeedBeReload: false, // 是否刷新列表
      editLogoImg: svgIcons.logo, // 编辑页LOGO
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

      isSavingDiary: false, // 是否正在保存日记
   },
   getters: {
      isInMobileMode(state){
         // console.log(state.insets)
         // 宽度小于 1024 或 高>宽 时，表示是在移动设备上
         return state.insets.windowsWidth < 1024 || state.insets.windowsWidth < state.insets.windowsHeight
      }
   },
   mutations
})
