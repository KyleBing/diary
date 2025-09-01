<template>
    <div :class="[
            'icon-btn',
            {wide: props.icon === 'LOGO'},
            {small: props.size === 'small'},
            {black: props.icon && props.icon.indexOf('黑色') > -1}
        ]">
        <img :alt="props.icon"
             :title="props.icon"
             :src="iconMap.get(props.icon)">
    </div>
</template>

<script lang="ts" setup>
import ICONS from "../assets/icons/SVG_ICONS.ts";
import {computed} from "vue";

const props = withDefaults(defineProps<{
    icon: 'LOGO'
        | '保存'
        | '确定'
        | '确定-已保存'
        | '确定-已变化'
        | '添加'
        | '关闭'
        | '返回'
        | '删除'
        | '编辑'
        | '菜单'
        | '恢复'
        | '搜索'
        | '分享'
        | '账单'
        | '账单简单'
        | '其它'
        | '银行卡'
        | '文件'
        | '待办'
        | '待办-显示'
        | '内容隐藏'
        | '内容显示'
        | '日历'
        | '日历-选中'
        | '列表简洁'
        | '列表详情'
        | '列表瀑布'
        | '黑色-添加'
        | '黑色-确定'
        | '黑色-关闭'
        | '黑色-返回'
        | '黑色-删除'
        | '黑色-编辑'
        | '黑色-菜单'
        | '黑色-恢复'
        | '黑色-搜索'
        | '黑色-分享'
        | '黑色-账单'
        | '黑色-账单简单'
        | '黑色-其它'
        | '黑色-银行卡'
        | '黑色-文件'
        | '黑色-待办'
        | '黑色-待办-显示'
        | '黑色-内容隐藏'
        | '黑色-内容显示'
        | '黑色-日历'
        | '黑色-列表简洁'
        | '黑色-列表详情'
        | '黑色-列表瀑布'
        | '黑色-日历-选中',
    size?: '' | 'small'
}>(), {
    size: ''
})

const iconMap = computed(() => {
    let iconMap = new Map()
    iconMap.set('LOGO', ICONS.logo_icons.logo)
    iconMap.set('保存', ICONS.tab_icons.done)
    iconMap.set('确定', ICONS.tab_icons.done)
    iconMap.set('确定-已保存', ICONS.tab_icons.doneSaved)
    iconMap.set('确定-已变化', ICONS.tab_icons.doneChanged)
    iconMap.set('添加', ICONS.tab_icons.add)
    iconMap.set('关闭', ICONS.tab_icons.close)
    iconMap.set('返回', ICONS.tab_icons.back)
    iconMap.set('删除', ICONS.tab_icons.delete)
    iconMap.set('编辑', ICONS.tab_icons.edit)
    iconMap.set('菜单', ICONS.tab_icons.menu)
    iconMap.set('恢复', ICONS.tab_icons.recover)
    iconMap.set('搜索', ICONS.tab_icons.search)
    iconMap.set('分享', ICONS.tab_icons.share)
    iconMap.set('账单', ICONS.tab_icons.bill)
    iconMap.set('账单简单', ICONS.tab_icons.billSimple)
    iconMap.set('其它', ICONS.tab_icons.others)
    iconMap.set('银行卡', ICONS.tab_icons.card)
    iconMap.set('文件', ICONS.tab_icons.folder)
    iconMap.set('待办', ICONS.tab_icons.todo)
    iconMap.set('待办-显示', ICONS.tab_icons.todoActive)
    iconMap.set('内容隐藏', ICONS.tab_icons.contentHide)
    iconMap.set('内容显示', ICONS.tab_icons.contentShow)
    iconMap.set('日历', ICONS.tab_icons.calendar)
    iconMap.set('日历-选中', ICONS.tab_icons.calendar_active)
    iconMap.set('列表简洁', ICONS.tab_icons.listSimple)
    iconMap.set('列表详情', ICONS.tab_icons.listDetail)
    iconMap.set('列表瀑布', ICONS.tab_icons.listWaterfall)

    iconMap.set('黑色-添加', ICONS.tab_icons_black.add)
    iconMap.set('黑色-确定', ICONS.tab_icons_black.done)
    iconMap.set('黑色-关闭', ICONS.tab_icons_black.close)
    iconMap.set('黑色-返回', ICONS.tab_icons_black.back)
    iconMap.set('黑色-删除', ICONS.tab_icons_black.delete)
    iconMap.set('黑色-编辑', ICONS.tab_icons_black.edit)
    iconMap.set('黑色-菜单', ICONS.tab_icons_black.menu)
    iconMap.set('黑色-恢复', ICONS.tab_icons_black.recover)
    iconMap.set('黑色-搜索', ICONS.tab_icons_black.search)
    iconMap.set('黑色-分享', ICONS.tab_icons_black.share)
    iconMap.set('黑色-账单', ICONS.tab_icons_black.bill)
    iconMap.set('黑色-账单简单', ICONS.tab_icons_black.billSimple)
    iconMap.set('黑色-其它', ICONS.tab_icons_black.others)
    iconMap.set('黑色-银行卡', ICONS.tab_icons_black.card)
    iconMap.set('黑色-文件', ICONS.tab_icons_black.folder)
    iconMap.set('黑色-待办', ICONS.tab_icons_black.todo)
    iconMap.set('黑色-待办-显示', ICONS.tab_icons_black.todoActive)
    iconMap.set('黑色-内容隐藏', ICONS.tab_icons_black.contentHide)
    iconMap.set('黑色-内容显示', ICONS.tab_icons_black.contentShow)
    iconMap.set('黑色-日历', ICONS.tab_icons_black.calendar)
    iconMap.set('黑色-列表简洁', ICONS.tab_icons_black.listSimple)
    iconMap.set('黑色-列表详情', ICONS.tab_icons_black.listDetail)
    iconMap.set('黑色-列表瀑布', ICONS.tab_icons_black.listWaterfall)
    iconMap.set('黑色-日历-选中', ICONS.tab_icons_black.calendar_active)
    return iconMap
})
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
        //background-color: darken(white, 60%);
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
    .icon-btn{}
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
