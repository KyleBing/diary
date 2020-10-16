<template>
   <nav class="navbar clearfix" id="navbar">
      <div class="navbar-btn-group left">
         <img v-show= "btns.includes('menu')"  alt= "菜单" @click= "btnMenu"  src= "img/tabicon/menu.svg" >
         <img v-show= "btns.includes('close')" alt= "关闭" @click= "btnClose" src= "img/tabicon/close.svg" >
      </div>
      <div class="navbar-btn-group right">
         <img v-show= "btns.includes('add')"    alt= "添加" @click= "btnAdd"    src= "img/tabicon/add.svg" >
         <img v-show= "btns.includes('delete')" alt= "删除" @click= "btnDelete" src= "img/tabicon/delete.svg" >
         <img v-show= "btns.includes('edit')"   alt= "编辑" @click= "btnEdit"   src= "img/tabicon/edit.svg" >
         <img v-show= "btns.includes('save')"   alt= "保存" @click= "btnSave"   src= "img/tabicon/done.svg" >
      </div>
      <div class="brand">
         <a @click="btnLogo"><img :src="logo" alt="日记"></a>
      </div>
   </nav>
</template>

<script>
   const LOGO_DICT = {
      normal: 'img/logo.svg',
         folded: 'img/logo_folded.svg',
         content: 'img/logo_content.svg',
         contentSaved: 'img/logo_content_saved.svg',
         title: 'img/logo_title.svg',
         titleSaved: 'img/logo_title_saved.svg',
   }
   export default {
      name: 'nav-bar',
      props: ['btns'],
      data() {
         return {
            contentEditorShowed: false,
            logo: LOGO_DICT.normal
         }
      },
      mounted() {
         switch (this.$route.name) {
            case 'edit':
               this.logo = LOGO_DICT.title;break;
               default: break;
         }
      },
      methods: {
         btnLogo(){
            let router = this.$router;
            let route = this.$route;
            switch (this.$route.name){
               case 'edit':

                  break;
               default: null
            }

            console.log(router, route)

         },
         showMenu() {
            this.btnClose = true;
            this.btnMenu = false;
            // this.btnAdd = false;
            // menu.menuPanelShowed = true;
         },
         goBack() {
            history.back(); // 返回主列表
         },
         btnEdit() {
            location = "./edit.html?id=" + this.diary.id
         },
         btnDelete() {
            // toast.show();
         },
         btnMenu() {

         },
         btnClose() {
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
         btnAdd() {
            this.$router.push('/edit')
         },
         btnSave() {
         }
      }
   }
</script>

