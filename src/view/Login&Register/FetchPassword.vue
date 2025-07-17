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
                <RegisterTip :html-content="fetchPasswordTip"/>
                <div :class="['footer', 'center']">
                    <RouterLink to="/login">登录</RouterLink>
                </div>
            </div>
        </transition>
    </div>
</template>


<script lang="ts" setup>
import RegisterTip from "./RegisterTip.vue";

import {useProjectStore} from "@/pinia/useProjectStore.ts";
const projectStore = useProjectStore()
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";
import projectConfig from "../../../config/projectConfig.json"

const fetchPasswordTip =  `
            <h3>如果你忘记密码</h3>
            <p>请使用注册邮件发送邮件到 <a :href="${projectConfig.adminEmail}">${projectConfig.adminEmail}</a>，注明来意，管理员将为你重置密码</p>
            <p>之后用重置的密码登录，再修改密码即可。</p>
        `

</script>
