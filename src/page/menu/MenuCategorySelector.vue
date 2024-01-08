<template>
    <!--category-->
    <div class="menu-category" >
        <ul class="menu-category-list">
            <li class="menu-category-item" v-for="(item, index) in storeProject.categoryAll" :key="index"
                :style="categoryMenuItemStyle(item)"
                @click="toggleCategory(item)"
            >
                <div>{{ item.name }}<span class="count">{{ storeProject.statisticsCategory[item.name_en] }}</span></div>
            </li>
        </ul>

        <div class="menu-category-list category-operations-container">
            <div :class="['menu-category-item', 'menu-category-shared', {active: storeProject.isFilterShared}]"
                 @click="toggleFilterShared">过滤共享日记</div>
        </div>

        <div class="menu-category-list category-operations-container">
            <div @click="selectCategoryAll" class="menu-btn">全选</div>
            <div @click="reverseCategorySelect" class="menu-btn">反选</div>
            <div @click="selectCategoryWork" class="menu-btn">周报</div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import {onMounted, ref, watch} from "vue";
import {getCategoryAll, getDiaryConfigFromLocalStorage} from "@/utility.ts";
import {useProjectStore} from "@/pinia";
import {CategoryEntity} from "@/entity/Category.ts";

const storeProject = useProjectStore()

const filterShared = ref(false) // 是否筛选已共享的日记

onMounted(()=>{
    filterShared.value = getDiaryConfigFromLocalStorage().isFilterShared
})

watch(filterShared, newValue => {
    storeProject.isFilterShared = newValue
})

function toggleFilterShared(){
    storeProject.SET_IS_FILTERED_SHARED(!storeProject.isFilterShared)
}
function toggleCategory(category: CategoryEntity){
    let index = storeProject.filteredCategories.indexOf(category.name_en)
    if ( index > -1) {
        storeProject.filteredCategories.splice(index, 1)
    } else {
        storeProject.filteredCategories.push(category.name_en)
    }
    storeProject.SET_FILTERED_CATEGORIES(storeProject.filteredCategories)
    storeProject.isListNeedBeReload = true
}
function categoryMenuItemStyle(category: CategoryEntity){
    if (storeProject.filteredCategories.indexOf(category.name_en) > -1){
        return `background-color: ${category.color}; border: 1px solid ${category.color};`
    } else {
        return ``
    }
}
function selectCategoryAll() {
    storeProject.SET_FILTERED_CATEGORIES(getCategoryAll().map(item => item.name_en))
}
function reverseCategorySelect() {
    let tempCategories = [].concat(storeProject.categoryAll.map(item => item.name_en))
    storeProject.filteredCategories.forEach(item => {
        tempCategories.splice(tempCategories.indexOf(item), 1)
    })
    storeProject.SET_FILTERED_CATEGORIES(tempCategories)
}
function selectCategoryWork(){
    storeProject.SET_FILTERED_CATEGORIES(['work', 'week'])
}
</script>
