<template>
    <div :class="['list-header', {big: size === 'big'}, {medium: size === 'medium'}]">{{ title }}</div>
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
    font-size: $fz-list-header;
    text-align: left;
    padding: 0 20px;
    //color: $text-date;
    background-color: $bg-light;
    height: $height-header;
    line-height: $height-header;
    //letter-spacing: -0.5px;
    font-family: "Galvji", sans-serif;
    //letter-spacing: 1px;
    color: black;
    font-weight: bold;
    text-shadow: 1px 1px 0 rgba(0,0,0,0.1);
    &.big{
        padding: 10px 20px;
        height: auto;
        font-size: $fz-big;
    }
    &.medium{
        border-bottom: none;
        padding: 3px 20px;
        height: auto;
        font-size: $fz-list-header + 3;
    }
}

// Mobile
@media (max-width: $grid-separate-width-sm) {
    .list-header {
        font-size: $fz-list-header-mobile;
    }
}



</style>
