<template>
   <router-link :to="`/detail/${diary.id}`"
                :class="['list-item', 'diary-list-item-' + diary.category, {active: active}]" >
      <i :class="['category', 'bg-' + diary.category]"></i>
      <span class="date">{{diary.date}}</span>
      <div class="detail">
         <p class="title">{{diary.title}}</p>
         <img alt="Content" v-if="diary.content" class="icon"
              :src="`img/content${suffix}.svg`"/>
         <img :alt="diary.weather" v-if="diary.weather"
              class="icon" :src="`img/weather/${diary.weather + suffix}.svg`"/>
      </div>
   </router-link>
</template>

<script>
   export default {
      name: "diaryListItem",
      props: {
         diary: Object
      },
      computed: {
         active(){
            return this.$route.params.id === this.diary.id
         },
         suffix(){
            return this.active? '_white': ''
         }
      }
   }
</script>

