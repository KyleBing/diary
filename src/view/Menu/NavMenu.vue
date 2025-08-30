<template>
    <!-- MENU -->
    <transition
        enter-active-class="animated-fast slideInLeft"
        leave-active-class="animated-fast slideOutLeft"
    >
        <div class="menu-panel" id="menu-panel"
             v-if="projectStore.isMenuShowed" :style="`height:  ${projectStore.insets.heightPanel}px`">

            <!-- 菜单列表 -->
            <MenuPanelContainer v-show="menuListShowed">
                <!-- 菜单列表内容 -->
                <div class="menu" :style="`min-height: ${projectStore.insets.heightPanel - 60}px`">
                    <div class="menu-list">
                        <MenuListItemShort
                            v-for="item in MENU_LIST_SHOWING" :key="item.name"
                                   :menu-name="item.name"
                                   :icon="item.icon"
                                   @click="item.onClick">
                            <component :is="item.insideComponent" v-if="item.insideComponent"/>
                        </MenuListItemShort>
                    </div>

                    <!-- 用户信息 -->
                    <UserProfile/>

                </div>
            </MenuPanelContainer>


            <!-- 页面 类别筛选 -->
            <transition enter-active-class="animated-fast fadeIn" leave-active-class="animated-fast fadeOut">
                <MenuCategorySelector v-if="categoryShowed"/>
            </transition>

            <!-- 页面 年份筛选 -->
            <transition enter-active-class="animated-fast fadeIn" leave-active-class="animated-fast fadeOut">
                <YearSelector v-show="yearShowed"/>
            </transition>

            <!-- 页面 其它功能 -->
            <transition enter-active-class="animated-fast fadeIn" leave-active-class="animated-fast fadeOut">
                <MenuOtherFunction v-show="othersShowed"/>
            </transition>

            <!-- 页面 关于 -->
            <transition enter-active-class="animated-fast fadeIn" leave-active-class="animated-fast fadeOut">
                <About v-show="aboutShowed"/>
            </transition>

            <!-- 页面 更新日志 -->
            <transition enter-active-class="animated-fast fadeIn" leave-active-class="animated-fast fadeOut">
                <ChangeLog v-show="changeLogShowed"/>
            </transition>
        </div>
    </transition>

</template>

<script lang="ts" setup>
import MenuCategorySelector from "@/view/Menu/MenuCategorySelector/MenuCategorySelector.vue"
import YearSelector from "./YearSelector/YearSelector.vue"
import About from "@/view/About/About.vue"
import packageInfo from "../../../package.json"
import MenuListItemShort from "@/view/Menu/MenuListItemShort.vue"
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts"
import UserProfile from "@/view/Menu/UserProfile.vue";
import MenuOtherFunction from "@/view/Menu/MenuOtherFunction/MenuOtherFunction.vue";
import ChangeLog from "@/view/Menu/ChangeLog/ChangeLog.vue";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import MenuCategoryIndicatorInline from "@/view/Menu/MenuCategorySelector/MenuCategoryIndicatorInline.vue";
import MenuPanelContainer from "@/framework/MenuPanelContainer.vue";

const projectStore = useProjectStore()
const router = useRouter()

onMounted(()=>{
    categoriesSet.value = new Set(projectStore.filteredCategories)
})

// MENU
const menuListShowed = ref(true)         // 菜单列表
const categoryShowed = ref(false)        // 类别菜单
const yearShowed = ref(false)            // 年份选择
const othersShowed = ref(false)          // 其它不常用功能
const aboutShowed = ref(false)           // 关于页面
const changeLogShowed = ref(false)       // 更新日志

const MENU_LIST = [
    {
        name: '搜索',
        isShowInMobile: false,
        isShowInPC: false,
        isNeedAdmin: false,
        icon: SVG_ICONS.tab_icons.search,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            projectStore.isShowSearchBar = true
            menuInit()
            nextTick(() => {
                (document.querySelector('#keyword') as HTMLInputElement).focus()
            })
        }
    },
    {
        name: '类别筛选',
        isShowInMobile: true,
        isShowInPC: true,
        isNeedAdmin: false,
        icon: SVG_ICONS.tab_icons.category,
        insideComponent: MenuCategoryIndicatorInline,
        addOnText: null,
        onClick: () => {
            menuListClicked('category')
        }
    },
    {
        name: '待办',
        isShowInMobile: true,
        isShowInPC: false,
        isNeedAdmin: false,
        icon: projectStore.filteredCategories.length === 1 &&
                projectStore.filteredCategories[0] === 'todo'?
                    SVG_ICONS.tab_icons.todoActive:
                    SVG_ICONS.tab_icons.todo,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            menuListClicked('todo')
        }
    },
    {
        name: '年份筛选',
        isShowInMobile: true,
        isShowInPC: true,
        isNeedAdmin: false,
        icon: SVG_ICONS.tab_icons.year,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            menuListClicked('year')
        }
    },
    {
        name: '日历',
        isShowInMobile: true,
        isShowInPC: true,
        isNeedAdmin: false,
        icon: SVG_ICONS.tab_icons.calendar,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            goToPage('Calendar')
        }
    },
    {
        name: '日历 - 经期',
        isShowInMobile: false,
        isShowInPC: false,
        isNeedAdmin: false,
        icon: SVG_ICONS.tab_icons.calendar,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            goToPage('CalendarPeriod')
        }
    },
    {
        name: '账单',
        isShowInMobile: true,
        isShowInPC: true,
        isNeedAdmin: false,
        icon: SVG_ICONS.tab_icons.billSimple,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            goToPage('Bill')
        }
    },
    {
        name: '统计数据',
        isShowInMobile: true,
        isShowInPC: true,
        isNeedAdmin: false,
        icon: SVG_ICONS.tab_icons.statistics,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            goToPage('Statistics')
        }
    },
    {
        name: '银行卡',
        isShowInMobile: true,
        isShowInPC: true,
        isNeedAdmin: false,
        icon: SVG_ICONS.tab_icons.card,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            goToPage('BankCard')
        }
    },
    {
        name: '文件管理',
        isShowInMobile: true,
        isShowInPC: true,
        isNeedAdmin: true,
        icon: SVG_ICONS.tab_icons.folder,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            goToPage('FileManager')
        }
    },
    {
        name: '其它',
        isShowInMobile: true,
        isShowInPC: true,
        isNeedAdmin: false,
        icon: SVG_ICONS.tab_icons.others,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            menuListClicked('others')
        }
    },
    {
        name: '邀请码',
        isShowInMobile: true,
        isShowInPC: true,   
        isNeedAdmin: true,
        icon: SVG_ICONS.tab_icons.invitation,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            goToPage('Invitation')
        }
    },
    {
        name: '更新日志',
        isShowInMobile: true,
        isShowInPC: true,
        isNeedAdmin: false,
        icon: SVG_ICONS.tab_icons.changeLog,
        insideComponent: null,
        addOnText: null,
        onClick: () => {
            menuListClicked('changeLog')
        }
    },
    {
        name: '关于',
        isShowInMobile: true,
        isShowInPC: true,
        isNeedAdmin: false,
        icon: SVG_ICONS.tab_icons.about,
        insideComponent: null,
        addOnText: `v${packageInfo.version}`,
        onClick: () => {
            menuListClicked('about')
        }
    }
] as const

const MENU_LIST_SHOWING = computed(() => {
    if (projectStore.isInMobileMode){
        return MENU_LIST.filter(item => item.isShowInMobile && (item.isNeedAdmin ? projectStore.isAdminUser : true))
    } else {
        return MENU_LIST.filter(item => item.isShowInPC && (item.isNeedAdmin ? projectStore.isAdminUser : true))
    }
})



// menu - category
const categoriesSet = ref(new Set())

const { isMenuShowed } = storeToRefs(projectStore)
watch(isMenuShowed, newValue => {
    if (newValue){
        menuShow()
    } else {
        menuClose()
    }
})

// 跳转到独立页面
function goToPage(pageName: string){
    projectStore.isMenuShowed = false
    menuClose()
    router.push({name: pageName})
}

// MENU related
function menuShow() {
    projectStore.isMenuShowed = true  // menu panel
    menuListShowed.value = true          // menu list
    categoryShowed.value = false         // category
    yearShowed.value = false             // year
    othersShowed.value = false           // others
    aboutShowed.value = false            // about
}
function menuClose(){
    if (categoryShowed.value) {
        projectStore.isListNeedBeReload = true
        menuInit()
    } else if (aboutShowed.value) {
        projectStore.isMenuShowed = true // menu panel
        menuListShowed.value = true        // menu list
        categoryShowed.value = false       // category
        yearShowed.value = false           // year
        othersShowed.value = false         // others
        aboutShowed.value = false          // about
    } else if (yearShowed.value) {
        projectStore.isListNeedBeReload = true
        menuInit()
    } else if (projectStore.isMenuShowed) {
        menuInit()
    }
}
function menuInit() {
    projectStore.isMenuShowed = false         // menu panel
    menuListShowed.value = true      // menu list
    categoryShowed.value = false     // category
    yearShowed.value = false         // year
    othersShowed.value = false       // others
    aboutShowed.value = false        // about
}
function menuListClicked(menuName: string) {
    switch (menuName) {
        case 'search':
            projectStore.isShowSearchBar = true
            menuInit()
            nextTick(() => {
                (document.querySelector('#keyword') as HTMLInputElement).focus()
            })
            break
        case 'todo':
            let nextCategories: string[] = []
            if (projectStore.filteredCategories.length === 1 && projectStore.filteredCategories[0] === 'todo'){
                nextCategories = []
            } else {
                nextCategories = ['todo']
            }
            projectStore.isFilterShared = false
            projectStore.SET_FILTERED_CATEGORIES(nextCategories)
            projectStore.isListNeedBeReload = true
            menuInit()
            break
        case 'category':
            projectStore.isMenuShowed = true  // menu panel
            menuListShowed.value = false // menu list
            categoryShowed.value = true  // category
            yearShowed.value = false     // year
            othersShowed.value = false   // others
            aboutShowed.value = false    // about
            changeLogShowed.value = false // changeLog
            break
        case 'bankCard':
            router.push({
                name: 'BankCard'
            })
            break
        case 'year':
            projectStore.isMenuShowed = true    // menu panel
            menuListShowed.value = false   // menu list
            categoryShowed.value = false   // category
            yearShowed.value = true        // year
            othersShowed.value = false     // others
            aboutShowed.value = false      // about
            changeLogShowed.value = false // changeLog
            break
        case 'others':
            projectStore.isMenuShowed = true    // menu panel
            menuListShowed.value = false   // menu list
            categoryShowed.value = false   // category
            yearShowed.value = false       // year
            othersShowed.value = true      // others
            aboutShowed.value = false      // about
            changeLogShowed.value = false // changeLog
            break
        case 'about':
            projectStore.isMenuShowed = true    // menu panel
            menuListShowed.value = false   // menu list
            categoryShowed.value = false   // category
            yearShowed.value = false       // year
            othersShowed.value = false     // others
            aboutShowed.value = true       // about
            changeLogShowed.value = false // changeLog
            break
        case 'changeLog':
            projectStore.isMenuShowed = true    // menu panel
            menuListShowed.value = false   // menu list
            categoryShowed.value = false   // category
            yearShowed.value = false       // year
            othersShowed.value = false     // others
            aboutShowed.value = false      // about
            changeLogShowed.value = true   // changeLog
            break
        default:
            break
    }
}
</script>

<style scoped lang="sass"></style>
