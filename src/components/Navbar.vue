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
            <div class="menu-panel" id="menu-panel" v-show="menuShowed" :style="'height:' + insets.heightPanel + 'px'">
                <div class="menu-list" v-show="menuListShowed" :style="'min-height:' + insets.heightPanel + 'px'">
                    <div class="menu-list-group">
                        <div class="menu-list-group-item" v-if="isInMobileMode" @click="menuListClicked('search')">搜索</div>
                        <div class="menu-list-group-item" @click="menuListClicked('category')">
                            <div>类别</div>
                            <div class="category-indicator">
                                <div :class="['item', 'category-shared', 'mr-2', {active: isFilterShared}]"></div> <!-- 共享小图标标识 -->
                                <div :class="['item', 'category-' + item.nameEn ,{active: filteredCategories.some(category => category ===item.nameEn)}]"
                                     v-for="(item, index) in categoryAll"
                                     :title="item.nameEn"
                                     :key="index"></div>
                            </div>
                        </div>
                        <div class="menu-list-group-item" @click="menuListClicked('year')">
                            <div>年份</div>
                            <div class="addon">{{ dateFilter }}</div>
                        </div>
                        <div class="menu-list-group-item" @click="menuListClicked('about')">关于</div>
                        <router-link class="menu-list-group-item" to="/change-password">修改密码</router-link>
                        <div class="menu-list-group-item" @click="logout">退出</div>
                    </div>
                    <div class="user-info-panel">
                        <div class="user-info">
                            <div class="user">
                                <p class="username">{{ userInfo.username }}</p>
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
                <menu-category-selector v-show="categoryShowed"/>

                <!-- year selector -->
                <year-selector v-show="yearShowed"/>

                <!--about-->
                <about v-show="aboutShowed"/>
            </div>
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

export default {
    name: "Navbar",
    components: {Loading, MenuCategorySelector, About, TabIcon, YearSelector},
    data() {
        return {
            location: {}, // clipboard 使用

            showLongList: false,
            // menu
            menuShowed: false,            // menu panel
            menuListShowed: true,         // menu list
            categoryShowed: false,        // category
            yearShowed: false,            // year chooser
            aboutShowed: false,           // about

            // menu - category
            userInfo: utility.getAuthorization(),
            categoriesSet: new Set(),
            originCategories: [],
            originFilterShared: false,

            // toast
            toastIsShowed: false,
        }
    },
    mounted() {
        this.location = window.location
        this.categoriesSet = new Set(this.filteredCategories)
    },
    computed: {
        ...mapState([
            'isSavingDiary',
            'filteredCategories',
            'categoryAll',
            'diaryEditorContentHasChanged',
            'currentDiary',
            'diaryListShowedInFullStyle',
            'insets',
            'isShowSearchBar',
            'isHideContent',
            'isFilterShared',
            'editLogoImg',
            'statisticsCategory',
            'statisticsYear',
            'dateFilter',
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
            'SET_LIST_NEED_BE_RELOAD',
        ]),
        toggleListStyle() {
            if (!this.menuShowed) {
                this.SET_DIARYLIST_SHOWED_INFULL_STYLE(!this.diaryListShowedInFullStyle)
            }
        },
        /* MENU */
        menuShow() {
            this.menuShowed = true            // menu panel
            this.menuListShowed = true            // menu list
            this.categoryShowed = false           // category
            this.yearShowed = false           // year
            this.aboutShowed = false           // about
        },
        menuClose() {
            if (this.categoryShowed) {
                this.SET_LIST_NEED_BE_RELOAD(true)
                this.menuInit()
            } else if (this.aboutShowed) {
                this.menuShowed = true            // menu panel
                this.menuListShowed = true            // menu list
                this.categoryShowed = false           // category
                this.yearShowed = false           // year
                this.aboutShowed = false           // about
            } else if (this.yearShowed) {
                this.SET_LIST_NEED_BE_RELOAD(true)
                this.menuInit()
            } else if (this.menuShowed) {
                this.menuInit()
            }
        },
        menuInit() {
            this.menuShowed = false            // menu panel
            this.menuListShowed = true             // menu list
            this.categoryShowed = false            // category
            this.yearShowed = false           // year
            this.aboutShowed = false            // about
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
                    this.menuShowed = true             // menu panel
                    this.menuListShowed = false            // menu list
                    this.categoryShowed = true             // category
                    this.yearShowed = false            // year
                    this.aboutShowed = false            // about
                    break
                case 'year':
                    this.menuShowed = true             // menu panel
                    this.menuListShowed = false            // menu list
                    this.categoryShowed = false            // category
                    this.yearShowed = true             // year
                    this.aboutShowed = false            // about
                    break
                case 'about':
                    this.menuShowed = true             // menu panel
                    this.menuListShowed = false            // menu list
                    this.categoryShowed = false            // category
                    this.yearShowed = false            // year
                    this.aboutShowed = true             // about
                    break
                default:
                    break
            }
        },

        /* SEARCH */
        showSearchbar() {
            this.SET_IS_SHOW_SEARCH_BAR(true)
        },

        /* HIDE CONTENT */
        toggleHideContent() {
            this.SET_IS_HIDE_CONTENT(!this.isHideContent)
        },

        diarySave() {
            this.SET_DIARY_NEED_TO_BE_SAVED(true)
        },
        diaryRecover() {
            this.SET_DIARY_NEED_TO_BE_RECOVERED(true)
        },

        /* SHARE */
        copySharePath() {
            let clipboard = new Clipboard('#shareBtn')
            clipboard.on('success', function (e) {
                this.$popMessage('success', '分享链接 已复制到 剪贴板', null, 2)
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
        logout() {
            utility.deleteAuthorization()
            this.$router.push('/login')
        },
    }
}
</script>
