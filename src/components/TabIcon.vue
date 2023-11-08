<template>
    <div :class="[
            'icon-btn',
            {wide: alt === 'LOGO'},
            {small: size === 'small'},
            {black: alt.indexOf('黑色') > -1}
        ]">
        <img :alt="alt"
             :title="alt"
             :src="icons.get(alt)">
    </div>
</template>

<script>
import ICONS from "../assets/img/SvgIcons";
export default {
    name: "TabIcon",
    props:{
        alt: {
            type: String,
            require: true
        },
        size: {
            type: String,
            default: '', // small normal big
        }
    },
    data(){
        return{}
    },
    computed:{
        icons(){
            let iconMap = new Map()
            iconMap.set('LOGO', ICONS.logo)
            iconMap.set('保存', ICONS.tab.done)
            iconMap.set('确定', ICONS.tab.done)
            iconMap.set('确定-已保存', ICONS.tab.doneSaved)
            iconMap.set('确定-已变化', ICONS.tab.doneChanged)
            iconMap.set('添加', ICONS.tab.add)
            iconMap.set('关闭', ICONS.tab.close)
            iconMap.set('返回', ICONS.tab.back)
            iconMap.set('删除', ICONS.tab.delete)
            iconMap.set('编辑', ICONS.tab.edit)
            iconMap.set('菜单', ICONS.tab.menu)
            iconMap.set('恢复', ICONS.tab.recover)
            iconMap.set('搜索', ICONS.tab.search)
            iconMap.set('分享', ICONS.tab.share)
            iconMap.set('账单', ICONS.tab.bill)
            iconMap.set('其它', ICONS.tab.others)
            iconMap.set('银行卡', ICONS.tab.card)
            iconMap.set('内容隐藏', ICONS.tab.contentHide)
            iconMap.set('内容显示', ICONS.tab.contentShow)
            iconMap.set('列表简洁', ICONS.tab.listSimple)
            iconMap.set('列表详情', ICONS.tab.listDetail)

            iconMap.set('黑色-添加', ICONS.tabDark.add)
            iconMap.set('黑色-关闭', ICONS.tabDark.close)
            iconMap.set('黑色-返回', ICONS.tabDark.back)
            iconMap.set('黑色-删除', ICONS.tabDark.delete)
            iconMap.set('黑色-编辑', ICONS.tabDark.edit)
            iconMap.set('黑色-菜单', ICONS.tabDark.menu)
            iconMap.set('黑色-恢复', ICONS.tabDark.recover)
            iconMap.set('黑色-搜索', ICONS.tabDark.search)
            iconMap.set('黑色-分享', ICONS.tabDark.share)
            iconMap.set('黑色-账单', ICONS.tabDark.bill)
            iconMap.set('黑色-其它', ICONS.tabDark.others)
            iconMap.set('黑色-银行卡', ICONS.tabDark.card)
            return iconMap
        }
    },
}
</script>

<style lang="scss" scoped>
@import "../scss/plugin";
$icon-padding-pc: 5px;
$icon-padding-mobile: 3px;

.icon-btn{
    height: $height-navbar;
    width: $height-navbar;
    padding: $icon-padding-pc;
    @extend .btn-like;
    @include border-radius(50px);
    img{
        transition: all 0.2s;
        width: $height-navbar - $icon-padding-pc * 2;
        height: $height-navbar - $icon-padding-pc * 2;
        display: block;
        background-color: transparent;
    }
    &.wide{
        width: $height-navbar + 5;
        img{
            width: $height-navbar - $icon-padding-pc * 2 + 5;
        }
    }
    &:hover{
        img{
            @include border-radius(10px);
            background-color: lighten($bg-menu, 0%);
        }
    }
    &:active{
        img{
            @include border-radius(50px);
            transition: all 0s;
            background-color: lighten($bg-menu, 5%);
        }
    }

    &.small{
        height: $height-navbar - 10;
        width: $height-navbar - 10;
        padding: $icon-padding-mobile;
        img {
            transition: all 0.2s;
            width: $height-navbar - 10 - $icon-padding-mobile * 2;
            height: $height-navbar - 10 - $icon-padding-mobile * 2;
        }
    }

    &.black{
        &:hover{
            img{
                background-color: lighten(white, 0%);
            }
        }
        &:active{
            img{
                background-color: lighten(white, 5%);
            }
        }
    }
}

@media (max-width: $grid-separate-width-sm) {
    .icon-btn{
    }
    img{
        width: $height-navbar - $icon-padding-mobile * 2;
        height: $height-navbar - $icon-padding-mobile * 2;
    }
}

@media (prefers-color-scheme: dark) {
    .icon-btn{
        &:hover{
            img{
                background-color: lighten($dark-bg, 2%);
            }
        }
        &:active{
            img{
                background-color: lighten($dark-bg, 6%);
            }
        }
    }
}


</style>
