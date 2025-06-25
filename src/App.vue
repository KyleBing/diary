<template>
    <RouterView v-if="useStatisticStore().categoryAll.length > 0"/>
    <ServerError v-if="isServerError"/>
</template>
<script lang="ts" setup>
import {useProjectStore} from "./pinia/useProjectStore.ts";
const projectStore = useProjectStore()
import {onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStatisticStore} from "./pinia/useStatisticStore.ts";

const route = useRoute()
const router = useRouter()


// Server Error
import ServerError from "./components/ServerError.vue";
const isServerError = ref(false)


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
    useStatisticStore().getCategoryAll().then(res => { // 获取所有类别数据
        isServerError.value = !res
    })

    projectStore.cacheDiary = undefined         // 每次刷新页面，清空缓存日记内容
    projectStore.cacheDiaryOrigin = undefined   // 每次刷新页面，清空缓存日记内容

    // 从本地配置文件中载入配置
    projectStore.INIT_PROJECT_CONFIG()

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


</script>

<style lang="scss">
@import "scss/diary";
</style>

