<template>
    <div class="bg" :style="`height: ${insets.windowsHeight}px`">
        <div class="not-found">
            <div class="logo">
                <img src="../assets/img/logo/logo_server_error.svg" alt="logo error">
            </div>
            <h1>访问的页面不存在</h1>
            <h1><router-link to="/">返回主页</router-link></h1>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";
import svgIcons from "../assets/img/SvgIcons";

export default {
    name: "notFound_404",
    computed: {
        ...mapState(['insets'])
    },
    data(){
        return {
            icons: svgIcons
        }
    }
}
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
