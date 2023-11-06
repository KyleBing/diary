<template>
    <!-- MENU -->
    <transition
        enter-active-class="animated-fast slideInLeft"
        leave-active-class="animated-fast slideOutLeft"
    >
        <div class="menu-panel" id="menu-panel" v-if="isMenuShowed" :style="'height:' + insets.heightPanel + 'px'">

            <!-- 菜单列表 -->
            <div class="menu" v-show="menuListShowed" :style="'min-height:' + insets.heightPanel + 'px'">
                <div class="menu-list">
                    <!-- 1. 搜索 -->
                    <menu-list-item v-if="isInMobileMode"
                                    menu-name="搜索"    :icon="icons.tab.search" @click="menuListClicked('search')"/>
                    <!-- 2. 类别筛选 -->
                    <menu-list-item menu-name="类别筛选" :icon="icons.tab.category" @click="menuListClicked('category')">
                        <menu-category-indicator/>
                    </menu-list-item>

                    <!-- 3. 年份筛选 -->
                    <menu-list-item menu-name="年份筛选" :icon="icons.tab.year"       @click="menuListClicked('year')"
                                    :add-on-text="dateFilter">
                    </menu-list-item>
                    <menu-list-item menu-name="统计数据"  :icon="icons.tab.statistics"  @click="goToPage('Statistic')" />
                    <menu-list-item menu-name="账单"     :icon="icons.tab.bill"        @click="goToPage('Bill')" />
                    <menu-list-item menu-name="银行卡"   :icon="icons.tab.card"        @click="goToPage('BankCard')" />
                    <menu-list-item
                        v-if="isAdminUser"
                        menu-name="文件管理" :icon="icons.tab.folder"        @click="goToPage('FileManager')" />
                    <menu-list-item menu-name="其它"     :icon="icons.tab.others"      @click="menuListClicked('others')" />
                    <menu-list-item
                        v-if="isAdminUser"
                        menu-name="邀请码"   :icon="icons.tab.invitation"         @click="goToPage('Invitation')" />
                    <menu-list-item
                        menu-name="关于"     :icon="icons.tab.about"        @click="menuListClicked('about')"
                        :add-on-text="`v${version}`"/>
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

<script>
import utility from "../../utility"
import MenuCategorySelector from "../../page/menu/MenuCategorySelector"
import YearSelector from "./YearSelector/YearSelector"
import About from "../../page/about/About"
import {mapGetters, mapMutations, mapState} from "vuex"
import packageInfo from "../../../package.json"
import MenuListItem from "../../page/menu/MenuListItem"
import MenuCategoryIndicator from "./MenuCategoryIndicator"
import svgIcons from "../../assets/img/SvgIcons"
import projectConfig from "../../projectConfig";
import UserProfile from "../../page/menu/UserProfile.vue";
import MenuOtherFunction from "@/page/menu/MenuOtherFunction";

export default {
    name: "NavMenu",
    components: {
        MenuOtherFunction,
        UserProfile,
        MenuCategoryIndicator,
        MenuListItem,
        About,
        YearSelector,
        MenuCategorySelector
    },
    data(){
        return {
            // menu
            menuListShowed: true,         // 菜单列表
            categoryShowed: false,        // 类别菜单
            yearShowed: false,            // 年份选择
            othersShowed: false,          // 其它不常用功能
            aboutShowed: false,           // 关于页面

            // menu - category
            categoriesSet: new Set(),
            originCategories: [],
            originFilterShared: false,

            version: packageInfo.version,

            icons: svgIcons,

            QiniuStyleSuffix: projectConfig.QiniuStyleSuffix
        }
    },
    mounted() {
        this.categoriesSet = new Set(this.filteredCategories)
    },
    computed:{
        ...mapGetters(['isInMobileMode']),
        ...mapState([
            'insets',
            'categoryAll',
            'statisticsCategory',
            'statisticsYear',
            'dateFilter',
            'isFilterShared',
            'filteredCategories',
            'isMenuShowed'
        ]),
        isAdminUser(){
            return utility.getAuthorization() && utility.getAuthorization().group_id === 1
        },
    },
    methods: {
        ...mapMutations([
            'SET_IS_LIST_NEED_BE_RELOAD',
            'SET_IS_SHOW_SEARCH_BAR',
            'SET_MENU_SHOWED'
        ]),
        // 跳转到独立页面
        goToPage(pageName){
            this.SET_MENU_SHOWED(false)
            this.menuClose()
            this.$router.push({name: pageName})
        },

        // MENU related
        menuShow() {
            this.SET_MENU_SHOWED(true)  // menu panel
            this.menuListShowed = true          // menu list
            this.categoryShowed = false         // category
            this.yearShowed = false             // year
            this.othersShowed = false           // others
            this.aboutShowed = false            // about
        },
        menuClose(){
            if (this.categoryShowed) {
                this.SET_IS_LIST_NEED_BE_RELOAD(true)
                this.menuInit()
            } else if (this.aboutShowed) {
                this.SET_MENU_SHOWED(true) // menu panel
                this.menuListShowed = true        // menu list
                this.categoryShowed = false       // category
                this.yearShowed = false           // year
                this.othersShowed = false         // others
                this.aboutShowed = false          // about
            } else if (this.yearShowed) {
                this.SET_IS_LIST_NEED_BE_RELOAD(true)
                this.menuInit()
                this.menuInit()
            } else if (this.isMenuShowed) {
                this.menuInit()
            }
        },
        menuInit() {
            this.SET_MENU_SHOWED(false)         // menu panel
            this.menuListShowed = true      // menu list
            this.categoryShowed = false     // category
            this.yearShowed = false         // year
            this.othersShowed = false       // others
            this.aboutShowed = false        // about
        },
        menuListClicked(menuName) {
            switch (menuName) {
                case 'search':
                    this.SET_IS_SHOW_SEARCH_BAR(true)
                    this.menuInit()
                    this.$nextTick(() => {
                        document.querySelector('#keyword').focus()
                    })
                    break
                case 'category':
                    this.SET_MENU_SHOWED(true)  // menu panel
                    this.menuListShowed = false // menu list
                    this.categoryShowed = true  // category
                    this.yearShowed = false     // year
                    this.othersShowed = false   // others
                    this.aboutShowed = false    // about
                    break
                case 'bankCard':
                    this.$router.push({
                        name: 'BankCard'
                    })
                    break
                case 'year':
                    this.SET_MENU_SHOWED(true)    // menu panel
                    this.menuListShowed = false   // menu list
                    this.categoryShowed = false   // category
                    this.yearShowed = true        // year
                    this.othersShowed = false     // others
                    this.aboutShowed = false      // about
                    break
                case 'others':
                    this.SET_MENU_SHOWED(true)    // menu panel
                    this.menuListShowed = false   // menu list
                    this.categoryShowed = false   // category
                    this.yearShowed = false       // year
                    this.othersShowed = true      // others
                    this.aboutShowed = false      // about
                    break
                case 'about':
                    this.SET_MENU_SHOWED(true)    // menu panel
                    this.menuListShowed = false   // menu list
                    this.categoryShowed = false   // category
                    this.yearShowed = false       // year
                    this.othersShowed = false     // others
                    this.aboutShowed = true       // about
                    break
                default:
                    break
            }
        },
    },
    watch: {
        isMenuShowed(newValue){
            if (newValue){
                this.menuShow()
            } else {
               this.menuClose()
            }
        }
    }
}
</script>

<style scoped lang="sass"></style>
