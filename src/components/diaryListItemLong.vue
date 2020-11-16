<template>
   <div  class="article">
      <router-link :to="'/detail?id=' + diary.id" :class="`article-header category-bg-${diary.category}`">
         <div class="week">{{diary.weekday}}</div>
         <div class="date">{{diary.dateString}}</div>
         <div :class="`category text-${diary.category}`">{{categoryString}}</div>
      </router-link>
      <div class="article-body">
         <div class="title">{{diary.title}}</div>
         <div class="content" v-html="diary.content"></div>
      </div>
   </div>
</template>

<script>
   import utility from "@/utility";

   export default {
      name: "diaryListItemLong",
      props: {
         diary: Object
      },
      data(){
         return {
            categoryString: utility.CATEGORIES[this.diary.category]
         }
      }
   }
</script>

