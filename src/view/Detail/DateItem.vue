<template>
    <div class="date-item">
        <div class="day">{{date.day}}</div>

        <div class="month-year">
            <div class="month">{{date.month}}月</div>
            <div class="year">{{date.year}}</div>
        </div>
        <div class="week">{{date.weekday}}</div>
    </div>

</template>

<script>

export default {
    name: "DateItem",
    props: {
        date: {
            type: Object
        }
    },
}
</script>

<style lang="scss" scoped>
@import "../../scss/_plugin.scss";

.date-item{
    align-items: center;
    display: flex;
    justify-content: flex-start;
}
.day{
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    font-weight: bold;
    color: white;
    background: $gradient-linear-blue;
}
.month-year{
    align-items: flex-end;
    margin-right: 5px;
    display: flex;
    flex-flow: column nowrap;
    .month, .year{
        font-size: $fz-note;
        line-height: 20px;
        height: 20px;
    }
}
.week{
    margin-left: 5px;
}

@media (prefers-color-scheme: dark) {
    color: $dark-text;
}

</style>
