<template>
    <div class="body-login-bg" :style="`min-height: ${insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <div class="logo-wrapper">
                    <div class="logo">
                        <img :src="icons.logoIcon.register" alt="Diary Logo">
                    </div>
                </div>
                <register-tip/>

                <form id="regForm">
                    <div class="input-group">
                        <label for="invitation" :class="{red: !invitationVerified}">{{ labelInvitation }}</label>
                        <input v-model="invitationCode"
                               type="text"
                               name="invitation"
                               id="invitation">
                    </div>
                    <div class="input-group">
                        <label for="nickname" :class="{red: !nicknameVerified}">{{ labelUsername }}</label>
                        <input v-model="nickname" type="text"
                               name="nickname" id="nickname">
                    </div>
                    <div class="input-group">
                        <label for="email" :class="{red: !emailVerified}">{{ labelEmail }}</label>
                        <input v-model.lazy="email"
                               type="text" name="email" id="email">
                    </div>
                    <div class="input-group">
                        <label for="password1" :class="{red: !password1Verified}">{{ labelPassword1 }}</label>
                        <input v-model.lazy="password1"
                               name="password1" type="password" id="password1">
                    </div>
                    <div class="input-group">
                        <label for="password2" :class="{red: !password2Verified}">{{ labelPassword2 }}</label>
                        <input v-model="password2"
                               type="password" name="password2" id="password2">
                    </div>
                    <button class="btn mt-8" :class="verified ? 'btn-active' : 'btn-inactive'"
                            type="button"
                            @click.prevent="regSubmit">注册
                    </button>
                </form>
                <div class="footer flex-start">
                    <router-link to="/login">登录</router-link>
                </div>
            </div>
        </transition>
    </div>
</template>


<script>
import userApi from "@/api/userApi"
import {mapState} from "vuex"
import SvgIcons from "@/assets/img/SvgIcons"
import utility from "@/utility"
import projectConfig from "@/projectConfig";
import RegisterTip from "./RegisterTip";

export default {
    name: 'Register',
    components: {RegisterTip},
    data() {
        return {
            show: false,

            adminEmail: projectConfig.adminEmail,

            icons: SvgIcons,

            labelInvitation: '邀请码',
            labelEmail: '邮箱',
            labelPassword1: '密码',
            labelPassword2: '再次确认密码',
            labelUsername: '昵称',
            nickname: '',
            email: '',
            password1: '',
            password2: '',
            invitationCode: '',
            invitationVerified: false,
            nicknameVerified: false,
            emailVerified: false,
            password1Verified: false,
            password2Verified: false,
            heightBg: 0
        }
    },
    mounted() {
        this.show = true
        document.title = '日记 - 注册' // 变更标题
    },
    computed: {
        ...mapState(['insets']),
        verified() {
            // return this.emailVerified && this.invitationVerified && this.nicknameVerified && this.password1Verified && this.password2Verified
            return this.emailVerified && this.nicknameVerified && this.password1Verified && this.password2Verified
        },
    },
    methods: {
        regSubmit() {
            if (this.verified) {
                let requestData = {
                    nickname: this.nickname,
                    invitationCode: this.invitationCode,
                    email: this.email,
                    password: this.password1,
                }

                userApi
                    .register(requestData)
                    .then(res => {
                        utility.popMessage('success', `${res.message}，正在前往登录`, () => {
                            this.$router.push({name: 'Login'})
                        })
                    })
                    .catch(err => {
                        utility.popMessage('danger', err.message)
                    })
            }
        }
    },
    watch: {
        invitation() {
            if (this.invitationCode.length > 0) {
                this.labelInvitation = "邀请码"
                this.invitationVerified = true
            } else {
                this.labelInvitation = "邀请码不能为空"
                this.invitationVerified = false
            }
        },
        nickname() {
            if (this.nickname.length > 0) {
                this.labelUsername = "昵称"
                this.nicknameVerified = true
            } else {
                this.labelUsername = "昵称不能为空"
                this.nicknameVerified = false
            }
        },
        email() {
            if (/(\w|\d)+@(\w|\d)+\.\w+/i.test(this.email)) {
                this.labelEmail = "邮箱"
                this.emailVerified = true
            } else {
                this.labelEmail = "输入的邮箱不正确，请重新输入"
                this.emailVerified = false
            }
        },
        password1() {
            if (this.password1.length > 0) {
                this.labelPassword1 = "密码"
                this.password1Verified = true
            } else {
                this.labelPassword1 = "密码不能为空"
                this.password1Verified = false
            }
        },
        password2() {
            if (this.password1 === this.password2 && this.password1Verified) {
                this.labelPassword2 = "再次确认密码"
                this.password2Verified = true
            } else {
                this.labelPassword2 = "两次密码不一致"
                this.password2Verified = false
            }
        }
    }
}
</script>
