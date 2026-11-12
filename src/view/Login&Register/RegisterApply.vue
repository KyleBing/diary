<template>
    <div class="body-login-bg apply-page" :style="`min-height: ${projectStore.insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <div class="logo-wrapper">
                    <div class="logo">
                        <img :src="SVG_ICONS.logo_icons.logo_register" alt="Diary Logo">
                    </div>
                    <div class="project-name">申请注册</div>
                </div>

                <RegisterTip :html-content="introTip"/>

                <form v-if="!submitted" id="applyForm" @submit.prevent="submit">
                    <div class="input-group">
                        <label for="email" :class="{red: emailLabelError, green: emailRegistered}">{{ labelEmail }}</label>
                        <input v-model.lazy="email"
                               type="text" name="email" id="email"
                               placeholder="请输入您的邮箱">
                    </div>
                    <div class="input-group">
                        <label for="paidAccount" :class="{red: accountTouched && !accountOk}">{{ labelAccount }}</label>
                        <input v-model="paidAccount"
                               type="text" name="paidAccount" id="paidAccount"
                               placeholder="付费昵称（支付宝/微信昵称）">
                    </div>
                    <div class="input-group">
                        <label :class="{red: !payPlatform}">付费平台</label>
                        <div class="pay-platform-group">
                            <button
                                v-for="opt in platformOptions"
                                :key="opt.value"
                                type="button"
                                :class="['pay-platform-option', {active: payPlatform === opt.value}]"
                                @click="payPlatform = opt.value"
                            >
                                <img :src="opt.icon" :alt="opt.label">
                                <span>{{ opt.label }}</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="payPlatform" class="pay-qr-block">
                        <p v-if="registerFeeYuan > 0" class="pay-qr-amount">
                            <span class="pay-qr-amount__label">应付金额</span>
                            <span class="pay-qr-amount__value">¥{{ registerFeeYuan }}</span>
                        </p>
                        <p v-else class="pay-qr-amount">
                            <span class="pay-qr-amount__label">应付金额</span>
                            <span class="pay-qr-amount__value custom">按约定金额支付</span>
                        </p>
                        <p class="pay-qr-hint">
                            请使用{{ payPlatformLabel }}扫码支付{{ registerFeeYuan > 0 ? '上方金额' : '约定金额' }}，并填写付款账户信息。
                        </p>
                        <img class="pay-qr-image" :src="payQrImageSrc" :alt="`${payPlatformLabel}收款码`">
                        <p v-if="payQrNote" class="pay-qr-note">{{ payQrNote }}</p>
                        <p class="pay-qr-payee">收款方：邴新科</p>
                    </div>
                    <div class="paid-confirm" :class="{error: paidTouched && !paidConfirmed}">
                        <button type="button" :class="['paid-check', {checked: paidConfirmed}]"
                                @click="togglePaid">
                            <span v-if="paidConfirmed">✓</span>
                        </button>
                        <span class="paid-label" @click="togglePaid">已支付</span>
                    </div>
                    <p v-if="paidTouched && !paidConfirmed" class="paid-error">请勾选已支付后再提交</p>
                    <button class="btn mt-8" :class="verified ? 'btn-active' : 'btn-inactive'"
                            type="submit"
                            :disabled="submitting">
                        {{ submitting ? '提交中...' : '提交申请' }}
                    </button>
                </form>
                <RegisterTip v-else :html-content="successTip"/>

                <div class="footer">
                    <RouterLink to="/register">注册</RouterLink>
                    <RouterLink to="/login">登录</RouterLink>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import RegisterTip from "./RegisterTip.vue"
import registrationApplicationApi, {type PayPlatform} from "@/api/registrationApplicationApi.ts"
import {useProjectStore} from "@/pinia/useProjectStore.ts"
import {useSystemConfigStore} from "@/pinia/useSystemConfigStore.ts"
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts"
import {popMessage} from "@/utility.ts"
import {payQrImage, pickPayQrItem} from "@/utility/payQrAssets.ts"
import {computed, onMounted, ref, watch} from "vue"
import alipayIcon from "@/assets/alipay.png"
import wepayIcon from "@/assets/wepay.png"

const projectStore = useProjectStore()
const systemConfigStore = useSystemConfigStore()

const show = ref(false)
const submitting = ref(false)
const submitted = ref(false)

const email = ref('')
const paidAccount = ref('')
const payPlatform = ref<PayPlatform>('alipay')
const paidConfirmed = ref(false)

const emailTouched = ref(false)
const accountTouched = ref(false)
const paidTouched = ref(false)

const labelEmail = ref('申请邮箱')
const labelAccount = ref('付费昵称')

const platformOptions: { value: PayPlatform; label: string; icon: string }[] = [
    {value: 'alipay', label: '支付宝', icon: alipayIcon},
    {value: 'wechat', label: '微信支付', icon: wepayIcon},
]

const emailFormatOk = computed(() => /(\w|\d)+@(\w|\d)+\.\w+/i.test(email.value))
const emailAvailable = ref(false)
const emailRegistered = ref(false)
const emailChecking = ref(false)
const emailLabelError = computed(() =>
    emailTouched.value && !emailRegistered.value && (!emailFormatOk.value || !emailAvailable.value),
)
const accountOk = computed(() => paidAccount.value.trim().length > 0)

const currentPayQr = computed(() =>
    pickPayQrItem(
        systemConfigStore.config.registration_pay_qr_list,
        Number(systemConfigStore.config.registration_pay_amount_yuan),
    ),
)

const registerFeeYuan = computed(() => currentPayQr.value?.amount_yuan ?? Number(systemConfigStore.config.registration_pay_amount_yuan) ?? 28)

const payPlatformLabel = computed(() => (payPlatform.value === 'wechat' ? '微信' : '支付宝'))
const payQrImageSrc = computed(() => {
    const url = payPlatform.value === 'wechat'
        ? currentPayQr.value?.wechat_url
        : currentPayQr.value?.alipay_url
    return payQrImage(payPlatform.value, url)
})
const payQrNote = computed(() =>
    payPlatform.value === 'wechat'
        ? currentPayQr.value?.wechat_note || ''
        : currentPayQr.value?.alipay_note || '',
)

const verified = computed(() =>
    emailFormatOk.value && emailAvailable.value && accountOk.value && !!payPlatform.value && paidConfirmed.value
)

const introTip = `
            <h3>付费注册申请</h3>
            <p>本站已持续更新并运行 <a href="https://kylebing.cn/diary/#/share/20941" target="_blank"> 7 年</a> 。日记会尽量长期保存，支持完整导出；若站点关闭，会提前 1 个月邮件通知，便于迁移数据。</p>
            <p>不确定是否需要？可先用试用账户体验，确认后再来申请注册。</p>
            <p>请填写下方信息提交申请。我们将在 1 日内完成审核，结果邮件通知；通过后会附上邀请码。</p>
            <hr>
            <p>项目已完全开源：<a href="https://github.com/KyleBing/diary" target="_blank">https://github.com/KyleBing/diary</a></p>
            <p>使用中有问题可邮件联系 <a href="mailto:kylebing@163.com">kylebing@163.com</a>，会尽快回复。</p>
            <hr>
            <p><a href="https://kylebing.cn/diary/#/share/20941" target="_blank">《使用说明》</a></p>
        `
const successTip = `
            <h3>申请已提交</h3>
            <p>我们会在 1 日内完成审核，请留意邮箱通知。</p>
        `

onMounted(() => {
    show.value = true
})

watch(email, () => {
    emailTouched.value = true
    emailAvailable.value = false
    emailRegistered.value = false
    if (!emailFormatOk.value) {
        labelEmail.value = '输入的邮箱不正确，请重新输入'
        return
    }
    labelEmail.value = '正在检查邮箱…'
    checkEmailAvailability()
})

// 邮箱填写完成后请求是否可注册
function checkEmailAvailability() {
    const value = email.value.trim()
    emailChecking.value = true
    registrationApplicationApi
        .checkEmail(value)
        .then(res => {
            if (email.value.trim() !== value) return
            const available = !!res.data?.available
            const registered = !!res.data?.registered
            emailAvailable.value = available
            emailRegistered.value = registered
            labelEmail.value = res.message || (available ? '该邮箱可以申请注册' : '该邮箱不可申请')
        })
        .catch(err => {
            if (email.value.trim() !== value) return
            emailAvailable.value = false
            emailRegistered.value = false
            labelEmail.value = err?.message || '邮箱检查失败，请稍后重试'
        })
        .finally(() => {
            emailChecking.value = false
        })
}

watch(paidAccount, () => {
    accountTouched.value = true
    if (accountOk.value) {
        labelAccount.value = '付费昵称'
    } else {
        labelAccount.value = '付费昵称不能为空'
    }
})

function togglePaid() {
    paidConfirmed.value = !paidConfirmed.value
    paidTouched.value = true
}

function submit() {
    paidTouched.value = true
    accountTouched.value = true
    emailTouched.value = true
    if (!verified.value || submitting.value || emailChecking.value) return
    submitting.value = true
    registrationApplicationApi
        .submit({
            email: email.value.trim(),
            paidAccount: paidAccount.value.trim(),
            payPlatform: payPlatform.value,
        })
        .then(res => {
            submitted.value = true
            popMessage('success', res.message || '申请已提交', () => {}, 5)
        })
        .catch(err => {
            popMessage('danger', err.message || '提交失败', () => {}, 5)
        })
        .finally(() => {
            submitting.value = false
        })
}
</script>

<style lang="scss" scoped>
@use "sass:color" as color;
@use "../../scss/plugin" as *;

.apply-page {
    align-items: flex-start;
}

.input-group label {
    &.red {
        color: $red;
    }

    &.green {
        color: $green;
    }
}

.pay-platform-group {
    display: flex;
    gap: 12px;
}

.pay-platform-option {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 14px 12px;
    border-radius: $radius-mobile;
    background-color: $bg-menu;
    color: white;
    font-size: $fz-note;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all .2s;

    img {
        width: 36px;
        height: 36px;
        object-fit: contain;
    }

    &.active {
        border-color: $color-main;
        box-shadow: 0 0 0 1px $color-main;
    }
}

.pay-qr-block {
    margin: 4px 0 16px;
    padding: 16px;
    text-align: center;
    border-radius: $radius-pc;
    background-color: $bg-menu;
}

.pay-qr-amount {
    margin: 0 0 12px;
    padding: 12px 16px;
    border-radius: 10px;
    background-color: $bg-main;
}

.pay-qr-amount__label {
    display: block;
    margin-bottom: 4px;
    font-size: $fz-note;
    color: $text-label;
}

.pay-qr-amount__value {
    display: block;
    font-size: 32px;
    font-weight: 700;
    line-height: 1.1;
    color: $color-main;

    &.custom {
        font-size: 18px;
        color: white;
    }
}

.pay-qr-hint {
    margin: 0 0 12px;
    font-size: $fz-small;
    line-height: 1.55;
    color: $dark-text-subtitle;
}

.pay-qr-image {
    display: block;
    width: min(220px, 100%);
    margin: 0 auto;
    border-radius: 8px;
    background: white;
}

.pay-qr-note {
    margin: 10px 0 0;
    font-size: $fz-small;
    line-height: 1.55;
    color: $dark-text-subtitle;
    white-space: pre-wrap;
}

.pay-qr-payee {
    margin: 10px 0 0;
    font-size: $fz-note;
    font-weight: 500;
    color: white;
}

.paid-confirm {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
}

.paid-check {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 1px solid color.adjust(white, $alpha: -0.7);
    background: transparent;
    color: $bg-main;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &.checked {
        background: $color-main;
        border-color: $color-main;
    }
}

.paid-label {
    font-size: $fz-note;
    color: $bg-light;
    cursor: pointer;
}

.paid-error {
    margin: 6px 0 0;
    font-size: $fz-tiny;
    color: $red;
}

.paid-confirm.error .paid-check {
    border-color: $red;
}
</style>
