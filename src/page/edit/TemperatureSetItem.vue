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

<script>
export default {
    name: "TemperatureSetItem",

    props: {
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
    },
    mounted() {
        this.$nextTick(_=> {
            if (this.modelValue === ''){
                this.temperatureLocal = ''
            } else {
                this.temperatureLocal = Number(this.modelValue)
            }
        })
    },
    data(){
        return {
            temperatureLocal: ''
        }
    },
    methods: {
        mouseWheelScrolled(event){
            event.preventDefault()
            if (this.temperatureLocal === ''){
                this.temperatureLocal = 20 // 数值变化从 20 开始
            }
            if (event.deltaY > 0){
                this.temperatureLocal = this.temperatureLocal + 1
            } else {
                this.temperatureLocal = this.temperatureLocal - 1
            }
            this.$emit('update:modelValue', String(this.temperatureLocal))
        },
        keyPressed(event){
            switch (event.key){
                case 'ArrowUp':
                    if (this.temperatureLocal === ''){
                        this.temperatureLocal = 20 // 数值变化从 20 开始
                    }
                    if (event.metaKey || event.ctrlKey){
                        this.temperatureLocal = this.temperatureLocal + 10
                    } else {
                        this.temperatureLocal = this.temperatureLocal + 1
                    }
                    event.preventDefault()
                    break;
                case 'ArrowDown':
                    if (this.temperatureLocal === ''){
                        this.temperatureLocal = 20 // 数值变化从 20 开始
                    }
                    if (event.metaKey || event.ctrlKey){
                        this.temperatureLocal = this.temperatureLocal - 10
                    } else {
                        this.temperatureLocal = this.temperatureLocal - 1
                    }
                    event.preventDefault()
                    break;
                default: break
            }
            this.$emit('update:modelValue', String(this.temperatureLocal))
        }
    },
    watch:{
        modelValue(newValue){
            if (newValue === ''){
                this.temperatureLocal = ''
            } else {
                this.temperatureLocal = Number(newValue)
            }
        },
        temperatureLocal(newValue){
            this.$emit('update:modelValue', String(newValue))
        }
    }
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
