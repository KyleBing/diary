<template>
    <div :class="['temperature-set-item',{active: !!temperatureLocal}]">
        <input placeholder="--"
               autocomplete="off"
               class="temperature"
               name="temperature"
               id="temperature"
               v-model.trim="temperatureLocal"
        >
        <div class="unit">{{unit}}</div>
    </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref, watch} from "vue";

const props = defineProps({
    label: {
        type: String,
        default: '温度'
    },
    modelValue: {
        type: String,
        default: '20'
    },
    unit: {
        type: String,
        default: '℃'
    }
})
const emit = defineEmits(['update:modelValue'])

// 最后一个正确的值，如果接下来的输入操作不正常，将回退到这个值
// 初始值一定是正确的。
const lastCorrectValue = ref('')

onMounted(()=>{
    nextTick(() => {
        temperatureLocal.value = props.modelValue
        lastCorrectValue.value = props.modelValue
    })
})

const temperatureLocal = ref('')

watch(() => props.modelValue, newValue => {
    temperatureLocal.value = newValue

})
watch(temperatureLocal, newValue => {
    emit('update:modelValue', newValue)
})

</script>

<style scoped lang="scss">
@import "../../scss/plugin";

.temperature-set-item{
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    &:hover{
        border-color: $color-border-highlight;
        input{
            color: black;
        }
    }
    &.active{
        input{
            color: $text-content;
        }
        .unit{
            color: $text-content;
        }
    }
    input{
        padding: 0 5px 0 10px;
        color: $text-content;
        text-align: right;
        background-color: transparent;
        display: block;
        width: 100%;
        font-size: $fz-label;
        border-bottom: 1px solid transparent;
        cursor: ns-resize;
        &:hover{
            border-color: $color-border-highlight;
        }
    }
    .unit{
        font-size: $fz-label;
        color: $text-label;
    }
}

@media (prefers-color-scheme: dark) {
    .temperature-set-item{
        input{
            color: $dark-text;
        }
        .unit{
            color: $dark-text;
        }
        &.active{
            input{
                color: $dark-text-title;
            }
            .unit{
                color: $dark-text-title;
            }
        }
    }
}

</style>
