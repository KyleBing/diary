<template>
    <div class="body-login-bg setup-page">
        <div class="body-login setup-body">
            <div class="logo-wrapper">
                <div class="logo">
                    <img :src="SVG_ICONS.logo_icons.logo_rounded" alt="Diary Logo">
                </div>
            </div>
            <div class="setup-title">安装引导</div>
            <div class="setup-subtitle">在前端完成数据库配置、项目配置与初始化。</div>

            <div v-if="isLoadingStatus" class="setup-card">
                <div class="setup-card-title">正在读取当前状态...</div>
            </div>

            <template v-else>
                <div class="setup-card">
                    <div class="setup-card-title">当前状态</div>
                    <div class="status-row">
                        <span :class="['status-pill', status.isInitialized ? 'is-done' : 'is-pending']">
                            {{ status.isInitialized ? '已初始化' : '未初始化' }}
                        </span>
                        <span class="status-text">初始化后会生成锁文件 `{{ status.lockFileName }}`。</span>
                    </div>
                    <div class="desc mt-1">
                        如果后续需要重新执行初始化，请先删除后台根目录中的 `{{ status.lockFileName }}` 文件。
                    </div>
                </div>

                <div class="setup-card" v-if="!status.isInitialized">
                    <div class="setup-card-title">1. 数据库配置</div>
                    <form @submit.prevent="saveConfig">
                        <div class="input-group">
                            <label for="db-host">主机</label>
                            <input id="db-host" v-model.trim="databaseConfig.host" type="text">
                        </div>
                        <div class="input-group">
                            <label for="db-user">用户名</label>
                            <input id="db-user" v-model.trim="databaseConfig.user" type="text">
                        </div>
                        <div class="input-group">
                            <label for="db-password">密码</label>
                            <input id="db-password" v-model="databaseConfig.password" type="password">
                        </div>
                        <div class="input-group">
                            <label for="db-port">端口</label>
                            <input id="db-port" v-model.number="databaseConfig.port" type="number" min="1">
                        </div>
                        <div class="input-group">
                            <label for="db-timezone">时区</label>
                            <input id="db-timezone" v-model.trim="databaseConfig.timezone" type="text" placeholder="可留空">
                        </div>
                        <label class="checkbox-row">
                            <input v-model="databaseConfig.multipleStatements" type="checkbox">
                            <span>允许多条 SQL 语句（初始化阶段建议保持开启）</span>
                        </label>

                        <div class="setup-card-title mt-8">2. 项目配置</div>
                        <div class="input-group">
                            <label for="project-invitation-code">通用邀请码</label>
                            <input id="project-invitation-code" v-model.trim="projectConfig.invitation_code" type="text">
                        </div>
                        <div class="input-group">
                            <label for="project-year-data-start">数据起始年份</label>
                            <input id="project-year-data-start" v-model.number="projectConfig.year_data_start" type="number" min="1">
                        </div>
                        <div class="input-group">
                            <label for="project-qiniu-access-key">七牛 Access Key</label>
                            <input id="project-qiniu-access-key" v-model.trim="projectConfig.qiniu_access_key" type="text" placeholder="可留空">
                        </div>
                        <div class="input-group">
                            <label for="project-qiniu-secret-key">七牛 Secret Key</label>
                            <input id="project-qiniu-secret-key" v-model.trim="projectConfig.qiniu_secret_key" type="text" placeholder="可留空">
                        </div>

                        <button
                            :class="['btn', isConfigValid && !isSavingConfig ? 'btn-active' : 'btn-inactive']"
                            :disabled="!isConfigValid || isSavingConfig"
                            type="submit"
                        >
                            {{ isSavingConfig ? '保存中...' : '保存配置' }}
                        </button>
                    </form>

                    <div class="desc mt-2">
                        会同步写入：{{ status.configFiles.join('、') }}
                    </div>
                    <div class="desc" v-if="saveMessage">{{ saveMessage }}</div>
                </div>

                <div class="setup-card" v-if="!status.isInitialized">
                    <div class="setup-card-title">3. 重启说明</div>
                    <div class="description-list">
                        <div v-for="tip in status.restartTips" :key="tip" class="desc">{{ tip }}</div>
                    </div>
                </div>

                <div class="setup-card">
                    <div class="setup-card-title">{{ status.isInitialized ? '初始化结果' : '4. 初始化数据库' }}</div>
                    <div class="desc" v-if="!status.isInitialized">
                        初始化会创建 `diary` 数据库，并写入基础表结构。首次注册的用户会自动成为管理员。
                    </div>
                    <div class="desc" v-if="initMessage">{{ initMessage }}</div>
                    <div class="btn-list mt-4" v-if="!status.isInitialized">
                        <button
                            :class="['btn', !isInitializing ? 'btn-active' : 'btn-inactive']"
                            :disabled="isInitializing"
                            @click="runInit"
                        >
                            {{ isInitializing ? '初始化中...' : '开始初始化' }}
                        </button>
                    </div>
                    <div class="btn-list mt-4" v-else>
                        <button class="btn btn-active" @click="goToLogin">前往登录</button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from "vue"
import {useRouter} from "vue-router"

import setupApi from "@/api/setupApi"
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts"
import {popMessage} from "@/utility"

const router = useRouter()

interface SetupStatus {
    isInitialized: boolean
    lockFileName: string
    configFiles: string[]
    restartTips: string[]
}

const isLoadingStatus = ref(true)
const isSavingConfig = ref(false)
const isInitializing = ref(false)
const saveMessage = ref('')
const initMessage = ref('')

const status = reactive<SetupStatus>({
    isInitialized: false,
    lockFileName: 'DATABASE_LOCK',
    configFiles: [],
    restartTips: []
})

const databaseConfig = reactive({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    multipleStatements: true,
    timezone: ''
})

const projectConfig = reactive({
    invitation_code: '',
    year_data_start: new Date().getFullYear(),
    qiniu_access_key: '',
    qiniu_secret_key: ''
})

const isConfigValid = computed(() => {
    return databaseConfig.host.trim().length > 0 &&
        databaseConfig.user.trim().length > 0 &&
        Number.isInteger(Number(databaseConfig.port)) &&
        Number(databaseConfig.port) > 0 &&
        projectConfig.invitation_code.trim().length > 0 &&
        Number.isInteger(Number(projectConfig.year_data_start)) &&
        Number(projectConfig.year_data_start) > 0
})

onMounted(() => {
    document.title = '日记 - 安装引导'
    loadStatus()
})

function applyStatusResponse(responseData: Awaited<ReturnType<typeof setupApi.status>>['data']) {
    status.isInitialized = responseData.isInitialized
    status.lockFileName = responseData.lockFileName
    status.configFiles = responseData.configFiles
    status.restartTips = responseData.restartTips

    if (responseData.config) {
        Object.assign(databaseConfig, responseData.config.databaseConfig)
        Object.assign(projectConfig, responseData.config.projectConfig)
    }
}

function loadStatus() {
    isLoadingStatus.value = true
    setupApi
        .status()
        .then(res => {
            applyStatusResponse(res.data)
        })
        .catch(err => {
            const message = err?.message || '读取安装状态失败'
            popMessage('danger', message)
        })
        .finally(() => {
            isLoadingStatus.value = false
        })
}

function saveConfig() {
    if (!isConfigValid.value || isSavingConfig.value) {
        return
    }

    isSavingConfig.value = true
    saveMessage.value = ''
    setupApi
        .saveConfig({
            databaseConfig: {
                host: databaseConfig.host.trim(),
                user: databaseConfig.user.trim(),
                password: databaseConfig.password,
                port: Number(databaseConfig.port),
                multipleStatements: databaseConfig.multipleStatements,
                timezone: databaseConfig.timezone.trim()
            },
            projectConfig: {
                invitation_code: projectConfig.invitation_code.trim(),
                year_data_start: Number(projectConfig.year_data_start),
                qiniu_access_key: projectConfig.qiniu_access_key.trim(),
                qiniu_secret_key: projectConfig.qiniu_secret_key.trim()
            }
        })
        .then(res => {
            saveMessage.value = res.message
            popMessage('success', res.message)
            applyStatusResponse({
                ...status,
                config: res.data
            })
        })
        .catch(err => {
            const message = err?.message || '保存配置失败'
            popMessage('danger', message)
        })
        .finally(() => {
            isSavingConfig.value = false
        })
}

function runInit() {
    if (isInitializing.value) {
        return
    }

    isInitializing.value = true
    initMessage.value = ''
    setupApi
        .init()
        .then(res => {
            status.isInitialized = true
            initMessage.value = `${res.message}，已创建锁文件 ${res.data.lockFileName}。`
            popMessage('success', res.message)
        })
        .catch(err => {
            const message = err?.message || '初始化失败'
            initMessage.value = message
            popMessage('danger', message, undefined, 2)
        })
        .finally(() => {
            isInitializing.value = false
        })
}

function goToLogin() {
    window.dispatchEvent(new Event('setup-completed'))
    router.replace({name: 'Login'})
}
</script>

<style scoped lang="scss">
@import "SetupWizard";
</style>
