<template>
    <div class="body-login-bg" :style="`min-height: ${insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <div class="logo-wrapper">
                    <div class="logo">
                        <img :src="icons.logoIcon.login" alt="Diary Logo">
                    </div>
                </div>

                <form method="post" id="regForm" @submit.prevent="loginSubmit">
                    <div class="input-group">
                        <label for="email" :class="{red: emailVerified || email.length < 1}">{{ labelEmail }}</label>
                        <input v-model.lazy="email" type="text" name="email" id="email">
                    </div>
                    <div class="input-group">
                        <label for="password">密码</label>
                        <input v-model="password" name="password" type="password" id="password">
                    </div>
                    <button class="btn mt-8" :class="verified ? 'btn-active' : 'btn-inactive'" type="submit">{{ loginLabel }}</button>
                </form>
                <div class="footer">
                    <router-link to="/register">注册</router-link>
                    <a @click="useTestAccount">试用演示账户</a>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import userApi from "../../api/userApi"
import utility from "../../utility"
import {mapState} from "vuex"
import SvgIcons from "../../assets/img/SvgIcons"

export default {
    name: "Login",
    data() {
        return {
            icons: SvgIcons,
            show: false,
            labelEmail: "邮箱",
            labelCheckPassword: "再次确认密码",
            email: "",
            password: "",
            loginLabel: '登录'
        }
    },
    mounted() {
        this.show = true
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
            if (this.verified){
                this.loginLabel = '登录中...'
                let requestData = {
                    email: this.email,
                    password: this.password,
                }
                userApi
                    .login(requestData)
                    .then(res => {
                        // set authorization
                        utility.setAuthorization(
                            res.data.nickname,
                            res.data.uid,
                            res.data.email,
                            res.data.phone,
                            res.data.avatar,
                            res.data.password,
                            res.data.group_id,
                            res.data.city,
                            res.data.geolocation,
                        )
                        utility.popMessage('success', res.message, () => {
                            this.$router.push({name: 'Index'})
                        })
                        this.loginLabel = '登录成功'
                    })
                    .catch(err => {
                        this.loginLabel = '登录失败'
                        utility.popMessage('danger', err.message, () => {
                            this.loginLabel = '登录'
                        })
                    })
            } else {

            }
        },
        useTestAccount() {
            this.email = "test@163.com"
            this.password = "test"
        }
    },
    watch: {
        email() {
            if (this.email === ''){
                this.labelEmail = '邮箱'
            } else if (this.emailVerified) {
                this.labelEmail = '邮箱'
            } else {
                this.labelEmail = '输入的邮箱不正确，请重新输入'
            }
        }
    }
}
</script>
