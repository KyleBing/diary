<template>
    <div class="body-login-bg" :style="`min-height: ${projectStore.insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <!--APP-->
                <div id="reg">
                    <div class="logo-wrapper">
                        <div class="logo">
                            <img v-if="userInfo.avatar" :src="userInfo.avatar + '-' + projectConfig.qiniu_style_suffix || SVG_ICONS.logo_icons.logo_rounded" alt="Avatar">
                            <img v-else :src="SVG_ICONS.logo_icons.logo_avatar" alt="Avatar">
                        </div>
                        <div class="desc">
                            <p>这是你最后反悔的机会</p>
                            <p>该账号的所有内容都将被删除</p>
                        </div>
                    </div>
                    <form id="regForm">
                        <button class="btn btn-active mt-8"
                                type="button"
                                @click.prevent="changePasswordSubmit">确认注销账号
                        </button>
                        <button class="btn mt-5"
                                type="button"
                                @click.prevent="router.go(-1)">取消
                        </button>
                    </form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import projectConfig from "../../../config/project_config.json";
import {deleteAuthorization, removeDiaryConfig, getAuthorization, popMessage} from "@/utility.ts";
import {onMounted, ref} from "vue";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {useRouter} from "vue-router";
import userApi from "@/api/userApi.ts";
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts";

const projectStore = useProjectStore()
const router = useRouter()

const show = ref(false)
const userInfo = getAuthorization()

onMounted(()=>{
    show.value = true
    document.title = '日记 - 注销账号' // 变更标题
})

function changePasswordSubmit() {
    userApi
        .destroyAccount()
        .then(res => {
            deleteAuthorization()
            removeDiaryConfig()
            popMessage('success', '注销成功，3 秒后跳转到登录页面', ()=>{
                router.push({name: 'Login'})
            }, 3)
        })
        .catch(err => {
            popMessage('danger', err.message, ()=>{
            }, 3)
        })
}
</script>
