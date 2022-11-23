<template>
    <div :class="['list-header', {big: size === 'big'}]">{{ title }}</div>
</template>

<script>
export default {
    name: "ListHeader",
    props: {
        title: {
            type: String,
            require: true
        },
        size: {
            type: String
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";

.list-header{
    letter-spacing: 1px;
    border-top: 1px solid $color-border;
    border-bottom: 1px solid $color-border;
    font-size: $fz-list-header;
    font-weight: bold;
    text-align: left;
    padding: 0 20px;
    color: $text-date;
    background-color: $bg-light;
    height: $height-header;
    line-height: $height-header;
    font-family: 'ImpactDiary';
    text-shadow: 1px 1px 0 rgba(0,0,0,0.1);
    &.big{
        border-bottom: none;
        padding: 10px 20px;
        height: auto;
        font-size: $fz-big;
    }
}

@media (max-width: $grid-separate-width-sm) {
    .list-header {
        font-size: $fz-list-header-mobile;
    }
}



</style>
