<template>
   <div>
      <navbar/>
      <div class="diary">
         <div class="diary-list" :style="`height:${contentHeight}px`">
            <list/>
         </div>
         <div class="diary-container" :style="`height:${contentHeight}px`">
            <router-view/>
         </div>
      </div>
   </div>
</template>

<script>
import list from "@/page/list"
import Navbar from "@/components/navbar";
let heightNavbar = 45;

export default {
   components: {
      Navbar,
      list
   },
   data(){
      return {
         contentHeight:0
      }
   },
   mounted() {
      this.contentHeight = window.innerHeight - heightNavbar
      // onresize 计算高度
      window.onresize = () => {
         this.contentHeight = window.innerHeight - heightNavbar
      }
   }
}

</script>