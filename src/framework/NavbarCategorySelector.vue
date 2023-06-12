<template>
    <!--category-->
    <div class="navbar-category-filter">

        <div class="navbar-category-list">
            <div class="navbar-category-list-item"
                 v-for="(item, index) in categoryAll" :key="index"
                 :style="categoryMenuItemStyle(item)"
                 @click="toggleCategory(item)"
            >{{ item.name }}</div>
        </div>
        <div class="navbar-category-list-special">
            <div :class="['navbar-category-list-item', {active: isFilterShared}]" @click="toggleFilterShared">共享</div>
            <div class="navbar-category-list-item" @click="selectCategoryAll" >全选</div>
            <div class="navbar-category-list-item" @click="reverseCategorySelect">反选</div>
            <div class="navbar-category-list-item" @click="selectCategoryWork" >周报</div>
        </div>
    </div>

</template>

<script>
import utility from "../utility"
import {mapMutations, mapState} from "vuex"

export default {
    name: "NavbarCategorySelector",
    data(){
        return {
            filterShared: false, // 是否筛选已共享的日记
            categories: [] // category
        }
    },
    mounted() {
        this.filterShared = utility.getDiaryConfig().isFilterShared
        this.$nextTick(() => {
            this.categories = utility.getDiaryConfig().filteredCategories
        })
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
        categoryMenuItemStyle(category){
            if (this.categories.indexOf(category.name_en) > -1){
                return `color: ${category.color}; font-weight: bold`
                // return `border-bottom: 1px solid ${category.color};`
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
        selectCategoryWork(){
            this.categories = ['work', 'week']
        },
    },
    computed: {
        ...mapState([ "categoryAll", 'isFilterShared'])
    },
    watch: {
        categories: {
            deep: true,
            handler(newValue, oldValue){
                this.SET_FILTERED_CATEGORIES(newValue)
                this.SET_IS_LIST_NEED_BE_RELOAD(true)
            }
        },
        filterShared(newValue){
            this.SET_IS_FILTER_SHARED(newValue)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/plugin";
.navbar-category-filter{
    display: flex;
    justify-content: flex-start;
}

.navbar-category-list-special{
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    padding: 2.5px;
    height: 45px;
}
.navbar-category-list{
    width: 300px;
    flex-grow: 1;
    align-items: center;
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;
    padding: ($height-navbar - 18 * 2)/2;
    height: $height-navbar;
}
.navbar-category-list-item{
    font-size: $fz-small;
    padding: 0 5px;
    height: 18px;
    font-weight: normal;
    line-height: 18px;
    color: transparentize(white, 0.8);
    @extend .btn-like;
    &.active{
        color: white;
        font-weight: bold;
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
