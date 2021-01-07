<template>
    <div class="body-login" :style="'min-height:' + heightBg + 'px'">
        <div class="logo">
            <img src="img/logo.svg" alt="Diary Logo">
        </div>
        <form id="regForm">
            <div class="input-group">
                <label for="invitation" :class="{red: !invitationVerified}">{{ labelInvitation }}</label>
                <input v-model="invitation"
                       type="text"
                       name="invitation"
                       id="invitation" >
            </div>
            <div class="input-group">
                <label for="email" :class="{red: !usernameVerified}">{{ labelUsername }}</label>
                <input v-model="username"
                       type="text"
                       name="username"
                       id="username" >
            </div>
            <div class="input-group">
                <label for="email" :class="{red: !emailVerified}">{{ labelEmail }}</label>
                <input v-model.lazy="email"
                       type="text"
                       name="email"
                       id="email" >
            </div>
            <div class="input-group">
                <label for="password1" :class="{red: !password1Verified}">{{ labelPassword1 }}</label>
                <input  v-model.lzay="password1"
                        name="password1"
                        type="password"
                        id="password1">
            </div>
            <div class="input-group">
                <label for="password2" :class="{red: !password2Verified}">{{ labelPassword2 }}</label>
                <input v-model="password2"
                       type="password"
                       name="password2"
                       id="password2">
            </div>

            <button class="btn"
                    :class="verified ? 'btn-active' : 'btn-inactive'"
                    type="button"
                    @click.prevent="regSubmit" >注册</button>
        </form>
        <div class="footer clearfix">
            <router-link to="/login" class="left">登录</router-link>
        </div>
    </div>

</template>



<script>
    import utility from "../utility";

    export default {
        data() {
           return {
               labelInvitation:'邀请码',
               labelEmail: '邮箱',
               labelPassword1: '密码',
               labelPassword2: '再次确认密码',
               labelUsername: '昵称',
               username: '',
               email: '',
               password1: '',
               password2: '',
               invitation: 'kylebingooOO',
               invitationVerified: false,
               usernameVerified: false,
               emailVerified: false,
               password1Verified: false,
               password2Verified: false,
               heightBg: 0
           }
        },
        mounted() {
            this.heightBg = window.innerHeight
        },
        computed:{
            verified: function ()  {
                // return this.emailVerified && this.invitationVerified && this.usernameVerified && this.password1Verified && this.password2Verified;
                return this.emailVerified && this.usernameVerified && this.password1Verified && this.password2Verified;
            },
        },
        methods:{
            regSubmit: function ()  {
                if (this.verified){
                    let queryData = {
                        "username": this.username,
                        "invitation": this.invitation,
                        "email": this.email,
                        "password": this.password1,
                        "type": "insert"
                    };

                    utility.axios.post(utility.URL.userOperation,queryData)
                        .then(res => {
                            if(res.success){ // 注册成功
                                popMessage(PopMessageType.success, `${res.info}，正在前往登录`,()=>{
                                    location = FrontURL.login
                                })
                            } else { // 注册失败
                                popMessage(PopMessageType.warning, res.info);
                            }
                        })
                }
            }
        },
        watch:{
            invitation: function ()  {
                if (this.invitation.length > 0){
                    this.labelInvitation = "邀请码";
                    this.invitationVerified = true
                } else {
                    this.labelInvitation = "邀请码不能为空";
                    this.invitationVerified = false
                }
            },
            username:function(){
                if(this.username.length > 0){
                    this.labelUsername = "昵称";
                    this.usernameVerified = true;
                } else {
                    this.labelUsername = "昵称不能为空";
                    this.usernameVerified = false
                }
            },
            email: function ()  {
                if (/(\w|\d)+@(\w|\d)+\.\w+/i.test(this.email)){
                    this.labelEmail = "邮箱";
                    this.emailVerified = true
                } else {
                    this.labelEmail = "输入的邮箱不正确，请重新输入";
                    this.emailVerified = false
                }
            },
            password1: function ()  {
                if (this.password1.length > 0 ){
                    this.labelPassword1 = "密码";
                    this.password1Verified = true;
                } else {
                    this.labelPassword1 = "密码不能为空";
                    this.password1Verified = false
                }
            },
            password2: function ()  {
                if (this.password1 === this.password2 && this.password1Verified){
                    this.labelPassword2 = "再次确认密码";
                    this.password2Verified = true;
                } else {
                    this.labelPassword2 = "两次密码不一致";
                    this.password2Verified = false
                }
            }
        }
    }
</script>