<template>
   <router-link :to="`/detail/${diary.id}`"
                :class="['list-item', 'diary-list-item-' + diary.category, {active: active}]" >
      <i :class="['category', 'bg-' + diary.category]"></i>
      <span class="date">{{diary.date}}</span>
      <div class="detail">
         <p class="title">{{diary.title}}</p>
         <img alt="Content" v-if="diary.content" class="icon"
              :src="`img/content${active? '_white': ''}.svg`"/>
         <img :alt="diary.weather" v-if="diary.weather"
              class="icon" :src="weatherIcon"/>
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
         weatherIcon(){
            if (this.active){
               return `img/weather/${this.diary.weather}_white.svg`
            } else {
               if (this.diary.isPublic){
                  return `img/weather/${this.diary.weather}_active.svg`
               } else {
                  return `img/weather/${this.diary.weather}.svg`
               }
            }
         },
      }
   }
</script>

