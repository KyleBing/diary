<template>
    <div class="date-meta">
        <div class="lunar">{{lunarObject.IMonthCn}}{{lunarObject.IDayCn}}</div>
        <div class="weekday">{{lunarObject.ncWeek}}</div>
    </div>
    <div class="date-set-item">
        <Datepicker
            @wheel="mouseWheelScrolled"
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
import calendar from "js-calendar-converter"
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
            dateLocal: new Date(),
            lunarObject: {
                // Animal: "兔",
                // IDayCn: "初十",
                // IMonthCn: "九月",
                // Term: null,
                // astro: "天蝎座",
                // cDay: 1,
                // cMonth: 11,
                // cYear: 1987,
                // gzDay: "甲寅",
                // gzMonth: "庚戌",
                // gzYear: "丁卯",
                // isLeap: false,
                // isTerm: false,
                // isToday: false,
                // lDay: 10,
                // lMonth: 9,
                // lYear: 1987,
                // nWeek: 7,
                // ncWeek: "星期日"
            }
        }
    },
    methods: {
        mouseWheelScrolled(event){
            if (event.deltaY > 0){
                this.dateMove(1)
            } else {
                this.dateMove(-1)
            }
        },
        // 日期前后移动
        dateMove(step) {
            switch (step) {
                case -1:
                case 1:
                    let dateTemp = new Moment(this.dateLocal)
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
        },
        dateLocal(newValue){
            this.lunarObject = calendar.solar2lunar(
                newValue.getFullYear(),
                newValue.getMonth() + 1,
                newValue.getDate()
            )
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

.date-meta{
    padding: 0 10%;
    display: flex;
    justify-content: space-between;
    color: $text-label;
    .lunar{}
    .weekday{

    }
}

$height: 60px;
.date-set-item{
    box-sizing: content-box;
    height: $height;
    width: 100%;
    @include border-radius($radius-mobile);
    //background-color: $bg-light;
    background-color: white;
    position: relative;
    border: 1px solid $color-border;
    &:hover{
        //background-color: $bg-light;
        border-color: $color-border-highlight;
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
        //font-family: "Galvji", sans-serif;
        font-size: 28px;
        letter-spacing: 1px;
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
