<template>
    <div class="navbar-container">
        <!-- NAVBAR -->
        <nav class="navbar" id="navbar">
            <div class="navbar-btn-group left">
                <div @click="menuShow" v-if="!menuShowed"><tab-icon alt="菜单"></tab-icon></div>
                <div @click="menuClose" v-else><tab-icon alt="关闭"></tab-icon></div>
                <div v-show="!searchBarShowed && !menuShowed" @click="showSearchbar"><tab-icon alt="搜索" @click=""></tab-icon></div>
            </div>

            <!--RIGHT part-->
            <!--NEW-->
            <div class="navbar-btn-group right">
                <router-link to="/edit"><tab-icon alt="添加"></tab-icon></router-link>
            </div>

            <!--EDIT-->
            <div class="navbar-btn-group right" v-if="$route.name === 'edit' || $route.name ==='editNew'">
                <div @click="diaryRecover" v-if="diaryEditorContentHasChanged"><tab-icon alt="恢复"></tab-icon></div>
                <div @click="diarySave"><tab-icon alt="保存"></tab-icon></div>
            </div>

            <!--DETAIL-->
            <div class="navbar-btn-group right" v-if="$route.name === 'detail' && currentDiary">
                <div
                    v-if="currentDiary && currentDiary.is_public === '1'"
                    id="shareBtn"
                    @click="copySharePath"
                    :data-clipboard-text="`${location.origin}/${diaryPath}/#/share/${currentDiary.id}`"><tab-icon alt="分享"></tab-icon></div>
                <div @click="toastShow"><tab-icon alt="删除"></tab-icon></div>
                <router-link :to="`/edit/${currentDiary.id}`">
                    <tab-icon alt="编辑"></tab-icon>
                </router-link>
            </div>


            <div class="brand">
                <a @click="toggleListStyle" v-if="$route.name !== 'edit'">
                    <img v-if="!diaryListShowedInFullStyle" src="img/logo.svg" alt="日记">
                    <img v-else src="img/logo_content.svg" alt="日记">
                </a>
                <img v-else :src="editLogoImg" alt="LOGO">
            </div>


            <!-- MENU -->
            <div class="menu-panel" id="menu-panel" v-show="menuShowed" :style="'height:' + heightPanel + 'px'">
                <div class="menu-list" v-show="menuListShowed">
                    <div class="menu-list-group">
                        <div class="menu-list-group-item" @click="menuListClicked('category')">
                            <div>类别</div>
                            <div class="category-indicator">
                                <div class="item category-life" v-if="filterShared"></div> <!-- 共享小图标标识 -->
                                <div :class="['item', 'category-' + item.nameEn ,{active: categoriesSet.has(item.nameEn)}]"
                                     v-for="(item, index) in categoriesAll"
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
                    <div class="user-info">
                        <p class="username">{{ userInfo.username }}</p>
                        <p class="email">{{ userInfo.email }}</p>
                        <p class="email">•</p>
                        <div v-if="statisticsCategory.shared > 0" class="statistics">
                            <p>共有日记 {{ statisticsCategory.amount }} 篇</p>
                            <p>共享 {{ statisticsCategory.shared }} 篇</p>
                        </div>
                    </div>
                </div>

                <!--category-->
                <div class="menu-category" v-show="categoryShowed">
                    <ul class="menu-category-list">
                        <li class="menu-category-item" v-for="(item, index) in categoriesAll" :key="index">
                            <input v-model="categories" class="hidden" type="checkbox" :id="'category-' + item.nameEn" :value="item.nameEn">
                            <label :class="'menu-category-' + item.nameEn" :for="'category-' + item.nameEn">
                                {{ item.name }}
                                <span class="count">{{ statisticsCategory[item.nameEn] }}</span>
                            </label>
                        </li>
                    </ul>

                    <div class="menu-category-list category-operations">
                        <div class="menu-category-item">
                            <input :checked="isNotAllSelected" @click="toggleCategorySelect" class="hidden" type="checkbox" id="categoryAll">
                            <label for="categoryAll" class="menu-category-study">全选</label>
                        </div>
                        <div class="menu-category-item">
                            <input :checked="!isNotAllSelected" @click="toggleCategorySelect" class="hidden" type="checkbox" id="categoryNone">
                            <label for="categoryAll" class="menu-category-life">取消全选</label>
                        </div>
                        <div class="menu-category-item">
                            <input checked @click="reverseCategorySelect" class="hidden" type="checkbox" id="categoryReverse">
                            <label for="categoryReverse" class="menu-category-week">反选</label>
                        </div>
                        <div class="menu-category-item">
                            <input checked v-model="filterShared" class="hidden" type="checkbox" id="share">
                            <label for="share" class="menu-category-grass">共享日记</label>
                        </div>
                    </div>
                </div>

                <!-- year selector -->
                <year-selector
                    :style="`height: ${heightPanel}px`"
                    v-show="yearShowed"></year-selector>

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
import {mapState, mapMutations} from 'vuex'
import YearSelector from "@/components/YearSelector"
import TabIcon from "@/components/TabIcon"
import About from "@/page/About";

export default {
    name: "navbar",
    components: {About, TabIcon, YearSelector},
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
            categories: [],
            categoriesSet: new Set(),
            originCategories: [],
            categoriesAll: utility.CATEGORIES_ALL_NAME,
            filterShared: false, // 是否筛选已共享的日记
            originFilterShared: false,

            // toast
            toastIsShowed: false,

            // edit
            logoImageUrl: 'img/logo.svg',

            // path
            diaryPath: utility.global.diaryPath
        }
    },
    mounted() {
        this.location = window.location
        this.categories = this.categoriesFilterInfo.categories
        this.categoriesSet = new Set(this.categoriesFilterInfo.categories)
        this.filterShared = this.categoriesFilterInfo.filterShared
    },
    computed: {
        isNotAllSelected() {
            return !this.categories.length
        },
        ...mapState([
            'categoriesFilterInfo',
            'diaryEditorContentHasChanged',
            'currentDiary',
            'diaryListShowedInFullStyle',
            'heightPanel',
            'editLogoImg',
            'statisticsCategory',
            'statisticsYear',
            'dateFilter',
            'searchBarShowed'
        ])
    },
    watch: {
        categories() {
            this.categoriesSet = new Set(this.categories)
        },
        searchBarShowed(newValue){
            if(newValue){
                this.$nextTick(() => {
                    document.querySelector('#keyword').focus()
                })
            }
        }
    },
    methods: {
        ...mapMutations([
            'setDiaryListShowedInFullStyle',
            'setCategoriesFilterInfo',
            'setSearchBarState',
            'setDiaryNeedToBeSaved',
            'setDiaryNeedToBeRecovered',
            'setListOperation',
            'setListNeedBeReload',
        ]),
        toggleListStyle() {
            if (!this.menuShowed) {
                this.setDiaryListShowedInFullStyle(!this.diaryListShowedInFullStyle)
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
                this.setCategoriesFilterInfo({
                    categories: this.categories,
                    filterShared: this.filterShared
                })
                this.menuInit()
            } else if (this.aboutShowed) {
                this.menuShowed = true            // menu panel
                this.menuListShowed = true            // menu list
                this.categoryShowed = false           // category
                this.yearShowed = false           // year
                this.aboutShowed = false           // about
            } else if (this.yearShowed) {
                this.setListNeedBeReload(true)
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
                case 'category':
                    this.menuShowed = true             // menu panel
                    this.menuListShowed = false            // menu list
                    this.categoryShowed = true             // category
                    this.yearShowed = false            // year
                    this.aboutShowed = false            // about
                    Object.assign(this.originCategories, this.categories)
                    this.originFilterShared = this.filterShared
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
        toggleCategorySelect() {
            this.categories = this.categories.length ? [] : utility.CATEGORIES_ALL
        },
        reverseCategorySelect() {
            let tempCategories = [].concat(utility.CATEGORIES_ALL)
            this.categories.forEach(item => {
                tempCategories.splice(tempCategories.indexOf(item), 1)
            })
            this.categories = tempCategories
        },

        /* SEARCH */
        showSearchbar() {
            this.setSearchBarState(true)
        },

        /* EDIT */
        updateDiaryIcon() {
            if (this.diaryHasChanged) {
                this.logoImageUrl = this.contentEditorShowed ? 'img/logo_content.svg' : 'img/logo_title.svg'
            } else {
                this.logoImageUrl = this.contentEditorShowed ? 'img/logo_content_saved.svg' : 'img/logo_title_saved.svg'
            }
        },
        diarySave() {
            this.setDiaryNeedToBeSaved(true)
        },
        diaryRecover() {
            this.setDiaryNeedToBeRecovered(true)
        },

        /* SHARE */
        copySharePath() {
            let clipboard = new Clipboard('#shareBtn')
            clipboard.on('success', function (e) {
                utility.popMessage(utility.POP_MSG_TYPE.success, '分享链接 已复制到 剪贴板', null, 2)
                e.clearSelection()
            })
            clipboard.on('error', function () {
            })
        },

        /* DELETE */
        diaryDelete() {
            let that = this
            let queryData = {
                diaryId: this.currentDiary.id,
                type: 'delete'
            }
            utility.postData(utility.URL.diaryOperation, queryData)
                .then(res => {
                    that.toastHide()
                    utility.popMessage(utility.POP_MSG_TYPE.success, res.info, () => {
                        this.setListOperation({type: 'delete', dairy: null, id: this.currentDiary.id})
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
