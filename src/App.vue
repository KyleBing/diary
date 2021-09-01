<template>
   <router-view></router-view>
</template>
<script>
export default {
   mounted() {
       if(process.env.NODE_ENV !== 'development'){
           if (innerWidth < 1024){
               location = '/diary/'
           }
       }
      window.onresize = () => {
         this.$store.commit('setHeightPanel', window.innerHeight - 45)
         this.$store.commit('setHeightWindow', window.innerHeight)
      }
   }
}
</script>

<style lang="scss">
@import "./scss/diary";
</style>

