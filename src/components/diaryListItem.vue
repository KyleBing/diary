<template>
   <router-link :to="'/detail?id=' + diary.id" class="list-item">
      <i :class="['category', 'bg-' + diary.category]"></i>
      <span class="date">{{diary.date}}</span>
      <div class="detail">
         <p class="title">{{diary.title}}</p>
         <img :alt="diary.content" v-if="diary.content" class="icon" src="/img/content.svg"/>
         <img :alt="diary.weather" v-if="diary.weather" class="icon" :src="'/img/weather/' + diary.weather + '.svg'"/>
      </div>
   </router-link>
</template>

<script>
   export default {
      name: "diaryListItem",
      props: {
         diary: Object
      }
   }
</script>

