<template>
    <div class="bg" :style="`height: ${projectStore.insets.windowsHeight}px`">
        <div class="not-found">
            <div class="logo">
                <img :src="SVG_ICONS.logo_icons.logo_server_error" alt="logo error">
            </div>
            <h1>访问的页面不存在</h1>
            <h1><RouterLink to="/">返回主页</RouterLink></h1>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {useProjectStore} from "../pinia/useProjectStore.ts";
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts";
const projectStore = useProjectStore()
</script>

<style scoped lang="scss">
@import "../scss/plugin";

.bg{
    letter-spacing: 1px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    background-color: $bg-menu;
    color: white;
}
a{
    line-height: 1.5;
    color: $color-main;
    &:hover{
        text-decoration: underline;
    }
}

.not-found{
    padding: 50px 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column nowrap;
    h1{
        font-size: $fz-main;
        font-weight: normal;
        margin-bottom: 10px;
    }
    .logo{
        img{
            display: block;
            width: 80px;
        }
    }
}
</style>
