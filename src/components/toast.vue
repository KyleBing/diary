<template>
   <div id="toast" class="fadeIn animated-fast" v-show="showToast">
      <div class="toast">
         <div class="toast-header">确定删除吗</div>
         <div class="toast-body"></div>
         <div class="toast-footer">
            <div class="btn-cancel" @click="hide">取消</div>
            <div class="btn-confirm" @click="deleteCurrentDiary">确定</div>
         </div>
      </div>
      <div class="mask"></div>
   </div>
</template>

<script>
   export default {
      name: "toast.vue"
   }

   let toast = new Vue({
      el: "#toast",
      data: {
         showToast: false
      },
      methods: {
         show: function () {
            this.showToast = true
         },
         hide: function () {
            this.showToast = false
         },
         deleteCurrentDiary: function () {
            let that = this;
            let queryData = {
               diaryId: vm.diary.id,
               type: 'delete'
            };
            $.ajax({
               url: URL.diaryOperation,
               dataType: 'json',
               method: 'POST',
               data: queryData,
               success: data => {
                  that.hide();
                  if (data.success) {
                     popMessage(PopMessageType.success, data.info, () => {
                        location = FrontURL.index
                     }, 1) // 删除成功后等待时间不要太长
                  } else if (!data.logined) {
                     location = FrontURL.login;
                  }
               },
               error: error => {
                  console.log(error);
               }
            })
         }
      }
   });
</script>

<style scoped>

</style>