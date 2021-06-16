<template>
<div></div>
</template>

<script>
   import utility from "../utility";

   export default {
      name: "Reset",
      data() {
         return {

         }
      },
      mounted() {
          utility.deleteAuthorization()
          utility.keyword.set('')
          utility.saveCategories(utility.CATEGORIES_ALL)

          setTimeout(()=>{
              this.$router.push('/')
          },2000)
      },
   }
</script>