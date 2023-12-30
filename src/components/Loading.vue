<template>
    <!--加载动画-->
    <div v-if="props.loading" class="loading">
        <div class="loading-1 loading-item"></div>
        <div class="loading-2 loading-item"></div>
        <div class="loading-3 loading-item"></div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped lang="scss">
@import "../scss/plugin";
// navbar 的高度是 45px, loading 的高度是 30px 上下的 padding 就是 15/2 px
.loading{
    box-sizing: content-box;
    height: $height-loading;
    padding: 7.5px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    .loading-item{
        width: 3px;
        margin-right: 5px;
        &:last-child{
            margin-right: 0;
        }
    }
    &-1{
        height: $height-loading * 1;
        @include animation(load-frame-1 1s infinite linear 0s);
        background-color: $red;
    }
    &-2{
        height: $height-loading * 0.5;
        @include animation(load-frame-2 1s infinite linear 0s);
        background-color: $color-main;
    }
    &-3{
        height: $height-loading * 0.25;
        @include animation(load-frame-1 1s infinite linear 0s);
        background-color: $green;
    }
}

@keyframes load-frame-1 {
    0% {height: $height-loading * .25}
    50% {height: $height-loading * 1}
    100% {height: $height-loading * .25}
}

@keyframes load-frame-2 {
    0% {height: $height-loading * 1}
    50% {height: $height-loading * .25}
    100% {height: $height-loading * 1}
}


</style>
