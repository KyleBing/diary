<template>
    <div class="body-login-bg" :style="`min-height: ${insets.windowsHeight}px`">
        <div class="body-login">
            <div class="logo">
                <img :src="$icons.logo" alt="Diary Logo">
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
                <button class="btn mt-8" :class="verified ? 'btn-active' : 'btn-inactive'" type="submit">{{ loginLabel }}</button>
            </form>
            <div class="footer">
                <router-link to="/register">注册</router-link>
                <a @click="useTestAccount">使用体验账户</a>
            </div>
        </div>
    </div>
</template>

<script>
import userApi from "@/api/userApi";
import utility from "@/utility";
import {mapState} from "vuex";

export default {
    name: "Login",
    data() {
        return {
            labelEmail: "邮箱",
            labelCheckPassword: "再次确认密码",
            email: "",
            password: "",
            loginLabel: '登录'
        }
    },
    mounted() {
        document.title = '日记 - 登录' // 变更标题
    },
    computed: {
        ...mapState(['insets']),
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
            this.loginLabel = '登录中...'
            let requestData = {
                email: this.email,
                password: this.password,
            }
            userApi.login(requestData)
                .then(res => {
                    // set authorization
                    utility.setAuthorization(
                        res.data.email,
                        res.data.password,
                        res.data.nickname,
                        res.data.uid,
                        res.data.group_id
                    )
                    this.$popMessage('success', res.message, () => {
                        this.$router.push('/')
                    })
                    this.loginLabel = '登录成功'
                })
                .catch(err => {
                    this.loginLabel = '登录失败'
                    this.$popMessage('danger', err.message, () => {
                        this.loginLabel = '登录'
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
            this.labelEmail = this.emailVerified ? "邮箱" : "输入的邮箱不正确，请重新输入"
        }
    }
}
</script>
