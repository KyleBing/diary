<template>
   <div :class="['pop-msg', 'animated-fast', 'slideInDown', 'pop-msg-' + type]">
      <h3>{{title}}</h3>
   </div>
</template>

<script>
   import $ from "jquery";

   export default {
      props: ['type', 'title', 'callback', 'duration'],
      name: "pop-msg",
      data(){

      },
      mounted() {
         setTimeout(() => {
            $('.popMessage')
               .removeClass('slideInDown')
               .addClass('slideOutUp');
            setTimeout(() => {
               $('.popMessage')
                  .hide()
                  .remove();
            }, 300); // 对应 css 中的动画时间
            if (callback) {
               callback()
            }
         }, 1000 * timeout);
      }
   }
</script>
