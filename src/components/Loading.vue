<template>
    <!--加载动画-->
    <div v-if="loading" class="loading">
        <div class="loading-1 loading-item"></div>
        <div class="loading-2 loading-item"></div>
        <div class="loading-3 loading-item"></div>
        <div class="loading-4 loading-item"></div>
    </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
    loading: boolean
}>(), {
    loading: false
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
    .loading-1{
        @include animation(load-frame-1 1.2s infinite linear 0s);
        @include box-shadow(2px 4px 2px rgba(0,0,0,0.1));
        background-color: $red;
    }
    .loading-2{
        @include animation(load-frame-2 1.2s infinite linear 0s);
        @include box-shadow(2px 4px 2px rgba(0,0,0,0.1));
        background-color: $yellow;
    }
    .loading-3{
        @include animation(load-frame-3 1.2s infinite linear 0s);
        @include box-shadow(2px 4px 2px rgba(0,0,0,0.1));
        background-color: $green;

    }
    .loading-4{
        @include animation(load-frame-4 1.2s infinite linear 0s);
        @include box-shadow(2px 4px 2px rgba(0,0,0,0.1));
        background-color: $blue;
    }
}

@keyframes load-frame-1 {
    0% {height: $height-loading * .15}
    25% {height: $height-loading * .65}
    50% {height: $height-loading * 1}
    75% {height: $height-loading * .65}
    100% {height: $height-loading * .15}
}
@keyframes load-frame-2 {
    0% {height: $height-loading * .65}
    25% {height: $height-loading * 1}
    50% {height: $height-loading * .65}
    75% {height: $height-loading * .15}
    100% {height: $height-loading * .65}
}
@keyframes load-frame-3 {
    0% {height: $height-loading * 1}
    25% {height: $height-loading * .65}
    50% {height: $height-loading * .15}
    75% {height: $height-loading * .65}
    100% {height: $height-loading * 1}
}
@keyframes load-frame-4 {
    0% {height: $height-loading * .65}
    25% {height: $height-loading * .15}
    50% {height: $height-loading * .65}
    75% {height: $height-loading * 1}
    100% {height: $height-loading * .65}
}

</style>
