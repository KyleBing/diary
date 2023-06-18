<template>
    <div class="user-profile">
        <div class="avatar">
            <img :src="userInfo.avatar + '-' + QiniuStyleSuffix || icons.logoIcon.login" alt="Avatar">
        </div>
        <div class="user-info mt-2 mb-4">
            <div class="user">
                <div class="username">{{ userInfo.nickname }}</div>
                <div class="email">{{ userInfo.email }}</div>
                <div class="operation">
                    <div class="logout" @click="logout">退出</div>
                    <div class="logout ml-3" @click="changeProfile">修改</div>
                </div>
            </div>
        </div>
        <div v-if="statisticsCategory.shared > 0" class="statistics">
            <p>📍 {{userInfo.city}}</p>
            <p>总计 <b>{{ statisticsCategory.amount }}</b> 篇</p>
            <p>共享 <b>{{ statisticsCategory.shared }}</b> 篇</p>
        </div>
    </div>
</template>

<script>
import projectConfig from "@/projectConfig";
import utility from "@/utility";
import {mapState} from "vuex";
import svgIcons from "@/assets/img/SvgIcons";

export default {
    name: "UserProfile",
    data(){
        return {
            QiniuStyleSuffix: projectConfig.QiniuStyleSuffix,
            // menu - category
            userInfo: utility.getAuthorization(),
            icons: svgIcons,
        }
    },
    computed: {
        ...mapState([
            'statisticsCategory',
        ])
    },
    methods: {
        changeProfile(){
            this.$router.push({name: 'ChangeProfile'})
        },
        logout() {
            utility.deleteAuthorization()
            this.$router.push({name: 'Login'})
            this.SET_MENU_SHOWED(false)
        },
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
.user-profile{
    padding: 30px 60px 50px;
    .avatar{
        margin: 0 auto;
        width: 60px;
        height: 60px;
        @include border-radius(50px);
        outline-width: 1px;
        overflow: hidden;
        img{
            width: 100%;
            display: block;
        }
    }
    .user-info{
        margin: 0 auto;
        padding: 8px 10px;
        @include border-radius($radius-pc $radius-pc 0 0);
        display: flex;
        //background-color: transparentize(white, 0.9);
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        line-height: 1.5;
        font-size: 13px;
        white-space: nowrap;
        color: $text-about-subtitle;

        .user{
            text-align: center;
            .username{
                font-weight: bold;
                font-size: $fz-label;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .operation{
            display: flex;
            justify-content: center;
            .logout {
                color: $color-main;
                opacity: 0.7;
                @extend .btn-like;
                &:hover {
                    opacity: 1;
                }
            }
        }
    }

    .statistics{
        margin: 0 auto;
        margin-top: 1px;
        padding: 10px 10px;
        @include border-radius($radius-mobile);
        display: flex;
        background-color: transparentize(white, 0.9);
        justify-content: space-around;
        align-items: center;
        line-height: 1.5;
        font-size: 13px;
        white-space: nowrap;
        color: $text-about-subtitle;
    }
}


</style>
