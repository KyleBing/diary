<template>
    <!-- MENU -->
    <transition
        enter-active-class="animated-fast slideInLeft"
        leave-active-class="animated-fast slideOutLeft"
    >
        <div class="menu-panel" id="menu-panel" v-if="isMenuShowed" :style="'height:' + insets.heightPanel + 'px'">
            <div class="menu" v-show="menuListShowed" :style="'min-height:' + insets.heightPanel + 'px'">
                <div class="menu-list">
                    <!--1. 搜索-->
                    <menu-list-item v-if="isInMobileMode"
                                    menu-name="搜索"    :icon="icons.tab.search" @click="menuListClicked('search')"/>
                    <!--2. 类别筛选-->
                    <menu-list-item menu-name="类别筛选" :icon="icons.tab.category" @click="menuListClicked('category')">
                        <category-indicator/>
                    </menu-list-item>

                    <!--3. 年份筛选-->
                    <menu-list-item menu-name="年份筛选" :icon="icons.tab.year"       @click="menuListClicked('year')"
                                    :add-on-text="dateFilter">
                    </menu-list-item>
                    <menu-list-item menu-name="统计数据"  :icon="icons.tab.statistics"  @click="goToStatisticPage" />
                    <menu-list-item menu-name="账单"     :icon="icons.tab.bill"        @click="goToBillPage" />
                    <menu-list-item menu-name="银行卡"   :icon="icons.tab.card"        @click="goToBankCard" />
                    <menu-list-item menu-name="修改密码"  :icon="icons.tab.key"         @click="goToChangePassword" />
                    <menu-list-item  v-if="isAdmin"
                                     menu-name="邀请码"   :icon="icons.tab.add"         @click="goToInvitationList" />
                    <menu-list-item menu-name="关于"     :icon="icons.tab.about"      @click="menuListClicked('about')"
                                    :add-on-text="`v${version}`"/>
                </div>


                <div class="user-info-panel">
                    <div class="avatar">
                        <img :src="userInfo.avatar || icons.logoIcon.login" alt="Avatar">
                    </div>
                    <div class="user-info mt-2">
                        <div class="user">
                            <div class="username">{{ userInfo.nickname }}</div>
                            <div class="email">{{ userInfo.email }}</div>
                            <div class="operation">
                                <div class="logout" @click="logout">退出</div>
                                <div class="logout ml-3" @click="changeProfile">修改</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="statisticsCategory.shared > 0" class="statistics">
                        <p>📍 {{userInfo.city}}</p>
                        <p>总计 <b>{{ statisticsCategory.amount }}</b> 篇</p>
                        <p>共享 <b>{{ statisticsCategory.shared }}</b> 篇</p>
                    </div>
                </div>
            </div>

            <!-- category-->
            <transition enter-active-class="animated-fast fadeIn" leave-active-class="animated-fast fadeOut">
                <menu-category-selector v-if="categoryShowed"/>
            </transition>

            <!-- year selector -->
            <transition enter-active-class="animated-fast fadeIn" leave-active-class="animated-fast fadeOut">
                <year-selector v-show="yearShowed"/>
            </transition>

            <!--about-->
            <transition enter-active-class="animated-fast fadeIn" leave-active-class="animated-fast fadeOut">
                <about v-show="aboutShowed"/>
            </transition>
        </div>
    </transition>

</template>

<script>
import utility from "@/utility"
import MenuCategorySelector from "@/page/menu/MenuCategorySelector"
import YearSelector from "@/page/menu/YearSelector"
import About from "@/page/about/About"
import {mapGetters, mapMutations, mapState} from "vuex"
import packageInfo from "@/../package.json"
import MenuListItem from "@/page/menu/MenuListItem"
import CategoryIndicator from "@/page/menu/CategoryIndicator"
import svgIcons from "@/assets/img/SvgIcons"

export default {
    name: "NavMenu",
    components: {CategoryIndicator, MenuListItem, About, YearSelector, MenuCategorySelector},
    data(){
        return {
            // menu
            menuListShowed: true,         // menu list
            categoryShowed: false,        // category
            yearShowed: false,            // year chooser
            aboutShowed: false,           // about

            // menu - category
            userInfo: utility.getAuthorization(),
            categoriesSet: new Set(),
            originCategories: [],
            originFilterShared: false,

            version: packageInfo.version,

            icons: svgIcons
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
        ])
    },
    methods: {
        ...mapMutations([
            'SET_IS_LIST_NEED_BE_RELOAD',
            'SET_IS_SHOW_SEARCH_BAR',
            'SET_MENU_SHOWED'
        ]),
        // 是否为管理员 管理员的组别为 1
        isAdmin(){
            return utility.getAuthorization() && utility.getAuthorization().group_id === 1
        },
        svgIcons() {
            return svgIcons
        },
        changeProfile(){
            this.$router.push({name: 'ChangeProfile'})
        },
        logout() {
            utility.deleteAuthorization()
            this.$router.push({name: 'Login'})
            this.SET_MENU_SHOWED(false)
        },

        goToStatisticPage(){
            this.SET_MENU_SHOWED(false)
            this.menuClose()
            this.$router.push({name: 'Statistics'})
        },

        goToBillPage(){
            this.SET_MENU_SHOWED(false)
            this.menuClose()
            this.$router.push({name: 'Bill'})
        },

        goToBankCard(){
            this.SET_MENU_SHOWED(false)
            this.menuClose()
            this.$router.push({name: 'BankCard'})
        },

        goToChangePassword(){
            this.SET_MENU_SHOWED(false)
            this.menuClose()
            this.$router.push({name: 'ChangePassword'})
        },

        goToInvitationList(){
            this.SET_MENU_SHOWED(false)
            this.menuClose()
            this.$router.push({name: 'Invitation'})
        },

        // MENU related
        menuShow() {
            this.SET_MENU_SHOWED(true)  // menu panel
            this.menuListShowed = true  // menu list
            this.categoryShowed = false // category
            this.yearShowed = false     // year
            this.aboutShowed = false    // about
        },
        menuClose(){
            if (this.categoryShowed) {
                this.SET_IS_LIST_NEED_BE_RELOAD(true)
                this.menuInit()
            } else if (this.aboutShowed) {
                this.SET_MENU_SHOWED(true) // menu panel
                this.menuListShowed = true            // menu list
                this.categoryShowed = false           // category
                this.yearShowed = false           // year
                this.aboutShowed = false           // about
            } else if (this.yearShowed) {
                this.SET_IS_LIST_NEED_BE_RELOAD(true)
                this.menuInit()
                this.menuInit()
            } else if (this.isMenuShowed) {
                this.menuInit()
            }
        },
        menuInit() {
            this.SET_MENU_SHOWED(false)              // menu panel
            this.menuListShowed = true               // menu list
            this.categoryShowed = false              // category
            this.yearShowed = false                  // year
            this.aboutShowed = false                 // about
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
                    this.aboutShowed = false      // about
                    break
                case 'about':
                    this.SET_MENU_SHOWED(true)    // menu panel
                    this.menuListShowed = false   // menu list
                    this.categoryShowed = false   // category
                    this.yearShowed = false       // year
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
