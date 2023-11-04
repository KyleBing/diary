<template>
    <div class="body-login-bg" :style="`min-height: ${insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <!--APP-->
                <div id="reg">
                    <div class="logo-wrapper">
                        <div class="logo">
                            <img v-if="userInfo.avatar" :src="userInfo.avatar + '-' + QiniuStyleSuffix || icons.logoIcon.login" alt="Avatar">
                            <img v-else src="../../assets/img/logo/logo_avatar.svg" alt="Avatar">
                        </div>
                        <div class="desc">
                            <p>这是你最后反悔的机会</p>
                            <p>该账号的所有内容都将被删除</p>
                        </div>
                    </div>
                    <form id="regForm">
                        <button class="btn btn-active mt-8"
                                type="button"
                                @click.prevent="changePasswordSubmit">确认注销账号
                        </button>
                        <button class="btn mt-5"
                                type="button"
                                @click.prevent="$router.go(-1)">取消
                        </button>
                    </form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import {mapState} from "vuex"
import SvgIcons from "../../assets/img/SvgIcons"
import userApi from "@/api/userApi";
import utility from "@/utility";
import projectConfig from "@/projectConfig";

export default {
    name: 'DestroyAccount',
    data() {
        return {
            show: false,
            icons: SvgIcons,
            userInfo: utility.getAuthorization(),
            QiniuStyleSuffix: projectConfig.QiniuStyleSuffix,
        }
    },
    mounted() {
        this.show = true
        document.title = '日记 - 注销账号' // 变更标题
    },
    computed: {
        ...mapState(['insets']),
    },
    methods: {
        changePasswordSubmit() {
            userApi
                .destroyAccount()
                .then(res => {
                    utility.deleteAuthorization()
                    utility.deleteDiaryConfig()
                    utility.popMessage('success', '注销成功，3 秒后跳转到登录页面', ()=>{
                        this.$router.push({name: 'Login'})
                    }, 3)
                })
                .catch(err => {
                    utility.popMessage('danger', err.message, ()=>{
                    }, 3)
                })
        }
    },
}
</script>
