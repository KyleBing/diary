<template>
    <div class="body-login-bg setup-page system-config-page">
        <div class="body-login setup-body">
            <div class="logo-wrapper">
                <div class="logo">
                    <img :src="SVG_ICONS.logo_icons.logo_config" alt="System Config">
                </div>
            </div>
            <div class="setup-title">系统配置</div>
            <div class="setup-subtitle">这些配置会存储在服务端，由管理员统一维护，前端通过 Pinia 读取。</div>

            <div v-if="isLoading" class="setup-card">
                <div class="setup-card-title">正在读取系统配置...</div>
            </div>

            <template v-else>
                <div class="setup-card">
                    <div class="setup-card-title">
                        <h3>账号与展示</h3>
                    </div>

                    <div class="input-group">
                        <label for="admin-email">管理员邮箱</label>
                        <input id="admin-email" v-model.trim="form.admin_email" type="email">
                    </div>

                    <div class="toggle-input-group">
                        <label for="is-show-demo-account">显示演示账号入口</label>
                        <div class="toggle-input-wrapper">
                            <input
                                id="is-show-demo-account"
                                v-model="form.is_show_demo_account"
                                type="checkbox"
                            >

                            <label class="switch dark" for="is-show-demo-account"></label>
                        </div>
                        <div class="desc mt-1">如果没有该账户，勾选时会自动创建；如果已存在，会自动修改密码成下面的新密码</div>
                    </div>

                    <div class="input-group">
                        <label for="demo-account">演示账号</label>
                        <input id="demo-account" v-model.trim="form.demo_account" type="text">
                    </div>

                    <div class="input-group">
                        <label for="demo-account-password">演示账号密码</label>
                        <input id="demo-account-password" v-model="form.demo_account_password" type="text">
                    </div>
                </div>

                <div class="setup-card">
                    <div class="setup-card-title">
                        <h3>七牛显示配置</h3>
                        <div class="desc mt-1">
                            <p>七牛云主要是用于存储用户头像，不配置只是不显示头像。 <a href="https://www.qiniu.com/" target="_blank">七牛云官网</a></p>
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="qiniu-base-url">图片访问域名</label>
                        <input id="qiniu-base-url" v-model.trim="form.qiniu_img_base_url" type="text">
                    </div>

                    <div class="input-group">
                        <label for="qiniu-bucket-name">Bucket 名称</label>
                        <input id="qiniu-bucket-name" v-model.trim="form.qiniu_bucket_name" type="text">
                    </div>

                    <div class="input-group">
                        <label for="qiniu-style-suffix">样式后缀</label>
                        <input id="qiniu-style-suffix" v-model.trim="form.qiniu_style_suffix" type="text">
                    </div>
                </div>

                <div class="setup-card">
                    <div class="setup-card-title">
                        <h3>天气服务</h3>
                        <div class="desc mt-1">
                            <p>如果需要使用和风天气，请先在和风天气控制台创建 API Key，并配置以下信息，有一定的免费额度可用。
                                <a href="https://dev.qweather.com/" target="_blank">和风天气 API 文档</a>
                            </p>
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="weather-api-key">和风天气 API Key</label>
                        <input id="weather-api-key" v-model.trim="form.hefeng_weather_api_key" type="text">
                    </div>

                    <div class="input-group">
                        <label for="weather-api-host">和风天气 Host</label>
                        <input id="weather-api-host" v-model.trim="form.hefeng_weather_api_host" type="text">
                    </div>
                </div>

                <div class="setup-card">
                    <div class="setup-card-title">
                        <h3>注册提示</h3>
                        <div class="desc mt-1">注册提示会显示在注册页，支持 HTML 格式</div>
                    </div>

                    <div class="input-group">
                        <label for="register-tip">HTML 内容</label>
                        <textarea id="register-tip" v-model="form.register_tip" rows="6"></textarea>
                    </div>
                </div>

                <div class="setup-card">
                    <div class="setup-card-title">操作</div>
                    <div class="btn-list">
                        <button
                            :class="['btn', isFormValid && !isSaving ? 'btn-active' : 'btn-inactive']"
                            :disabled="!isFormValid || isSaving"
                            @click="saveConfig"
                        >
                            {{ isSaving ? '保存中...' : '保存系统配置' }}
                        </button>
                        <button class="btn btn-default" @click="router.go(-1)">返回</button>
                    </div>
                    <div class="desc mt-2" v-if="message">{{ message }}</div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeMount, onMounted, reactive, ref} from "vue"
import {useRouter} from "vue-router"

import SVG_ICONS from "@/assets/icons/SVG_ICONS"
import {SystemConfig} from "@/entity/SystemConfig"
import {useProjectStore} from "@/pinia/useProjectStore"
import {useSystemConfigStore} from "@/pinia/useSystemConfigStore"
import {popMessage} from "@/utility"

const router = useRouter()
const projectStore = useProjectStore()
const systemConfigStore = useSystemConfigStore()

const isLoading = ref(true)
const isSaving = ref(false)
const message = ref('')

const form = reactive<SystemConfig>({
    ...systemConfigStore.config
})

const isFormValid = computed(() => {
    if (!form.admin_email.trim().length) {
        return false
    }
    if (form.is_show_demo_account) {
        return form.demo_account.trim().length > 0 && form.demo_account_password.length > 0
    }
    return true
})

onBeforeMount(() => {
    if (!projectStore.isAdminUser) {
        router.replace({name: 'Index'})
    }
})

onMounted(async () => {
    if (!projectStore.isAdminUser) {
        return
    }
    document.title = '日记 - 系统配置'
    try {
        const config = await systemConfigStore.fetchConfig(true)
        Object.assign(form, config)
    } catch (err: any) {
        popMessage('danger', err?.message || '读取系统配置失败', undefined, 4)
    } finally {
        isLoading.value = false
    }
})

async function saveConfig() {
    if (!isFormValid.value || isSaving.value) {
        return
    }

    isSaving.value = true
    message.value = ''
    try {
        const res = await systemConfigStore.saveConfig(form)
        Object.assign(form, systemConfigStore.config)
        message.value = res.message
        popMessage('success', res.message)
    } catch (err: any) {
        popMessage('danger', err?.message || '保存系统配置失败')
    } finally {
        isSaving.value = false
    }
}
</script>

<style scoped lang="scss">
@import "../Setup/setup-wizard";
@import "system-config-page";
</style>
