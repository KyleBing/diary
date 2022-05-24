<template>
    <div class="category-selector">
        <div
            :style="itemStyle(categorySelected === category.name_en, category)"
            class="category"
            @click="chooseCategory(category.name_en)"
            v-for="category in categoryAll"
            :key="category.name_en">{{ category.name }}
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "CategorySelector",
    props: {
        category: {
            default: 'life',
            type: String
        }
    },
    data() {
        return {
            categorySelected: this.category
        }
    },
    computed: {
        ...mapState(['categoryAll','categoryMap']),
    },
    watch: {
        category() {
            this.categorySelected = this.category
        },
        categorySelected() {
            this.$emit('change', this.categorySelected)
        }
    },
    methods: {
        itemStyle(active, category){
            if (active) {
                return `color: white; background-color: ${category.color}`
            } else {
                return `color: ${category.color}`
            }
        },
        chooseCategory(categoryName) {
            this.categorySelected = categoryName
        }
    }
}
</script>
