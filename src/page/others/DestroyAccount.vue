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
                            <img :src="icons.logoIcon.changeAvatar" alt="Diary Logo">
                        </div>
                        <!--                        <div class="project-name">清空所有日记</div>-->
                    </div>
                    <form id="regForm">
                        <button class="btn btn-active mt-8"
                                type="button"
                                @click.prevent="changePasswordSubmit">确认注销帐号
                        </button>
                    </form>
                    <div class="footer flex-center">
                        <router-link to="/">返回</router-link>
                    </div>
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

export default {
    name: 'DestroyAccount',
    data() {
        return {
            show: false,
            icons: SvgIcons,
        }
    },
    mounted() {
        this.show = true
        document.title = '日记 - 注销帐号' // 变更标题
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
        }
    },
}
</script>
