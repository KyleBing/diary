<template>
    <div :class="['btn-normal', props.type]">
        <slot/>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    type: {
        type: String,
        default: ''
    }
})
</script>

<style scoped lang="scss">
@import "../scss/plugin";

.btn-normal{
    line-height: 1;
    background-color: $bg-menu;
    border: 1px solid $bg-menu;
    color: white;
    margin-right: 10px;
    font-size: $fz-main;
    padding: 7px 10px;
    @include border-radius($radius-mobile);
    @extend .btn-like;
    &.confirm{
        background-color: $color-main;
        color: black;
    }
}

@media (prefers-color-scheme: dark) {

}

</style>
