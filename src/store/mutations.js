import utility from "@/utility";

export default {
   SET_DATA_ARRAY_CATEGORY(state, payload){
      state.dataArrayCategory = payload
   },
   SET_DATA_ARRAY_YEAR(state, payload){
      state.dataArrayYear = payload
   },
   SET_MENU_SHOWED(state, payload){
      state.menuShowed = payload
   },
   SET_IS_SAVING_DIARY(state, payload){
      state.isSavingDiary = payload
   },
   SET_INSETS(state, payload){
      state.insets = payload
   },
   SET_IS_HIDE_CONTENT(state, payload){
      state.isHideContent = payload
   },
   SET_IS_SHOW_SEARCH_BAR (state, payload){
      state.isShowSearchBar = payload
   },
   SET_DATE_FILTER(state, payload){
      state.dateFilter = payload
      let diaryConfig = utility.getDiaryConfig()
      diaryConfig.dateFilter = payload
      utility.setDiaryConfig(diaryConfig)
   },
   SET_STATISTICS_CATEGORY(state, payload){
      state.statisticsCategory = payload
   },
   SET_STATISTICS_YEAR(state, payload){
      // 如果没有任何年份数据，清除 dateFilter 数字
      let diaryConfig = utility.getDiaryConfig()
      if (payload){

      } else {
         diaryConfig.dateFilter = ''
         state.dateFilter = '' // 同时变更 state 中的数据
      }
      utility.setDiaryConfig(diaryConfig)
      state.statisticsYear = payload
   },
   SET_IS_FILTER_SHARED (state, payload){
      state.isFilterShared = payload
      let diaryConfig = utility.getDiaryConfig()
      diaryConfig.isFilterShared = payload
      utility.setDiaryConfig(diaryConfig)
   },
   SET_FILTERED_CATEGORIES(state, payload){
      state.filteredCategories = payload
      let diaryConfig = utility.getDiaryConfig()
      diaryConfig.filteredCategories = payload
      utility.setDiaryConfig(diaryConfig)
   },
   SET_KEYWORD (state, payload){
      state.keywords = payload
      let diaryConfig = utility.getDiaryConfig()
      diaryConfig.keywords = payload
      utility.setDiaryConfig(diaryConfig)
   },
   SET_CURRENT_DIARY (state, payload){
      state.currentDiary = payload
   },
   SET_DIARY_NEED_TO_BE_SAVED (state, payload){
      state.diaryNeedToBeSaved = payload
   },
   SET_DIARYLIST_SHOWED_INFULL_STYLE (state, payload){
      state.diaryListShowedInFullStyle = payload
   },
   SET_LIST_NEED_BE_RELOAD(state, payload){
      state.listNeedBeReload = payload
   },
   SET_EDIT_LOGOIMG(state, payload){
      state.editLogoImg = payload
   },
   SET_LIST_OPERATION(state, payload){
      state.listOperation = payload
   },
   SET_DIARY_NEED_TO_BE_RECOVERED(state, payload){
      state.diaryNeedToBeRecovered = payload
   },
   SET_DIARY_EDITOR_CONTENT_HAS_CHANGED(state, payload){
      state.diaryEditorContentHasChanged = payload
   },
}
