<template>
    <div :class="['icon-btn', {wide: alt === 'LOGO'}]">
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
            iconMap.set('银行卡', ICONS.tab.card)
            iconMap.set('内容隐藏', ICONS.tab.contentHide)
            iconMap.set('内容显示', ICONS.tab.contentShow)
            iconMap.set('列表简洁', ICONS.tab.listSimple)
            iconMap.set('列表详情', ICONS.tab.listDetail)
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
