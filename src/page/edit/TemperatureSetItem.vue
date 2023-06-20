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
        <div class="unit"> ℃</div>
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
        }
    },
    mounted() {
        this.$nextTick(_=> {
            this.temperatureLocal = Number(this.modelValue)
        })
    },
    data(){
        return {
            temperatureLocal: 0
        }
    },
    methods: {
        mouseWheelScrolled(event){
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

$height: 70px;
.temperature-set-item{
    height: $height;
    width: 49%;
    @include border-radius($radius-mobile);
    background-color: $bg-light;
    position: relative;
    border: 1px solid $color-border;
    input{
        text-align: center;
        line-height: $height;
        background-color: transparent;
        display: block;
        width: 100%;
        font-size: 3rem;
        font-family: "DS-Digital", sans-serif;
        cursor: ns-resize;
    }
    label{
        top: 5px;
        left: 5px;
        font-size: $fz-small;
        color: $text-content;
        position: absolute;
    }
    .unit{
        position: absolute;
        right: 8px;
        bottom: 8px;
        font-size: $fz-list-content;
        color: $text-content;
    }
}

</style>
