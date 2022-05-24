<template>
    <!-- MENU -->
    <div class="menu-panel" id="menu-panel" v-show="menuShowed" :style="'height:' + insets.heightPanel + 'px'">
        <div class="menu-list" v-show="menuListShowed" :style="'min-height:' + insets.heightPanel + 'px'">
            <div class="menu-list-group">
                <!--1. 搜索-->
                <div class="menu-list-group-item" v-if="isInMobileMode" @click="menuListClicked('search')">搜索</div>

                <!--2. 类别筛选-->
                <div class="menu-list-group-item" @click="menuListClicked('category')">
                    <div>类别筛选</div>
                    <div class="category-indicator">
                        <div :class="['item', 'category-shared', 'mr-2', {active: isFilterShared}]"></div> <!-- 共享小图标标识 -->
                        <div :class="['item' ,{active: filteredCategories.some(category => category === item.name_en)}]"
                             :style="filteredCategories.indexOf(item.name_en) > -1? `background-color: ${item.color}`:`border-color: ${item.color}`"
                             v-for="(item, index) in categoryAll"
                             :title="item.name_en"
                             :key="index"></div>
                    </div>
                </div>

                <!--3. 年份筛选-->
                <div class="menu-list-group-item" @click="menuListClicked('year')">
                    <div>年份筛选</div>
                    <div class="addon">{{ dateFilter }}</div>
                </div>

                <!--4. 统计数据-->
                <div class="menu-list-group-item" @click="goToStatisticPage">统计数据</div>

                <!--5. 银行卡-->
                <div class="menu-list-group-item" @click="menuListClicked('bankCard')">银行卡</div>

                <!--6. 修改密码-->
                <router-link class="menu-list-group-item" to="/change-password">修改密码</router-link>

                <!--7. 关于-->
                <div class="menu-list-group-item" @click="menuListClicked('about')">关于</div>

                <!--8. 退出-->
                <div class="menu-list-group-item" @click="logout">退出</div>

            </div>

            <div class="user-info-panel">
                <div class="user-info">
                    <div class="user">
                        <p class="username">{{ userInfo.nickname }}</p>
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
        <menu-category-selector v-if="categoryShowed"/>

        <!-- year selector -->
        <year-selector v-show="yearShowed"/>

        <!-- bank card -->
        <bank-card v-if="bankCardShowed"/>

        <!--about-->
        <about v-show="aboutShowed"/>
    </div>

</template>

<script>
import utility from "@/utility";
import MenuCategorySelector from "@/page/menu/MenuCategorySelector";
import YearSelector from "@/page/menu/YearSelector";
import About from "@/page/About";
import {mapGetters, mapMutations, mapState} from "vuex";
import BankCard from "@/page/menu/BankCard";

export default {
    name: "NavMenu",
    components: {BankCard, About, YearSelector, MenuCategorySelector},
    data(){
        return {
            // menu
            menuListShowed: true,         // menu list
            categoryShowed: false,        // category
            yearShowed: false,            // year chooser
            bankCardShowed: false,        // bank card
            aboutShowed: false,           // about

            // menu - category
            userInfo: utility.getAuthorization(),
            categoriesSet: new Set(),
            originCategories: [],
            originFilterShared: false,
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
            'menuShowed'
        ])
    },
    methods: {
        ...mapMutations([
            'SET_LIST_NEED_BE_RELOAD',
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
            this.$router.push('/statistics')
        },

        goToBankCard(){
            this.SET_MENU_SHOWED(false)
            this.$router.push('/bank-card')
        },

        // MENU related
        menuShow() {
            this.SET_MENU_SHOWED(true)  // menu panel
            this.menuListShowed = true  // menu list
            this.categoryShowed = false // category
            this.yearShowed = false     // year
            this.bankCardShowed = false // bank card
            this.aboutShowed = false    // about
        },
        menuClose(){
            if (this.categoryShowed) {
                this.SET_LIST_NEED_BE_RELOAD(true)
                this.menuInit()
            } else if (this.aboutShowed) {
                this.SET_MENU_SHOWED(true) // menu panel
                this.menuListShowed = true            // menu list
                this.categoryShowed = false           // category
                this.yearShowed = false           // year
                this.bankCardShowed = false // bank card
                this.aboutShowed = false           // about
            } else if (this.yearShowed) {
                this.SET_LIST_NEED_BE_RELOAD(true)
                this.menuInit()
            } else if (this.bankCardShowed) {
                this.menuInit()
            } else if (this.menuShowed) {
                this.menuInit()
            }
        },
        menuInit() {
            this.SET_MENU_SHOWED(false)              // menu panel
            this.menuListShowed = true               // menu list
            this.categoryShowed = false              // category
            this.yearShowed = false                  // year
            this.bankCardShowed = false // bank card
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
                    this.bankCardShowed = false // bank card
                    this.aboutShowed = false    // about

                    break
                case 'bankCard':
                    this.SET_MENU_SHOWED(true)    // menu panel
                    this.menuListShowed = false   // menu list
                    this.categoryShowed = false   // category
                    this.yearShowed = false       // year
                    this.bankCardShowed = true    // bank card
                    this.aboutShowed = false      // about

                    break
                case 'year':
                    this.SET_MENU_SHOWED(true)    // menu panel
                    this.menuListShowed = false   // menu list
                    this.categoryShowed = false   // category
                    this.yearShowed = true        // year
                    this.bankCardShowed = false   // bank card
                    this.aboutShowed = false      // about

                    break
                case 'about':
                    this.SET_MENU_SHOWED(true)    // menu panel
                    this.menuListShowed = false   // menu list
                    this.categoryShowed = false   // category
                    this.yearShowed = false       // year
                    this.bankCardShowed = false   // bank card
                    this.aboutShowed = true       // about


                    break
                default:
                    break
            }
        },
    },
    watch: {
        menuShowed(newValue){
            if (newValue){
                this.menuShow()
            } else {
               this.menuClose()
            }
        }
    }
}
</script>

<style scoped>

</style>
