<template>
   <div class="category-selector">
      <input type="radio" name="category" value="life" id="category-life" v-model="category">
      <label for="category-life">生活</label>
      <input type="radio" name="category" value="study" id="category-study" v-model="category">
      <label for="category-study">学习</label>
      <input type="radio" name="category" value="work" id="category-work" v-model="category">
      <label for="category-work">工作</label>
      <input type="radio" name="category" value="game" id="category-game" v-model="category">
      <label for="category-game">游戏</label>
      <input type="radio" name="category" value="film" id="category-film" v-model="category">
      <label for="category-film">电影</label>
      <input type="radio" name="category" value="sport" id="category-sport" v-model="category">
      <label for="category-sport">运动</label>
      <input type="radio" name="category" value="bigevent" id="category-bigevent" v-model="category">
      <label for="category-bigevent">大事</label>
      <input type="radio" name="category" value="week" id="category-week" v-model="category">
      <label for="category-week">周报</label>
      <input type="radio" name="category" value="article" id="category-article" v-model="category">
      <label for="category-article">文章</label>
   </div>
</template>

<script>
   export default {
      name: "categorySelector",
      data(){
         return {
            category: "life",
         }
      }
   }
</script>

<style scoped>

</style>