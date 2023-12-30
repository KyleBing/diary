<template>
    <router-view v-if="storeProject.categoryAll.length > 0"/>
    <server-error v-if="isServerError"/>
</template>
<script lang="ts" setup>
import {useProjectStore} from "./pinia";
const storeProject = useProjectStore()
import {onBeforeMount, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";


const route = useRoute()
const router = useRouter()

import diaryApi from "./api/diaryApi.ts"


// Server Error
import ServerError from "./fundation/ServerError.vue";
const isServerError = ref(false)


onBeforeMount(() => {
    // 日记项目载入后，隐藏 preloading
    document.querySelector('.preloading').style.display = 'none'

    // 获取当前颜色模式
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        storeProject.colorMode=  'dark'
    } else {
        storeProject.colorMode=  'dark'
    }

    // 颜色模式监听
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        storeProject.colorMode = event.matches ? "dark" : "light"
    })
})


onMounted(()=> {
    // 获取所有类别数据
    getCategoryAll()

    // 从本地配置文件中载入配置
    storeProject.initProjectConfig()

    window.onresize = () => {
        storeProject.insets = {
            windowsHeight: document.documentElement.clientHeight,
            windowsWidth: document.documentElement.clientWidth,
            heightPanel: document.documentElement.clientHeight - 45, // 除 navbar 的高度
        }
        if (storeProject.isInMobileMode){

        } else {
            if (route.name === 'List'){
                router.push({
                    name: 'EditNew'
                })
            }
        }
    }
})

function getCategoryAll() {
    diaryApi
        .categoryAllGet()
        .then(res => {
            storeProject.categoryAll = res.data
        })
        .catch(_ => {
            isServerError.value = true
            console.log('服务器错误，请联系管理员')
        })
}
</script>

<style lang="scss">
@import "scss/diary";
</style>

