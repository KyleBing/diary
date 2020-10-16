<template>
   <div class="menu-panel" id="menu-panel" v-show="showed" :style="'min-height:' + heightBg + 'px'">
      <div class="menu-list-group" v-show="menuListShowed">
         <a class="menu-list-group-item" @click="showSearchBar">搜索</a>
         <a class="menu-list-group-item" @click="referenceClicked">类别</a>
         <a class="menu-list-group-item" @click="aboutClicked">关于</a>
         <router-link class="menu-list-group-item" to="/change-password">修改密码</router-link>
         <a class="menu-list-group-item" @click="logout">退出</a>
         <div class="user-info">
            <span class="username">{{userInfo.username}}</span>
            <span class="email">{{userInfo.email}}</span>
         </div>
      </div>

      <!--reference-->
      <ul class="reference" v-show="referenceShowed" :style="'min-height:' + heightBg + 'px'">
         <li class="list-group-item" v-for="(item, index) in categoriesAll" :key="index">
            <input v-model="categories" class="hidden" type="checkbox" :id="'category-' + item.nameEn" :value="item.nameEn">
            <label :class="'reference-' + item.nameEn" :for="'category-' + item.nameEn">{{item.name}}</label>
         </li>

         <li class="list-group-item toggle-btn">
            <input :checked="showSelectAllBtn" @click="toggleCategorySelect" class="hidden" type="checkbox" id="category-all">
            <label for="category-all" class="reference-all">{{ showSelectAllBtn? '全选': '全不选' }}</label>
         </li>
         <li class="list-group-item toggle-btn">
            <input checked @click="reverseCategorySelect" class="hidden" type="checkbox" id="category-reverse">
            <label for="category-reverse" class="reference-all">反选</label>
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
            <a href="https://github.com/KyleBing/diary">version 5.9.2</a>
         </div>
      </div>
      <!--search-->
   </div>
</template>

<script>
   import utility from "../utility";

   export default {
      props: {
         showed: Boolean
      },
      data(){
         return {
            menuPanelShowed: false,      // menu panel
            secondMenuShowed: false,      // second menu
            menuListShowed: true,       // menu list
            referenceShowed: false,      // reference
            aboutShowed: false,      // about
            userInfo: utility.getAuthorization(),
            categories: [],
            categoriesAll: [],

            heightBg: 0
         }
      },
      mounted() {
         this.heightBg = window.innerHeight
         this.categories = JSON.parse(this.$cookie.get(utility.COOKIE_NAME.category));
         this.categoriesAll = utility.CATEGORIES_ALL_NAME
      },
      watch: {
         secondMenuShowed() { // false all second panel when secondMenuShowed is false.
            if (!this.secondMenuShowed) {
               this.referenceShowed = false;
               this.aboutShowed = false;
            }
         },
         menuPanelShowed() {
            if (this.menuPanelShowed) {
               // navbar.btnAdd = false;
            }
         },
         referenceShowed() {
            // console.log(this.categories);
            this.$cookie.set(utility.COOKIE_NAME.category, JSON.stringify(this.categories), utility.COOKIE_NAME.options);
            // diaryApp.freshLoad(); // 关闭 reference 页面的时候初始化载入内容
         }

      },
      methods: {
         toggleCategorySelect() {
            if (this.categories.length) {
               this.categories = [];
            } else {
               this.categories = utility.CATEGORIES_ALL
            }
         },
         reverseCategorySelect() {
            let tempCategories = [].concat(utility.CATEGORIES_ALL);
            this.categories.forEach(item => {
               tempCategories.splice(tempCategories.indexOf(item), 1)
            });
            this.categories = tempCategories;
         },
         referenceClicked() {
            this.menuListShowed = false;
            this.menuPanelShowed = true;
            this.secondMenuShowed = true;
            this.referenceShowed = true;
         },
         aboutClicked() {
            this.menuListShowed = false;
            this.menuPanelShowed = true;
            this.secondMenuShowed = true;
            this.aboutShowed = true;
         },
         showSearchBar() {
/*            diaryApp.searchBarShow = true;
            navbar.closeMenu();
            document.scrollingElement.scrollTo(0, 0); // 定位到最上方
            $('#keyword').focus();*/
         },
         logout() {
            utility.deleteAuthorization();
            this.$cookie.delete(utility.COOKIE_NAME.category, {path: '/'});
            this.$router.push('/login')
         },
         refreshContent() {
            // diaryApp.freshLoad();
         }
      },
      computed: {
         // 全选按钮随类别数组变化而变化
         showSelectAllBtn() {
            return !this.categories.length
         }
      },
   }

</script>