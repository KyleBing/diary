<template>
    <ServerError v-if="isServerError"/>
    <RouterView v-else-if="isSetupRequired || isAppReady"/>
</template>
<script lang="ts" setup>
import {useProjectStore} from "./pinia/useProjectStore.ts";
const projectStore = useProjectStore()
import {onBeforeMount, onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStatisticStore} from "./pinia/useStatisticStore.ts";
import {useSystemConfigStore} from "./pinia/useSystemConfigStore.ts";
import setupApi from "@/api/setupApi.ts";

const route = useRoute()
const router = useRouter()
const statisticStore = useStatisticStore()
const systemConfigStore = useSystemConfigStore()


// Server Error
import ServerError from "./components/ServerError.vue";
const isServerError = ref(false)
const isSetupRequired = ref(false)
const isAppReady = ref(false)

onBeforeMount(() => {
    // 获取当前颜色模式
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        projectStore.colorMode=  'dark'
    } else {
        projectStore.colorMode=  'dark'
    }

    // 颜色模式监听
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        projectStore.colorMode = event.matches ? "dark" : "light"
    })
})


onMounted(()=> {
    projectStore.cacheDiary = undefined         // 每次刷新页面，清空缓存日记内容
    projectStore.cacheDiaryOrigin = undefined   // 每次刷新页面，清空缓存日记内容

    // 从本地配置文件中载入配置
    projectStore.INIT_PROJECT_CONFIG()

    syncSetupStatus()
    window.addEventListener('setup-completed', handleSetupCompleted)
    watch([isServerError, isSetupRequired, isAppReady], hidePreloadingWhenReady, {immediate: true})

    window.addEventListener('resize', () => {
        projectStore.insets = {
            windowsHeight: document.documentElement.clientHeight,
            windowsWidth: document.documentElement.clientWidth,
            heightPanel: document.documentElement.clientHeight - 45, // 除 navbar 的高度
        }
        if (projectStore.isInMobileMode){

        } else {
            if (route.name === 'List'){
                router.push({
                    name: 'EditNew'
                })
            }
        }
    })
})

onUnmounted(() => {
    window.removeEventListener('setup-completed', handleSetupCompleted)
})

function syncSetupStatus() {
    setupApi
        .status()
        .then(async res => {
            // setup/status 成功即表示后端可访问，用于区分「服务未启动/不可达」与业务接口错误
            isServerError.value = false
            isSetupRequired.value = !res.data.isInitialized
            if (isSetupRequired.value) {
                if (route.name !== 'Setup') {
                    await router.replace({name: 'Setup'})
                }
                return
            }

            afterBackendReady()
        })
        .catch(() => {
            isServerError.value = true
        })
}

function handleSetupCompleted() {
    isSetupRequired.value = false
    isServerError.value = false
    afterBackendReady()
}

async function afterBackendReady() {
    isAppReady.value = false
    try {
        // 类别是后续页面与统计依赖的基础数据，后端连通后优先拉取
        await statisticStore.getCategoryAll()
        await systemConfigStore.fetchConfig(true).catch(() => {})
    } finally {
        // 避免因单个初始化步骤异常导致页面永久停在 loading
        isAppReady.value = true
    }
}

function hidePreloadingWhenReady() {
    // 使用 index.html 的 preloading，等待可渲染状态后再隐藏
    if (!isServerError.value && !isSetupRequired.value && !isAppReady.value) {
        return
    }
    const preloading = document.querySelector('.preloading') as HTMLDivElement | null
    if (preloading) {
        preloading.style.display = 'none'
    }
}


</script>

<style lang="scss">
@import "scss/diary";
</style>

