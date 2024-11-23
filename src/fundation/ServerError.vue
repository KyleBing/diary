<template>
    <!-- 服务器错误 -->
    <div class="server-error" :style="`height: ${projectStore.insets.windowsHeight}px`">
        <div class="logo-server-error">
            <img :src="SVG_ICONS.logo_icons.logo_server_error" alt="logo error">
        </div>
        <div class="server-error-title">遇到错误，请尝试刷新页面。如果还不行，请联系管理员</div>
        <div class="server-error-title">
            <a :href="`mailto:${ projectConfig.adminEmail }`">{{ projectConfig.adminEmail }}</a>
        </div>
    </div>

</template>

<script lang="ts" setup>
import projectConfig from "../projectConfig.ts"
import {useProjectStore} from "../pinia";
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts";
const projectStore = useProjectStore()
</script>

<style scoped lang="scss">
@import "../scss/plugin";

.server-error{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
}

.logo-server-error{
    margin-bottom: 20px;
    width: 80px;
    img{
        width: 100%;
    }
}

.server-error-title{
    text-align: center;
    font-size: 14px;
    color: #FFCC00;
    a{
        color: #FFCC00;
        font-size: 14px;
        text-decoration: underline;
    }
}



</style>
