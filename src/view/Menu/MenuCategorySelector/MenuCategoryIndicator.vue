<template>
    <!-- 移动端导航：5×3 类别色圆点，选中实心 / 未选中空心 -->
    <div class="indicator-list" title="类别">
        <div
            class="indicator-list-item"
            v-for="(item, index) in useStatisticStore().categoryAll"
            :key="index"
            :style="indicatorItemStyle(item)"
        />
    </div>
</template>

<script lang="ts" setup>
import {CategoryEntity} from "@/entity/Category.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {useStatisticStore} from "@/pinia/useStatisticStore.ts";
const projectStore = useProjectStore()

// 选中：类别色实心；未选中：同色空心描边
function indicatorItemStyle(category: CategoryEntity): string{
    const color = category.color
    if (projectStore.filteredCategories.indexOf(category.name_en) > -1){
        return `border-color: ${color}; background-color: ${color};`
    } else {
        return `border-color: ${color}; background-color: transparent;`
    }
}

</script>

<style lang="scss" scoped>
@use "../../../scss/plugin" as *;

$dot-size: 5px;
$dot-gap: 2px;
$grid-cols: 5;

.indicator-list{
    // 与 TabIcon 占位一致，便于替换导航栏类别按钮
    height: $height-navbar;
    width: $height-navbar;
    cursor: pointer;
    @extend .btn-like;
    box-sizing: border-box;
    padding: 8px;

    // 固定 5 列，类别按顺序铺成 5×3 点阵
    display: grid;
    grid-template-columns: repeat($grid-cols, $dot-size);
    grid-auto-rows: $dot-size;
    gap: $dot-gap;
    place-content: center;
}

.indicator-list-item{
    width: $dot-size;
    height: $dot-size;
    border-radius: 50%;
    border: 1.5px solid transparent;
    box-sizing: border-box;
    flex-shrink: 0;
}
</style>
