<template>
   <div>
      <navbar/>
      <div class="diary">
         <div class="diary-list" :style="`height:${heightPanel}px`">
            <list/>
         </div>
         <div class="diary-container" :style="`height:${heightPanel}px`">
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
   mounted() {
      window.onresize = () => {
         this.$store.commit('setWindowHeight', window.innerHeight - 45)
      }
   },
   computed: {
      ...mapState([
         'heightPanel'
      ])
   }
}

</script>