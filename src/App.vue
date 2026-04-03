<template>
    <RouterView v-if="canRenderRouterView"/>
    <ServerError v-if="isServerError"/>
</template>
<script lang="ts" setup>
import {useProjectStore} from "./pinia/useProjectStore.ts";
const projectStore = useProjectStore()
import {computed, onBeforeMount, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStatisticStore} from "./pinia/useStatisticStore.ts";
import setupApi from "@/api/setupApi.ts";

const route = useRoute()
const router = useRouter()
const statisticStore = useStatisticStore()


// Server Error
import ServerError from "./components/ServerError.vue";
const isServerError = ref(false)
const isSetupRequired = ref(false)
const canRenderRouterView = computed(() => {
    return route.name === 'Setup' || isSetupRequired.value || statisticStore.categoryAll.length > 0
})


onBeforeMount(() => {
    // 日记项目载入后，隐藏 preloading
    (document.querySelector('.preloading') as HTMLDivElement).style.display = 'none'

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
            isSetupRequired.value = !res.data.isInitialized
            if (isSetupRequired.value) {
                isServerError.value = false
                if (route.name !== 'Setup') {
                    await router.replace({name: 'Setup'})
                }
                return
            }

            statisticStore.getCategoryAll().then(success => {
                isServerError.value = !success
            })
        })
        .catch(() => {
            statisticStore.getCategoryAll().then(success => {
                isServerError.value = !success
            })
        })
}

function handleSetupCompleted() {
    isSetupRequired.value = false
    statisticStore.getCategoryAll().then(success => {
        isServerError.value = !success
    })
}


</script>

<style lang="scss">
@import "scss/diary";
</style>

