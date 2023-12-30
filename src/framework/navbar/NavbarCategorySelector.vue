<template>
    <!--category-->
    <div class="navbar-category-filter">
        <transition
            enter-active-class="animated-fast slideInRight"
            leave-active-class="animated-fast slideOutRight"
        >
            <div class="navbar-category-list-container" >
                <div class="navbar-category-list">
                    <div :class="['navbar-category-list-item', {active: filteredCategories.includes(item.name_en)}]"
                         v-for="(item, index) in categoryAll" :key="index"
                         :style="categoryMenuItemStyle(item)"
                         @click="toggleCategory(item)"
                    >{{ item.name }}</div>
                    <div :class="['navbar-category-list-item' ,'ml-3', {active: isFilterShared}]" @click="toggleFilterShared">共享</div>

                </div>
                <div class="navbar-category-list-special">
                    <div class="navbar-category-list-item special" @click="reverseCategorySelect">反选</div>
                    <div class="navbar-category-list-item special" @click="selectCategoryNone" >清选</div>
                </div>
            </div>


        </transition>
    </div>
</template>

<script>
import utility from "../../utility.js"
import {mapMutations, mapState} from "vuex"
import TabIcon from "../../components/TabIcon.vue";

export default {
    name: "NavbarCategorySelector",
    components: {TabIcon},
    data(){
        return {
            filterShared: false, // 是否筛选已共享的日记
        }
    },
    computed: {
        ...mapState([ 'categoryAll', 'isFilterShared', 'filteredCategories'])
    },
    mounted() {
        this.filterShared = utility.getDiaryConfig().isFilterShared
    },
    methods: {
        ...mapMutations([
            'SET_IS_FILTER_SHARED',
            'SET_FILTERED_CATEGORIES',
            'SET_IS_FILTER_SHARED',
            'SET_IS_LIST_NEED_BE_RELOAD'
        ]),
        toggleFilterShared(){
            this.filterShared = !this.isFilterShared
            this.SET_IS_FILTER_SHARED(this.filterShared)
            this.SET_IS_LIST_NEED_BE_RELOAD(true)
        },
        toggleCategory(category){
            let index = this.filteredCategories.indexOf(category.name_en)
            if ( index > -1) {
                this.filteredCategories.splice(index, 1)
            } else {
                this.filteredCategories.push(category.name_en)
            }
            this.SET_IS_LIST_NEED_BE_RELOAD(true)
        },
        selectCategoryAll() {
            this.filteredCategories = this.categoryAll.map(item => item.name_en)
            this.SET_IS_LIST_NEED_BE_RELOAD(true)

        },
        selectCategoryNone() {
            this.filteredCategories = []
            this.SET_IS_LIST_NEED_BE_RELOAD(true)
        },
        reverseCategorySelect() {
            let tempCategories = [].concat(this.categoryAll.map(item => item.name_en))
            this.filteredCategories.forEach(item => {
                tempCategories.splice(tempCategories.indexOf(item), 1)
            })
            this.filteredCategories = tempCategories
            this.SET_IS_LIST_NEED_BE_RELOAD(true)
        },

        // style
        indicatorItemStyle(category){
            if (this.filteredCategories.indexOf(category.name_en) > -1){
                return `background-color: ${category.color};`
                // return `border-bottom: 1px solid ${category.color};`
            } else {
                return ``
            }
        },
        categoryMenuItemStyle(category){
            if (this.filteredCategories.indexOf(category.name_en) > -1){
                return `color: ${category.color}; opacity: 1; font-weight: bold;`
                // return `color: rgba(255,255,255,0.8); font-weight: bold;`
            } else {
                return ``
            }
        },

    },
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
