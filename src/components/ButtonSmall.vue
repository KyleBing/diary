<template>
    <div class="button-small">
        <slot/>
    </div>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
@use "sass:color" as color;
@use "../scss/plugin" as *;

.button-small{
    @extend .btn-like;
    line-height: 1;
    text-align: center;
    cursor: pointer;
    border-radius: $radius-mobile - 3;
    background: linear-gradient(to bottom, color.adjust($bg-light, $lightness: 20%), $bg-light);
    font-weight: normal;
    padding: 7px 8px;
    border: 1px solid $color-border;
    font-size: $fz-main;
    &:hover{
        background: linear-gradient(to bottom, color.adjust($bg-light, $lightness: 10%), $bg-light);
    }
    &:active{
        background: linear-gradient(to top, color.adjust($bg-light, $lightness: 20%), $bg-light);
    }
}

@media (prefers-color-scheme: dark) {
    .button-small{
        color: $dark-text-title;
        border-color: $dark-border-active;
        background: linear-gradient(to bottom, color.adjust($dark-bg-main, $lightness: 5%), $dark-bg-main);
        &:hover{
            background: linear-gradient(to bottom, color.adjust($dark-bg-main, $lightness: 5%), $dark-bg-main);
        }
        &:active{
            background: linear-gradient(to top, color.adjust($dark-bg-main, $lightness: 15%), $dark-bg-main);
        }
    }
}

</style>
