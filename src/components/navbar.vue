<template>
   <div class="navbar-container">
      <!-- NAVBAR -->
      <nav class="navbar" id="navbar">
         <div class="navbar-btn-group left">
            <img alt="菜单" @click="menuShow" src="img/tabicon/menu.svg" v-if="!menuShowed">
            <img alt="关闭" @click="menuClose" src="img/tabicon/close.svg" v-else>
         </div>

         <!--RIGHT part-->
         <!--EMPTY-->
         <div class="navbar-btn-group right">
            <router-link to="/edit"><img alt="添加" src="img/tabicon/add.svg"></router-link>
         </div>

         <!--EDIT-->
         <div class="navbar-btn-group right" v-if="$route.name === 'edit'">
            <img @click="diarySave" alt="保存" src="img/tabicon/done.svg">
         </div>


         <!--DETAIL-->
         <div class="navbar-btn-group right" v-if="$route.name === 'detail'">
            <img
               id="shareBtn"
               alt="分享链接"
               @click="copySharePath"
               src="img/tabicon/share.svg"
               :data-clipboard-text="`${location.origin}/diary/#/share/id=${diaryId}`">
            <img alt="删除" @click="" src="img/tabicon/delete.svg"/>
            <router-link :to="'/edit/' + diaryId"><img alt="编辑" src="img/tabicon/edit.svg"></router-link>
         </div>


         <div class="brand">
            <a @click="">
               <img v-if="!showLongList" src="img/logo.svg" alt="日记">
               <img v-else src="img/logo_content.svg" alt="日记">
            </a>
         </div>


         <!-- MENU -->
         <div class="menu-panel" id="menu-panel" v-show="menuShowed" :style="'min-height:' + heightBg + 'px'">
            <div class="menu-list" v-show="menuListShowed">
               <div class="menu-list-group">
                  <a class="menu-list-group-item" @click="menuListClicked('search')">搜索</a>
                  <a class="menu-list-group-item" @click="menuListClicked('category')">类别</a>
                  <a class="menu-list-group-item" @click="menuListClicked('about')">关于</a>
                  <router-link class="menu-list-group-item" to="/change-password">修改密码</router-link>
                  <a class="menu-list-group-item" @click="logout">退出</a>
               </div>
               <div class="user-info">
                  <span class="username">{{ userInfo.username }}</span>
                  <span class="email">{{ userInfo.email }}</span>
               </div>
            </div>

            <!--category-->
            <ul class="menu-category" v-show="categoryShowed" :style="'min-height:' + heightBg + 'px'">
               <li class="menu-category-item" v-for="(item, index) in categoriesAll" :key="index">
                  <input v-model="categories" class="hidden" type="checkbox" :id="'category-' + item.nameEn" :value="item.nameEn">
                  <label :class="'menu-category-' + item.nameEn" :for="'category-' + item.nameEn">{{ item.name }}</label>
               </li>
               <li class="menu-category-item toggle-btn">
                  <input :checked="selectAllBtnHighlight" @click="toggleCategorySelect" class="hidden" type="checkbox" id="category-all">
                  <label for="category-all" class="menu-category-all">{{ selectAllBtnHighlight ? '全选' : '全不选' }}</label>
               </li>
               <li class="menu-category-item toggle-btn">
                  <input checked @click="reverseCategorySelect" class="hidden" type="checkbox" id="category-reverse">
                  <label for="category-reverse" class="menu-category-all">反选</label>
               </li>
            </ul>

            <!--about-->
            <div class="about" v-show="aboutShowed" :style="'min-height:' + heightBg + 'px'">
               <h3 class="title">标题日记</h3>
               <h4 class="subtitle">用一句话记录你最珍贵的时刻</h4>
               <div class="author">
                  <a href="http://kylebing.cn" class="social-link">🌖开发者主页</a>
                  <a href="http://weibo.com/kylebing" class="social-link">@十月ooOO</a>
                  <a href="mailto:kylebing@163.com">kylebing@163.com</a>
                  <a href="https://github.com/KyleBing/diary">{{ $version }}</a>
               </div>
            </div>
            <!--search-->
         </div>
      </nav>
   </div>


</template>

<script>
import utility from "@/utility";
import Clipboard from "clipboard";
import {mapState} from 'vuex'

export default {
   name: "navbar",
   data() {
      return {
         location: {},
         diaryId: null,
         showLongList: false,

         heightBg: 0,

         // menu
         menuShowed: false,            // menu panel
         menuListShowed: true,         // menu list
         categoryShowed: false,        // category
         aboutShowed: false,           // about

         // menu - category
         userInfo: utility.getAuthorization(),
         categories: [],
         categoriesAll: utility.CATEGORIES_ALL_NAME,
      }
   },
   mounted() {
      this.location = window.location;
      this.heightBg = window.innerHeight;
      this.categories = this.categoriesChecked
   },
   computed: {
      selectAllBtnHighlight() {
         return !this.categories.length
      },
      ...mapState([
         'categoriesChecked'
      ])
   },
   methods: {
      menuShow() {
         this.menuShowed      =  true;            // menu panel
         this.menuListShowed  =  true;            // menu list
         this.categoryShowed  =  false;           // category
         this.aboutShowed     =  false;           // about
      },
      menuClose() {
         if (this.categoryShowed) {
/*            this.queryData.pageNo = 1;
            this.haveMore = true;
            this.diaries = [];
            this.diariesShow = [];
            this.loadMore();*/
            // TODO: operate List.vue
            // 关闭菜单时，更新 categories
            this.$store.commit('changeCategoriesChecked', this.categories)
            this.menuInit();
         } else if (this.aboutShowed) {
            this.menuShowed      =  true;            // menu panel
            this.menuListShowed  =  true;            // menu list
            this.categoryShowed  =  false;           // category
            this.aboutShowed     =  false;           // about
         } else if (this.menuShowed) {
            this.menuInit();
         }
      },

      menuInit() {
         this.menuShowed      =  false;            // menu panel
         this.menuListShowed  =  true;             // menu list
         this.categoryShowed  =  false;            // category
         this.aboutShowed     =  false;            // about
      },
      menuListClicked(menuName) {
         switch (menuName) {
            case 'search':
               this.$store.commit('changeSearchBarState', true);
               this.menuInit();
               this.$nextTick(() => {
                  document.querySelector('#keyword').focus();
               });
               break;
            case 'category':
               this.menuShowed      =  true;             // menu panel
               this.menuListShowed  =  false;            // menu list
               this.categoryShowed  =  true;             // category
               this.aboutShowed     =  false;            // about
               break;
            case 'about':
               this.menuShowed      =  true;             // menu panel
               this.menuListShowed  =  false;            // menu list
               this.categoryShowed  =  false;            // category
               this.aboutShowed     =  true;             // about
               break;
            default:
               break;
         }
      },
      toggleCategorySelect() {
         this.categories = this.categories.length ? [] : utility.CATEGORIES_ALL
      },
      reverseCategorySelect() {
         let tempCategories = [].concat(utility.CATEGORIES_ALL);
         this.categories.forEach(item => {
            tempCategories.splice(tempCategories.indexOf(item), 1)
         });
         this.categories = tempCategories;
      },

      diaryCreate() {

      },
      diarySave() {

      },
      copySharePath() {
         let clipboard = new Clipboard('#shareBtn');
         clipboard.on('success', function (e) {
            utility.popMessage(utility.POP_MSG_TYPE.success, '分享链接 已复制到 剪贴板', null, 2)
            e.clearSelection();
         });
         clipboard.on('error', function () {
         });
      },
      logout() {
         utility.deleteAuthorization();
         this.$router.push('/login');
      },
   }
}
</script>