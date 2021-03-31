import utility from "@/utility";

export default {
   setHeightWindow(state, payload){
      state.heightWindow = payload
   },
   setHeightPanel(state, payload){
      state.heightPanel = payload
   },
   setSearchBarState (state, payload){
      state.searchBarShowed = payload
   },
   setDateFilter(state, payload){
      state.dateFilter = payload
   },
   setStatistics(state, payload){
      state.statisticsCategory = payload.category
      state.statisticsYear = payload.year
   },
   setKeyword (state, payload){
      state.keyword = payload
      utility.queryData.keyword = payload
   },
   setCategoriesFilterInfo (state, payload){
      state.categoriesFilterInfo = payload
      utility.queryData.categories = payload.categories // categories 变化时保存
      utility.queryData.filterShared = payload.filterShared // categories 变化时保存
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
