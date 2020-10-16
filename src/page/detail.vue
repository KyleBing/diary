<div class="body-white">
   <nav class="navbar clearfix" id="navbar">
      <div @click="goBack" class="navbar-btn-group left"><img src="img/tabicon/back.svg" alt="返回"></div>
      <div class="navbar-btn-group right">
         <img @click="deleteClicked" src="img/tabicon/delete.svg" alt="删除">
         <img @click="editBtnClicked" v-show="confirmBtnShow" src="img/tabicon/edit.svg" alt="编辑">
      </div>
      <div class="brand">
         <a href=".."><img src="img/logo.svg" alt="日记"></a>
      </div>
   </nav>

   <div class="diary-detail" id="diaryDetail">
      <!--META-->
      <div class="diary-meta">
         <div class="date">{{diary.date}}</div>
         <div class="weather">
            <img v-if="diary.weather" :src="`img/weather/${diary.weather}_active.svg`" :alt="diary.weather"></div>
         <div class="temperature"><span>{{diary.temperature}}</span>℃</div>
         <div :class="[`detail-category-${diary.category}`, 'detail-category']"><span>{{diary.categoryName}}</span>
         </div>
      </div>
      <!--TITLE-->
      <div class="diary-title">
         <h2>{{diary.title}}</h2>
      </div>

      <!--CONTENT-->
      <div class="diary-content" v-html="diary.content"></div>
   </div>

   <div id="toast" class="fadeIn animated-fast" v-show="showToast">
      <div class="toast">
         <div class="toast-header">确定删除吗</div>
         <div class="toast-body"></div>
         <div class="toast-footer">
            <div class="btn-cancel" @click="hide">取消</div>
            <div class="btn-confirm" @click="deleteCurrentDiary">确定</div>
         </div>
      </div>
      <div class="mask"></div>
   </div>
</div>

<script>
   import utility from "../utility";

   export default {
      data(){
         return {
            diary: null
         }
      },
      mounted() {
         utility.getData(utility.URL.diaryOperation, {
            'type': 'query',
            'diaryId': getSearchData().diaryId
         }).then(res => {
            let diary = res.data[0];
            this.diary = diary;
            this.diary.date = formateDate(diary.date);
            let contentArray = diary.content.split('\n');
            let contentHtml = "";
            contentArray.forEach(item => {
               contentHtml += `<p>${item}</p>`
            });
            this.diary.content = contentHtml;
            this.diary.temperature = diary.temperature === '-273' ? '' : diary.temperature;
            this.diary.categoryName = CATEGORIES[diary.category];
         })
      }
   }

/*
   // Navbar
   let navbar = new Vue({
      el: "#navbar",
      data: {
         href: '',
         confirmBtnShow: true
      },
      methods: {
         goBack() {
            history.back(); // 返回主列表
         },
         editBtnClicked() {
            location = "./edit.html?id=" + vm.diary.id
         },
         deleteClicked() {
            toast.show();
         },
      }
   });
*/

   const WEATHER = {
      sunny: {title: 'sunny', name: '晴'},
      cloudy: {title: 'cloudy', name: '多云'},
      overcast: {title: 'overcast', name: '阴'},
      sprinkle: {title: 'sprinkle', name: '小雨'},
      rain: {title: 'rain', name: '雨'},
      thunderstorm: {title: 'thunderstorm', name: '暴雨'},
      snow: {title: 'snow', name: '雪'},
      fog: {title: 'fog', name: '雾'}
   };

   const CATEGORIES = {
      life: '生活',
      study: '学习',
      film: '电影',
      game: '游戏',
      work: '工作',
      sport: '运动',
      bigevent: '大事',
      week: '周报',
      article: '文章',
   };

   function formateDate(dateString) {
      let year = Number(dateString.substring(0, 4));
      let month = Number(dateString.substring(5, 7));
      let day = Number(dateString.substring(8, 10));
      let date = new Date(year, month - 1, day);
      let week = date.getDay();
      return `${year}年${month}月${day}日 ${WEEKDAY[week]}`
   }

</script>
