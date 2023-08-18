<template>
    <div class="diary-header">
        <div class="date-wrapper" v-if="diary.dateObj">
            <div class="date-time">{{ diary.dateObj.dateFull }}  {{diary.dateObj.time}}</div>
            <div class="date-lunar">{{lunarObject.IMonthCn}}{{lunarObject.IDayCn}}  {{diary.dateObj.weekday}}</div>
        </div>

        <div class="weather-wrapper">
            <div class="weather">
                <img v-if="diary.weather" :src="icons.weather[`${diary.weather}_active`]" :alt="diary.weather">
            </div>
            <div class="temperatures">
                <div class="temperature" v-if="diary.temperature">
                    身处 <span :class="['temperature-number', getTemperatureClassName(Number(diary.temperature))]">{{ diary.temperature }}</span> ℃
                </div>
                <div class="temperature" v-if="diary.temperatureOutside">
                    室外 <span :class="['temperature-number', getTemperatureClassName(Number(diary.temperatureOutside))]">{{ diary.temperatureOutside }}</span> ℃
                </div>
            </div>
        </div>

        <div class="category-wrapper">
            <div class="detail-category" :style="categoryBgColor">
                <span>{{ diary.categoryString }}</span>
            </div>
        </div>

    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import SvgIcons from "@/assets/img/SvgIcons";

export default {
    name: "DetailHeader",
    props: {
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
    },
    data(){
        return {
            icons: SvgIcons,
        }
    },
    computed: {
        ...mapGetters(['isInMobileMode', 'categoryNameMap', 'categoryObjectMap']),
        categoryBgColor(){
            if (this.diary && this.diary.category){
                return `background-color: ${this.categoryObjectMap.get(this.diary.category).color}`
            } else {
                return ''
            }
        },
    },
    methods: {
        getTemperatureClassName(temperature){
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
            }
        },
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
                img{
                }
            }
            .temperature{
                margin-right: 15px;
            }
        }

        .date-wrapper{
            .date{
            }
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
        .date {
            color: $dark-text;
        }
        .weather-wrapper{
            .temperature{
                color: $dark-text;
            }
        }
    }
}



</style>
