<template>
    <div class="time-picker">

        <div class="time-picker-time-value" v-if="isShowValue">
                <div class="hour">{{ String(hour).padStart(2, '0') }}</div>
                <div class="separator">:</div>
                <div class="minute">{{ String(minute).padStart(2, '0') }}</div>
        </div>

        <div class="time-picker-panel">
            <div class="hour-picker">
                <div class="picker-header">小时</div>
                <div class="hour-list">
                    <div class="hour-list-item" :class="{active: hour === item}"
                         @click="hour = item"
                         v-for="item in hours" :key="item">
                        <div class="label">{{ String(item).padStart(2, '0') }}</div>
                    </div>
                </div>
            </div>

            <div class="minute-picker">
                <div class="picker-header">分钟</div>
                <div class="minute-list">
                    <div class="minute-list-item" :class="{active: minute === item}"
                         :style="{width: props.minuteSimple ? '100%' : '10%'}"
                         @click="minute = item"
                         v-for="item in minutes" :key="item">
                        <div class="label">{{ String(item).padStart(2, '0') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<{
    minuteSimple?: boolean,
    isShowValue?: boolean
}>(), {
    minuteSimple: false,
    isShowValue: true
})

const modelValue = defineModel<Date>({required: true})

const hour = ref(0)
const minute = ref(0)

const hours = Array.from({length: 24}, (_, index) => index)
const minutes = props.minuteSimple ? // 如果分钟简单模式，则只显示15的倍数
                Array.from({length: 60 / 10}, (_, index) => index * 10) : // 如果分钟简单模式，则只显示10的倍数
                Array.from({length: 60}, (_, index) => index) // 如果分钟复杂模式，则显示所有分钟

watch(modelValue, (newValue) => {
    hour.value = newValue?.getHours() || 0
    minute.value = newValue?.getMinutes() || 0
}, {immediate: true})

watch(hour, (newValue) => {
    modelValue.value = new Date(modelValue.value.getFullYear(), modelValue.value.getMonth(), modelValue.value.getDate(), newValue, minute.value)
})

watch(minute, (newValue) => {
    modelValue.value = new Date(modelValue.value?.getFullYear() || 0, modelValue.value?.getMonth() || 0, modelValue.value?.getDate() || 0, hour.value, newValue)
})
</script>



<style scoped lang="scss">

$bg-item: #f7f7f7;
$bg-item-active: black;

$text-color: #333;
$text-subtitle: #666;
$text-item: black;
$text-item-active: white;
$border-color-highlight: black;
$border-color: #ddd;


.time-picker{
    .time-picker-time-value{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        .hour, .minute, .separator{
            font-size: 30px;
        }

    }
}
.time-picker-panel{
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    gap: 5px;
}

.hour-picker, .minute-picker {
    background-color: white;
    border: 1px solid $border-color;
    .picker-header{
        border-bottom: 1px solid $border-color;
        padding: 2px 5px;
        font-size: 12px;
        color: $text-subtitle;
    }
}

.hour-list{
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    .hour-list-item{
        text-align: center;
        width: 25%;
    }
}

.minute-list{
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    .minute-list-item{
        width: 10%;
    }
}

.hour-list-item, .minute-list-item{
    flex-shrink: 0;

    font-size: 12px;
    background-color: $bg-item;
    text-align: center;
    line-height: 1;
    height: 20px;
    overflow: hidden;
    //border-radius: 20px;
    border: 1px solid transparent;


    display: flex;
    justify-content: center;
    align-items: center;

    white-space: nowrap;
    cursor: pointer;
    &:active{
        transform: translateY(2px);
    }
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:hover{
        border-color: $border-color-highlight;
        color: $text-item;
    }
    &.active{
        background-color: $bg-item-active;
        color: $text-item-active;
    }

}


</style>
