<template>
    <div class="category-selector">
        <div :class="['category', 'category-' + item.nameEn, {active: categorySelected === item.nameEn}]"
             @click="chooseCategory(item.nameEn)"
             v-for="item in categoryAll"
             :key="item.nameEn">{{ item.name }}
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
        ...mapState(['categoryAll'])
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
        chooseCategory(categoryName) {
            this.categorySelected = categoryName
        }
    }
}
</script>
