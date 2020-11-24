<template>
   <div class="category-selector">
      <div v-for="(item, index) in categories" :key="index">
         <input type="radio" name="category" :value="item.nameEn" :id="'category-' + item.nameEn" v-model="categoryNew">
         <label :for="'category-' + item.nameEn">{{item.name}}</label>
      </div>
   </div>
</template>

<script>
   import utility from "../utility";

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
            categoryNew: this.category
         }
      },
      watch: {
         categoryNew(){
            this.$emit('change', this.categoryNew)
         }
      }
   }
</script>

<style scoped>

</style>