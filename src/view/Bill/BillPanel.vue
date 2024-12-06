<template>
    <div class="bill-panel" :style="`width: ${width}px`">
        <div class="bill-panel-title">{{ title }}</div>
        <div class="bill-panel-content"
             :style="`padding: ${padding}`"
        >
            <slot/>
        </div>
    </div>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
    title: string,
    padding?: string  // 10px 10px
    width: number
}>(),{
    padding: '0 0 10px 0',
    width: 300
})

</script>

<style scoped lang="scss">
@import "../../scss/plugin";

.bill-panel{
    flex-shrink: 0;
    overflow: hidden;
    margin-right: 20px;
    width: 300px;
    @include border-radius($radius-pc);
    border: 1px solid $color-border;
    background-color: white;
    .bill-panel-title{
        background: linear-gradient(to bottom, white, #f1f1f1);
        padding: 8px 20px;
        //background-color: $bg-lighter;
        font-weight: bold;
        font-size: $fz-title;
        text-align: center;
        border-bottom: 1px solid $color-border-light;
    }
    .bill-panel-content{
        padding-bottom: 10px;
    }
}

// mobile
@media (max-width: $grid-separate-width-sm) {
    .bill-panel {
        height: auto;
        margin-right: 0;
        margin-bottom: 20px;
        width: 100%;
    }
}

@media (prefers-color-scheme: dark) {
    .bill-panel {
        @include border-radius($radius-pc);
        border: 1px solid $dark-border;
        background-color: $dark-bg-dark;
        .bill-panel-title {
            border-color: $dark-border;
            background: linear-gradient(to bottom, lighten($dark-bg-dark, 5%), $dark-bg);
        }
    }
}

</style>
