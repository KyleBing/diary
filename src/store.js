import { createStore } from 'vuex'
import svgIcons from "@/assets/img/SvgIcons";
import utility from "@/utility";

export default createStore({
    state: {
        insets: {
            windowsHeight: window.innerHeight,
            windowsWidth: window.innerWidth,
            heightPanel: window.innerHeight - 45, // 除 navbar 的高度
        },
        statisticsCategory: {} ,                 // 统计信息
        statisticsYear: {} ,                     // 统计信息

        isFilterShared: false ,                  // 是否筛选共享的日记
        dateFilter: '' ,                         // 日期筛选
        keywords: [] ,                           // 搜索关键字
        filteredCategories: [] ,                 // 筛选的类别

        isShowSearchBar: false ,                 // 搜索栏显示
        isHideContent: false ,                   // 是否显示列表内容

        currentDiary: null ,                     // 当前日记

        isDiaryNeedToBeSaved: false ,            // 日记需要被存储
        isDiaryNeedToBeRecovered: false ,        // 取消当前编辑的日记
        isDiaryEditorContentHasChanged: false ,  // 日记内容已经变化
        isDiaryListShowedInFullStyle: false ,    // 日记列表是否显示为全部内容
        isListNeedBeReload: false ,              // 是否刷新列表
        isSavingDiary: false ,                   // 是否正在保存日记
        isMenuShowed: false ,                    // 显示菜单

        editLogoImg: svgIcons.logo ,             // 编辑页LOGO
        listOperation:{} ,                       // 列表页的操作，增删改操作，一般不再重新加载列表


        categoryAll : [
            // {name: '生活', name_en: 'life', color: '#fff'},
        ],
        dataArrayYear: [],
        dataArrayCategory: []
    },
    getters: {
        isInMobileMode(state){
            // console.log(state.insets)
            // 宽度小于 1024 或 高>宽 时，表示是在移动设备上
            return state.insets.windowsWidth < 1024 || state.insets.windowsWidth < state.insets.windowsHeight
        },

        // 类别名称字典
        categoryNameMap(state){
            let categoryNameMap = new Map()
            state.categoryAll.forEach(item => {
                categoryNameMap.set(item.name_en, item.name)
            })
            return categoryNameMap
        },

        // 类别对象字典
        categoryObjectMap(state){
            let categoryNameMap = new Map()
            state.categoryAll.forEach(item => {
                categoryNameMap.set(item.name_en, item)
            })
            return categoryNameMap
        },
    },
    mutations: {
        SET_CATEGORY_ALL(state, payload){
            state.categoryAll = payload
        },
        SET_DATA_ARRAY_CATEGORY(state, payload){
            state.dataArrayCategory = payload
        },
        SET_DATA_ARRAY_YEAR(state, payload){
            state.dataArrayYear = payload
        },
        SET_MENU_SHOWED(state, payload){
            state.isMenuShowed = payload
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
        SET_IS_DIARY_NEED_TO_BE_SAVED (state, payload){
            state.isDiaryNeedToBeSaved = payload
        },
        SET_IS_DIARY_LIST_SHOWED_IN_FULL_STYLE (state, payload){
            state.isDiaryListShowedInFullStyle = payload
        },
        SET_IS_LIST_NEED_BE_RELOAD(state, payload){
            state.isListNeedBeReload = payload
        },
        SET_EDIT_LOGO_IMG(state, payload){
            state.editLogoImg = payload
        },
        SET_LIST_OPERATION(state, payload){
            state.listOperation = payload
        },
        SET_IS_DIARY_NEED_TO_BE_RECOVERED(state, payload){
            state.isDiaryNeedToBeRecovered = payload
        },
        SET_IS_DIARY_EDITOR_CONTENT_HAS_CHANGED(state, payload){
            state.isDiaryEditorContentHasChanged = payload
        },
    }
})
