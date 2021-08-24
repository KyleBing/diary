<template>
   <router-view></router-view>
</template>
<script>
export default {
   mounted() {
      window.onresize = () => {
         this.$store.commit('setHeightPanel', window.innerHeight - 45)
         this.$store.commit('setHeightWindow', window.innerHeight)
      }
   }
}
</script>

<style lang="scss">
@import "./assets/scss/diary";
</style>

