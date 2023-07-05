<template>
   <div class="menu-others-container">
       <div class="menu-section">
           <div class="menu-section-title">密码</div>
           <div class="menu-section-content">
               <div class="btn-list">
                   <div class="btn btn-active" @click="goToChangePassword">修改密码</div>
                   <div class="btn btn-active" @click="goToChangePassword">找回密码</div>
               </div>

               <div class="desc">通过注册的邮箱给管理员 {{ projectConfig.adminEmail }} 发邮件重置密码</div>
           </div>
       </div>
       <div class="menu-section">
           <div class="menu-section-title">导出</div>
           <div class="menu-section-subtitle">导出所有日记到指定格式的文件 </div>
           <div class="menu-section-content">
               <div class="btn-list">
                   <div class="btn btn-active" @click="exportDiary('cvs')">cvs</div>
                   <div class="btn btn-active" @click="exportDiary('json')">json</div>
                   <div class="btn btn-active" @click="exportDiary('text')">text</div>
               </div>
           </div>
       </div>
   </div>

</template>

<script>
import projectConfig from "@/projectConfig";
import {mapMutations} from "vuex";
import diaryApi from "@/api/diaryApi";

export default {
    name: "MenuOtherFunction",
    data(){
        return {
            projectConfig
        }
    },

    methods: {
        ...mapMutations(['SET_MENU_SHOWED']),
        goToChangePassword(){
            this.SET_MENU_SHOWED(false)
            this.$router.push({name: 'ChangePassword'})
        },
        exportDiary(fileFormat){
            diaryApi
                .export()
                .then(res => {
                    let diaries = res.data
                })
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";

</style>
