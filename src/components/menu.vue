<template>
   <div class="menu-panel" id="menu-panel" v-show="menuPanelShowed" style="display: none;">
      <div class="menu-list-group" v-show="menuListShowed">
         <a class="menu-list-group-item" @click="showSearchBar">搜索</a>
         <a class="menu-list-group-item" @click="referenceClicked">类别</a>
         <a class="menu-list-group-item" @click="aboutClicked">关于</a>
         <a class="menu-list-group-item" href="change_password.html">修改密码</a>
         <a class="menu-list-group-item" @click="logout">退出</a>
         <div class="user-info">
            <span class="username">{{userInfo.username}}</span>
            <span class="email">{{userInfo.email}}</span>
         </div>
      </div>

      <!--reference-->
      <ul class="reference" v-show="referenceShowed" style="display: none;">
         <li class="list-group-item">
            <input v-model="categories" class="hidden" type="checkbox" id="category-game" value="game"><label class="reference-game" for="category-game">游戏</label>
         </li>
         <li class="list-group-item">
            <input v-model="categories" class="hidden" type="checkbox" id="category-study" value="study"><label class="reference-study" for="category-study">学习</label>
         </li>
         <li class="list-group-item">
            <input v-model="categories" class="hidden" type="checkbox" id="category-work" value="work"><label class="reference-work" for="category-work">工作</label>
         </li>
         <li class="list-group-item">
            <input v-model="categories" class="hidden" type="checkbox" id="category-sport" value="sport"><label class="reference-sport" for="category-sport">运动</label>
         </li>
         <li class="list-group-item">
            <input v-model="categories" class="hidden" type="checkbox" id="category-week" value="week"><label class="reference-week" for="category-week">周报</label>
         </li>
         <li class="list-group-item">
            <input v-model="categories" class="hidden" type="checkbox" id="category-life" value="life"><label class="reference-life" for="category-life">生活</label>
         </li>
         <li class="list-group-item">
            <input v-model="categories" class="hidden" type="checkbox" id="category-film" value="film"><label class="reference-film" for="category-film">电影</label>
         </li>
         <li class="list-group-item">
            <input v-model="categories" class="hidden" type="checkbox" id="category-bigevent" value="bigevent"><label class="reference-bigevent" for="category-bigevent">大事</label>
         </li>
         <li class="list-group-item">
            <input v-model="categories" class="hidden" type="checkbox" id="category-article" value="article"><label class="reference-article" for="category-article">文章</label>
         </li>

         <li class="list-group-item toggle-btn">
            <input :checked="showSelectAllBtn" @click="toggleCategorySelect" class="hidden" type="checkbox" id="category-all"><label for="category-all" class="reference-all">{{ showSelectAllBtn? '全选': '全不选' }}</label>
         </li>
         <li class="list-group-item toggle-btn">
            <input checked @click="reverseCategorySelect" class="hidden" type="checkbox" id="category-reverse"><label for="category-reverse" class="reference-all">反选</label>
         </li>
      </ul>

      <!--about-->
      <div class="about" v-show="aboutShowed" style="display: none;">
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
   export default {
      data(){
         return {
            menuPanelShowed: false,      // menu panel
            secondMenuShowed: false,      // second menu
            menuListShowed: true,       // menu list
            referenceShowed: false,      // reference
            aboutShowed: false,      // about
            userInfo: getAuthorization(),
            categories: []
         }
      },
      watch: {
         secondMenuShowed: function () { // false all second panel when secondMenuShowed is false.
            if (!this.secondMenuShowed) {
               this.referenceShowed = false;
               this.aboutShowed = false;
            }
         },
         menuPanelShowed: function () {
            if (this.menuPanelShowed) {
               navbar.btnAdd = false;
            }
         },
         referenceShowed: function () {
            // console.log(this.categories);
            $.cookie(COOKIE.category, JSON.stringify(this.categories), COOKIE.options);
            diaryApp.freshLoad(); // 关闭 reference 页面的时候初始化载入内容
         }

      },
      methods: {
         toggleCategorySelect: function () {
            if (this.categories.length) {
               this.categories = [];
            } else {
               this.categories = AllCategories
            }
         },
         reverseCategorySelect: function () {
            let tempCategories = [].concat(AllCategories);
            this.categories.forEach(item => {
               tempCategories.splice(tempCategories.indexOf(item), 1)
            });
            this.categories = tempCategories;
         },
         referenceClicked: function () {
            this.menuListShowed = false;
            this.menuPanelShowed = true;
            this.secondMenuShowed = true;
            this.referenceShowed = true;
         },
         aboutClicked: function () {
            this.menuListShowed = false;
            this.menuPanelShowed = true;
            this.secondMenuShowed = true;
            this.aboutShowed = true;
         },
         showSearchBar: function () {
            diaryApp.searchBarShow = true;
            navbar.closeMenu();
            document.scrollingElement.scrollTo(0, 0); // 定位到最上方
            $('#keyword').focus();
         },
         logout: function () {
            deleteAuthorization();
            $.removeCookie(COOKIE.category, {path: '/'});
            location = FrontURL.login;
         },
         refreshContent: function () {
            diaryApp.freshLoad();
         }
      },
      computed: {
         // 全选按钮随类别数组变化而变化
         showSelectAllBtn: function () {
            return !this.categories.length
         }
      },
      created: function () {
         this.categories = JSON.parse($.cookie(COOKIE.category));
      }
   }

</script>