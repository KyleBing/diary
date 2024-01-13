<template>
    <div class="menu-list-item">
        <div class="menu-list-item-wrapper">
            <div class="menu-list-item-icon" v-if="icon">
                <img :src="icon" alt="icon">
            </div>
            <div class="menu-list-item-content">
                <div class="title">{{ menuName }}</div>
            </div>

            <slot></slot>
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
    },
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import "../../scss/plugin";
$height-menu-list: 50px;
$height-icon: 34px;

$gap: 16px;

.menu-list-item{
    width: 50%;
    padding: $gap * 0.5;
    color: white;

    .menu-list-item-wrapper{
        position: relative;
        padding: 0 5px 0 15px;
        background-color: lighten($bg-menu, 4%);
        border: 1px solid lighten($bg-menu, 8%);
        align-items: center;
        display: flex;
        justify-content: flex-start;
        @extend .unselectable;
        @include border-radius($radius-mobile);
        overflow: hidden;
        &:hover{
            border-color: lighten($bg-menu, 12%);
            background-color: lighten($bg-menu, 9%);
        }
        &:active{
            background-color: lighten($bg-menu,12%);
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
            padding: 0 5px;
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
        }
    }
}

@media (max-width: $grid-separate-width-sm) {
    .menu-list-item{
        padding: $gap * 0.4 $gap * 0.5;
        &:nth-child(odd){
            padding-left: 0;
        }
        &:nth-child(even){
            padding-right: 0;
        }
        .menu-list-item-wrapper{
            padding: 0 5px 0 10px;
            @include border-radius($radius-pc);
            .menu-list-item-icon{
                margin-right: 5px;
                width: $height-icon;
                height: $height-icon;
            }
            .menu-list-item-content{
                letter-spacing: 1px;
                padding: 0 5px;
                width: 100%;
                font-size: $fz-menu;
                height: $height-menu-list;
                line-height: $height-menu-list;
                .addon{
                    margin-top: 2px; // 抵消靠上的显示错觉
                    font-size: $fz-list-content;
                    line-height: 1;
                    color: $text-menu-second;
                }
            }
        }
    }
}
@media (prefers-color-scheme: dark) {
    .menu-list-item{
        color: $dark-text-title;
        .menu-list-item-wrapper{
            background-color: lighten($dark-bg-main, 3%);
            border-color: $dark-menu-border;
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
