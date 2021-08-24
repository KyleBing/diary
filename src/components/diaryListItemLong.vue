<template>
   <div :class="['article', {active: active}, `article-${diary.category}`]">
      <router-link :to="`/detail/${diary.id}`"
                   class="article-header" >
         <div class="week">{{diary.weekday}}</div>
         <div class="date">{{diary.dateString}}</div>
         <div class="weather">
            <img v-if="diary.weather"
                 :src="`img/weather/${diary.weather + suffix}.svg`"
                 :alt="diary.weather">
         </div>
         <div class="category">{{categoryString}}</div>
      </router-link>
      <div class="article-body">
         <div class="title">{{diary.title}}</div>
         <div class="content" v-html="diary.content"></div>
      </div>
   </div>
</template>

<script>
   import utility from "@/utility"

   export default {
      name: "diaryListItemLong",
      props: {
         diary: Object
      },
      data(){
         return {
            categoryString: utility.CATEGORIES[this.diary.category]
         }
      },
      computed:{
         active(){
            return this.$route.params.id === this.diary.id
         },
         suffix(){
            return this.active? '_white': '_active'
         }
      }
   }
</script>

