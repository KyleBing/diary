<template>
    <MenuPanelContainer>
        <ul class="menu-category-list">
            <li class="menu-category-item" v-for="(item, index) in useStatisticStore().categoryAll" :key="index"
                :style="categoryMenuItemStyle(item)"
                @click="toggleCategory(item)"
            >
                <div>{{ item.name }}<span class="count">{{ useStatisticStore().statisticsCategory[item.name_en] }}</span></div>
            </li>
        </ul>

        <div class="menu-category-list category-operations-container">
            <div :class="['menu-category-item', 'menu-category-shared', {active: projectStore.isFilterShared}]"
                 @click="toggleFilterShared">共享日记</div>

        </div>

        <div class="menu-category-list category-operations-container">
            <div @click="selectCategoryAll" class="menu-btn">全选</div>
            <div @click="reverseCategorySelect" class="menu-btn">反选</div>
        </div>
    </MenuPanelContainer>
</template>

<script lang="ts" setup>

import {onMounted, ref, watch} from "vue";
import {getDiaryConfigFromLocalStorage} from "@/utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {CategoryEntity} from "@/entity/Category.ts";
import MenuPanelContainer from "@/framework/MenuPanelContainer.vue";
import {useStatisticStore} from "@/pinia/useStatisticStore.ts";
const projectStore = useProjectStore()

const filterShared = ref(false) // 是否筛选已共享的日记

onMounted(()=>{
    filterShared.value = getDiaryConfigFromLocalStorage().isFilterShared
})

watch(filterShared, newValue => {
    projectStore.isFilterShared = newValue
})

function toggleFilterShared(){
    projectStore.SET_IS_FILTERED_SHARED(!projectStore.isFilterShared)
}
function toggleCategory(category: CategoryEntity){
    let index = projectStore.filteredCategories.indexOf(category.name_en)
    if ( index > -1) {
        projectStore.filteredCategories.splice(index, 1)
    } else {
        projectStore.filteredCategories.push(category.name_en)
    }
    projectStore.SET_FILTERED_CATEGORIES(projectStore.filteredCategories)
    projectStore.isListNeedBeReload = true
}
function categoryMenuItemStyle(category: CategoryEntity){
    if (projectStore.filteredCategories.indexOf(category.name_en) > -1){
        return `background-color: ${category.color}; border: 1px solid ${category.color};`
    } else {
        return ``
    }
}
function selectCategoryAll() {
    projectStore.SET_FILTERED_CATEGORIES(useStatisticStore().getCategoryAllFromLocalStorage().map(item => item.name_en))
}
function reverseCategorySelect() {
    let tempCategories = [].concat(useStatisticStore().categoryAll.map(item => item.name_en))
    projectStore.filteredCategories.forEach(item => {
        tempCategories.splice(tempCategories.indexOf(item), 1)
    })
    projectStore.SET_FILTERED_CATEGORIES(tempCategories)
}

</script>
