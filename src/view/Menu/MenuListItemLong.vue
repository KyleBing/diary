<template>
    <div class="menu-list-item">
        <div class="menu-list-item-icon" v-if="icon">
            <img :src="icon" alt="icon">
        </div>
        <div class="menu-list-item-content">
            <div class="title">{{ menuName }}</div>
            <slot></slot>
            <div class="addon" v-if="addOnText">{{ addOnText }}</div>
        </div>
    </div>
</template>

<script>

export default {
    name: "MenuListItem",
    props: {
        icon:{
            type: String,
            default: null
        },
        menuName:{
            type: String,
            default: '菜单'
        },
        addOnText:{
            type: String,
            default: ''
        },
    },
}
</script>

<style lang="scss" scoped>
@import "../../scss/plugin";
$height-menu-list: 50px;
$height-icon: 34px;
.menu-list-item{
    width: 100%;
    padding: 0 10px;
    align-items: center;
    display: flex;
    justify-content: flex-start;
    @extend .unselectable;
    @include border-radius($radius-pc);
    overflow: hidden;
    color: white;
    &:hover{
        background-color: lighten($bg-menu, 5%);
    }

    &:active{
        background-color: lighten($bg-menu,10%);
    }

    .menu-list-item-icon{
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        width: $height-icon;
        height: $height-icon;
        img{
            display: block;
            width: 100%;
        }
    }
    .menu-list-item-content{
        letter-spacing: 1px;
        padding: 0 10px 0 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        position: relative;
        font-size: $fz-menu;
        height: $height-menu-list;
        line-height: $height-menu-list;

        .addon{
            margin-top: 2px; // 抵消靠上的显示错觉
            font-size: $fz-list-content;
            line-height: 1;
            color: $text-menu-second;
        }

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
    }
}
@media (prefers-color-scheme: dark) {
    .menu-list-item{
        color: $dark-text-title;
        &:hover{
            background-color: lighten($dark-bg, 0.9);
        }
        .menu-list-item-content{
            &:after{
                width: 100%;
                bottom: 0;
                left: 0;
                content: '';
                display: block;
                background-color: $dark-menu-border;
                height: 1px;
                position: absolute;
                transform-origin: 0 100%;
                transform: scaleY(0.5);
            }
        }
    }
}


</style>
