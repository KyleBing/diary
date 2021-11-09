<template>
    <div class="body-login-bg" :style="'min-height:' + heightBg + 'px'">
        <div class="body-login">
            <div class="logo">
                <img src="~@/assets/img/logo.svg" alt="Diary Logo">
            </div>
            <form method="post" id="regForm" @submit.prevent="loginSubmit">
                <div class="input-group">
                    <label for="email" :class="{red: emailVerified || email.length < 1}">{{ labelEmail }}</label>
                    <input v-model.lazy="email" type="text" name="email" id="email">
                </div>
                <div class="input-group">
                    <label for="password">密码</label>
                    <input v-model.lazy="password" name="password" type="password" id="password">
                </div>
                <button class="btn" :class="verified ? 'btn-active' : 'btn-inactive'" type="submit">登录</button>
            </form>
            <div class="footer">
                <router-link to="/register">注册</router-link>
                <a @click="useTestAccount">使用体验账户</a>
            </div>
        </div>
    </div>
</template>

<script>
import utility from "../utility"

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
    mounted() {
        this.heightBg = window.innerHeight
        document.title = '日记 - 登录' // 变更标题
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
                    email: this.email,
                    password: this.password,
                    type: "login"
                })
                .then(res => {
                    utility.setAuthorization(res.email, res.token, res.username, res.uid)
                    utility.queryData.categories = utility.CATEGORIES_ALL
                    utility.popMessage(utility.POP_MSG_TYPE.success, res.info, () => {
                        this.$router.push('/')
                    })
                })
        },
        useTestAccount() {
            this.email = "test@163.com"
            this.password = "test"
        }
    },
    watch: {
        email() {
            this.labelEmail = this.emailVerified? "邮箱" : "输入的邮箱不正确，请重新输入"
        }
    }
}
</script>
