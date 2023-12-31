<template>
    <div class="weather-selector">
        <div class="weather" @click="chooseWeather(item.title)" v-for="item in WeatherArray" :key="item.title">
            <img
                :src="weatherSelected === item.title? SVG_ICONS.weather[item.title + '_active'] :  SVG_ICONS.weather[item.title]"
                :alt="item.name"
                :title="item.name">
        </div>
    </div>
</template>

<script lang="ts" setup>
import SVG_ICONS from "../../../assets/img/SVG_ICONS.ts";
import {ref, watch} from "vue";
import {WeatherArray} from "../../../entity/Weather.ts";

const emit = defineEmits(['change'])
const props = defineProps({
    weather: {
        type: String,
        default: 'sunny'
    }
})

const weatherSelected = ref(props.weather)

watch(props.weather, () => {
    weatherSelected.value = props.weather
})
watch(weatherSelected, () => {
    emit('change', weatherSelected.value)
})


function chooseWeather(weatherName: string) {
    weatherSelected.value = weatherName
}
</script>

<style lang="scss" scoped>
@import "./weather-selector";
</style>
