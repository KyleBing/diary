<template>
    <div :class="['temperature-set-item',{active: !!temperatureLocal}]">
        <input placeholder="--"
               @keydown="keyPressed"
               @wheel="mouseWheelScrolled"
               class="temperature"
               name="temperature"
               id="temperature"
               v-model="temperatureLocal"
        >
        <div class="unit">{{unit}}</div>
    </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, Ref, ref, watch} from "vue";

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

onMounted(()=>{
    nextTick(() => {
        if (props.modelValue === ''){
            temperatureLocal.value = ''
        } else {
            temperatureLocal.value = Number(props.modelValue)
        }
    })
})

const temperatureLocal: Ref<null|number|''> = ref(null) // TODO: 确定类型

watch(props.modelValue, newValue => {
    if (newValue === ''){
        temperatureLocal.value = ''
    } else {
        temperatureLocal.value = Number(newValue)
    }
})
watch(temperatureLocal, newValue => {
    emit('update:modelValue', String(newValue))
})


function mouseWheelScrolled(event){
    event.preventDefault()
    if (temperatureLocal.value === ''){
        temperatureLocal.value = 20 // 数值变化从 20 开始
    }
    if (event.deltaY > 0){
        temperatureLocal.value = temperatureLocal.value + 1
    } else {
        temperatureLocal.value = temperatureLocal.value - 1
    }
    emit('update:modelValue', String(temperatureLocal.value))
}
function keyPressed(event){
    switch (event.key){
        case 'ArrowUp':
            if (temperatureLocal.value === ''){
                temperatureLocal.value = 20 // 数值变化从 20 开始
            }
            if (event.metaKey || event.ctrlKey){
                temperatureLocal.value = temperatureLocal.value + 10
            } else {
                temperatureLocal.value = temperatureLocal.value + 1
            }
            event.preventDefault()
            break;
        case 'ArrowDown':
            if (temperatureLocal.value === ''){
                temperatureLocal.value = 20 // 数值变化从 20 开始
            }
            if (event.metaKey || event.ctrlKey){
                temperatureLocal.value = temperatureLocal.value - 10
            } else {
                temperatureLocal.value = temperatureLocal.value - 1
            }
            event.preventDefault()
            break;
        default: break
    }
    emit('update:modelValue', String(temperatureLocal.value))
}

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
