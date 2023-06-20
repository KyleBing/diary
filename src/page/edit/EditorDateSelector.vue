<template>
    <div class="date-set-item">
<!--        <label>日期</label>-->
        <Datepicker
            :editable="false"
            :show-now-button="true"
            v-model="dateLocal"
            format="yyyy/MM/dd HH:mm"
            selectText="确定"
            cancelText="取消"
            locale="zh-CN"
            placeholder="----/--/-- --:--"
            input-class="date"
            :clearable="false"
        />
    </div>
</template>

<script>
import Moment from "moment/moment";

export default {
    name: "EditorDateSelector",
    props: {
        modelValue: {
            type: Object,
            default: new Date()
        }
    },
    mounted() {
        this.$nextTick(_=> {
            this.dateLocal = this.modelValue
        })
    },
    data(){
        return {
            dateLocal: new Date()
        }
    },
    methods: {
        mouseWheelScrolled(event){
            if (event.deltaY > 0){
                this.dateLocal = this.dateLocal + 1
            } else {
                this.dateLocal = this.dateLocal - 1
            }
        },
        // 日期前后移动
        dateMove(step) {
            switch (step) {
                case -1:
                case 1:
                    let dateTemp = new Moment(this.diary.date)
                    dateTemp.add(step, 'day')
                    this.dateLocal = dateTemp.toDate()
                    this.$emit('update:modelValue', this.dateLocal)
                    break;
                case 0:
                    this.dateLocal = new Date()
                    this.$emit('update:modelValue', this.dateLocal)
                    break;
            }
        }
    },
    watch: {
        modelValue(newValue){
            this.dateLocal = newValue
        }
    }
}
</script>

<style lang="scss">
@use "sass:math";
@import "../../scss/plugin";

// Overwrite DatePicker Style
// plugin style overwrite

.dp__input{
    border: none !important;
}

.dp__icon.dp__input_icon{ // date picker icon
    display: none !important;
}


$height: 60px;
.date-set-item{
    height: $height;
    width: 100%;
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
        background-color: transparent;
        display: block;
        width: 100%;
        font-family: "Galvji", sans-serif;
        font-size: 25px;
        //font-size: 2.3rem;
        //font-family: "DS-Digital", sans-serif;
        line-height: 40px;
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

</style>
