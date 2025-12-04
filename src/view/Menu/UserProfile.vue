<template>
    <div class="user-profile">
        <div class="avatar">
            <img v-if="userInfo.avatar"
                 :src="userInfo.avatar + '-' + projectConfig.qiniu_style_suffix || SVG_ICONS.logo_icons.logo_rounded"
                 alt="Avatar">
            <img v-else :src="SVG_ICONS.logo_icons.logo_avatar" alt="Avatar">
        </div>
        <div class="user-info mt-1 mb-2">
            <div class="user">
                <div class="username">{{ userInfo.nickname }}</div>
                <div class="email">{{ userInfo.email }}</div>
                <div class="operation">
                    <div class="logout" @click="logout">退出</div>
                    <div class="logout ml-3" @click="changeProfile">修改</div>
                </div>
            </div>
        </div>
        <div v-if="statisticStore.statisticsCategory.shared > 0" class="statistics">
            <p>📍 {{userInfo.city}}</p>
            <p>总计 <b>{{ statisticStore.statisticsCategory.amount }}</b> 篇</p>
            <p>共享 <b>{{ statisticStore.statisticsCategory.shared }}</b> 篇</p>
        </div>
        <div class="copyright">
            <span class="version ml-1">v{{ packageInfo.version }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import projectConfig from "../../../config/project_config.json";
import {ref} from "vue";
import {deleteAuthorization, getAuthorization} from "@/utility.ts";
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts";
import {useRouter} from "vue-router";
import packageInfo from "../../../package.json";
import {useStatisticStore} from "@/pinia/useStatisticStore.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";

const statisticStore = useStatisticStore()
const projectStore = useProjectStore()

const router = useRouter()

const userInfo = ref(getAuthorization())

function changeProfile(){
    router.push({name: 'ChangeProfile'})
}
// 退出登录
function logout() {
    deleteAuthorization()
    statisticStore.removeCategoryAllFromLocalStorage()
    projectStore.isMenuShowed = false  // 关闭菜单
    router.push({name: 'Login'})
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
.user-profile{
    padding: 40px 20px 10px;
    .avatar{
        border: 1px solid $color-main;
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
            $timer: 0.1;
            @include transition(all 0.3s);
            @include box-shadow(
                    3px*$timer 3px*$timer 0 transparentize(black, 0.6),
                    -5px*$timer -8px*$timer 3px*$timer transparentize($color-main, 0.3),
                    -15px*$timer 13px*$timer 4px*$timer transparentize($green, 0.3),
                    -45px*$timer 8px*$timer 10px*$timer transparentize($cyan, 0.5),
                    15px*$timer -15px*$timer 10px*$timer transparentize($blue, 0.1),
                    65px*$timer 65px*$timer 30px*$timer transparentize($yellow, 0.6),
                    20px*$timer 45px*$timer 15px*$timer transparentize($magenta, 0.2),
                    -20px*$timer -45px*$timer 15px*$timer transparentize($red, 0.6),
                    -105px*$timer 38px*$timer 20px*$timer transparentize($green, 0.5),
                    15px*$timer -105px*$timer 10px*$timer transparentize($blue, 0.6),
                    140px*$timer 45px*$timer 15px*$timer transparentize($magenta, 0.6),
                    -20px*$timer -145px*$timer 40px*$timer transparentize($yellow, 0.6),
                    60px*$timer -65px*$timer 40px*$timer transparentize($magenta, 0.2),
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
        border-top: 1px solid rgba(255,255,255,0.1);
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

.copyright{
    margin-top: 10px;
    display: flex;
    justify-content: center;
    font-size: $fz-small;
    .version{
        color: $dark-text-subtitle;
    }

}


// MOBILE
@media (max-width: $grid-separate-width-sm) {
    .user-profile{
        padding: 20px 30px 10px;
        .statistics{
            @include border-radius($radius-pc)
        }
    }

}


@keyframes vola {

    0%{
        $timer: 0.3;
        @include box-shadow(
                3px*$timer 3px*$timer 0 transparentize(black, 0.6),
                -5px*$timer -8px*$timer 3px*$timer transparentize($color-main, 0.3),
                -15px*$timer 13px*$timer 4px*$timer transparentize($green, 0.3),
                -45px*$timer 8px*$timer 10px*$timer transparentize($cyan, 0.5),
                15px*$timer -15px*$timer 10px*$timer transparentize($blue, 0.1),
                65px*$timer 65px*$timer 30px*$timer transparentize($yellow, 0.6),
                20px*$timer 45px*$timer 15px*$timer transparentize($magenta, 0.2),
                -20px*$timer -45px*$timer 15px*$timer transparentize($red, 0.6),
                -105px*$timer 38px*$timer 20px*$timer transparentize($green, 0.5),
                15px*$timer -105px*$timer 10px*$timer transparentize($blue, 0.6),
                140px*$timer 45px*$timer 15px*$timer transparentize($magenta, 0.6),
                -20px*$timer -145px*$timer 40px*$timer transparentize($yellow, 0.6),
                60px*$timer -65px*$timer 40px*$timer transparentize($magenta, 0.2),
        );
    }

    50%{
        $timer: 0.5;
        @include box-shadow(
                -3px*$timer 3px*$timer 0 transparentize(black, 0.6),
                -5px*$timer -8px*$timer 3px*$timer transparentize($color-main, 0.3),
                -15px*$timer 13px*$timer 4px*$timer transparentize($green, 0.3),
                45px*$timer -8px*$timer 10px*$timer transparentize($cyan, 0.5),
                -15px*$timer 15px*$timer 10px*$timer transparentize($blue, 0.1),
                15px*$timer -5px*$timer 30px*$timer transparentize($yellow, 0.6),
                20px*$timer 45px*$timer 15px*$timer transparentize($magenta, 0.2),
                -20px*$timer 45px*$timer 15px*$timer transparentize($red, 0.6),
                5px*$timer 18px*$timer 20px*$timer transparentize($green, 0.5),
                -15px*$timer 105px*$timer 10px*$timer transparentize($blue, 0.6),
                14px*$timer 15px*$timer 35px*$timer transparentize($magenta, 0.6),
                -20px*$timer -145px*$timer 40px*$timer transparentize($yellow, 0.6),
                20px*$timer -15px*$timer 0px*$timer transparentize($magenta, 0.2),
        );
    }
    100%{
        $timer: 0.3;
        @include box-shadow(
                3px*$timer 3px*$timer 0 transparentize(black, 0.6),
                -5px*$timer -8px*$timer 3px*$timer transparentize($color-main, 0.3),
                -15px*$timer 13px*$timer 4px*$timer transparentize($green, 0.3),
                -45px*$timer 8px*$timer 10px*$timer transparentize($cyan, 0.5),
                15px*$timer -15px*$timer 10px*$timer transparentize($blue, 0.1),
                65px*$timer 65px*$timer 30px*$timer transparentize($yellow, 0.6),
                20px*$timer 45px*$timer 15px*$timer transparentize($magenta, 0.2),
                -20px*$timer -45px*$timer 15px*$timer transparentize($red, 0.6),
                -105px*$timer 38px*$timer 20px*$timer transparentize($green, 0.5),
                15px*$timer -105px*$timer 10px*$timer transparentize($blue, 0.6),
                140px*$timer 45px*$timer 15px*$timer transparentize($magenta, 0.6),
                -20px*$timer -145px*$timer 40px*$timer transparentize($yellow, 0.6),
                60px*$timer -65px*$timer 40px*$timer transparentize($magenta, 0.2),
        );
    }


}


</style>
