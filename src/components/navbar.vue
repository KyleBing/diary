<template>
   <!-- NAVBAR -->
   <nav class="navbar" id="navbar">
      <div class="navbar-btn-group left">
         <img alt="菜单" @click="" src="img/tabicon/menu.svg">
         <img alt="关闭" @click="" src="img/tabicon/close.svg">
      </div>

      <!--RIGHT part-->
         <!--EMPTY-->
      <div class="navbar-btn-group right" v-if="$route.name !== 'detail' && $route.name !== 'edit'">
         <router-link to="/edit"><img alt="添加" src="img/tabicon/add.svg"></router-link>
      </div>

         <!--EDIT-->
      <div class="navbar-btn-group right" v-if="$route.name === 'edit'">
         <img @click="diaryCreate" alt="新建" src="img/tabicon/add.svg">
         <img @click="diarySave" alt="保存" src="img/tabicon/done.svg">
      </div>


         <!--DETAIL-->
      <div class="navbar-btn-group right" v-if="$route.name === 'detail'">
         <img
            id="shareBtn"
            alt="分享链接"
            @click="copySharePath"
            src="img/tabicon/share.svg"
            :data-clipboard-text="`${location.origin}/diary/#/share/id=${diaryId}`">
         <img alt="删除" @click="" src="img/tabicon/delete.svg"/>
         <router-link :to="'/edit/' + diaryId"><img alt="编辑" src="img/tabicon/edit.svg"></router-link>
      </div>


      <div class="brand">
         <a @click="">
            <img v-if="!showLongList" src="img/logo.svg" alt="日记">
            <img v-else src="img/logo_content.svg" alt="日记">
         </a>
      </div>
   </nav>
</template>

<script>
import utility from "@/utility";
import Clipboard from "clipboard";

export default {
   name: "navbar",
   data() {
      return {
         location: {},
         diaryId: null,
         showLongList: false
      }
   },
   mounted() {
      this.location = window.location;
      console.log(this.$route)
   },
   methods: {
      diaryCreate() {

      },
      diarySave() {

      },
      copySharePath() {
         let clipboard = new Clipboard('#shareBtn');
         clipboard.on('success', function (e) {
            utility.popMessage(utility.POP_MSG_TYPE.success, '分享链接 已复制到 剪贴板', null, 2)
            e.clearSelection();
         });
         clipboard.on('error', function () {
         });
      },
   }
}
</script>