<template>
    <div class="diary-header">
        <div class="date-wrapper" v-if="props.diary.dateObj">
            <div class="date-time">
                {{ props.diary.dateObj.dateFull }}  {{props.diary.dateObj.time}}
            </div>
            <div class="date-lunar">
                {{lunarObject.IMonthCn}}{{lunarObject.IDayCn}}  {{props.diary.dateObj.weekday}}
            </div>
        </div>

        <div class="weather-wrapper">
            <div class="weather">
                <img v-if="props.diary.weather" :src="SVG_ICONS.weather_icons[`${props.diary.weather}_active`]"
                     :alt="props.diary.weather">
            </div>
            <div class="temperatures">
                <div class="temperature"
                     v-if="props.diary.temperature">
                    身处
                    <span :class="['temperature-number', getTemperatureClassName(Number(props.diary.temperature))]">{{ props.diary.temperature }}</span> ℃
                </div>
                <div class="temperature"
                     v-if="props.diary.temperature_outside">
                    室外
                    <span :class="['temperature-number', getTemperatureClassName(Number(props.diary.temperature_outside))]">{{ props.diary.temperature_outside }}</span> ℃
                </div>
            </div>
        </div>

        <div class="category-wrapper">
            <div class="detail-category" :style="categoryBgColor">
                <span>{{ props.diary.categoryString }}</span>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";
import {computed} from "vue";
import {useProjectStore} from "../../pinia";
const projectStore = useProjectStore()

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    },
    diary: {
        type: Object,
        default: {}
    },
    lunarObject: {
        type: Object,
        default: {}
    },
})

const categoryBgColor = computed<string>( () => {
    if (props.diary && props.diary.category){
        return `background-color: ${projectStore.categoryObjectMap.get(props.diary.category).color}`
    } else {
        return ''
    }
})

function getTemperatureClassName(temperature: number): string{
    if (temperature >= 35){
        return 'temperature-35'
    } else if (temperature < 35 && temperature >= 28){
        return 'temperature-35-28'
    } else if (temperature < 28 && temperature >= 22){
        return 'temperature-28-22'
    } else if (temperature < 22 && temperature >= 15) {
        return 'temperature-22-15'
    } else if (temperature < 15 && temperature >= 4) {
        return 'temperature-15-4'
    } else if (temperature < 4) {
        return 'temperature-4'
    } else {
        return ''
    }
}
</script>

<style scoped lang="scss">
@import "src/scss/plugin";

.diary-header{
    background-color: $bg-light;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    .weather-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        .weather{
            margin-right: 5px;
            flex-grow: 1;
            padding: 3px;
            img{
                height: 30px;
                display: block;
            }
        }
        .temperatures{
            flex-shrink: 0;
            font-size: $fz-small;
            color: $text-title;
            .temperature{

            }
        }
    }

    .date-wrapper{
        font-size: $fz-main;
        .date-time{
            font-weight: bold;
        }
        .date-lunar{
            font-size: $fz-small;
            margin-top: 3px;
        }
    }
    .category-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        .detail-category{
            font-size: .8rem;
            text-align: center;
            margin: 3px 0;
            padding: 5px 12px;
            color: white;
            @include border-radius(5px);
        }
    }
}


@media (min-width: $grid-separate-width-big ) {
    .diary-header{
        background-color: $bg-light;
        padding: 15px 50px;
        display: flex;
        justify-content: space-between;
        @include border-radius(10px);

        .weather-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;

            .weather {
                margin-right: 5px;
                flex-grow: 1;
                padding: 3px;

                img {
                    height: 35px;
                    display: block;
                }
            }

            .temperatures {
                flex-shrink: 0;
                font-size: $fz-note;
                color: $text-title;
            }
        }
        .date-wrapper {
            flex-shrink: 0;
            color: $bg-main;

            .date-time {
                font-weight: bold;
                font-size: $fz-title;
            }

            .date-lunar {
                margin-top: 3px;
                color: $text-subtitle;
                font-size: $fz-note;
            }
        }
        .category-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;

            .detail-category {
                font-size: .8rem;
                text-align: center;
                margin: 3px 0;
                padding: 5px 12px;
                color: white;
                @include border-radius(5px);
            }
        }
    }
}
@media (min-width: $grid-separate-width-md) and (max-width: $grid-separate-width-big) {
    .diary-header{
        margin: 0 0 30px;
        padding: 10px 50px;
        justify-content: space-between;
        @include border-radius($radius-mobile);

        .weather-wrapper{
            .weather{
                margin-right: 15px;
                img{}
            }
            .temperature{
                margin-right: 15px;
            }
        }

        .date-wrapper{
            .date{}
            .time{
                margin-left: 20px;
            }
        }
    }
}

@media (prefers-color-scheme: dark) {
    .diary-header {
        background-color: darken($dark-bg, 5%);
        color: $dark-text;
        .date-wrapper {
            color: $bg-main;
            .date-time {
                color: $dark-text-header-date;
            }
            .date-lunar {
                color: $dark-text-header-lunar;
            }
        }
        .weather-wrapper{
            .temperature{
                color: $dark-text;
            }
        }
    }
}



</style>
