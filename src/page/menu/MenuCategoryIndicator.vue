<template>
    <div class="menu-category-indicator">
        <div :class="['item', 'category-shared', 'mr-2', {active: isFilterShared}]"></div> <!-- 共享小图标标识 -->
        <div :class="['item' ,{active: filteredCategories.some(category => category === item.name_en)}]"
             :style="filteredCategories.indexOf(item.name_en) > -1? `background-color: ${item.color}`:`border-color: ${item.color}`"
             v-for="(item, index) in categoryAll"
             :title="item.name_en"
             :key="index"></div>
    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex"

export default {
    name: "MenuCategoryIndicator",
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
    computed: {
        ...mapState([
            'isFilterShared',
            'filteredCategories',
            'categoryAll'
        ])
    },
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import "../../scss/plugin";

$item-height: 12px;
$item-width: 6px;
$item-radius: 2px;

// 菜单中的类别标识
.menu-category-indicator{
    display: flex;
    justify-content: flex-start;

    .item{
        margin-left: math.div($item-width, 2);
        height: $item-height;
        width: $item-width;
        display: block;
        @include border-radius($item-radius);
        border: 1px dotted transparent;
    }
    // shared 指示器
    .category-shared{
        border-color: white;
        &.active{
            background-color: white;
        }
    }
}


</style>
