<template>
    <div class="about" :style="'height:' + insets.heightPanel + 'px'">
        <div class="logo">
            <img src="../assets/img/logo.svg" alt="LOGO">
        </div>
        <h3 class="title">标题日记</h3>
        <h4 class="subtitle">用一句话记录你最珍贵的时刻</h4>
        <div class="author">
            <a href="https://kylebing.cn" class="social-link">🌖 开发者主页</a>
            <a href="mailto:kylebing@163.com">kylebing@163.com</a>
            <a href="https://github.com/KyleBing/diary-vue">GitHub.com</a>
            <a>·</a>
            <a href="">v7.34 @ 2022-07-16</a>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "About",
    computed: {
        ...mapState(['insets'])
    }
}
</script>

<style lang="scss">
@import "../assets/scss/plugin";

.about{
    position: relative;
    height: 100%;
    text-align: center;
    color: $bg-light;
    padding-top: 60px;
    .logo{
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
        line-height: 30px;
        color: white;
    }
    .subtitle{
        font-size: $fz-small;
        color: $text-about-subtitle;
        font-weight: 300;
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
                font-weight: 300;
            }
        }
    }
}
</style>
