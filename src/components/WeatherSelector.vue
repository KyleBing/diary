<template>
   <div class="weather-selector">
      <div class="weather" @click="chooseWeather(item.title)" v-for="item in weathers" :key="item.title">
         <img
            :src="`img/weather/${weatherSelected === item.title? item.title + '_active' : item.title}.svg`"
            :alt="item.name"
            :title="item.name">
      </div>
   </div>
</template>

<script>
   import utility from "../utility"

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
            weatherSelected: this.weather,
            weathers: utility.WEATHER,
         }
      },
      watch:{
         weather(){
            this.weatherSelected = this.weather
         },
         weatherSelected(){
            this.$emit('change', this.weatherSelected)
         }
      },
      methods: {
         chooseWeather(weatherName){
            this.weatherSelected = weatherName
         }
      }
   }
</script>
