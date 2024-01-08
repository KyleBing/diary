<template>
    <!-- MENU -->
    <transition
        enter-active-class="animated-fast slideInLeft"
        leave-active-class="animated-fast slideOutLeft"
    >
        <div class="menu-panel" id="menu-panel" v-if="storeProject.isMenuShowed" :style="'height:' + storeProject.insets.heightPanel + 'px'">

            <!-- 菜单列表 -->
            <div class="menu" v-show="menuListShowed" :style="'min-height:' + storeProject.insets.heightPanel + 'px'">
                <div class="menu-list">
                    <!-- 1. 搜索 -->
                    <MenuListItem v-if="storeProject.isInMobileMode"
                                    menu-name="搜索"    :icon="SVG_ICONS.tab_icons.search" @click="menuListClicked('search')"/>
                    <!-- 2. 类别筛选 -->
                    <MenuListItem menu-name="类别筛选" :icon="SVG_ICONS.tab_icons.category" @click="menuListClicked('category')">
                        <MenuCategoryIndicator/>
                    </MenuListItem>

                    <!-- 3. 年份筛选 -->
                    <MenuListItem menu-name="年份筛选" :icon="SVG_ICONS.tab_icons.year"       @click="menuListClicked('year')"
                                    :add-on-text="storeProject.dateFilterString">
                    </MenuListItem>
                    <MenuListItem menu-name="统计数据"  :icon="SVG_ICONS.tab_icons.statistics"  @click="goToPage('Statistics')" />
                    <MenuListItem menu-name="账单"     :icon="SVG_ICONS.tab_icons.bill"        @click="goToPage('Bill')" />
                    <MenuListItem menu-name="银行卡"   :icon="SVG_ICONS.tab_icons.card"        @click="goToPage('BankCard')" />
                    <MenuListItem
                        v-if="isAdminUser"
                        menu-name="文件管理" :icon="SVG_ICONS.tab_icons.folder"        @click="goToPage('FileManager')" />
                    <MenuListItem menu-name="其它"     :icon="SVG_ICONS.tab_icons.others"      @click="menuListClicked('others')" />
                    <MenuListItem
                        v-if="isAdminUser"
                        menu-name="邀请码"   :icon="SVG_ICONS.tab_icons.invitation"         @click="goToPage('Invitation')" />
                    <MenuListItem
                        menu-name="关于"     :icon="SVG_ICONS.tab_icons.about"        @click="menuListClicked('about')"
                        :add-on-text="`v${packageInfo.version}`"/>
                </div>

                <!-- 用户信息 -->
                <UserProfile/>

            </div>

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
import MenuCategorySelector from "../menu/MenuCategorySelector.vue"
import YearSelector from "./YearSelector/YearSelector.vue"
import About from "../about/About.vue"
import packageInfo from "../../../package.json"
import MenuListItem from "../menu/MenuListItem.vue"
import MenuCategoryIndicator from "./MenuCategoryIndicator.vue"
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts"
import UserProfile from "../menu/UserProfile.vue";
import MenuOtherFunction from "../menu/MenuOtherFunction.vue";

import {useProjectStore} from "@/pinia";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {getAuthorization} from "@/utility.ts";

const storeProject = useProjectStore()
const router = useRouter()

onMounted(()=>{
    categoriesSet.value = new Set(storeProject.filteredCategories)
})

// MENU
const menuListShowed = ref(true)         // 菜单列表
const categoryShowed = ref(false)        // 类别菜单
const yearShowed = ref(false)            // 年份选择
const othersShowed = ref(false)          // 其它不常用功能
const aboutShowed = ref(false)           // 关于页面

// menu - category
const categoriesSet = ref(new Set())

const { isMenuShowed } = storeToRefs(storeProject)
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
    storeProject.isMenuShowed = false
    menuClose()
    router.push({name: pageName})
}

// MENU related
function menuShow() {
    storeProject.isMenuShowed = true  // menu panel
    menuListShowed.value = true          // menu list
    categoryShowed.value = false         // category
    yearShowed.value = false             // year
    othersShowed.value = false           // others
    aboutShowed.value = false            // about
}
function menuClose(){
    if (categoryShowed.value) {
        storeProject.isListNeedBeReload = true
        menuInit()
    } else if (aboutShowed.value) {
        storeProject.isMenuShowed = true // menu panel
        menuListShowed.value = true        // menu list
        categoryShowed.value = false       // category
        yearShowed.value = false           // year
        othersShowed.value = false         // others
        aboutShowed.value = false          // about
    } else if (yearShowed.value) {
        storeProject.isListNeedBeReload = true
        menuInit()
    } else if (storeProject.isMenuShowed) {
        menuInit()
    }
}
function menuInit() {
    storeProject.isMenuShowed = false         // menu panel
    menuListShowed.value = true      // menu list
    categoryShowed.value = false     // category
    yearShowed.value = false         // year
    othersShowed.value = false       // others
    aboutShowed.value = false        // about
}
function menuListClicked(menuName: string) {
    switch (menuName) {
        case 'search':
            storeProject.isShowSearchBar = true
            menuInit()
            nextTick(() => {
                (document.querySelector('#keyword') as HTMLInputElement).focus()
            })
            break
        case 'category':
            storeProject.isMenuShowed = true  // menu panel
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
            storeProject.isMenuShowed = true    // menu panel
            menuListShowed.value = false   // menu list
            categoryShowed.value = false   // category
            yearShowed.value = true        // year
            othersShowed.value = false     // others
            aboutShowed.value = false      // about
            break
        case 'others':
            storeProject.isMenuShowed = true    // menu panel
            menuListShowed.value = false   // menu list
            categoryShowed.value = false   // category
            yearShowed.value = false       // year
            othersShowed.value = true      // others
            aboutShowed.value = false      // about
            break
        case 'about':
            storeProject.isMenuShowed = true    // menu panel
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
