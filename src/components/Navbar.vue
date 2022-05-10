<template>
    <div class="navbar-container">
        <!-- NAVBAR -->
        <nav class="navbar" id="navbar">
            <div class="navbar-btn-group left">
                <div @click="menuShow"
                     v-if="(!isInMobileMode && !menuShowed)
                     || isInMobileMode && $route.name === 'list' && !menuShowed">
                    <tab-icon alt="菜单"></tab-icon>
                </div>
                <div @click="menuClose" v-if="menuShowed">
                    <tab-icon alt="关闭"></tab-icon>
                </div>
                <div @click="$router.back()" v-if="isInMobileMode && $route.name !== 'list'">
                    <tab-icon alt="返回"></tab-icon>
                </div>
                <div v-show="!menuShowed" v-if="!isInMobileMode" @click="toggleHideContent">
                    <tab-icon v-if="isHideContent" alt="内容隐藏"></tab-icon>
                    <tab-icon v-else alt="内容显示"></tab-icon>
                </div>
                <div v-show="!isShowSearchBar && !menuShowed" v-if="!isInMobileMode" @click="showSearchbar">
                    <tab-icon alt="搜索"></tab-icon>
                </div>
            </div>

            <!--RIGHT part-->
            <!--NEW-->
            <div class="navbar-btn-group right" v-if="(isInMobileMode && $route.name !== 'detail') || !isInMobileMode">
                <router-link to="/edit">
                    <tab-icon alt="添加"></tab-icon>
                </router-link>
            </div>

            <!--EDIT-->
            <div class="navbar-btn-group right" v-if="$route.name === 'edit' || $route.name ==='editNew'">
                <div @click="diaryRecover" v-if="diaryEditorContentHasChanged">
                    <tab-icon alt="恢复"></tab-icon>
                </div>
                <div v-if="isSavingDiary">
                    <Loading :height="50" :loading="true"/>
                </div>
                <div @click="diarySave" v-else>
                    <tab-icon alt="保存"></tab-icon>
                </div>
            </div>

            <!--DETAIL-->
            <div class="navbar-btn-group right" v-if="$route.name === 'detail' && currentDiary">
                <div
                    v-if="currentDiary && currentDiary.is_public === 1"
                    id="shareBtn"
                    @click="copySharePath"
                    :data-clipboard-text="`${location.origin}/diary/#/share/${currentDiary.id}`">
                    <tab-icon alt="分享"></tab-icon>
                </div>
                <div @click="toastShow">
                    <tab-icon alt="删除"></tab-icon>
                </div>
                <router-link :to="`/edit/${currentDiary.id}`">
                    <tab-icon alt="编辑"></tab-icon>
                </router-link>
            </div>

            <div class="brand">
                <img :src="editLogoImg" v-if="$route.name === 'edit' || $route.name === 'editNew'" alt="LOGO">
                <a @click="toggleListStyle" v-else>
                    <img v-if="!diaryListShowedInFullStyle" :src="$icons.logo" alt="日记">
                    <img v-else :src="$icons.logo_content" alt="日记">
                </a>
            </div>

            <!-- MENU -->
            <nav-menu/>

        </nav>

        <!--TOAST-->
        <div id="toast" class="fadeIn animated-fast" v-show="toastIsShowed">
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
import Clipboard from "clipboard"
import {mapState, mapMutations, mapGetters} from 'vuex'
import YearSelector from "@/components/YearSelector"
import TabIcon from "@/components/TabIcon"
import About from "@/page/About"
import MenuCategorySelector from "@/page/menu/MenuCategorySelector";
import Loading from "@/components/Loading";
import diaryApi from "@/api/diaryApi";
import NavMenu from "@/components/NavMenu";

export default {
    name: "Navbar",
    components: {NavMenu, Loading, MenuCategorySelector, About, TabIcon, YearSelector},
    data() {
        return {
            location: {}, // clipboard 使用

            showLongList: false,

            // toast
            toastIsShowed: false,
        }
    },
    mounted() {
        this.location = window.location
    },
    computed: {
        ...mapState([
            'menuShowed', // 菜单是否显示
            'isSavingDiary',
            'diaryEditorContentHasChanged',
            'currentDiary',
            'diaryListShowedInFullStyle',
            'insets',
            'isShowSearchBar',
            'isHideContent',
            'editLogoImg'
        ]),
        ...mapGetters(['isInMobileMode'])
    },
    watch: {
        keywords(newValue) {
            if (newValue) {
                this.$nextTick(() => {
                    document.querySelector('#keyword').focus()
                })
            }
        }
    },
    methods: {
        ...mapMutations([
            'SET_DIARYLIST_SHOWED_INFULL_STYLE',
            'SET_IS_SHOW_SEARCH_BAR',
            'SET_IS_HIDE_CONTENT',
            'SET_DIARY_NEED_TO_BE_SAVED',
            'SET_DIARY_NEED_TO_BE_RECOVERED',
            'SET_LIST_OPERATION',
            'SET_MENU_SHOWED'
        ]),

        // 菜单操作
        menuShow() {
            this.SET_MENU_SHOWED(true)
        },
        menuClose() {
            this.SET_MENU_SHOWED(false)
        },
        toggleListStyle() {
            if (!this.menuShowed) {
                this.SET_DIARYLIST_SHOWED_INFULL_STYLE(!this.diaryListShowedInFullStyle)
            }
        },

        // SEARCH BAR
        showSearchbar() {
            this.SET_IS_SHOW_SEARCH_BAR(true)
        },

        // HIDE CONTENT
        toggleHideContent() {
            this.SET_IS_HIDE_CONTENT(!this.isHideContent)
        },
        diarySave() {
            this.SET_DIARY_NEED_TO_BE_SAVED(true)
        },
        diaryRecover() {
            this.SET_DIARY_NEED_TO_BE_RECOVERED(true)
        },

        // 分享
        copySharePath() {
            let clipboard = new Clipboard('#shareBtn')
            let that = this
            clipboard.on('success', function (e) {
                that.$popMessage('success', '分享链接 已复制到 剪贴板', null, 2)
                e.clearSelection()
            })
            clipboard.on('error', function () {
            })
        },

        /* DELETE */
        diaryDelete() {
            let that = this
            let requestData = {
                diaryId: this.currentDiary.id,
            }
            diaryApi.delete(requestData)
                .then(res => {
                    that.toastHide()
                    this.$popMessage('success', res.message, () => {
                        this.SET_LIST_OPERATION({type: 'delete', dairy: null, id: this.currentDiary.id})
                    }, 1) // 删除成功后等待时间不要太长
                })
        },
        toastHide() {
            this.toastIsShowed = false
        },
        toastShow() {
            this.toastIsShowed = true
        },

    }
}
</script>
