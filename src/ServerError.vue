<template>
    <!-- 服务器错误 -->
    <div class="server-error" :style="`height: ${height}px`">
        <div class="logo-server-error">
            <img src="./assets/img/logo/logo_server_error.svg" alt="logo error">
        </div>
        <div class="server-error-title">遇到错误，请尝试刷新页面。如果还不行，请联系管理员</div>
        <div class="server-error-title">
            <a :href="`mailto:${ adminEmail }`">{{ adminEmail }}</a>
        </div>
    </div>

</template>

<script>
import packageInfo from "../package.json"

export default {
    name: "ServerError",
    data(){
        return {
            height: 800,
            adminEmail: packageInfo.adminEmail
        }
    },
    mounted() {
        this.height = innerHeight
    }
}
</script>

<style scoped lang="scss">
@import "scss/plugin";

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
