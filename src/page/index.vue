<template>
   <div class="body-normal">
      <!--      <menu/>-->

      <div class="container" id="diaryApp">
         <!--         <div class="search-bar" v-show="searchBarShow">
                     <form @submit.prevent="searchConfirmed">
                        <input id="keyword" type="text" placeholder="搜索内容" v-model="keyword">
                        <span v-show="keyword.length > 0" @click="freshLoad" class="clear">✕</span>
                     </form>
                  </div>-->
         <div class="diary-list-group">
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

   export default {
      data() {
         return {
            searchBarShow: false,
            haveMore: true,
            isLoading: true,
            diaries: [],
            keyword: '',

            pageNo: 1,
            PAGE_AMOUNT: 50
         }
      },
      mounted() {
         // init
         this.keyword = this.$cookie.get(utility.COOKIE_NAME.keyword) ? this.$cookie.get(utility.COOKIE_NAME.keyword) : '';
         this.loadMore();
      },
      methods: {
         loadMore() {
            this.searchBarShow = !!this.keyword;
            this.haveMore = false;
            this.isLoading = true;
            let queryData = {
               "keyword": this.keyword,
               "pageCount": this.PAGE_AMOUNT,
               "pageNo": this.pageNo,
               "type": "list",
               // "category": menu.categories
            };
            this.getDiaries(queryData)
         },
         getDiaries(queryData) {
            utility.postData(URL.diaryOperation, queryData).then(res => {
               this.isLoading = false;
               // 刷新 cookie 过期时间
               utility.setAuthorization(
                  utility.getAuthorization().email,
                  utility.getAuthorization().token,
                  utility.getAuthorization().username,
                  utility.getAuthorization().uid);
               this.$cookie.set(utility.COOKIE_NAME.category, this.$cookie.set(utility.COOKIE_NAME.category), utility.COOKIE_NAME.options);

               this.diaries = this.diaries.concat(res.data);
               // 在后面判断获取的数据，小于1或小于每页的数量时，隐藏加载更多按钮
               this.haveMore = !(res.data.length < this.PAGE_AMOUNT);
               if (!this.haveMore) {
                  window.onscroll = null; // 日记全部加载完毕后，去掉 scroll 事件
               }
               this.pageNo++;
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
            let lastOffsetTop = document.querySelector('.list-content:last-child .list-item:last-child').offsetTop;
            let clientHeight = window.innerHeight;
            let scrollTop = document.scrollingElement.scrollTop;
            // console.clear();
            // console.log(`${lastOffsetTop} | ${clientHeight} | ${scrollTop}`);
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

            return `<a href="${href}" class="list-item">
                    <i class="category bg-${item.category}"></i>
                    <span class="date">${date}</span>
                    <div class="detail">
                        <p class="title">${item.title}</p>
                        ${hascontentHtml}
                        ${weatherHtml}
                    </div>
                </a>`;
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
      },
      watch: {
         diaries() {
            let diaries = this.diaries;
            if (diaries.length > 0) {
               let lastItem = diaries[0];
               let html = `<h3 onclick="toggleMonthContent(this)" class="list-header">${lastItem.date.substring(0, 7)}</h3>
                                <div class="list-content">` + this.currentItemHtml(lastItem, Number(lastItem.date.slice(8, 10)));
               if (diaries.length > 1) {
                  for (let i = 1; i < diaries.length; i++) {
                     let currentDiary = diaries[i];
                     let lastItemMonth = lastItem.date.substring(0, 7);
                     let lastItemDay = Number(lastItem.date.substring(8, 10));
                     let currentItemMonth = currentDiary.date.substring(0, 7);
                     let currentItemDay = Number(currentDiary.date.substring(8, 10));
                     let template = '';

                     if (lastItemMonth === currentItemMonth) {
                        let date = (lastItemDay === currentItemDay) ? '' : currentItemDay;
                        template = this.currentItemHtml(currentDiary, date);
                     } else {
                        template = `</div>
                                        <h3 onclick="toggleMonthContent(this)" class="list-header">${currentDiary.date.substring(0, 7)}</h3>
                                        <div class="list-content">` + this.currentItemHtml(currentDiary, currentItemDay);
                     }
                     html += template;
                     lastItem = diaries[i];
                  }
               }
               html += `</div>`;
               document.querySelector('.diary-list-group').innerHTML = html;
            } else {
               document.querySelector('.diary-list-group').innerHTML = ''
            }
         }

      }
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
