<template>
    <div class="body-login-bg" :style="`min-height: ${heightBg}px`">
        <div class="body-login">
            <!--APP-->
            <div id="reg">
                <div class="logo">
                    <img :src="$icons.logo" alt="Diary Logo">
                </div>
                <form id="regForm">
                    <div class="input-group">
                        <label for="oldPassword">原密码</label>
                        <input v-model.lazy="oldPassword" name="oldPassword" type="password" id="oldPassword">
                    </div>
                    <div class="input-group">
                        <label for="password1">新密码</label>
                        <input v-model.lazy="password1" name="password1" type="password" id="password1">
                    </div>
                    <div class="input-group">
                        <label for="password2" :class="[(passwordVerified || password2<1)? '' : 'red']">{{ labelCheckPassword }}</label>
                        <input v-model="password2" type="password" name="password2" id="password2" class="focused">
                    </div>

                    <button class="btn"
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
    </div>
</template>

<script>
import utility from "../utility"

export default {
    name: 'ChangePassword',
    data() {
        return {
            labelCheckPassword: "再次确认密码",
            oldPassword: "",
            password1: "",
            password2: "",
            heightBg: 0
        }
    },
    mounted() {
        this.heightBg = window.innerHeight
        document.title = '日记 - 修改密码' // 变更标题
    },
    computed: {
        verified: function () {
            return (this.passwordVerified && this.oldPassword.length > 0)
        },
        passwordVerified: function () {
            return (this.password1.length > 0 && this.password1 === this.password2)
        }
    },
    methods: {
        changePasswordSubmit: function () {
            if (this.passwordVerified) {
                let queryData = {
                    "oldPassword": this.oldPassword,
                    "newPassword": this.password1,
                    "type": "update"
                }

                utility.postData(utility.URL.userOperation, queryData).then(res => {
                    utility.popMessage('success', `${res.info}，正在前往登录`, () => {
                        utility.deleteAuthorization()
                        this.$router.go(-1)
                    }, 2)
                })
            }
        }
    },
    watch: {
        password2: function () {
            if (this.passwordVerified) {
                this.labelCheckPassword = "再次确认密码"
            } else {
                this.labelCheckPassword = "两次密码不一致"
            }
        }
    }
}
</script>
