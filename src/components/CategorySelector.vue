<template>
   <div class="category-selector">
      <div :class="['category', 'category-' + item.nameEn, {active: categorySelected === item.nameEn}]"
           @click="chooseCategory(item.nameEn)"
           v-for="item in categories"
           :key="item.nameEn">{{item.name}}</div>
   </div>
</template>

<script>
   import utility from "../utility"

   export default {
      name: "categorySelector",
      props: {
         category: {
            default: 'life',
            type: String
         }
      },
      data(){
         return {
            categories: utility.CATEGORIES_ALL_NAME,
            categorySelected: this.category
         }
      },
      watch: {
         category(){
            this.categorySelected = this.category
         },
         categorySelected(){
            this.$emit('change', this.categorySelected)
         }
      },
      methods: {
         chooseCategory(categoryName){
            this.categorySelected = categoryName
         }
      }
   }
</script>
