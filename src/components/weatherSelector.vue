<template>
   <div class="weather-selector">
      <div v-for="(item, index) in weathers" :key="index">
         <input type="radio" name="weather" :value="item.title" :id="'weather-' + item.title" v-model="weatherNew">
         <label :for="'weather-' + item.title"></label>
      </div>
   </div>
</template>

<script>
   import utility from "../utility";

   export default {
      name: "categorySelector",
      props: ['weather'],
      data(){
         return {
            weathers: utility.WEATHER,
            weatherNew: this.weather,
         }
      }
   }
</script>

<style scoped>

</style>