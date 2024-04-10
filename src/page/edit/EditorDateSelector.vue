<template>
    <div class="date-selector">
        <div class="date-set-item">
            <div class="button-date-change" @click="dateMove(-1)">
                <div><</div>
            </div>
            <Datepicker
                @wheel="mouseWheelScrolled"
                :editable="false"
                :show-now-button="true"
                v-model="dateLocal"
                format="yyyy.MM.dd HH:mm"
                selectText="确定"
                cancelText="取消"
                locale="zh-CN"
                placeholder="----.--.-- --:--"
                input-class="date"
                :clearable="false"
            />
            <div class="button-date-change" @click="dateMove(1)">
                <div>></div>
            </div>
        </div>
        <div class="date-meta">
            <div class="lunar">{{lunarObject.IMonthCn}}{{lunarObject.IDayCn}}</div>
            <div class="weekday">{{lunarObject.ncWeek}}</div>
        </div>
    </div>

</template>

<script lang="ts" setup>
import calendar from "js-calendar-converter"
import Moment from "moment/moment";
import {nextTick, onMounted, Ref, ref, watch} from "vue";
import {LunarDateEntity} from "../../entity/LunarDate.ts";

const props = defineProps({
    modelValue: {
        type: Object,
        default: new Date()
    }
})

const emit = defineEmits(["dayChange", "update:modelValue"])

onMounted(()=>{
    nextTick(()=> {
        dateLocal.value = props.modelValue
    })
})

const dateLocal = ref(new Date())
const lunarObject: Ref<LunarDateEntity> = ref({})


watch(() => props.modelValue, newValue => {
    dateLocal.value = newValue
})
watch(dateLocal, (newValue, oldValue) => {
    lunarObject.value = calendar.solar2lunar(
        newValue.getFullYear(),
        newValue.getMonth() + 1,
        newValue.getDate()
    )
    emit('update:modelValue', dateLocal.value)

    // 判断是否日期有变，day 有变，emit dayChange, 附带是否为今天的标识
    let dateMomentDiary = Moment(newValue)
    let dateMomentDiaryOrigin = Moment(oldValue)
    if ( dateMomentDiary.isSame(dateMomentDiaryOrigin, 'day')){
    } else {
        if (dateMomentDiary.isSame(new Date(), 'day')){
            emit('dayChange', true)
        } else {
            emit('dayChange', false)
        }
    }
})

function mouseWheelScrolled(event){
    event.preventDefault()
    if (event.ctrlKey){
        if (event.deltaY > 10){
            dateMove(1)
        } else if (event.deltaY < -10) {
            dateMove(-1)
        }
    } else {
        if (event.deltaY > 10){
            dateTimeMove(1)
        } else if (event.deltaY < -10) {
            dateTimeMove(-1)
        }
    }
}
// 日期前后移动
function dateMove(step: -1|0|1) {
    switch (step) {
        case -1:
        case 1:
            let dateTemp = Moment(dateLocal.value)
            dateTemp.add(step, 'day')
            dateLocal.value = dateTemp.toDate()
            emit('update:modelValue', dateLocal.value)
            break;
        case 0:
            dateLocal.value = new Date()
            emit('update:modelValue', dateLocal.value)
            break;
    }
}
// 日期前后移动
function dateTimeMove(step: -1|0|1) {
    switch (step) {
        case -1:
        case 1:
            let dateTemp = Moment(dateLocal.value)
            dateTemp.add(step, 'hour')
            dateLocal.value = dateTemp.toDate()
            emit('update:modelValue', dateLocal.value)
            break;
        case 0:
            dateLocal.value = new Date()
            emit('update:modelValue', dateLocal.value)
            break;
    }
}
</script>

<style lang="scss">
@use "sass:math";
@import "../../scss/plugin";


.date-selector{
    display: flex;
    width: 100%;
    flex-flow: column nowrap;
}

$height: 40px;
.date-set-item{
    padding: 0 5px;
    box-sizing: content-box;
    height: $height;
    width: 100%;
    @include border-radius($radius-mobile);
    position: relative;
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    .button-date-change{
        @include transition(opacity 0.3s);
        display: flex;
        opacity: 0;
        color: $text-subtitle;
        flex-shrink: 0;
        @extend .btn-like;
        @include border-radius(50px);
        justify-content: center;
        align-items: center;
        height: 30px;
        width: 30px;
        cursor: pointer;
        &:hover{
            color: $text-title;
            background-color: $color-main;
            border: 1px solid $orange;
        }
    }
    &:hover{
        background-color: $bg-light;
        border-color: $color-border-highlight;
        .button-date-change{
            @include transition(opacity 0.3s);
            opacity: 1;
        }
        input{
            color: black;
        }
    }
    input{
        font-family: 'SF UI Text';
        color: $text-content;
        text-align: center;
        background-color: transparent;
        display: block;
        width: 100%;
        font-size: 28px;
        padding: math.div($height - 40, 2) ;
        cursor: ns-resize;
    }
    label{
        padding: 3px 5px;
        background-color: white;
        z-index: $z-header;
        top: -10px;
        left: 10px;
        font-size: $fz-small;
        color: $text-label;
        position: absolute;
    }
    .unit{
        position: absolute;
        right: 8px;
        bottom: 8px;
        font-size: $fz-list-content;
        color: $text-label;
    }
}


.date-meta{
    width: 100%;
    padding: 0 20% 20px;
    margin-bottom: 15px;
    display: flex;
    font-size: $fz-main;
    justify-content: space-between;
    color: $text-label;
    border-bottom: 1px solid $color-border;
    .lunar{}
    .weekday{}
}



// Overwrite DatePicker Style
// plugin style overwrite

.dp__input{
    border: none !important;
}

.dp__icon.dp__input_icon{ // date picker icon
    display: none !important;
}

@media (min-width: $grid-separate-width-md) and (max-width: $grid-separate-width-big) {
    .date-selector{
        width: 50%;
        .date-set-item{
            input{
                text-align: left;
            }
        }
        .date-meta{
            justify-content: flex-start;
            padding: 0;
            border: none;
            .lunar{
                margin-right: 20px;
            }
        }
    }
}
// MOBILE
@media (max-width: $grid-separate-width-md) {
    .date-selector {
        width: 100%;
    }
}


// DARK
@media (prefers-color-scheme: dark) {
    .date-set-item{
        .button-date-change{
            color: $dark-text-subtitle;
            flex-shrink: 0;
            @extend .btn-like;
            @include border-radius(50px);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            width: 30px;
            cursor: pointer;
            &:hover{
                color: $text-title;
                background-color: $color-main;
                border: 1px solid $orange;
            }
        }
        &:hover{
            background-color: $dark-bg;
            input{
                color: $dark-text-title;
            }
        }
        input{
            color: $dark-text-title;
            //color: white;
        }
    }

    .date-meta{
        border-bottom-color: $dark-border;
    }
}



</style>
