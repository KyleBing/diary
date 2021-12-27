<template>
    <!--category-->
    <div class="menu-category" >
        <ul class="menu-category-list">
            <li class="menu-category-item" v-for="(item, index) in categoryAll" :key="index">
                <input v-model="categories"
                       class="hidden" type="checkbox"
                       :id="'category-' + item.nameEn"
                       :value="item.nameEn">
                <label :class="'menu-category-' + item.nameEn" :for="'category-' + item.nameEn">
                    {{ item.name }}
                    <span class="count">{{ statisticsCategory[item.nameEn] }}</span>
                </label>
            </li>
        </ul>

        <div class="menu-category-list category-operations-container">
            <div class="menu-category-item">
                <input checked v-model="filterShared" class="hidden" type="checkbox" id="share">
                <label for="share" class="menu-category-shared">共享日记</label>
            </div>
        </div>

        <div class="menu-category-list category-operations-container">
            <div @click="selectCategoryAll" class="menu-btn">全选</div>
            <div @click="selectCategoryNone" class="menu-btn">全不选</div>
            <div @click="selectCategoryWork" class="menu-btn">周报</div>
            <div @click="reverseCategorySelect" class="menu-btn">反选</div>
        </div>
    </div>
</template>

<script>
import utility from "@/utility";
import {mapMutations, mapState} from "vuex";

export default {
    name: "MenuCategorySelector",
    data(){
        return {
            categories: [],
            filterShared: false, // 是否筛选已共享的日记
        }
    },
    mounted() {
        this.filterShared = utility.getDiaryConfig().isFilterShared
        this.categories = utility.getDiaryConfig().filteredCategories
    },
    methods: {
        ...mapMutations(['SET_IS_FILTER_SHARED','SET_FILTERED_CATEGORIES']),
        selectCategoryAll() {
            this.categories = this.categoryAll.map(item => item.nameEn)
        },
        selectCategoryNone() {
            this.categories = []
        },
        reverseCategorySelect() {
            let tempCategories = [].concat(this.categoryAll.map(item => item.nameEn))
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
        ...mapState(['statisticsCategory', "categoryAll"])
    },
    watch: {
        categories(newValue){
            this.SET_FILTERED_CATEGORIES(newValue)
        },
        filterShared(newValue){
            this.SET_IS_FILTER_SHARED(newValue)
        }
    }
}
</script>

<style scoped>

</style>
