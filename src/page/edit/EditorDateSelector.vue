<template>
    <div class="date-selector">
        <div class="date-set-item">
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
        </div>
        <div class="date-meta">
            <div class="lunar">{{lunarObject.IMonthCn}}{{lunarObject.IDayCn}}</div>
            <div class="weekday">{{lunarObject.ncWeek}}</div>
        </div>
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
            event.preventDefault()

            if (event.ctrlKey){
                if (event.deltaY > 10){
                    this.dateMove(1)
                } else if (event.deltaY < -10) {
                    this.dateMove(-1)
                }
            } else {
                if (event.deltaY > 10){
                    this.dateTimeMove(1)
                } else if (event.deltaY < -10) {
                    this.dateTimeMove(-1)
                }
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
        },
        // 日期前后移动
        dateTimeMove(step) {
            switch (step) {
                case -1:
                case 1:
                    let dateTemp = new Moment(this.dateLocal)
                    dateTemp.add(step, 'hour')
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
        dateLocal(newValue, oldValue){
            this.lunarObject = calendar.solar2lunar(
                newValue.getFullYear(),
                newValue.getMonth() + 1,
                newValue.getDate()
            )
            this.$emit('update:modelValue', this.dateLocal)

            // 判断是否日期有变，day 有变，emit dayChange, 附带是否为今天的标识
            let dateMomentDiary = new Moment(newValue)
            let dateMomentDiaryOrigin = new Moment(oldValue)
            if ( dateMomentDiary.isSame(dateMomentDiaryOrigin, 'day')){
            } else {
                if (dateMomentDiary.isSame(new Date(), 'day')){
                    this.$emit('dayChange', true)
                } else {
                    this.$emit('dayChange', false)
                }
            }
        }
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
    box-sizing: content-box;
    height: $height;
    width: 100%;
    @include border-radius($radius-mobile);
    position: relative;
    margin-bottom: 5px;
    &:hover{
        background-color: $bg-light;
        border-color: $color-border-highlight;
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
        font-weight: bold;
        font-size: 26px;
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
