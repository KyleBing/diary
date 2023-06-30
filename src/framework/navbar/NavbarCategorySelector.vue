<template>
    <!--category-->
    <div class="navbar-category-filter">
        <transition
            enter-active-class="animated-fast slideInRight"
            leave-active-class="animated-fast slideOutRight"
        >
            <div class="navbar-category-list-container" >
                <div class="navbar-category-list">
                    <div class="navbar-category-list-item"
                         v-for="(item, index) in categoryAll" :key="index"
                         :style="categoryMenuItemStyle(item)"
                         @click="toggleCategory(item)"
                    >{{ item.name }}</div>
                    <div :class="['navbar-category-list-item' ,'ml-3', {active: isFilterShared}]" @click="toggleFilterShared">共享</div>

                </div>
                <div class="navbar-category-list-special">
                    <div class="navbar-category-list-item special" @click="selectCategoryAll" >全选</div>
                    <div class="navbar-category-list-item special" @click="selectCategoryNone" >清选</div>
                    <div class="navbar-category-list-item special" @click="reverseCategorySelect">反选</div>
                </div>
            </div>


        </transition>
    </div>
</template>

<script>
import utility from "../../utility"
import {mapMutations, mapState} from "vuex"
import TabIcon from "../../components/TabIcon";

export default {
    name: "NavbarCategorySelector",
    components: {TabIcon},
    data(){
        return {
            filterShared: false, // 是否筛选已共享的日记
            categories: [], // category
        }
    },
    computed: {
        ...mapState([ 'categoryAll', 'isFilterShared'])
    },
    mounted() {
        this.filterShared = utility.getDiaryConfig().isFilterShared
        this.categories = utility.getDiaryConfig().filteredCategories
        // 避免上面的触发 watch 所以在后面手动添加 watch
        this.$watch('categories', newValue => {
            this.SET_FILTERED_CATEGORIES(newValue)
            this.SET_IS_LIST_NEED_BE_RELOAD(true)
        }, {deep: true})
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
            let index = this.categories.indexOf(category.name_en)
            if ( index > -1) {
                this.categories.splice(index, 1)
            } else {
                this.categories.push(category.name_en)
            }
        },
        indicatorItemStyle(category){
            if (this.categories.indexOf(category.name_en) > -1){
                return `background-color: ${category.color};`
                // return `border-bottom: 1px solid ${category.color};`
            } else {
                return ``
            }
        },
        categoryMenuItemStyle(category){
            if (this.categories.indexOf(category.name_en) > -1){
                // return `color: ${category.color}; opacity: 0.5; font-weight: bold`
                return `color: rgba(255,255,255,0.8); font-weight: bold;`
            } else {
                return ``
            }
        },
        selectCategoryAll() {
            this.categories = this.categoryAll.map(item => item.name_en)
        },
        selectCategoryNone() {
            this.categories = []
        },
        reverseCategorySelect() {
            let tempCategories = [].concat(this.categoryAll.map(item => item.name_en))
            this.categories.forEach(item => {
                tempCategories.splice(tempCategories.indexOf(item), 1)
            })
            this.categories = tempCategories
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
    padding: 0 5px;
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
            color: white;
        }
    }
    &:hover{
        font-weight: bold;
        color: rgba(255,255,255,0.8);
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
