<template>
    <div class="body-login-bg" :style="`min-height: ${storeProject.insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <!--APP-->
                <div id="reg">
                    <div class="logo-wrapper">
                        <div class="logo">
                            <img v-if="userInfo.avatar" :src="userInfo.avatar + '-' + projectConfig.QiniuStyleSuffix || SVG_ICONS.logo_icons.logo_rounded" alt="Avatar">
                            <img v-else :src="SVG_ICONS.logo_icons.logo_avatar" alt="Avatar">
                        </div>
                        <div class="desc">
                            <p>这是你最后反悔的机会</p>
                            <p>你的所有日记都将被删除</p>
                            <p class="mt-2">总计 <b>{{ storeProject.statisticsCategory.amount }}</b> 篇，共享日记 <b>{{ storeProject.statisticsCategory.shared }}</b> 篇</p>
                            <p></p>
                        </div>
                    </div>
                    <form id="regForm">
                        <button class="btn btn-active mt-8"
                                type="button"
                                @click.prevent="changePasswordSubmit">确认清空所有日记
                        </button>
                        <button class="btn mt-5"
                                type="button"
                                @click.prevent="$router.go(-1)">取消
                        </button>
                    </form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import diaryApi from "../../api/diaryApi.ts";
import projectConfig from "../../projectConfig.ts";
import {getAuthorization, popMessage} from "../../utility.ts";
import {onMounted, ref} from "vue";
import {useProjectStore} from "../../pinia";
import {useRouter} from "vue-router";
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";

const storeProject = useProjectStore()
const router = useRouter()

const show = ref(false)
const userInfo = getAuthorization()

onMounted(()=>{
    show.value = true
    document.title = '日记 - 清空日记' // 变更标题
})

function changePasswordSubmit() {
    diaryApi
        .clear()
        .then(res => {
            popMessage('success', res.message, ()=>{
                router.push({name: 'List'})
            }, 2)
        })
        .catch(err => {
            popMessage('danger', err.message, ()=>{
            }, 3)
        })
}
</script>
