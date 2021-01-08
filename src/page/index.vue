<template>
   <div class="diary">
      <div class="diary-list" :style="`height:${contentHeight}px`">
         <list/>
      </div>
      <div class="diary-container" :style="`height:${contentHeight}px`">
         <router-view/>
      </div>
   </div>
</template>

<script>
import list from "@/page/list"
let heightNavbar = 0;

export default {
   components: {
      list
   },
   data(){
      return {
         contentHeight:0
      }
   },
   mounted() {
      this.contentHeight = window.innerHeight - heightNavbar
   }
}
</script>