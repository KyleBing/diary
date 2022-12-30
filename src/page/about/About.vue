<template>
    <div class="about" :style="'height:' + insets.heightPanel + 'px'">
        <div class="logo">
            <img src="../../assets/img/logo/logo_login.svg" alt="LOGO">
        </div>
        <h3 class="title">{{nameZh}}</h3>
        <h4 class="subtitle">{{description}}</h4>
        <div class="version">v{{version}}</div>
        <div class="author">
            <a href="http://kylebing.cn" class="social-link">🌖 开发者主页</a>
            <a href="mailto:kylebing@163.com">kylebing@163.com</a>
            <a>·</a>
            <a href="https://github.com/KyleBing/diary-vue"> &gt;&gt; 前往开源仓库 &lt;&lt; </a>
            <a>·</a>
            <a href="">{{dateInit}} ~ {{dateModify}}</a>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex"
import packageInfo from "../../../package.json"

export default {
    name: "About",
    computed: {
        ...mapState(['insets'])
    },
    data(){
        return {
            version: packageInfo.version,
            dateModify: packageInfo.dateModify,
            dateInit: packageInfo.dateInit,
            nameZh: packageInfo.nameZh,
            description: packageInfo.description
        }
    }
}
</script>

<style lang="scss">
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
            width: 70px;
        }
    }
    .title{
        font-size: $fz-label;
        font-weight: bold;
        line-height: 1.5;
        color: white;
    }
    .subtitle{
        font-size: $fz-note;
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
        font-weight: 300;
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
