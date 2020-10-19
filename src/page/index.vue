<template>
   <div class="body-normal">
      <nav-bar :btns="btns"/>
      <menu-panel :showed="false"/>
      <div class="container" id="diaryApp">
         <!--         <div class="search-bar" v-show="searchBarShow">
                     <form @submit.prevent="searchConfirmed">
                        <input id="keyword" type="text" placeholder="搜索内容" v-model="keyword">
                        <span v-show="keyword.length > 0" @click="freshLoad" class="clear">✕</span>
                     </form>
                  </div>-->
         <div class="diary-list-group">
            <div v-for="(item, index) in diariesShow"
                 :key="index">
               <div v-if="!item.title" class="list-header">{{item.date}}</div>
               <diary-list-item v-else :category="item.category"
                                :id="item.id"
                                :title="item.title"
                                :content="item.content"
                                :dateString="item.date.toString()"
                                :weather="item.weather">
               </diary-list-item>
            </div>
         </div>



         <!--加载动画-->
         <div v-show="isLoading" class="loading">
            <div class="loading-1 loading-item"></div>
            <div class="loading-2 loading-item"></div>
            <div class="loading-3 loading-item"></div>
         </div>

         <div v-show="!isLoading&&!haveMore" class="end-of-diary">
            <p><img src="img/EOF.svg" alt="EOF"></p>
         </div>
      </div>
   </div>
</template>

<script>
   import utility from "../utility";
   import navBar from "../components/navbar";
   import menuPanel from "../components/menuPanel";
   import diaryListItem from "../components/diaryListItem";

   export default {
      data() {
         return {
            btns: ['menu', 'add'],

            searchBarShow: false,
            haveMore: true,
            isLoading: true,
            diaries: [],
            keyword: '',

            diariesShow: [],

            pageNo: 1,
            PER_PAGE_AMOUNT: 50
         }
      },
      components: {
         navBar, menuPanel, diaryListItem
      },
      mounted() {
         // init
         this.keyword = this.$cookie.get(utility.COOKIE_NAME.keyword) ? this.$cookie.get(utility.COOKIE_NAME.keyword) : '';
         this.loadMore();
         this.addScrollEvent();
      },
      methods: {
         loadMore() {
            this.searchBarShow = !!this.keyword;
            this.haveMore = false;
            this.isLoading = true;
            let queryData = {
               "keyword": this.keyword,
               "pageCount": this.PER_PAGE_AMOUNT,
               "pageNo": this.pageNo,
               "type": "list",
               "category": utility.CATEGORIES_ALL
            };
            this.getDiaries(queryData)
         },
         getDiaries(queryData) {
            utility.getData(utility.URL.diaryOperation, queryData)
               .then(res => {
                  let tempShowArray = [];
                  let tempFullArray = this.diaries.concat(res.data);

                  // page operation
                  if (res.data.length === this.PER_PAGE_AMOUNT){
                     this.haveMore = true;
                     this.pageNo++
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
         // 列表模板
         currentItemHtml(item, date) {
            let hascontentHtml = '';
            let weatherHtml = item.weather ? `<img class="icon" src="img/weather/${item.weather}.svg" alt="${item.weather}">` : '';
            let href = '';

            if (item.content) {
               hascontentHtml = `<img class="icon" src="img/content.svg" alt="hascontent">`;
               href = `detail.html?diaryId=${item.id}`
            } else {
               hascontentHtml = '';
               href = `detail.html?diaryId=${item.id}`
            }

            return `<router-link to="/detail" class="list-item">
                    <i class="category bg-${item.category}"></i>
                    <span class="date">${date}</span>
                    <div class="detail">
                        <p class="title">${item.title}</p>
                        ${hascontentHtml}
                        ${weatherHtml}
                    </div>
                </router-link>`;
         },
         /*         freshLoad() {
                     pageNo = 1;
                     diaryApp.diaries = [];
                     this.keyword = '';
                     $.cookie(COOKIE_NAME.keyword, this.keyword, COOKIE_NAME.options);
                     this.loadMore();
                  },
                  searchConfirmed() {
                     window.onscroll = null; // 去掉现有scroll
                     addScrollEvent();       // 添加 scroll 事件
                     // 初始化一些值
                     pageNo = 1;
                     diaryApp.diaries = [];
                     this.loadMore();
                     // 存储关键字
                     $.cookie(COOKIE_NAME.keyword, this.keyword, COOKIE_NAME.options)
                  },*/
      }
      ,
   }
   /*
      // logo 点击切换图标
      function toggleLogo(logo) {
         const LOGO = {
            open: 'img/logo.svg',
            close: 'img/logo_close.svg'
         };
         let img = $(logo).children('img');
         let currentSrc = img.attr('src');
         if (currentSrc === LOGO.open) {
            img.attr('src', LOGO.close);
            $('.list-content').slideUp()
         } else {
            img.attr('src', LOGO.open);
            $('.list-content').slideDown()
         }
      }

      function toggleMonthContent(header) {
         $(header).next().slideToggle();
      }
   */


</script>
