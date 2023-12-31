<template>
    <div class="about" :style="'height:' + storeProject.insets.heightPanel + 'px'">
        <div class="logo">
            <img src="../../assets/img/logo/logo_login.svg" alt="LOGO">
        </div>
        <h3 class="title">{{packageInfo.nameZh}}</h3>
        <h4 class="subtitle">{{packageInfo.description}}</h4>
        <div class="version">v{{packageInfo.version}}</div>
        <div class="author">
            <a href="http://kylebing.cn" class="social-link">🌖 开发者主页</a>
            <a href="mailto:kylebing@163.com">kylebing@163.com</a>
            <a>·</a>
            <a href="https://github.com/KyleBing/diary-vue"> github 开源仓库 </a>
            <a>·</a>
            <a href="">{{packageInfo.dateInit}} ~ {{packageInfo.dateModify}}</a>
        </div>
    </div>
</template>

<script lang="ts" setup>

import packageInfo from "../../../package.json"
import {useProjectStore} from "../../pinia";
const storeProject = useProjectStore()

</script>

<style lang="scss" scoped>
@import "../../scss/plugin";

.about{
    position: relative;
    height: 100%;
    text-align: center;
    color: $bg-light;
    padding-top: 60px;
    .logo{
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        img{
            display: block;
            width: 80px;
        }
    }
    .title{
        font-size: $fz-title;
        font-weight: bold;
        line-height: 1.5;
        color: white;
    }
    .subtitle{
        font-size: $fz-label;
        font-weight: 300;
        color: $text-about-subtitle;
    }
    .version{
        line-height: 1.5;
        color: white;
        margin-top: 20px;
        font-size: $fz-list-content;
    }
    .author{
        width: 100%;
        position: absolute;
        bottom: 60px;
        a{
            display: block;
            line-height: 20px;
            font-size: $fz-note;
            height: 20px;
            &:link,&:hover,&:active,&:visited{
                color: $text-about-subtitle;
            }
        }
    }
}
</style>
