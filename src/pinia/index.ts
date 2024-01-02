import { defineStore } from "pinia";
import SVG_ICONS from "../assets/icons/SVG_ICONS.ts";
import {getDiaryConfigFromLocalStorage, getAuthorization, setDiaryConfig} from "../utility.ts";
import {DiaryEntity} from "../page/list/Diary.ts";

console.log('pinia is loaded, inside pinia file')

export const useProjectStore = defineStore('projectStore', {
    state: ()=>({
        insets: {
            windowsHeight: window.innerHeight,
            windowsWidth: window.innerWidth,
            heightPanel: window.innerHeight - 45, // 除 navbar 的高度
        },
        colorMode: 'light',
        statisticsCategory: {} ,                 // 统计信息
        statisticsYear: {} ,                     // 统计信息

        // LIST FILTER
        isFilterShared: false ,                  // 是否筛选共享的日记
        dateFilter: '' ,                         // 日期筛选
        keywords: [] ,                           // 搜索关键字
        filteredCategories: [] ,                 // 筛选的类别

        isShowSearchBar: false ,                 // 搜索栏显示
        isHideContent: false ,                   // 是否显示列表内容

        currentDiary: <DiaryEntity>{} ,          // 当前日记

        isDiaryNeedToBeSaved: false ,            // 日记需要被存储
        isDiaryNeedToBeRecovered: false ,        // 取消当前编辑的日记
        isDiaryEditorContentHasChanged: false ,  // 日记内容已经变化
        isDiaryListShowedInFullStyle: false ,    // 日记列表是否显示为全部内容
        isListNeedBeReload: false ,              // 是否刷新列表
        isSavingDiary: false ,                   // 是否正在保存日记
        isMenuShowed: false ,                    // 显示菜单

        editLogoImg: SVG_ICONS.logo ,             // 编辑页LOGO
        listOperation:{} ,                       // 列表页的操作，增删改操作，一般不再重新加载列表

        categoryAll : [],
        dataArrayYear: [],
        dataArrayCategory: [],

        // BILL
        moneyAccuracy: 1, // 展示的货币精度，小数位数
    }),
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
        isAdminUser(){
            return getAuthorization() && getAuthorization().group_id === 1
        },
    },
    actions: {
        initProjectConfig(){
            // 初始化 LocalStorage 存储对象
            let diaryConfig = getDiaryConfigFromLocalStorage()
            this.filteredCategories = diaryConfig.filteredCategories
            this.keywords = diaryConfig.keywords
            this.dateFilter = diaryConfig.dateFilter
            this.isFilterShared = diaryConfig.isFilterShared
        }
    }
})

const mutations = {
    SET_DATE_FILTER(state, payload){
        state.dateFilter = payload
        let diaryConfig = getDiaryConfigFromLocalStorage()
        diaryConfig.dateFilter = payload
        setDiaryConfig(diaryConfig)
    },
    SET_STATISTICS_YEAR(state, payload){
        // 如果没有任何年份数据，清除 dateFilter 数字
        let diaryConfig = getDiaryConfigFromLocalStorage()
        if (payload){

        } else {
            diaryConfig.dateFilter = ''
            state.dateFilter = '' // 同时变更 state 中的数据
        }
        setDiaryConfig(diaryConfig)
        state.statisticsYear = payload
    },
    SET_IS_FILTER_SHARED (state, payload){
        state.isFilterShared = payload
        let diaryConfig = getDiaryConfigFromLocalStorage()
        diaryConfig.isFilterShared = payload
        setDiaryConfig(diaryConfig)
    },
    SET_FILTERED_CATEGORIES(state, payload){
        state.filteredCategories = payload
        let diaryConfig = getDiaryConfigFromLocalStorage()
        diaryConfig.filteredCategories = payload
        setDiaryConfig(diaryConfig)
    },
    SET_KEYWORD (state, payload){
        state.keywords = payload
        let diaryConfig = getDiaryConfigFromLocalStorage()
        diaryConfig.keywords = payload
        setDiaryConfig(diaryConfig)
    },
}


