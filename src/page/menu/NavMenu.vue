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
                                    menu-name="搜索"
                                    @click="menuListClicked('search')"/>

                    <!--2. 类别筛选-->
                    <menu-list-item  menu-name="类别筛选"
                                     @click="menuListClicked('category')"
                    >
                        <div class="category-indicator">
                            <div :class="['item', 'category-shared', 'mr-2', {active: isFilterShared}]"></div> <!-- 共享小图标标识 -->
                            <div :class="['item' ,{active: filteredCategories.some(category => category === item.name_en)}]"
                                 :style="filteredCategories.indexOf(item.name_en) > -1? `background-color: ${item.color}`:`border-color: ${item.color}`"
                                 v-for="(item, index) in categoryAll"
                                 :title="item.name_en"
                                 :key="index"></div>
                        </div>
                    </menu-list-item>

                    <!--3. 年份筛选-->
                    <menu-list-item menu-name="年份筛选"
                                    @click="menuListClicked('year')"
                                    :add-on-text="dateFilter">
                    </menu-list-item>
                    <menu-list-item  @click="goToStatisticPage" menu-name="统计数据"/>
                    <menu-list-item  @click="goToBillPage" menu-name="账单"/>
                    <menu-list-item  @click="goToBankCard" menu-name="银行卡"/>
                    <menu-list-item  @click="goToChangePassword" menu-name="修改密码"/>
                    <menu-list-item  @click="menuListClicked('about')"
                                     :add-on-text="`v${version}`"
                                     menu-name="关于"/>
                </div>

                <div class="user-info-panel">
                    <div class="user-info">
                        <div class="user">
                            <p class="username">{{ userInfo.nickname }} <span class="logout ml-3" @click="logout">退出</span></p>
                            <p class="email">{{ userInfo.email }}</p>
                        </div>
                        <div class="separator"></div>
                        <div v-if="statisticsCategory.shared > 0" class="statistics">
                            <p>共享 {{ statisticsCategory.shared }} 篇</p>
                            <p>总计 {{ statisticsCategory.amount }} 篇</p>
                        </div>
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
import utility from "@/utility";
import MenuCategorySelector from "@/page/menu/MenuCategorySelector";
import YearSelector from "@/page/menu/YearSelector";
import About from "@/page/About";
import {mapGetters, mapMutations, mapState} from "vuex";
import packageInfo from "@/../package.json"
import MenuListItem from "@/page/menu/MenuListItem";

export default {
    name: "NavMenu",
    components: {MenuListItem, About, YearSelector, MenuCategorySelector},
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

            version: packageInfo.version
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

        logout() {
            utility.deleteAuthorization()
            this.$router.push('/login')
            this.SET_MENU_SHOWED(false)
        },

        goToStatisticPage(){
            this.SET_MENU_SHOWED(false)
            this.menuClose()
            this.$router.push('/statistics')
        },

        goToBillPage(){
            this.SET_MENU_SHOWED(false)
            this.menuClose()
            this.$router.push('/bill')
        },

        goToBankCard(){
            this.SET_MENU_SHOWED(false)
            this.menuClose()
            this.$router.push('/card')
        },

        goToChangePassword(){
            this.SET_MENU_SHOWED(false)
            this.menuClose()
            this.$router.push('/change-password')
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
                    this.SET_IS_SHOW_SEARCH_BAR(true);
                    this.menuInit();
                    this.$nextTick(() => {
                        document.querySelector('#keyword').focus();
                    });
                    break;
                case 'category':
                    this.SET_MENU_SHOWED(true)  // menu panel
                    this.menuListShowed = false // menu list
                    this.categoryShowed = true  // category
                    this.yearShowed = false     // year
                    this.aboutShowed = false    // about

                    break
                case 'bankCard':
                    this.$router.push({
                        name: 'card'
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
