<template>
    <!--category-->
    <div class="menu-category" >
        <ul class="menu-category-list">
            <li class="menu-category-item" v-for="(item, index) in categoryAll" :key="index"
                :style="categoryMenuItemStyle(item)"
                @click="toggleCategory(item)"
            >
                <div>{{ item.name }}<span class="count">{{ statisticsCategory[item.name_en] }}</span></div>
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

<script>
import utility from "../../utility.js"
import {mapMutations, mapState} from "vuex"

export default {
    name: "MenuCategorySelector",
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
        ...mapMutations(['SET_IS_FILTER_SHARED','SET_FILTERED_CATEGORIES','SET_IS_FILTER_SHARED']),
        toggleFilterShared(){
            this.SET_IS_FILTER_SHARED(!this.isFilterShared)
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
                return `background-color: ${category.color}; border: 1px solid ${category.color};`
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
        ...mapState(['statisticsCategory', "categoryAll", 'isFilterShared'])
    },
    watch: {
        categories: {
            deep: true,
            handler(newValue, oldValue){
                this.SET_FILTERED_CATEGORIES(newValue)
            }
        },
        filterShared(newValue){
            this.SET_IS_FILTER_SHARED(newValue)
        }
    }
}
</script>
