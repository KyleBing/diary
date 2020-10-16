<template>
   <nav class="navbar clearfix" id="navbar">
      <div class="navbar-btn-group left">
         <img v-show="btnMenu" @click="showMenu" src="img/tabicon/menu.svg" alt="菜单">
         <img v-show="btnClose" @click="closeMenu" src="img/tabicon/close.svg" alt="关闭">
      </div>
      <div class="navbar-btn-group right">
         <img v-show="btnAdd" @click="addClicked" src="img/tabicon/add.svg" alt="添加">
         <img v-show="btnConfirm" @click="confirmClicked" src="img/tabicon/done.svg" alt="添加">
      </div>
      <div class="brand">
         <a href="long.html"><img src="img/logo.svg" alt="日记"></a>
      </div>
   </nav>
</template>

<script>

   export default {
      name: 'nav-bar',
      data() {
         return {
            btnClose: false,
            btnMenu: true,
            btnAdd: true,
            btnConfirm: false
         }
      },
      methods: {
         showMenu: function () {
            this.btnClose = true;
            this.btnMenu = false;
            // this.btnAdd = false;
            // menu.menuPanelShowed = true;
         },
         closeMenu: function () {
            /*if (menu.secondMenuShowed) {
               if (menu.referenceShowed) {  // 去掉这个条件恢复正常模式，现在是从 reference 直接进 index 列表
                  menu.menuListShowed = true;
                  menu.secondMenuShowed = false;
                  menu.referenceShowed = false;
                  this.btnClose = false;
                  this.btnMenu = true;
                  this.btnAdd = true;
                  menu.menuPanelShowed = false;
               }
               menu.menuListShowed = true;
               menu.secondMenuShowed = false;
            } else {
               this.btnClose = false;
               this.btnMenu = true;
               this.btnAdd = true;
               menu.menuPanelShowed = false;
            }*/

         },
         addClicked: function () {
            location = FrontURL.edit;
         },
         confirmClicked: function () {
         }
      }
   }
</script>

