<template>
    <!-- 对齐 iOS CategoryDotGrid：每列 3 点，先竖后横；末尾加共享白点 -->
    <div class="indicator-list" title="类别">
        <div
            class="indicator-list-item"
            v-for="(item, index) in useStatisticStore().categoryAll"
            :key="index"
            :style="indicatorItemStyle(item)"
        />
        <div
            class="indicator-list-item indicator-shared"
            :class="{ active: projectStore.isFilterShared }"
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
$dot-gap: 2.5px;
$per-column: 3;

.indicator-list{
    height: $height-navbar;
    cursor: pointer;
    @extend .btn-like;
    box-sizing: border-box;
    padding: 0 6px;

    // 先填满一列 3 个，再往右开新列（与 iOS LazyHGrid 一致）
    display: grid;
    grid-template-rows: repeat($per-column, $dot-size);
    grid-auto-flow: column;
    grid-auto-columns: $dot-size;
    gap: $dot-gap;
    align-content: center;
    justify-content: center;
}

.indicator-list-item{
    width: $dot-size;
    height: $dot-size;
    border-radius: 50%;
    border: 0.8px solid transparent;
    box-sizing: border-box;
    flex-shrink: 0;
}

.indicator-shared{
    border-color: white;
    background-color: transparent;
    &.active{
        background-color: white;
    }
}
</style>
