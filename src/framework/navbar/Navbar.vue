<template>
    <div class="navbar-container">
        <!-- NAVBAR -->
        <nav class="navbar" id="navbar">
            <div class="nav-part-left">
                <div @click="menuShow"
                     v-if="(!isInMobileMode && !isMenuShowed)
                     || isInMobileMode && $route.name === 'List' && !isMenuShowed">
                    <tab-icon alt="菜单"/>
                </div>
                <div @click="menuClose" v-if="isMenuShowed">
                    <tab-icon alt="关闭"/>
                </div>
                <div @click="commitBack" v-if="isInMobileMode && $route.name !== 'List'">
                    <tab-icon alt="返回"/>
                </div>
                <div v-show="!isMenuShowed" v-if="!isInMobileMode" @click="toggleHideContent">
                    <tab-icon v-if="isHideContent" alt="内容隐藏"/>
                    <tab-icon v-else alt="内容显示"/>
                </div>
                <div v-show="!isMenuShowed" v-if="!isInMobileMode" @click="toggleSearchbar">
                    <tab-icon alt="搜索"/>
                </div>
                <div v-show="!isMenuShowed"  v-if="!isInMobileMode" @click="toggleListStyle">
                    <tab-icon v-if="!isDiaryListShowedInFullStyle" alt="列表简洁"/>
                    <tab-icon v-else alt="列表详情"/>
                </div>
                <div v-show="!isMenuShowed" v-if="!isInMobileMode" @click="routeToCard">
                    <tab-icon alt="银行卡"/>
                </div>
                <div v-show="!isMenuShowed" v-if="!isInMobileMode" @click="routeToBill">
                    <tab-icon alt="账单"/>
                </div>
                <div class="btn-text-group" v-show="!isMenuShowed"  v-if="!isInMobileMode && dateFilter">
                    <div class="btn-text" @click="clearDateFilter">{{ dateFilter }}</div>
                </div>
                <NavbarCategorySelector v-if="!isMenuShowed" class="ml-5"/>

            </div>

            <div class="nav-part-right">
                <!--CLOCK-->
                <div class="clock pr-6" v-if="!isInMobileMode">
                    <Clock/>
                </div>

                <!--DETAIL-->
                <div class="nav-btn-wrapper" v-if="$route.name === 'Detail' && currentDiary">
                    <div
                        v-if="currentDiary && currentDiary.is_public === 1"
                        class="clipboard-trigger"
                        @click="copySharePath"
                        :data-clipboard="shareUrl">
                        <tab-icon alt="分享"/>
                    </div>
                    <div @click="toastShow">
                        <tab-icon alt="删除"/>
                    </div>
                    <router-link :to="`/edit/${currentDiary.id}`">
                        <tab-icon alt="编辑"/>
                    </router-link>
                </div>

                <!--EDIT-->
                <div class="nav-btn-wrapper" v-if="$route.name === 'Edit' || $route.name ==='EditNew'">
                    <div @click="diaryRecover" v-if="isDiaryEditorContentHasChanged">
                        <tab-icon alt="恢复"/>
                    </div>
                    <div v-if="isSavingDiary">
                        <Loading :height="50" :loading="true"/>
                    </div>
                    <div @click="diarySave" v-else>
                        <tab-icon alt="保存"/>
                    </div>
                </div>

                <router-link
                    v-if="(isInMobileMode && $route.name !== 'Detail' && !isMenuShowed) || !isInMobileMode"
                    to="/edit"
                >
                    <tab-icon alt="添加"/>
                </router-link>
            </div>


            <!--LOGO-->
            <div class="brand" v-if="isInMobileMode" @click="toggleListStyle">
                <img :src="editLogoImg" v-if="$route.name === 'Edit' || $route.name === 'EditNew'" alt="LOGO">
                <a v-else-if="isDiaryListShowedInFullStyle"><img :src="icons.logo_content" alt="日记"></a>
                <a v-else><img :src="icons.logo" alt="日记"></a>
            </div>
            <div class="brand" v-else>
                <img :src="editLogoImg" v-if="$route.name === 'Edit' || $route.name === 'EditNew'" alt="LOGO">
                <a v-else><img :src="icons.logo" alt="日记"></a>
            </div>

            <!--RIGHT part-->



            <!-- MENU -->
            <nav-menu/>

        </nav>

        <!--TOAST-->
        <div id="toast" class="fadeIn animated-fast" v-show="isToastShowed">
            <div class="toast">
                <div class="toast-header">确定删除吗</div>
                <div class="toast-body"></div>
                <div class="toast-footer">
                    <div class="btn-cancel" @click="toastHide">取消</div>
                    <div class="btn-confirm" @click="diaryDelete">确定</div>
                </div>
            </div>
            <div class="mask"></div>
        </div>
    </div>

</template>

<script>
import utility from "../../utility"
import ClipboardJS from "clipboard"
import {mapState, mapMutations, mapGetters} from 'vuex'
import YearSelector from "../../page/menu/YearSelector/YearSelector"
import TabIcon from "../../components/TabIcon"
import About from "../../page/about/About"
import MenuCategorySelector from "../../page/menu/MenuCategorySelector";
import Loading from "../../components/Loading";
import diaryApi from "../../api/diaryApi";
import NavMenu from "../../page/menu/NavMenu";
import ICONS from "../../assets/img/SvgIcons";
import Clock from "./Clock";
import NavbarCategorySelector from "@/framework/NavbarCategorySelector.vue";


export default {
    name: "Navbar",
    components: {NavbarCategorySelector, Clock, NavMenu, Loading, MenuCategorySelector, About, TabIcon, YearSelector},
    data() {
        return {
            location: {}, // clipboard 使用
            icons: ICONS,
            clipboard: null,

            // toast
            isToastShowed: false,
        }
    },
    mounted() {
        this.location = window.location

        // 绑定剪贴板操作方法
        this.clipboard = new ClipboardJS('.clipboard-trigger', {
            text: trigger => {
                return trigger.getAttribute('data-clipboard')
            },
        })
        this.clipboard.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
            utility.popMessage('success', '分享链接 已复制到 剪贴板', null, 2)
        })
    },
    unmounted() {
        this.clipboard.destroy()
    },
    computed: {
        ...mapState([
            'dateFilter',
            'isMenuShowed', // 菜单是否显示
            'isSavingDiary',
            'isDiaryEditorContentHasChanged',
            'currentDiary',
            'isDiaryListShowedInFullStyle',
            'insets',
            'categoryAll',
            'filteredCategories',
            'isShowSearchBar',
            'isHideContent',
            'editLogoImg',
            'isFilterShared'
        ]),
        ...mapGetters(['isInMobileMode']),
        shareUrl(){
            return `${location.origin}/diary/#/share/${this.currentDiary.id}`
        },
    },
    methods: {
        ...mapMutations([
            'SET_IS_DIARY_LIST_SHOWED_IN_FULL_STYLE',
            'SET_IS_SHOW_SEARCH_BAR',
            'SET_IS_HIDE_CONTENT',
            'SET_IS_DIARY_NEED_TO_BE_SAVED',
            'SET_IS_DIARY_NEED_TO_BE_RECOVERED',
            'SET_LIST_OPERATION',
            'SET_FILTERED_CATEGORIES',
            'SET_IS_LIST_NEED_BE_RELOAD',
            'SET_MENU_SHOWED',
            'SET_IS_FILTER_SHARED',
            'SET_DATE_FILTER'
        ]),
        commitBack(){
            switch (this.$route.name){
                case 'Edit':
                case 'Detail':
                    this.$router.push({name: 'List'});
                    break
                default:
                    this.$router.push({name: 'List'})
            }
        },
        clearDateFilter(){
            this.SET_DATE_FILTER('')
            this.SET_IS_LIST_NEED_BE_RELOAD(true)
        },
        routeToBill(){
            this.$router.push({
                name: 'Bill'
            })
        },
        routeToCard(){
            this.$router.push({
                name: 'BankCard'
            })
        },

        // 菜单操作
        menuShow() {
            this.SET_MENU_SHOWED(true)
        },
        menuClose() {
            this.SET_MENU_SHOWED(false)
        },
        toggleListStyle() {
            if (!this.isMenuShowed) {
                this.SET_IS_DIARY_LIST_SHOWED_IN_FULL_STYLE(!this.isDiaryListShowedInFullStyle)
            }
        },

        // SEARCH BAR
        toggleSearchbar() {
            this.SET_IS_SHOW_SEARCH_BAR(!this.isShowSearchBar)
        },

        // show bill
        showBillPanel(){

        },

        // show card
        showCardPanel(){},

        // HIDE CONTENT
        toggleHideContent() {
            this.SET_IS_HIDE_CONTENT(!this.isHideContent)
        },
        diarySave() {
            this.SET_IS_DIARY_NEED_TO_BE_SAVED(true)
        },
        diaryRecover() {
            this.SET_IS_DIARY_NEED_TO_BE_RECOVERED(true)
        },

        // 分享
        copySharePath() {
        },

        /* DELETE */
        diaryDelete() {
            let that = this
            let requestData = {
                diaryId: this.currentDiary.id,
            }
            diaryApi
                .delete(requestData)
                .then(res => {
                    that.toastHide()
                    utility.popMessage('success', res.message, () => {
                        this.SET_LIST_OPERATION({type: 'delete', dairy: null, id: this.currentDiary.id})
                    }, 1) // 删除成功后等待时间不要太长
                })
        },
        toastHide() {
            this.isToastShowed = false
        },
        toastShow() {
            this.isToastShowed = true
        },

    }
}
</script>

<style lang="scss" scoped>
@import "navbar";
</style>
