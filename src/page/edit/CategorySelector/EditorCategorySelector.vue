<template>
    <div class="edit-category-selector">
        <div
            class="category-wrapper"
            @click="chooseCategory(category.name_en)"
            v-for="category in categoryAll"
            :key="category.name_en">
            <div
                class="category"
                :style="itemStyle(categorySelected === category.name_en, category)"
            >{{ category.name }}
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex"

export default {
    name: "EditorCategorySelector",
    props: {
        category: {
            default: 'life',
            type: String
        }
    },
    emits: ['change'],
    data() {
        return {
            categorySelected: this.category
        }
    },
    computed: {
        ...mapState(['categoryAll']),
        ...mapGetters(['categoryNameMap'])
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
        itemStyle(active, category) {
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

<style lang="scss" scoped>
@import "editor-category-selector";
</style>
