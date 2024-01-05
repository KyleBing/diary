<template>
    <!--category-->
    <div class="navbar-category-filter">
        <transition
            enter-active-class="animated-fast slideInRight"
            leave-active-class="animated-fast slideOutRight"
        >
            <div class="navbar-category-list-container" >
                <div class="navbar-category-list">
                    <div :class="['navbar-category-list-item', {active: storeProject.filteredCategories.includes(item.name_en)}]"
                         v-for="(item, index) in storeProject.categoryAll" :key="index"
                         :style="categoryMenuItemStyle(item)"
                         @click="toggleCategory(item)"
                    >{{ item.name }}</div>
                    <div :class="['navbar-category-list-item', 'share-item' ,'ml-3', {active: storeProject.isFilterShared}]" @click="toggleFilterShared">共享</div>

                </div>
                <div class="navbar-category-list-special">
                    <div class="navbar-category-list-item special" @click="reverseCategorySelect">反选</div>
                    <div class="navbar-category-list-item special" @click="selectCategoryNone" >清选</div>
                </div>
            </div>


        </transition>
    </div>
</template>

<script lang="ts" setup>
import {useProjectStore} from "@/pinia";
import {CategoryEntity} from "@/entity/Category.ts";

const storeProject = useProjectStore()

function toggleFilterShared(){
    storeProject.SET_IS_FILTERED_SHARED(!storeProject.isFilterShared)
    storeProject.isListNeedBeReload = true
}
function toggleCategory(category: CategoryEntity){
    let index = storeProject.filteredCategories.indexOf(category.name_en)
    if ( index > -1) {
        storeProject.filteredCategories.splice(index, 1)
    } else {
        storeProject.filteredCategories.push(category.name_en)
    }
    storeProject.isListNeedBeReload = true
}
function selectCategoryNone() {
    storeProject.SET_FILTERED_CATEGORIES([])
    storeProject.isListNeedBeReload = true
}
function reverseCategorySelect() {
    let tempCategories = [].concat(storeProject.categoryAll.map(item => item.name_en))
    storeProject.filteredCategories.forEach(item => {
        tempCategories.splice(tempCategories.indexOf(item), 1)
    })
    storeProject.SET_FILTERED_CATEGORIES(tempCategories)
    storeProject.isListNeedBeReload = true
}

// STYLE
function categoryMenuItemStyle(category: CategoryEntity){
    if (storeProject.filteredCategories.indexOf(category.name_en) > -1){
        return `color: ${category.color}; opacity: 1; font-weight: bold;`
        // return `color: rgba(255,255,255,0.8); font-weight: bold;`
    } else {
        return ``
    }
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import "../../scss/plugin";
$nav-btn-height: 15px;

.navbar-category-filter{
    display: flex;
}

.navbar-category-list-container{
    display: flex;
}


.navbar-category-list-special{
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    height: $height-navbar;
    //padding: ($height-navbar - $nav-btn-height * 2)/2;
    .navbar-category-list-item{
        color: transparentize(white, 0.5);
    }
}
.navbar-category-list{
    flex-shrink: 0;
    flex-grow: 1;
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    padding: math.div($height-navbar - $nav-btn-height * 2, 2);
    height: $height-navbar;
}
.navbar-category-list-item{
    font-size: $fz-small;
    padding: 0 6px;
    height: $nav-btn-height;
    font-weight: normal;
    line-height: $nav-btn-height;
    color: transparentize(white, 0.6);
    @extend .btn-like;

    &.special{
        font-weight: bold;
        color: transparentize($color-main, 0.4);
    }
    &.active{
        color: white;
        font-weight: bold;
        &:hover{
            transform: translateY(-1px);
            text-shadow: 2px 2px 1px transparentize(black, 0.5);
        }
    }
    &:hover{
        font-weight: bold;
        color: rgba(255,255,255,0.6);
        &.active.share-item{
            color: white;
        }
        &.special{
            color: transparentize($color-main, 0.2);
        }
    }

}

$height-indicator: 8px;
.indicator-list{
    width: $height-indicator * (8+3);
    cursor: pointer;
    @extend .btn-like;
    height: $height-navbar;
    //padding: ($height-navbar - $height-indicator * 2 - 3)/2 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-flow: row nowrap;
    .indicator-list-item{
        margin-right: 3px;
        flex-shrink: 0;
        border: 1px dotted white;
        height: $height-indicator;
        width: $height-indicator;
        @include border-radius(2px);
        &:nth-child(2n){
            margin-bottom: 0;
        }
    }
}

@media (max-width: $grid-separate-width-sm) {
    .navbar-category-list{
        display: none;
    }
    .navbar-category-list-special{
        display: none;
    }

}
</style>
