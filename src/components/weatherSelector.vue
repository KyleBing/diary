<template>
   <div class="weather-selector">
      <input type="radio" name="weather" value="sunny" id="weather-sunny" v-model="weather">
      <label for="weather-sunny"></label>
      <input type="radio" name="weather" value="cloudy" id="weather-cloudy" v-model="weather">
      <label for="weather-cloudy"></label>
      <input type="radio" name="weather" value="overcast" id="weather-overcast" v-model="weather">
      <label for="weather-overcast"></label>
      <input type="radio" name="weather" value="fog" id="weather-fog" v-model="weather">
      <label for="weather-fog"></label>
      <input type="radio" name="weather" value="sprinkle" id="weather-sprinkle" v-model="weather">
      <label for="weather-sprinkle"></label>
      <input type="radio" name="weather" value="rain" id="weather-rain" v-model="weather">
      <label for="weather-rain"></label>
      <input type="radio" name="weather" value="thunderstorm" id="weather-thunderstorm" v-model="weather">
      <label for="weather-thunderstorm"></label>
      <input type="radio" name="weather" value="snow" id="weather-snow" v-model="weather">
      <label for="weather-snow"></label>
   </div>
</template>

<script>
   export default {
      name: "categorySelector",
      data(){
         return {
            weather: "sunny",
         }
      }
   }
</script>

<style scoped>

</style>