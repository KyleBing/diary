<template>
    <div class="about" :style="'height:' + insets.heightPanel + 'px'">
        <h3 class="title">标题日记</h3>
        <h4 class="subtitle">用一句话记录你最珍贵的时刻</h4>
        <h4 class="subtitle">电脑版</h4>
        <div class="author">
            <a href="http://kylebing.cn" class="social-link">🌖开发者主页</a>
            <a href="http://weibo.com/kylebing" class="social-link">@十月ooOO</a>
            <a href="mailto:kylebing@163.com">kylebing@163.com</a>
            <a href="https://github.com/KyleBing/diary">v7.13 （2021-12-26）</a>
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
@import "../scss/plugin";

.about{
    position: relative;
    height: 100%;
    text-align: center;
    color: $bg-light;
    padding-top: 60px;
    .title{
        font-size: 20px;
        font-weight: bold;
        line-height: 30px;
        color: white;
    }
    .subtitle{
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
