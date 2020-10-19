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
      props: {
         weather: {
            type: String,
            default: 'sunny'
         }
      },
      data(){
         return {
            weathers: utility.WEATHER,
            weatherNew: this.weather,
         }
      },
      watch:{
         weatherNew(){
            this.$emit('change', this.weatherNew)
         }
      }
   }
</script>