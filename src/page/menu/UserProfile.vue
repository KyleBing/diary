<template>
    <div class="user-profile">
        <div class="avatar">
            <img v-if="userInfo.avatar" :src="userInfo.avatar + '-' + projectConfig.QiniuStyleSuffix || SVG_ICONS.logo_icons.logo_login" alt="Avatar">
            <img v-else :src="SVG_ICONS.logo_icons.logo_avatar" alt="Avatar">
        </div>
        <div class="user-info mt-1 mb-4">
            <div class="user">
                <div class="username">{{ userInfo.nickname }}</div>
                <div class="email">{{ userInfo.email }}</div>
                <div class="operation">
                    <div class="logout" @click="logout">退出</div>
                    <div class="logout ml-3" @click="changeProfile">修改</div>
                </div>
            </div>
        </div>
        <div v-if="storeProject.statisticsCategory.shared > 0" class="statistics">
            <p>📍 {{userInfo.city}}</p>
            <p>总计 <b>{{ storeProject.statisticsCategory.amount }}</b> 篇</p>
            <p>共享 <b>{{ storeProject.statisticsCategory.shared }}</b> 篇</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import projectConfig from "../../projectConfig.ts";
import {ref} from "vue";
import {useProjectStore} from "../../pinia";
import {deleteAuthorization, getAuthorization, removeCategoryAll} from "../../utility.ts";
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";
import {useRouter} from "vue-router";

const router = useRouter()
const storeProject = useProjectStore()

const userInfo = ref(getAuthorization())

function changeProfile(){
    router.push({name: 'ChangeProfile'})
}
function logout() {
    deleteAuthorization()
    removeCategoryAll()
    storeProject.isMenuShowed = false
    router.push({name: 'Login'})
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
        @include box-shadow(0px 0px 0 transparentize(black, 0.6));
        @include transition(all 0.3s);
        &:hover{
            @include transition(all 0.3s);
            @include box-shadow(
                3px 3px 0 transparentize(black, 0.6),
                -5px -8px 3px transparentize($color-main, 0.3),
                -15px 13px 4px transparentize($green, 0.3),
                -45px 8px 10px transparentize($cyan, 0.5),
                15px -15px 10px transparentize($blue, 0.1),
                65px 65px 30px transparentize($yellow, 0.6),
                20px 45px 15px transparentize($magenta, 0.2),
                -20px -45px 15px transparentize($red, 0.6),
                -105px 38px 20px transparentize($green, 0.5),
                15px -105px 10px transparentize($blue, 0.6),
                140px 45px 15px transparentize($magenta, 0.6),
                -20px -145px 40px transparentize($yellow, 0.6),
                60px -65px 40px transparentize($magenta, 0.2),
            );
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

// MOBILE
@media (max-width: $grid-separate-width-sm) {
    .user-profile{
        padding: 20px 40px 50px;
    }
}


</style>
