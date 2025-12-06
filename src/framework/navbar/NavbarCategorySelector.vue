<template>
    <!--category-->
    <div class="navbar-category-filter">
        <transition
            enter-active-class="animated-fast slideInRight"
            leave-active-class="animated-fast slideOutRight"
        >
            <div class="navbar-category-list-container" >
                <div class="navbar-category-list">
                    <div :class="['navbar-category-list-item', {active: projectStore.filteredCategories.includes(item.name_en), 'pulse-animate': isAnimating === index}]"
                         v-for="(item, index) in useStatisticStore().categoryAll" :key="index"
                         :title="item.name"
                         @click="toggleCategory(item, index)"
                    >
                    <div class="dot" :style="dotStyle(item)"></div>
                    <!-- <div class="name"> {{ item.name }} </div> -->
                </div>

                    <div :class="['navbar-category-list-item', 'share-item' ,'ml-3', {active: projectStore.isFilterShared}]" @click="toggleFilterShared">
                        <div class="dot" :style="projectStore.isFilterShared ? 'border-color: white; background-color: white;' : 'border-color: white;'"></div>
                    </div>

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
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {CategoryEntity} from "@/entity/Category.ts";
import {useStatisticStore} from "@/pinia/useStatisticStore.ts";
import {ref} from "vue";

const projectStore = useProjectStore()
const isAnimating = ref<number | null>(null)

function toggleFilterShared(){
    projectStore.SET_IS_FILTERED_SHARED(!projectStore.isFilterShared)
    projectStore.isListNeedBeReload = true
}
function toggleCategory(category: CategoryEntity, index: number){
    // Trigger animation
    isAnimating.value = index
    setTimeout(() => {
        isAnimating.value = null
    }, 300) // Match animation duration
    
    let idx = projectStore.filteredCategories.indexOf(category.name_en)
    if ( idx > -1) {
        projectStore.filteredCategories.splice(idx, 1)
    } else {
        projectStore.filteredCategories.push(category.name_en)
    }
    projectStore.SET_FILTERED_CATEGORIES(projectStore.filteredCategories)
    projectStore.isListNeedBeReload = true
}
function selectCategoryNone() {
    projectStore.SET_FILTERED_CATEGORIES([])
    projectStore.isListNeedBeReload = true
}
function reverseCategorySelect() {
    let tempCategories: string[] = useStatisticStore().categoryAll.map(item => item.name_en)
    projectStore.filteredCategories.forEach(item => {
        tempCategories.splice(tempCategories.indexOf(item), 1)
    })
    projectStore.SET_FILTERED_CATEGORIES(tempCategories)
    projectStore.isListNeedBeReload = true
}

function dotStyle(category: CategoryEntity){
    const isActive = projectStore.filteredCategories.indexOf(category.name_en) > -1
    if (isActive){
        return `border-color: ${category.color}; background-color: ${category.color};`
    } else {
        return `border-color: ${category.color};`
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
    //font-size: $fz-small;
    font-size: 13px;
    padding: 0 3px;
    height: $nav-btn-height;
    font-weight: normal;
    line-height: $nav-btn-height;
    color: transparentize(white, 0.6);
    border-left: 1px solid transparent;
    //@extend .btn-like;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-flow: row nowrap;
    cursor: pointer;
    @extend .unselectable;

    &.special{
        font-weight: bold;
        color: transparentize($color-main, 0.4);
    }
    &.active{
        color: white;
        font-weight: bold;
        &:hover{
            text-shadow: 2px 2px 1px transparentize(black, 0.5);
        }
        .dot{
            border-width: 2px;
            opacity: 1;
            height: 20px;
            background-color: inherit;
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
        .dot{
            box-shadow: 0 0 3px rgba(255,255,255,0.7);
            opacity: 1;
        }
    }

    .dot{
        opacity: 0.8;
        background-color: transparent;
        border: 2px solid transparent;
        display: block;
        width: 10px;
        height: 10px;
        @include border-radius(8px);
        margin-right: 5px;
        transition: all 0.2s;
    }
    .name{
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
