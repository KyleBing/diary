<template>
    <div :class="[
            'btn',
            {'btn-light': props.type === 'light'},
            {'btn-active': props.type === 'active'},
            {'btn-inactive': props.type === 'inactive'},
        ]"
         @click="emit('click')"
         @submit="emit('submit')"
    >
        <slot/>
        <div v-if="isLoading" class="loading">
            <div class="loading-1 loading-item"></div>
            <div class="loading-2 loading-item"></div>
            <div class="loading-3 loading-item"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'active' // active | inactive | light
    }
})
const emit = defineEmits( ['click', 'submit'])
</script>


<style scoped lang="scss">
@import "../scss/plugin";
.btn{
    display: flex;
    justify-content: center;
    align-items: center;
}

$height-loading-btn: 20px;
.loading{
    margin-left: 10px;
    box-sizing: content-box;
    height: $height-loading-btn;
    display: flex;
    align-items: center;
    justify-content: center;
    .loading-item{
        width: 3px;
        margin-right: 3px;
        &:last-child{
            margin-right: 0;
        }
    }
    &-1{
        height: $height-loading-btn * 1;
        @include animation(load-frame-1 1s infinite linear 0s);
        background-color: $grass;
    }
    &-2{
        height: $height-loading-btn * 0.5;
        @include animation(load-frame-2 1s infinite linear 0s);
        background-color: $color-main;
    }
    &-3{
        height: $height-loading-btn * 0.25;
        @include animation(load-frame-1 1s infinite linear 0s);
        background-color: $magenta;
    }
}

@keyframes load-frame-1 {
    0% {height: $height-loading-btn * .25}
    50% {height: $height-loading-btn * 1}
    100% {height: $height-loading-btn * .25}
}

@keyframes load-frame-2 {
    0% {height: $height-loading-btn * 1}
    50% {height: $height-loading-btn * .25}
    100% {height: $height-loading-btn * 1}
}


</style>

