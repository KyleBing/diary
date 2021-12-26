import utility from "@/utility";

export default {
   setInsets(state, payload){
      state.insets = payload
   },
   SET_IS_SHOW_SEARCH_BAR (state, payload){
      state.isShowSearchBar = payload
   },
   setDateFilter(state, payload){
      state.dateFilter = payload
   },
   setStatistics(state, payload){
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
   setCurrentDiary (state, payload){
      state.currentDiary = payload
   },
   setDiaryNeedToBeSaved (state, payload){
      state.diaryNeedToBeSaved = payload
   },
   setDiaryListShowedInFullStyle (state, payload){
      state.diaryListShowedInFullStyle = payload
   },

   setListNeedBeReload(state, payload){
      state.listNeedBeReload = payload
   },
   setEditLogoImg(state, payload){
      state.editLogoImg = payload
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
}
