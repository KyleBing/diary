<template>
    <router-view/>
</template>

<script>
export default {
   mounted() {
      if (innerWidth > 1024){
         location = '/diary-pc/'
      }
   }
}
</script>

<style lang="scss">
   @import "./assets/scss/diary";
</style>

