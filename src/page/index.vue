<template>
   <div>
      <navbar/>
      <div class="diary">
         <div class="diary-list" :style="`height:${windowHeight - heightNavbar}px`">
            <list/>
         </div>
         <div class="diary-container" :style="`height:${windowHeight - heightNavbar}px`">
            <router-view/>
         </div>
      </div>
   </div>
</template>

<script>
import list from "@/page/list"
import Navbar from "@/components/navbar";
import utility from "@/utility";
import { mapState } from 'vuex'

export default {
   components: {
      Navbar,
      list
   },
   data(){
      return {
         heightNavbar: utility.global.heightNavbar
      }
   },
   mounted() {
      window.onresize = () => {
         this.$store.commit('setWindowHeight', window.innerHeight)
      }
   },
   computed: {
      ...mapState([
         'windowHeight'
      ])
   }
}

</script>