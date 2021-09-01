<template>
    <div class="bg" :style="`height: ${heightWindow}px`">
        <div class="not-found">
            <div class="logo">
                <img src="img/logo.svg" alt="LOGO">
            </div>
            <h1>访问的页面不存在</h1>
            <h1><router-link to="/">返回主页</router-link></h1>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "notFound_404",
    computed: {
        ...mapState(['heightWindow'])
    }
}
</script>

<style scoped lang="scss">
@import "../scss/variables";
.bg{
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    background-color: $bg-menu;
    color: white;
}
a{
    color: $color-main;
    &:hover{
        text-decoration: underline;
    }
}

.not-found{
    transform: translateY(-200px);
    padding: 50px 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column nowrap;
    .logo{
        img{
            display: block;
            width: 100px;
        }
    }
}
</style>
