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
            <div :class="['menu-category-item', 'menu-category-shared', {active: isFilterShared}]"
                 @click="toggleFilterShared">过滤共享日记</div>
        </div>

        <div class="menu-category-list category-operations-container">
            <div @click="selectCategoryAll" class="menu-btn">全选</div>
<!--            <div @click="selectCategoryNone" class="menu-btn">全不选</div>-->
            <div @click="reverseCategorySelect" class="menu-btn">反选</div>
            <div @click="selectCategoryWork" class="menu-btn">周报</div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import {nextTick, onMounted, Ref, ref, watch} from "vue";
import {getDiaryConfig} from "../../utility.ts";
import {useProjectStore} from "../../pinia";
import {CategoryEntity} from "../../entity/Category.ts";

const storeProject = useProjectStore()

const filterShared = ref(false) // 是否筛选已共享的日记
const categories: Ref<string[]> = ref([]) // category

onMounted(()=>{
    filterShared.value = getDiaryConfig().isFilterShared
    nextTick(() => {
        categories.value = getDiaryConfig().filteredCategories
    })
})

watch(categories, {
    deep: true,
    handler(newValue) {
        storeProject.filteredCategories = newValue
    }
})

watch(filterShared, newValue => {
    storeProject.isFilterShared = newValue
})


function toggleFilterShared(){
    storeProject.isFilterShared = !storeProject.isFilterShared
}
function toggleCategory(category: CategoryEntity){
    let index = categories.value.indexOf(category.name_en)
    if ( index > -1) {
        categories.value.splice(index, 1)
    } else {
        categories.value.push(category.name_en)
    }
}
function categoryMenuItemStyle(category: CategoryEntity){
    if (categories.value.indexOf(category.name_en) > -1){
        return `background-color: ${category.color}; border: 1px solid ${category.color};`
    } else {
        return ``
    }
}
function selectCategoryAll() {
    categories.value = storeProject.categoryAll.map(item => item.name_en)
}
function selectCategoryNone() {
    categories.value = []
}
function reverseCategorySelect() {
    let tempCategories = [].concat(storeProject.categoryAll.map(item => item.name_en))
    categories.value.forEach(item => {
        tempCategories.splice(tempCategories.indexOf(item), 1)
    })
    categories.value = tempCategories
}
function selectCategoryWork(){
    categories.value = ['work', 'week']
}
</script>
