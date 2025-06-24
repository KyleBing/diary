<template>
    <div class="body-login-bg" :style="`min-height: ${projectStore.insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <div class="logo-wrapper">
                    <div class="logo">
                        <img :src="SVG_ICONS.logo_icons.logo_register" alt="Diary Logo">
                    </div>
                    <div class="project-name">注册</div>
                </div>
                <RegisterTip :html-content="projectConfig.registerTip"/>

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
                <div :class="['footer', {center: !projectConfig.isShowDemoAccount}]">
                    <RouterLink to="/login">登录</RouterLink>
                </div>
            </div>
        </transition>
    </div>
</template>


<script lang="ts" setup>
import userApi from "../../api/userApi.ts"
import projectConfig from "../../projectConfig.ts";
import RegisterTip from "./RegisterTip.vue";

import {useProjectStore} from "../../pinia/useProjectStore.ts";
const projectStore = useProjectStore()
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";
import {popMessage} from "../../utility.ts";
import {UserRegisterEntity} from "@/entity/User.ts";

const route = useRoute()
const router = useRouter()

const show = ref(false)

const labelInvitation = ref('邀请码')
const labelEmail = ref('邮箱')
const labelPassword1 = ref('密码')
const labelPassword2 = ref('再次确认密码')
const labelUsername = ref('昵称')
const nickname = ref('')
const email = ref('')
const password1 = ref('')
const password2 = ref('')
const invitationCode=  ref('')
const invitationVerified=  ref(false)
const nicknameVerified=  ref(false)
const emailVerified=  ref(false)
const password1Verified=  ref(false)
const password2Verified=  ref(false)
const heightBg =  ref(0)


onMounted(()=>{
    show.value = true
    document.title = '日记 - 注册' // 变更标题
})

const verified = computed(()=> {
    return emailVerified.value
        && nicknameVerified.value
        && password1Verified.value
        && password2Verified.value
})

function  regSubmit() {
    if (verified.value) {
        let requestData: UserRegisterEntity = {
            nickname: nickname.value,
            invitationCode: invitationCode.value,
            email: email.value,
            password: password1.value,
        }

        userApi
            .register(requestData)
            .then(res => {
                popMessage('success', `${res.message}，正在前往登录`, () => router.push({name: 'Login'}))})
            .catch(err => {
                popMessage('danger', err.message, ()=>{}, 5)
            })
    }
}

watch(invitationCode, () => {
    if (invitationCode.value.length > 0) {
        labelInvitation.value = "邀请码"
        invitationVerified.value = true
    } else {
        labelInvitation.value = "邀请码不能为空"
        invitationVerified.value = false
    }
})
watch(nickname, () => {
    if (nickname.value.length > 0) {
        labelUsername.value = "昵称"
        nicknameVerified.value = true
    } else {
        labelUsername.value = "昵称不能为空"
        nicknameVerified.value = false
    }
})
watch(email, () => {
    if (/(\w|\d)+@(\w|\d)+\.\w+/i.test(email.value)) {
        labelEmail.value = "邮箱"
        emailVerified.value = true
    } else {
        labelEmail.value = "输入的邮箱不正确，请重新输入"
        emailVerified.value = false
    }
})
watch(password1, () => {
    if (password1.value.length > 0) {
        labelPassword1.value = "密码"
        password1Verified.value = true
    } else {
        labelPassword1.value = "密码不能为空"
        password1Verified.value = false
    }
})
watch(password2, () => {
    if (password1.value === password2.value && password1Verified.value) {
        labelPassword2.value = "再次确认密码"
        password2Verified.value = true
    } else {
        labelPassword2.value = "两次密码不一致"
        password2Verified.value = false
    }
})
</script>
