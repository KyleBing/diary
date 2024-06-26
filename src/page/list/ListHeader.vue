<template>
    <div :class="['list-header', {big: size === 'big'}, {medium: size === 'medium'}]">{{ title }}</div>
</template>

<script lang="ts" setup>

defineProps<{
    title: string,
    size?: string
}>()

</script>

<style scoped lang="scss">
@import "../../scss/plugin";

.list-header{
    font-size: $fz-list-header;
    text-align: left;
    padding: 3px 20px;
    //color: $text-date;
    background-color: $bg-light;
    //height: $height-header;
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

@media (prefers-color-scheme: dark) {
    .list-header{
        border-color: $dark-border !important;
        background-color: $dark-list-header-bg !important;
        @include border-radius($radius-mobile);
        color: white !important;
        &.big{
            margin: 0 10px;
        }
    }
}




</style>
