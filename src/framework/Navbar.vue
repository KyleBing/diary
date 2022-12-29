<template>
    <div class="navbar-container">
        <!-- NAVBAR -->
        <nav class="navbar" id="navbar">
            <div class="navbar-btn-group float-left">
                <div @click="menuShow"
                     v-if="(!isInMobileMode && !isMenuShowed)
                     || isInMobileMode && $route.name === 'list' && !isMenuShowed">
                    <tab-icon alt="菜单"/>
                </div>
                <div @click="menuClose" v-if="isMenuShowed">
                    <tab-icon alt="关闭"/>
                </div>
                <div @click="commitBack" v-if="isInMobileMode && $route.name !== 'list'">
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

                <div class="btn-text-group">
                    <div  :class="['btn-text', 'ml-5', {active: isInBillMode}]" v-show="!isMenuShowed" v-if="!isInMobileMode"
                         @click="switchToCategory('bill')">账单</div>
                    <div :class="['btn-text', {active: isInPlayMode}]" v-show="!isMenuShowed" v-if="!isInMobileMode"
                         @click="switchToCategory('play')">剧本</div>
                    <div :class="['btn-text', {active: isInWorkMode}]" v-show="!isMenuShowed" v-if="!isInMobileMode"
                         @click="switchToCategory('work')">工作</div>
                    <div :class="['btn-text', {active: isInMemoMode}]" v-show="!isMenuShowed" v-if="!isInMobileMode"
                         @click="switchToCategory('memo')">备忘</div>
                    <div class="btn-text" v-show="!isMenuShowed" v-if="!isInMobileMode"
                         @click="switchToCategory('other')">其它</div>
                    <div :class="['btn-text', {active: isAllCategorySelected && !isFilterShared}]"  v-show="!isMenuShowed" v-if="!isInMobileMode"
                         @click="switchToCategory('all')">全部</div>
                    <div :class="['btn-text', {active: isFilterShared}]" v-show="!isMenuShowed"  v-if="!isInMobileMode"
                         @click="switchToCategory('shared')">共享</div>
                </div>

                <div class="btn-text-group" v-show="!isMenuShowed"  v-if="!isInMobileMode && dateFilter">
                    <div class="btn-text" @click="clearDateFilter">{{ dateFilter }}</div>
                </div>
            </div>

            <!--RIGHT part-->
            <!--NEW-->
            <div class="navbar-btn-group float-right"
                 v-if="(isInMobileMode && $route.name !== 'detail' && !isMenuShowed) || !isInMobileMode">
                <router-link to="/edit">
                    <tab-icon alt="添加"/>
                </router-link>
            </div>

            <!--EDIT-->
            <div class="navbar-btn-group float-right" v-if="$route.name === 'edit' || $route.name ==='editNew'">
                <div @click="diaryRecover" v-if="isDiaryEditorContentHasChanged">
                    <tab-icon alt="恢复"/>
                </div>
                <div v-if="isSavingDiary">
                    <Loading :height="50" :loading="true"/>
                </div>
                <div @click="diarySave" v-else-if="isDiaryEditorContentHasChanged">
                    <tab-icon alt="保存"/>
                </div>
            </div>

            <!--DETAIL-->
            <div class="navbar-btn-group float-right" v-if="$route.name === 'detail' && currentDiary">
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

            <div class="brand" v-if="isInMobileMode" @click="toggleListStyle">
                <img :src="editLogoImg" v-if="$route.name === 'edit' || $route.name === 'editNew'" alt="LOGO">
                <a v-else-if="isDiaryListShowedInFullStyle"><img :src="icons.logo_content" alt="日记"></a>
                <a v-else><img :src="icons.logo" alt="日记"></a>
            </div>
            <div class="brand" v-else>
                <img :src="editLogoImg" v-if="$route.name === 'edit' || $route.name === 'editNew'" alt="LOGO">
                <a v-else><img :src="icons.logo" alt="日记"></a>
            </div>

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
import utility from "@/utility"
import ClipboardJS from "clipboard"
import {mapState, mapMutations, mapGetters} from 'vuex'
import YearSelector from "@/page/menu/YearSelector"
import TabIcon from "@/components/TabIcon"
import About from "@/page/about/About"
import MenuCategorySelector from "@/page/menu/MenuCategorySelector";
import Loading from "@/components/Loading";
import diaryApi from "@/api/diaryApi";
import NavMenu from "@/page/menu/NavMenu";
import ICONS from "@/assets/img/SvgIcons";


export default {
    name: "Navbar",
    components: {NavMenu, Loading, MenuCategorySelector, About, TabIcon, YearSelector},
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
        isAllCategorySelected(){
            return this.filteredCategories.length === this.categoryAll.length
        },
        isInBillMode(){
            return this.filteredCategories.length === 1 && this.filteredCategories[0] === 'bill'
        },
        isInMemoMode(){
            return this.filteredCategories.length === 1 && this.filteredCategories[0] === 'memo'
        },
        isInPlayMode(){
            return this.filteredCategories.length === 1 && this.filteredCategories[0] === 'play'
        },
        isInWorkMode(){
            return this.filteredCategories.length === 2
                && this.filteredCategories.some(item => item === 'work')
                && this.filteredCategories.some(item => item === 'week')
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
                case 'detail': this.$router.push({name: 'list'});break
                default: this.$router.back()
            }
        },
        clearDateFilter(){
            this.SET_DATE_FILTER('')
            this.SET_IS_LIST_NEED_BE_RELOAD(true)
        },
        routeToBill(){
            this.$router.push({
                name: 'bill'
            })
        },
        routeToCard(){
            this.$router.push({
                name: 'card'
            })
        },
        switchToCategory(mode){
            switch (mode){
                case 'bill':
                    this.SET_IS_FILTER_SHARED(false)
                    this.SET_FILTERED_CATEGORIES(['bill'])
                    break;
                case 'play':
                    this.SET_IS_FILTER_SHARED(false)
                    this.SET_FILTERED_CATEGORIES(['play'])
                    break;
                case 'work':
                    this.SET_IS_FILTER_SHARED(false)
                    this.SET_FILTERED_CATEGORIES(['work', 'week'])
                    break;
                case 'memo':
                    this.SET_IS_FILTER_SHARED(false)
                    this.SET_FILTERED_CATEGORIES(['memo'])
                    break;
                case 'other':
                    this.SET_IS_FILTER_SHARED(false)
                    const otherArray = this.categoryAll
                        .filter(item => !/work|week|bill|memo/i.test(item.name_en))
                        .map(item => item.name_en)
                    this.SET_FILTERED_CATEGORIES(otherArray)
                    break;
                case 'all':
                    this.SET_IS_FILTER_SHARED(false)
                    const allArray = this.categoryAll
                        .map(item => item.name_en)
                    this.SET_FILTERED_CATEGORIES(allArray)
                    break;
                case 'shared':
                    const all = this.categoryAll
                        .map(item => item.name_en)
                    this.SET_FILTERED_CATEGORIES(all)
                    this.SET_IS_FILTER_SHARED(true)
                    break;
            }
            this.SET_IS_LIST_NEED_BE_RELOAD(true)
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
