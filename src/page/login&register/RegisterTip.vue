<template>
    <transition
        enter-active-class="animated-fast fadeIn"
        leave-active-class="animated-fast faceOut"
    >
        <div v-if="htmlContent" class="register-tip mb-6" v-html="htmlContent"/>
    </transition>
</template>


<script lang="ts" setup>
defineProps({
    htmlContent: {
        type: String,
    }
})

</script>

<style lang="scss">
@import "../../scss/plugin";
.register-tip {
    width: 100%;
    padding: 20px;
    font-size: $fz-small;
    @include border-radius($radius-pc);
    background-color: $bg-menu;
    color: $dark-text-title;
    line-height: 1.3;
    hr{
        margin: 10px 0;
        border-bottom: 1px solid $color-border-menu;
    }

    h1,h2,h3,h4,h5,h6{
        text-align: center;
        margin-bottom: 20px;
        font-size: $fz-title;
    }
    p{}
    ol{
        padding: 10px;
        margin-left: 30px;
        li{}
    }
    a{
        color: $green;
        &:hover{
            color: $color-main;
        }
    }
}
</style>
