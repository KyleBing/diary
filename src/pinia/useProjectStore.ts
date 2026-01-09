import { defineStore } from "pinia";
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts";
import {getAuthorization, getDiaryConfigFromLocalStorage, setDiaryConfig} from "@/utility.ts";
import {EntityDiaryForm, EntityDiaryListOperation} from "@/view/DiaryList/Diary.ts";
import {EnumListStyle} from "@/listStyle.ts";

console.log('pinia projectStore is loaded, inside pinia file')

export const useProjectStore = defineStore('projectStore', {
    state: ()=>({
        insets: {
            windowsHeight: window.innerHeight,
            windowsWidth: window.innerWidth,
            heightPanel: window.innerHeight - 45, // 除 navbar 的高度
        } as
            {windowsHeight: number, windowsWidth: number,heightPanel:number} ,

        colorMode: 'light',
        isDarkTheme: false, // 系统主题检测 (prefers-color-scheme: dark)

        // LIST FILTER
        isFilterShared: false ,                         // 是否筛选共享的日记
        dateFilterString: '' ,                          // 日期筛选
        keywords: [] as String[] ,                      // 搜索关键字
        filteredCategories: [] as string[] ,            // 筛选的类别 name_en[]

        isShowSearchBar: false ,                        // 搜索栏显示
        isHideContent: false ,                          // 是否显示列表内容

        currentDiary: {} as EntityDiaryForm,                // 当前日记

        listStyle: EnumListStyle.list ,                 // 日记列表是否显示为全部内容
        waterFallItemCount: 0, // 瀑布流展示的日记数量


        isDiaryNeedToBeSaved: false ,                   // 日记需要被存储
        isDiaryNeedToBeRecovered: false ,               // 取消当前编辑的日记
        isDiaryEditorContentHasChanged: false ,         // 日记内容已经变化
        isListNeedBeReload: false ,                     // 是否刷新列表
        isSavingDiary: false ,                          // 是否正在保存日记
        isMenuShowed: false ,                           // 显示菜单

        editLogoImg: SVG_ICONS.logo_icons.logo ,        // 编辑页LOGO
        listOperation: {} as EntityDiaryListOperation ,       // 列表页的操作，增删改操作，一般不再重新加载列表


        // BILL
        moneyAccuracy: 1, // 展示的货币精度，小数位数

        cacheDiary: undefined as (EntityDiaryForm | undefined),                // 缓存日记，目前只用于屏幕变换时，恢复日记内容
        cacheDiaryOrigin: undefined as (EntityDiaryForm | undefined),          // 跟上面同步使用：用于恢复用户之前的编辑状态，同时恢复当时的原日记内容，恢复 “日记已被编辑” 的状态
    }),
    getters: {
        isInMobileMode(state){
            // console.log(state.insets)
            // 宽度小于 1024 或 高>宽 时，表示是在移动设备上
            return state.insets.windowsWidth < 1024 || state.insets.windowsWidth < state.insets.windowsHeight
        },
        isAdminUser(){
            return getAuthorization()?.group_id === 1
        },
        // 检测系统主题样式 (light/dark)
        isDarkMode(state){
            if (state.isDarkTheme !== undefined) {
                return state.isDarkTheme
            }
            if (typeof window !== 'undefined' && window.matchMedia) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches
            }
            return false
        }
    },
    actions: {
        INIT_PROJECT_CONFIG(){
            // 初始化 LocalStorage 存储对象
            let diaryConfig = getDiaryConfigFromLocalStorage()
            this.filteredCategories = diaryConfig.filteredCategories
            this.keywords = diaryConfig.keywords
            this.dateFilterString = diaryConfig.dateFilterString
            this.isFilterShared = diaryConfig.isFilterShared
            
            // Initialize system theme detection
            this.detectSystemTheme()
            
            // Listen for system theme changes
            if (typeof window !== 'undefined' && window.matchMedia) {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
                // Modern browsers support addEventListener
                if (mediaQuery.addEventListener) {
                    mediaQuery.addEventListener('change', (e) => {
                        this.isDarkTheme = e.matches
                    })
                } else {
                    // Fallback for older browsers
                    mediaQuery.addListener((e) => {
                        this.isDarkTheme = e.matches
                    })
                }
            }
        },
        // Detect system theme preference
        detectSystemTheme(){
            if (typeof window !== 'undefined' && window.matchMedia) {
                this.isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            }
        },
        // 设置是否显示共享
        SET_IS_FILTERED_SHARED (payload: boolean){
            this.isFilterShared = payload
            let diaryConfig = getDiaryConfigFromLocalStorage()
            diaryConfig.isFilterShared = payload
            setDiaryConfig(diaryConfig)
        },
        // 设置类别筛选
        SET_FILTERED_CATEGORIES(payload: string[]){
            this.filteredCategories = payload
            let diaryConfig = getDiaryConfigFromLocalStorage()
            diaryConfig.filteredCategories = payload
            setDiaryConfig(diaryConfig)
        },
        SET_DATE_FILTER_STRING(payload: string){
            this.dateFilterString = payload
            let diaryConfig = getDiaryConfigFromLocalStorage()
            diaryConfig.dateFilterString = payload
            setDiaryConfig(diaryConfig)
        },
        SET_KEYWORD (payload: string[]){
            this.keywords = payload
            let diaryConfig = getDiaryConfigFromLocalStorage()
            diaryConfig.keywords = payload
            setDiaryConfig(diaryConfig)
        },
    }
})


