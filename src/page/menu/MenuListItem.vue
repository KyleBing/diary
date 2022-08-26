<template>
    <div class="menu-list-item">
        <div class="menu-list-item-title">
            <div class="icon">
                <img src="../../assets/img/logo-login.svg" alt="">
            </div>
            <div class="menu-title">{{ menuName }}</div>
        </div>

        <slot></slot>
        <div class="addon" v-if="addOnText">{{ addOnText }}</div>
    </div>
</template>

<script>

export default {
    name: "MenuListItem",
    data() {
        return {
        }
    },
    props: {
        menuName:{
            type: String,
            default: '菜单'
        },
        addOnText:{
            type: String,
            default: ''
        },
    },
    mounted() {
    },

    methods: {

    }
}
</script>

<style lang="scss">
@import "src/assets/scss/plugin";
$height-menu-list: 50px;

.menu-list-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    position: relative;
    font-size: $fz-menu;
    height: $height-menu-list;
    line-height: $height-menu-list;
    padding: 0 15px;
    color: white;
    @extend .unselectable;
    @include border-radius($radius-pc);
    overflow: hidden;
    &:after{
        width: 100%;
        bottom: 0;
        left: 0;
        content: '';
        display: block;
        background-color: $color-border-menu;
        height: 1px;
        position: absolute;
        transform-origin: 0 100%;
        transform: scaleY(0.5);
    }
    &:active{
        background-color: lighten($bg-menu,10%);
    }
    .menu-list-item-title{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .icon{
            width: 30px;
            height: 30px;
            img{
                display: block;
                width: 100%;
            }
        }
        .menu-title{
            margin-left: 10px;

        }
    }

    .addon{
        margin-top: 2px; // 抵消靠上的显示错觉
        font-size: $fz-list-content;
        line-height: 1;
        color: $text-menu-second;
    }
}

</style>
