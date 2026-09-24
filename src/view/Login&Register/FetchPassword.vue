<template>
    <div class="body-login-bg" :style="`min-height: ${projectStore.insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login">
                <div class="logo-wrapper">
                    <div class="logo">
                        <img :src="SVG_ICONS.logo_icons.logo_change_password" alt="Diary Logo">
                    </div>
                    <div class="project-name">找回密码</div>
                </div>

                <RegisterTip v-if="sent" :html-content="sentTip"/>
                <template v-else>
                    <RegisterTip :html-content="introTip"/>
                    <form id="forgotForm" @submit.prevent="submit">
                        <div class="input-group">
                            <label for="email" :class="{red: emailTouched && !emailFormatOk}">{{ labelEmail }}</label>
                            <input v-model.lazy="email"
                                   type="text" name="email" id="email"
                                   placeholder="注册时使用的邮箱">
                        </div>
                        <button class="btn mt-8" :class="emailFormatOk ? 'btn-active' : 'btn-inactive'"
                                type="submit"
                                :disabled="submitting">
                            {{ submitting ? '发送中...' : '发送重置邮件' }}
                        </button>
                    </form>
                </template>

                <div :class="['footer', 'center']">
                    <RouterLink to="/login">登录</RouterLink>
                </div>
            </div>
        </transition>
    </div>
</template>


<script lang="ts" setup>
import RegisterTip from "./RegisterTip.vue";
import userApi from "@/api/userApi.ts"
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts";
import {computed, onMounted, ref, watch} from "vue";
import {popMessage} from "@/utility.ts";

const projectStore = useProjectStore()

const email = ref('')
const emailTouched = ref(false)
const labelEmail = ref('邮箱')
const submitting = ref(false)
const sent = ref(false)

const emailFormatOk = computed(() => /(\w|\d)+@(\w|\d)+\.\w+/i.test(email.value))

const introTip = computed(() => `
            <h3>通过邮箱重置密码</h3>
            <p>输入注册邮箱，我们将发送一封重置密码的邮件（1 小时内有效）。</p>
        `)
const sentTip = computed(() => `
            <h3>邮件已发送</h3>
            <p>若该邮箱已注册，重置链接已发往你的邮箱，请查收并在 1 小时内完成重置。</p>
            <p>未收到？请检查垃圾箱，或稍后重试。</p>
        `)

onMounted(() => {
    document.title = '日记 - 找回密码'
})

watch(email, () => {
    emailTouched.value = true
    if (emailFormatOk.value) {
        labelEmail.value = '邮箱'
    } else {
        labelEmail.value = '输入的邮箱不正确，请重新输入'
    }
})

function submit() {
    if (!emailFormatOk.value || submitting.value) return
    submitting.value = true
    userApi
        .forgot({email: email.value.trim()})
        .then(res => {
            sent.value = true
            popMessage('success', res.message || '若该邮箱已注册，重置邮件已发送', () => {}, 5)
        })
        .catch(err => {
            popMessage('danger', err.message || '发送失败', () => {}, 5)
        })
        .finally(() => {
            submitting.value = false
        })
}
</script>
