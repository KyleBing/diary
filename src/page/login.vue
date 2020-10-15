<template>
   <div class="body-regist" :style="'min-height:' + heightBg + 'px'">
      <div class="logo">
         <img src="img/logo.svg" alt="Diary Logo">
      </div>
      <form method="post" id="regForm" @submit.prevent="loginSubmit">
         <div class="input-group">
            <label for="email" :class="[(emailVerified || email.length<1)? '' : 'red']">{{ labelEmail }}</label>
            <input v-model.lazy="email"
                   type="text"
                   name="email"
                   id="email">
         </div>
         <div class="input-group">
            <label for="password">密码</label>
            <input v-model.lzay="password"
                   name="password"
                   type="password"
                   id="password">
         </div>

         <button class="btn"
                 :class="verified ? 'btn-active' : 'btn-inactive'"
                 type="submit">登录
         </button>
      </form>
      <div class="footer clearfix">
         <router-link to="/register" class="left">注册</router-link>
         <a @click="useTestAccount" class="right">使用体验账户</a>
      </div>
   </div>
</template>

<script>

   import utility from "../utility";

   export default {
      name: "Login",
      data() {
         return {
            labelEmail: "邮箱",
            labelCheckPassword: "再次确认密码",
            email: "",
            password: "",
            heightBg: 0
         }
      },
      created() {
         this.heightBg = window.innerHeight
      },
      computed: {
         emailVerified() {
            return /(\w|\d)+@(\w|\d)+\.\w+/i.test(this.email)
         },
         passwordVerified() {
            return this.password.length > 0
         },
         verified() {
            return this.emailVerified && this.passwordVerified
         }
      },
      methods: {
         loginSubmit() {
            utility.postData(utility.URL.userOperation,
               {
                  "email": this.email,
                  "password": this.password,
                  "type": "login"
               })
               .then(res => {
                  utility.setAuthorization(res.email, res.token, res.username, res.uid);
                  this.$cookie.set(utility.COOKIE_NAME.category, JSON.stringify(utility.CATEGORIES_ALL), utility.COOKIE_NAME.options);
                  utility.popMessage(utility.POP_MSG_TYPE.success, res.info, () => {
                     this.$router.push('/')
                  })
               })
         },
         useTestAccount() {
            this.email = "test@163.com";
            this.password = "test";
         }
      },
      watch: {
         email() {
            if (this.emailVerified) {
               this.labelEmail = "邮箱"
            } else {
               this.labelEmail = "输入的邮箱不正确，请重新输入"
            }
         }
      }
   }

   // bak
   // 如果已经登录，跳到主页
   /*    window.onload = () => {
           if (getAuthorization()) {
               popMessage(PopMessageType.default, '您已经登录，正在跳转...',()=>{
                   location = FrontURL.index;
               })
           }
       };*/
</script>