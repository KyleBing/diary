<template>
    <div class="category-indicator">
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
    name: "CategoryIndicator",
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

<style lang="scss">
@import "../../scss/plugin";


// 菜单中的类别标识
.category-indicator{
    display: flex;
    justify-content: flex-start;

    $item-height: 8px;
    $item-width: 8px;
    $item-radius: 2px;
    .item{
        margin-left: 4px;
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
