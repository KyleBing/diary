<template>
   <div class="body-normal">

      <!-- navbar -->
      <nav class="navbar" id="navbar">
         <div class="navbar-btn-group left">
            <img v-show= "!showMenu"  alt= "菜单" @click="menuShow"  src="img/tabicon/menu.svg" >
            <img v-show= "showMenu" alt= "关闭" @click="menuClose" src="img/tabicon/close.svg" >
         </div>
         <div class="navbar-btn-group right" v-show="!showMenu">
            <router-link to="/edit"><img alt= "添加" src="img/tabicon/add.svg" ></router-link>
         </div>
         <div class="brand">
            <a @click="toggleDiaryList">
               <img src="img/logo.svg" alt="日记" v-if="showDiaryList">
               <img src="img/logo_content.svg" alt="日记" v-else>
            </a>
         </div>
      </nav>

      <!-- menu -->
      <div class="menu-panel" id="menu-panel" v-show="showMenu" :style="'min-height:' + heightBg + 'px'">
         <div class="menu-list" v-show="showMenuList">
            <div class="menu-list-group" >
               <a class="menu-list-group-item" @click="menuListClicked('search')">搜索</a>
               <a class="menu-list-group-item" @click="menuListClicked('category')">类别</a>
               <a class="menu-list-group-item" @click="menuListClicked('about')">关于</a>
               <router-link class="menu-list-group-item" to="/change-password">修改密码</router-link>
               <a class="menu-list-group-item" @click="logout">退出</a>
            </div>
            <div class="user-info">
               <span class="username">{{userInfo.username}}</span>
               <span class="email">{{userInfo.email}}</span>
            </div>
         </div>

         <!--reference-->
         <ul class="reference" v-show="showCategory" :style="'min-height:' + heightBg + 'px'">
            <li class="list-group-item" v-for="(item, index) in categoriesAll" :key="index">
               <input v-model="categories" class="hidden" type="checkbox" :id="'category-' + item.nameEn" :value="item.nameEn">
               <label :class="'reference-' + item.nameEn" :for="'category-' + item.nameEn">{{item.name}}</label>
            </li>

            <li class="list-group-item toggle-btn">
               <input :checked="selectAllBtnHighlight" @click="toggleCategorySelect" class="hidden" type="checkbox" id="category-all">
               <label for="category-all" class="reference-all">{{ selectAllBtnHighlight? '全选': '全不选' }}</label>
            </li>
            <li class="list-group-item toggle-btn">
               <input checked @click="reverseCategorySelect" class="hidden" type="checkbox" id="category-reverse">
               <label for="category-reverse" class="reference-all">反选</label>
            </li>
         </ul>

         <!--about-->
         <div class="about" v-show="showAbout" :style="'min-height:' + heightBg + 'px'">
            <h3 class="title">标题日记</h3>
            <h4 class="subtitle">用一句话记录你最珍贵的时刻</h4>
            <div class="author">
               <a href="http://kylebing.cn" class="social-link">🌖开发者主页</a>
               <a href="http://weibo.com/kylebing" class="social-link">@十月ooOO</a>
               <a href="mailto:kylebing@163.com">kylebing@163.com</a>
               <a href="https://github.com/KyleBing/diary">v 6.0.0</a>
            </div>
         </div>
         <!--search-->
      </div>

      <!--content-->
      <div class="container" id="diaryApp" :style="'min-height: ' + heightBg + 'px'">

         <div class="search-bar" v-show="searchBarShow">
            <form @submit.prevent="search">
               <input id="keyword" type="text" placeholder="搜索内容" v-model="queryData.keyword">
               <span v-show="queryData.keyword.length > 0" @click="clearSearchContent" class="clear">✕</span>
            </form>
         </div>

         <div class="diary-list-group" v-if="showDiaryList">
            <div v-for="(item, index) in diariesShow" :key="index">
               <div v-if="!item.title" class="list-header">{{item.date}}</div>
               <diary-list-item v-else :category="item.category" :diary="item"/>
            </div>
         </div>

         <div class="diary-list-group" v-else>
            <div v-for="(item, index) in diaries" :key="index">
               <div v-if="!item.title" class="list-header">{{item.date}}</div>
               <diary-list-item-long v-else :category="item.category" :diary="item"/>
            </div>
         </div>

         <!--加载动画-->
         <div v-show="isLoading" class="loading">
            <div class="loading-1 loading-item"></div>
            <div class="loading-2 loading-item"></div>
            <div class="loading-3 loading-item"></div>
         </div>

         <div v-show="!isLoading && !haveMore" class="end-of-diary">
            <p><img src="img/EOF.svg" alt="EOF"></p>
         </div>
      </div>
   </div>
</template>

<script>
   import utility from "../utility";
   import diaryListItem from "../components/diaryListItem";
   import diaryListItemLong from "../components/diaryListItemLong";

   export default {
      data() {
         return {
            showDiaryList: true,
            searchBarShow: false,

            haveMore: true,
            isLoading: true,
            
            queryData: {
               type: 'list',
               keyword: '',
               pageNo: 1,
               pageCount: 50,
               category: [],
            },
            diaries: [],
            diariesShow: [],

            // MENU
            showMenu: false,            // menu panel
            showMenuList: true,         // menu list
            showCategory: false,       // reference
            showAbout: false,           // about

            userInfo: utility.getAuthorization(),
            categories: [],
            categoriesAll: utility.CATEGORIES_ALL_NAME,

            heightBg: 0
         }
      },
      components: {
         diaryListItem, diaryListItemLong
      },
      mounted() {
         // init
         this.categories = utility.getCategories()
         this.queryData.keyword = utility.keyword.get();
         this.loadMore();
         this.addScrollEvent();
         this.searchBarShow = !!this.queryData.keyword;
         this.heightBg = window.innerHeight
      },
      computed: {
         selectAllBtnHighlight() {
            return !this.categories.length
         }
      },
      watch: {
         categories(){
            utility.saveCategories(this.categories)
         }
      },
      methods: {

         /* MENU 相关 */
         toggleDiaryList(){
            this.showDiaryList = !this.showDiaryList
         },
         menuInit(){
            this.showMenu            = false;            // menu panel
            this.showMenuList        = true;             // menu list
            this.showCategory        = false;            // reference
            this.showAbout           = false;            // about
         },
         menuListClicked(menuName){
            switch (menuName){
               case 'search':
                  this.searchBarShow = true;
                  document.querySelector('#keyword').focus();
                  this.menuInit();
                  break;
               case 'category':
                  this.showMenu      = true;             // menu panel
                  this.showMenuList  = false;            // menu list
                  this.showCategory  = true;             // reference
                  this.showAbout     = false;            // about
                  break;
               case 'about':
                  this.showMenu      = true;             // menu panel
                  this.showMenuList  = false;            // menu list
                  this.showCategory  = false;            // reference
                  this.showAbout     = true;             // about

                  break;
               default: break;
            }
         },
         menuShow(){
            this.showMenu     = true;            // menu panel
            this.showMenuList = true;            // menu list
            this.showCategory = false;           // reference
            this.showAbout    = false;           // about

         },
         menuClose(){
            if (this.showCategory){
               this.queryData.pageNo = 1;
               this.haveMore = true;
               this.diaries = [];
               this.diariesShow = [];
               this.loadMore();
               this.menuInit();
            } else if (this.showAbout){
               this.showMenu     = true;            // menu panel
               this.showMenuList = true;            // menu list
               this.showCategory = false;           // reference
               this.showAbout    = false;           // about

            } else if (this.showMenu){
               this.menuInit();
            }

         },
         search(){
            this.queryData.pageNo = 1;
            this.diaries = [];
            this.diariesShow = [];
            this.loadMore();
         },
         clearSearchContent(){
            this.queryData.keyword = '';
            this.search();
         },

         logout(){
            utility.deleteAuthorization();
            this.$router.push('/login');
         },
         toggleCategorySelect() {
            this.categories = this.categories.length? []: utility.CATEGORIES_ALL
         },
         reverseCategorySelect() {
            let tempCategories = [].concat(utility.CATEGORIES_ALL);
            this.categories.forEach(item => {
               tempCategories.splice(tempCategories.indexOf(item), 1)
            });
            this.categories = tempCategories;
         },


         /* DIARY 相关 */
         loadMore() {
            this.haveMore = false;
            this.isLoading = true;
            utility.keyword.set(this.queryData.keyword);
            this.getDiaries(this.queryData)
         },
         getDiaries(queryData) {
            utility.getData(utility.URL.diaryOperation, queryData)
               .then(res => {
                  let tempShowArray = [];
                  let newDiariesList = res.data.map(diary => {
                     diary.content = diary.content.replace(/\n/g, '<br/>');
                     diary.weekday = utility.formateDate(diary.date).weekday;
                     diary.dateString = utility.formateDate(diary.date).date;
                     let category = utility.CATEGORIES_ALL_NAME.filter(item => diary.nameEn === item.category);
                     diary.categoryString = category[0].name;
                     return diary;
                  })
                  let tempFullArray = this.diaries.concat(newDiariesList);

                  // page operation
                  if (res.data.length === this.queryData.pageCount){
                     this.haveMore = true;
                     this.queryData.pageNo++
                  } else {
                     this.haveMore = false;
                  }

                  if (tempFullArray.length > 0) { // 在开始时，先把头问月份和第一个日记加到数组中
                     let lastDiary = tempFullArray[0];
                     tempShowArray.push({ // 添加年月
                        date: lastDiary.date.substring(0, 7)
                     })
                     let currentDay = Number(lastDiary.date.slice(8, 10));
                     tempShowArray.push({  // 添加当前日记内容
                        id: lastDiary.id,
                        date: currentDay,
                        title: lastDiary.title,
                        content: lastDiary.content,
                        weather: lastDiary.weather,
                        category: lastDiary.category
                     })

                     if (tempFullArray.length > 1) {  // 再判断第二个日记与第一个的关系
                        for (let i = 1; i < tempFullArray.length; i++) {
                           lastDiary = tempFullArray[i - 1]; // 更新上一条日记指向
                           let currentDiary = tempFullArray[i];
                           let lastDiaryMonth = lastDiary.date.substring(0, 7);
                           let lastDiaryDay = Number(lastDiary.date.substring(8, 10));
                           let currentDiaryMonth = currentDiary.date.substring(0, 7);
                           let currentDiaryDay = Number(currentDiary.date.substring(8, 10));
                           // console.log(lastDiaryMonth, currentDiaryMonth);
                           if (lastDiaryMonth !== currentDiaryMonth) {
                              tempShowArray.push({ // 添加年月
                                 date: currentDiary.date.substring(0, 7)
                              })
                           }
                           tempShowArray.push({  // 添加当前日记内容
                              id: currentDiary.id,
                              date: currentDiaryDay === lastDiaryDay ? '' : currentDiaryDay,
                              title: currentDiary.title,
                              content: currentDiary.content,
                              weather: currentDiary.weather,
                              category: currentDiary.category
                           })
                        }
                     }
                  }
                  this.diaries = tempFullArray;
                  this.diariesShow = tempShowArray;
               }).finally(()=>{
                  this.isLoading = false
            })
         },
         addScrollEvent() {
            window.onscroll = () => {
               if (this.haveMore && this.needLoadContent()) {
                  this.loadMore();
               }
            };
         },
         // 判断是否加载内容
         needLoadContent() {
            let lastOffsetTop = document.querySelector('.diary-list-group > div:last-child').offsetTop;
            let clientHeight = window.innerHeight;
            let scrollTop = document.scrollingElement.scrollTop;
            // console.clear();
            // window.console.log(`${lastOffsetTop} | ${clientHeight} | ${scrollTop}`);
            return (lastOffsetTop < clientHeight + scrollTop);
         },
      }
   }


</script>
