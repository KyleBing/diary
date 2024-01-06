<template>
    <div class="btn-small">
        <slot/>
    </div>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
@import "../scss/plugin";

.btn-small{
    cursor: pointer;
    @include border-radius($radius-mobile);
    background-color: white;
    font-weight: normal;
    padding: 5px 8px;
    border: 1px solid $color-border;
    font-size: $fz-main;
    @extend .btn-like;
}

@media (prefers-color-scheme: dark) {
    .btn-small{
        background-color: $dark-bg-nav;
        font-weight: normal;
        padding: 5px 8px;
        color: $dark-text-title;
        border: 1px solid $dark-border;
        font-size: $fz-main;
    }
}

</style>
