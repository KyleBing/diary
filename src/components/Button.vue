<template>
    <div :class="['button', 'active', type]">
        <slot/>
    </div>
</template>

<script lang="ts" setup>

defineProps<{
    type?: string
}>()

</script>

<style scoped lang="scss">
@import "../scss/plugin";
.button {
    border: 1px solid $color-border;
    padding: 8px 15px;
    text-align: center;
    background: linear-gradient(to bottom, lighten($bg-light, 20%), $bg-light);
    font-weight: bold;
    width: 100%;
    display: block;
    font-size: $fz-title;
    cursor: pointer;
    @include border-radius();

    &:active {
        transform: translateY(2px);
    }

    @extend .btn-like;
    &.active {
        border-color: $color-main;
        color: $bg-main;
        background: linear-gradient(to bottom, lighten($color-main, 20%), $color-main);
        //background-color: $color-main;
        &:hover {
            background: linear-gradient(to bottom, lighten($color-main, 10%), $color-main);
        }
        &:active{
            background: linear-gradient(to top, lighten($color-main, 20%), $color-main);
        }
    }
}



@media (prefers-color-scheme: dark) {

}

</style>
