<template>
    <div class="temperature-set-item">
        <label for="temperature">{{label}}</label>
        <input placeholder="--"
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
            if (this.temperatureLocal === ''){
                this.temperatureLocal = 20 // 数值变化从 20 开始
            }
            if (event.deltaY > 0){
                this.temperatureLocal = this.temperatureLocal + 1
            } else {
                this.temperatureLocal = this.temperatureLocal - 1
            }
            this.$emit('update:modelValue', String(this.temperatureLocal))
        }
    },
    watch:{
        modelValue(newValue){
            this.temperatureLocal = Number(newValue)
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";

$height: 60px;
.temperature-set-item{
    height: $height;
    //width: 32%;
    width: 48%;
    @include border-radius($radius-mobile);
    //background-color: $bg-light;
    background-color: white;
    position: relative;
    border: 1px solid $color-border;
    &:hover{
        border-color: black;
        label{
            color: black;
        }
        input{
            color: black;
        }
    }
    input{
        color: $text-content;
        text-align: center;
        line-height: $height;
        background-color: transparent;
        display: block;
        width: 100%;
        //font-family: "Galvji", sans-serif;
        //font-size: 25px;
        font-size: 2.2rem;
        font-family: "DS-Digital", sans-serif;
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
        right: 5px;
        bottom: 3px;
        font-size: $fz-list-content;
        color: $text-label;
    }
}

</style>
