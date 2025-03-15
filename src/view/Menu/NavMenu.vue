<template>
    <!-- MENU -->
    <transition
        enter-active-class="animated-fast slideInLeft"
        leave-active-class="animated-fast slideOutLeft"
    >
        <div class="menu-panel" id="menu-panel" v-if="projectStore.isMenuShowed" :style="`height:  ${projectStore.insets.heightPanel}px`">

            <MenuPanelContainer v-show="menuListShowed">
                <!-- 菜单列表 -->
                <div class="menu" :style="`min-height: ${projectStore.insets.heightPanel - 60}px`">
                    <div class="menu-list">
                        <MenuListItemShort v-if="projectStore.isInMobileMode"
                                           menu-name="搜索"    :icon="SVG_ICONS.tab_icons.search" @click="menuListClicked('search')"/>

                        <MenuListItemShort v-if="projectStore.isInMobileMode" menu-name="待办"
                                           :icon="projectStore.filteredCategories.length === 1 && projectStore.filteredCategories[0] === 'todo'?
                                                                                                                    SVG_ICONS.tab_icons.todoActive:
                                                                                                                    SVG_ICONS.tab_icons.todo"
                                           @click="menuListClicked('todo')"/>

                        <MenuListItemShort menu-name="类别筛选" :icon="SVG_ICONS.tab_icons.category" @click="menuListClicked('category')">
                            <MenuCategoryIndicatorInline/>
                        </MenuListItemShort>

                        <MenuListItemShort menu-name="年份筛选" :icon="SVG_ICONS.tab_icons.year"       @click="menuListClicked('year')"
                                           :add-on-text="projectStore.dateFilterString">
                        </MenuListItemShort>
                        <MenuListItemShort menu-name="统计数据"  :icon="SVG_ICONS.tab_icons.statistics"  @click="goToPage('Statistics')" />
                        <MenuListItemShort menu-name="账单"     :icon="SVG_ICONS.tab_icons.billSimple"        @click="goToPage('Bill')" />
                        <MenuListItemShort menu-name="银行卡"   :icon="SVG_ICONS.tab_icons.card"        @click="goToPage('BankCard')" />
                        <MenuListItemShort
                            v-if="isAdminUser"
                            menu-name="文件管理" :icon="SVG_ICONS.tab_icons.folder"        @click="goToPage('FileManager')" />
                        <MenuListItemShort menu-name="其它"     :icon="SVG_ICONS.tab_icons.others"      @click="menuListClicked('others')" />
                        <MenuListItemShort
                            v-if="isAdminUser"
                            menu-name="邀请码"   :icon="SVG_ICONS.tab_icons.invitation"         @click="goToPage('Invitation')" />
                        <MenuListItemShort
                            menu-name="关于"     :icon="SVG_ICONS.tab_icons.about"        @click="menuListClicked('about')"
                            :add-on-text="`v${packageInfo.version}`"/>
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
        </div>
    </transition>

</template>

<script lang="ts" setup>
import MenuCategorySelector from "@/view/Menu/MenuCategorySelector.vue"
import YearSelector from "./YearSelector/YearSelector.vue"
import About from "@/view/About/About.vue"
import packageInfo from "../../../package.json"
import MenuListItemShort from "@/view/Menu/MenuListItemShort.vue"
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts"
import UserProfile from "@/view/Menu/UserProfile.vue";
import MenuOtherFunction from "@/view/Menu/MenuOtherFunction.vue";

import {useProjectStore} from "@/pinia";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {getAuthorization} from "@/utility.ts";
import MenuCategoryIndicatorInline from "@/view/Menu/MenuCategoryIndicatorInline.vue";
import MenuCategoryIndicatorInlineVertical from "@/view/Menu/MenuCategoryIndicatorInlineVertical.vue";
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

const isAdminUser = computed(()=>{
    return getAuthorization().group_id === 1
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
            break
        case 'others':
            projectStore.isMenuShowed = true    // menu panel
            menuListShowed.value = false   // menu list
            categoryShowed.value = false   // category
            yearShowed.value = false       // year
            othersShowed.value = true      // others
            aboutShowed.value = false      // about
            break
        case 'about':
            projectStore.isMenuShowed = true    // menu panel
            menuListShowed.value = false   // menu list
            categoryShowed.value = false   // category
            yearShowed.value = false       // year
            othersShowed.value = false     // others
            aboutShowed.value = true       // about
            break
        default:
            break
    }
}
</script>

<style scoped lang="sass"></style>
