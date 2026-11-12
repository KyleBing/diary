<template>
    <div class="body-login-bg login-page" :style="`min-height: ${projectStore.insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <div class="logo-wrapper">
                    <div :class="['logo', {valid: avatarLink} ]">
                        <img v-if="avatarLink" :src="avatarLink" alt="标题日记">
                        <img v-else :src="SVG_ICONS.logo_icons.logo_rounded" alt="标题日记">
                    </div>
                    <h1 class="sr-only">标题日记 · 登录</h1>
                    <p class="sr-only">用一句话概括你的一天。纯文本 Web 日记，支持日历、账单、统计与公开分享。</p>
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
                    <button :class="['btn', 'mt-8', verified ? 'btn-active' : 'btn-inactive']"
                            type="submit">{{ loginLabel }}</button>
                    <button v-if="needResendVerify"
                            class="btn mt-2 btn-inactive"
                            type="button"
                            @click.prevent="resendVerifyEmail">重发验证邮件</button>
                </form>
                <div :class="['footer', {center: !is_show_demo_account}]">
                    <RouterLink to="/register">注册</RouterLink>
                    <a v-if="is_show_demo_account" @click="useTestAccount">试用演示账户</a>
                </div>
                <div class="copyright">
                    <a class="project-name" target="_blank"
                       href="http://kylebing.cn/diary/#/share/6766">{{ packageInfo.nameZh }}</a>
                    <span class="version ml-1">v{{ packageInfo.version }}</span>
                    <span class="ml-1"> {{ packageInfo.dateInit.substring(0,4) }}-{{ packageInfo.dateModify.substring(0,4) }}</span>
                    <RouterLink class="ml-1 password" to="/fetch-password">找回密码</RouterLink>
                    <RouterLink class="ml-1 password" to="/privacy">隐私</RouterLink>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import packageInfo from "../../../package.json"

import userApi from "@/api/userApi.ts"
import billApi from "@/api/billApi.ts";

import {popMessage, setAuthorization, setBillKeys} from "@/utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {useSystemConfigStore} from "@/pinia/useSystemConfigStore.ts";
const projectStore = useProjectStore()
const systemConfigStore = useSystemConfigStore()
import {computed, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts";

const router = useRouter()

const show = ref(false)
const needResendVerify = ref(false)
onMounted(()=> {
    show.value = true
})



const labelEmail = ref("邮箱")
const email = ref('')
const password = ref('')
const loginLabel = ref('登录')
const systemConfig = computed(() => systemConfigStore.config)
const is_show_demo_account = computed(() => systemConfig.value.is_show_demo_account)
const avatarLink = ref<string | null>(null)


watch(email, newValue => {
    if (newValue === ''){
        labelEmail.value = '邮箱'
        avatarLink.value = null
    } else if (emailVerified.value) {
        labelEmail.value = '邮箱'
        getAvatar()
    } else {
        avatarLink.value = null
        labelEmail.value = '输入的邮箱不正确，请重新输入'
    }
})


const emailVerified = computed(() => {
    return /(\w|\d)+@(\w|\d)+\.\w+/i.test(email.value)
})
const passwordVerified = computed(() => {
    return password.value.length > 0
})
const verified = computed(() => {
    return emailVerified.value && passwordVerified.value
})


function loginSubmit() {
    if (verified.value){
        loginLabel.value = '登录中...'
        needResendVerify.value = false
        let requestData = {
            email: email.value,
            password: password.value,
        }
        userApi
            .login(requestData)
            .then(res => {
                // set authorization
                setAuthorization({
                    nickname : res.data.nickname,
                    uid : res.data.uid,
                    email : res.data.email,
                    phone : res.data.phone,
                    avatar : res.data.avatar,
                    token : res.data.token,
                    group_id : res.data.group_id,
                    city : res.data.city,
                    geolocation : res.data.geolocation,
                })
                getBillKeys()
                popMessage('success', res.message, () => router.push({name: 'Index'}))
                loginLabel.value = '登录成功'
            })
            .catch(err => {
                loginLabel.value = '登录'
                if (err?.data?.code === 'email_not_verified') {
                    needResendVerify.value = true
                }
                popMessage('danger', err.message, () => {}, 5)
            })
    } else {

    }
}

function resendVerifyEmail() {
    if (!emailVerified.value) return
    userApi
        .resendVerify({email: email.value})
        .then(res => {
            popMessage('success', res.message || '验证邮件已发送', () => {}, 5)
        })
        .catch(err => {
            popMessage('danger', err.message || '发送失败', () => {}, 5)
        })
}

function getBillKeys() {
    billApi
        .keys()
        .then(res => {
            setBillKeys(res.data)
        })
        .catch(err => {
            popMessage('warning', err.message)
        })
}
function useTestAccount() {
    email.value = systemConfig.value.demo_account
    password.value = systemConfig.value.demo_account_password
}
function getAvatar(){
    userApi
        .getAvatar({
            email: email.value
        })
        .then(res => {
            if (res.data){
                avatarLink.value = res.data.avatar
            }
        })
}


</script>
<style lang="scss" scoped>
@use "../../scss/plugin" as *;

// 高度够：表单纵向居中、小字靠底；高度不够：随内容撑开，小字落到表单下方（可滚动），不重叠
.login-page.body-login-bg {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.login-page .body-login {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    height: auto; // 覆盖共用样式 height:100%，避免矮屏内容溢出压住小字
    box-sizing: border-box;

    // 与底部 copyright 等分剩余空间，把 logo/表单区域顶回纵向居中
    &::before {
        content: '';
        flex: 1 1 0;
    }
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.copyright {
    flex: 1 1 0;
    width: 100%;
    padding-top: 40px;
    padding-bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    font-size: $fz-tiny;
    line-height: 1;
    color: $text-subtitle;
    a {
        color: $dark-text-subtitle;

        &:hover {
            color: $color-main;
            text-decoration: underline;
        }
    }
    .version {
        color: $dark-text-subtitle;
    }
    .project-name {
        font-weight: bold;
    }
    .password {
        color: $dark-text-subtitle;
        @extend .btn-like;
        &:hover {
            color: $color-main;
        }
    }
}
</style>


