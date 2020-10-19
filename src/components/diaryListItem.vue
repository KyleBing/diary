<template>
   <a class="list-item">
      <i :class="['category', 'bg-' + category]"></i>
      <span class="date">{{dateString}}</span>
      <div class="detail">
         <p class="title">{{title}}</p>
         <img :alt="content" v-if="content" class="icon" src="/img/content.svg"/>
         <img :alt="weather" v-if="weather" class="icon" :src="'/img/weather/' + weather + '.svg'"/>
      </div>
   </a>
</template>

<script>
   export default {
      name: "diaryListItem",
      props: {
         title: String,
         weather: String,
         content: String,
         dateString: String,
         category: String
      },
      data() {
         return {

         }
      }
   }
</script>

