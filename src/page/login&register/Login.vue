<template>
    <div class="body-login-bg" :style="`min-height: ${storeProject.insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <div class="logo-wrapper">
                    <div :class="['logo', {valid: avatarLink} ]">
                        <img v-if="avatarLink" :src="avatarLink" alt="Diary Logo">
                        <img v-else :src="SVG_ICONS.logo_icons.logo_rounded" alt="LOGIN-LOGO">
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
                <div :class="['footer', {center: !isShowDemoAccount}]">
                    <router-link to="/register">注册</router-link>
                    <a v-if="isShowDemoAccount" @click="useTestAccount">试用演示账户</a>
                </div>
                <div class="copyright">
                    <p>
                        <a class="project-name" target="_blank" href="https://kylebing.cn/diary/#/share/6766">{{ packageInfo.nameZh }}</a>
                        <span class="version ml-1">v{{ packageInfo.version }}</span>
                        <span class="ml-1">  始于 {{ packageInfo.dateInit }}</span>
                        <router-link class="ml-1 password" to="/fetch-password">找回密码</router-link>
<!--                        <span class="ml-1 password" @click="routeToFetchPassword">找回密码</span>-->
                    </p>
                </div>
            </div>


        </transition>
    </div>
</template>

<script lang="ts" setup>
import projectConfig from "../../projectConfig.ts";
import packageInfo from "../../../package.json"

import userApi from "../../api/userApi.ts"
import billApi from "../../api/billApi.ts";

import {popMessage, setAuthorization, setBillKeys} from "@/utility.ts";
import {useProjectStore} from "@/pinia";
const storeProject = useProjectStore()
import {computed, onMounted, Ref, ref, watch} from "vue";
import {useRouter} from "vue-router";
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";

const router = useRouter()

const show = ref(false)
onMounted(()=> {
    show.value = true
    document.title = '日记 - 登录' // 变更标题
})



const labelEmail = ref("邮箱")
const email = ref('')
const password = ref('')
const loginLabel = ref('登录')
const isShowDemoAccount = projectConfig.isShowDemoAccount
const avatarLink: Ref<string | null> = ref(null)


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
                    token : res.data.password,
                    group_id : res.data.group_id,
                    city : res.data.city,
                    geolocation : res.data.geolocation,
                })
                getBillKeys()
                popMessage('success', res.message, () => router.push({name: 'Index'}))
                loginLabel.value = '登录成功'
            })
            .catch(err => {
                loginLabel.value = '登录失败'
                popMessage('danger', err.message, () => loginLabel.value = '登录', 5)
            })
    } else {

    }
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
    email.value = projectConfig.demoAccount
    password.value = projectConfig.demoAccountPassword
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

function routeToFetchPassword(){
    router.push({name: 'FetchPassword'})
}

</script>
<style lang="scss" scoped>
@import "../../scss/plugin";
.copyright{
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
    bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $fz-tiny;
    line-height: 1;
    color: $text-subtitle;
    a{
        color: $dark-text-subtitle;

        &:hover{
            color: $color-main;
            text-decoration: underline;
        }
    }
    .version{
        color: $dark-text-subtitle;
    }
    .project-name{
        font-weight: bold;
    }
    .valid-date{
    }
    .version{
    }
    .password{
        color: $dark-text-subtitle;
        @extend .btn-like;
        &:hover{
            color: $color-main;
        }
    }
}
</style>


