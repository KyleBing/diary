<template>
   <div id="diaryApp" :style="`min-height: ${heightPanel}px`">
      <div class="search-bar" v-show="searchBarShowed">
         <form @submit.prevent="search">
            <input id="keyword" type="text" placeholder="搜索内容" v-model="queryData.keyword">
            <span v-show="queryData.keyword.length > 0" @click="clearKeyword" class="clear">✕</span>
         </form>
      </div>

      <div class="diary-list-group" v-if="!diaryListShowedInFullStyle">
         <div v-for="(item, index) in diariesShow" :key="index">
            <div v-if="!item.title" class="list-header">{{ item.date.split('-').join(' - ') }}</div>
            <diary-list-item v-else :category="item.category" :diary="item"/>
         </div>
      </div>

      <div class="diary-list-group" v-else>
         <div v-for="(item, index) in diaries" :key="index">
            <div v-if="!item.title" class="list-header">{{ item.date }}</div>
            <diary-list-item-long v-else :diary="item"/>
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
</template>

<script>
import utility from "../utility";
import diaryListItem from "../components/diaryListItem";
import diaryListItemLong from "../components/diaryListItemLong";
import { mapState } from 'vuex'

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
      }
   },
   components: {
      diaryListItem, diaryListItemLong
   },
   mounted() {
      // init
      this.categories = utility.queryData.categories;
      this.queryData.keyword = this.keyword;
      this.reload();
      this.addScrollEvent();
      this.searchBarShow = !!this.queryData.keyword;
   },

   computed: {
      ...mapState([
         'searchBarShowed',
         'keyword',
         'categoriesChecked',
         'diaryListShowedInFullStyle',
         'diaryListFilterShared',
         'listNeedBeReload',
         'listOperation',
         'heightPanel'])
   },
   watch: {
      // route 载入 `/` 路径时，重载日记列表：比如删除日记后
      $route(to){
         if (to.path === '/'){
            this.reload()
         }
      },
      diaries(){
         let tempShowArray = [];
         if (this.diaries.length > 0) { // 在开始时，先把头问月份和第一个日记加到数组中
            let lastDiary = this.diaries[0];
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
               category: lastDiary.category,
               isPublic: lastDiary.is_public === '1'
            })

            if (this.diaries.length > 1) {  // 再判断第二个日记与第一个的关系
               for (let i = 1; i < this.diaries.length; i++) {
                  lastDiary = this.diaries[i - 1]; // 更新上一条日记指向
                  let currentDiary = this.diaries[i];
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
                     category: currentDiary.category,
                     isPublic: currentDiary.is_public === '1'
                  })
               }
            }
         }
         this.diariesShow = tempShowArray;
      },
      categories() {
         utility.queryData.categories = this.categories
      },
      categoriesChecked(){
         this.reload()
      },
      diaryListFilterShared(){
         this.reload()
      },
      listNeedBeReload(){
         if (this.listNeedBeReload){
            this.reload()
         }
      },
      listOperation({type, diary, id}){
         switch (type){
            case 'add':
               let posInsert = 0;
               for (let i=0; i<this.diaries.length;i++){
                  let currentDiary = this.diaries[i];
                  if (diary.date > currentDiary.date){
                     posInsert = i
                     break
                  } else {
                     continue
                  }
               }
               this.diaries.splice(posInsert,0, diary);
               break;
            case 'delete':
               this.diaries.map((item, index) => {
                  if (item.id === id){
                     this.diaries.splice(index,1);
                     if (this.diaries[index]){
                        // 删除当前日记后，显示最近的一条日记，由于删除了一条，所以留下的 index 就是后面一个元素的 index
                        this.$router.push('/detail/' + this.diaries[index].id)
                     } else {
                        // 如果没有，就跳转到主页
                        this.$router.push('/')
                     }
                  }
               })
               break;
            case 'change':
               // TODO: 修改日记的日期时排序调整位置
               this.diaries.map((item, index) => {
                  if (item.id === diary.id){
                     this.diaries.splice(index,1,diary);
                  }
               });
               break;
         }
      }
   },
   methods: {
      /* MENU 相关 */
      search() {
         this.$store.commit('setKeyword', this.queryData.keyword)
         this.reload()
      },
      clearKeyword() {
         this.queryData.keyword = '';
         this.search();
      },
      reload(){
         this.queryData.pageNo = 1;
         this.diaries = [];
         this.diariesShow = [];
         this.getStatistic();
         this.loadMore();
      },

      /* DIARY 相关 */
      getStatistic(){
         utility.getData(utility.URL.diaryOperation, {type: 'statistic'})
            .then(res => {
               this.$store.commit('setStatistics', res.data)
            })
      },
      loadMore() {
         this.haveMore = false;
         this.isLoading = true;
         this.getDiaries(this.queryData)
      },
      getDiaries(queryData) {
         this.queryData.filterShare = this.diaryListFilterShared? 1: 0; // 是否筛选已共享的日记
         utility.getData(utility.URL.diaryOperation, queryData)
            .then(res => {
               let newDiariesList = res.data.map(diary => {
                  if (diary.content) {
                     diary.content = diary.content.replace(/\n/g, '<br/>');
                  }
                  diary.weekday = utility.formateDate(diary.date).weekday;
                  diary.dateString = utility.formateDate(diary.date).date;
                  let category = utility.CATEGORIES_ALL_NAME.filter(item => diary.nameEn === item.category);
                  diary.categoryString = category[0].name;
                  return diary;
               })

               // page operation
               if (res.data.length === this.queryData.pageCount) {
                  this.haveMore = true;
                  this.queryData.pageNo++
               } else {
                  this.haveMore = false;
               }

               // diary operation
               this.diaries = this.diaries.concat(newDiariesList);
            })
            .finally(() => {
               // 列表加载完成后设置列表重载： false
               this.$store.commit('setListNeedBeReload', false)
               this.isLoading = false
            })
      },
      addScrollEvent() {
         document.querySelector('.diary-list').addEventListener('scroll', () => { // 由于这里用的箭头方法，所以这里的 This 指向的是 VUE app
            /* 判断是否加载内容*/
            function needLoadContent() {
               let lastNode = document.querySelector('.diary-list-group > div:last-child');
               if (!lastNode) {
                  return false;
               }
               let lastOffsetTop = lastNode.offsetTop;
               let clientHeight = window.innerHeight;
               let listEl = document.querySelector('.diary-list');
               let scrollTop = listEl.scrollTop;
               // console.clear();
               // window.console.log(`${lastOffsetTop} | ${clientHeight} | ${scrollTop}`);
               return (lastOffsetTop < clientHeight + scrollTop + clientHeight / 2); // 添加 1/2 触发高度
            }
            if (this.haveMore && needLoadContent()) {
               this.loadMore();
            }
         })
      },
   }
}

</script>

