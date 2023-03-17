<template>
    <div class="body-login-bg" :style="`min-height: ${insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <!--APP-->
                <div id="reg">
                    <div class="logo-wrapper">
                        <div class="logo">
                            <img :src="icons.logoIcon.changePassword" alt="Diary Logo">
                        </div>
                    </div>
                    <form id="regForm">
    <!--                    <div class="input-group">
                            <label for="oldPassword">原密码</label>
                            <input v-model.lazy="oldPassword" name="oldPassword" type="password" id="oldPassword">
                        </div>-->
                        <div class="input-group">
                            <label for="password1">新密码</label>
                            <input v-model.lazy="password1" name="password1" type="password" id="password1">
                        </div>
                        <div class="input-group">
                            <label for="password2" :class="{red: (passwordVerified || password2<1)}">{{ labelCheckPassword }}</label>
                            <input v-model="password2" type="password" name="password2" id="password2" class="focused">
                        </div>

                        <button class="btn mt-8"
                                :class="passwordVerified ? 'btn-active' : 'btn-inactive'"
                                type="button"
                                @click.prevent="changePasswordSubmit">确定修改
                        </button>
                    </form>
                    <div class="footer">
                        <router-link to="/" class="left">返回</router-link>
                        <router-link to="/login" class="right">登录</router-link>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import utility from "../../utility"
import userApi from "../../api/userApi"
import {mapState} from "vuex"
import SvgIcons from "../../assets/img/SvgIcons"

export default {
    name: 'ChangePassword',
    data() {
        return {
            show: false,

            icons: SvgIcons,

            labelCheckPassword: "再次确认密码",
            password1: "",
            password2: "",
        }
    },
    mounted() {
        this.show = true
        document.title = '日记 - 修改密码' // 变更标题
    },
    computed: {
        ...mapState(['insets']),
        verified() {
            return (this.passwordVerified)
        },
        passwordVerified() {
            return (this.password1.length > 0 && this.password1 === this.password2)
        }
    },
    methods: {
        changePasswordSubmit() {
            if (this.passwordVerified) {
                let requestData = {
                    password: this.password1,
                }

                userApi
                    .changePassword(requestData)
                    .then(res => {
                        utility.popMessage('success', `${res.message}，正在前往登录`, () => {
                            utility.deleteAuthorization()
                            this.$router.go(-1)
                        }, 2)
                    })
                    .catch(err => {
                        utility.popMessage('danger', `${err.message}`, () => {}, 2)
                    })
            }
        }
    },
    watch: {
        password2() {
            if (this.passwordVerified) {
                this.labelCheckPassword = "再次确认密码"
            } else {
                this.labelCheckPassword = "两次密码不一致"
            }
        }
    }
}
</script>
