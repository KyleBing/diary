import utility from "@/utility";

export default {
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
   },
   SET_STATISTICS(state, payload){
      state.statisticsCategory = payload.category
      state.statisticsYear = payload.year
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
      state.keyword = payload
      let diaryConfig = utility.getDiaryConfig()
      diaryConfig.keyword = payload
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
