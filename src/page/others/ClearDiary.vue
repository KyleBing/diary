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
                            <p>你的所有日记都将被删除</p>
                            <p class="mt-2">总计 <b>{{ statisticsCategory.amount }}</b> 篇，共享日记 <b>{{ statisticsCategory.shared }}</b> 篇</p>
                            <p></p>
                        </div>
                    </div>
                    <form id="regForm">
                        <button class="btn btn-active mt-8"
                                type="button"
                                @click.prevent="changePasswordSubmit">确认清空所有日记
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
import utility from "@/utility";
import diaryApi from "@/api/diaryApi";
import projectConfig from "@/projectConfig";


export default {
    name: 'ClearDiary',
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
        document.title = '日记 - 清空日记' // 变更标题
    },
    computed: {
        ...mapState(['insets', 'statisticsCategory']),
    },
    methods: {
        changePasswordSubmit() {
            diaryApi
                .clear()
                .then(res => {
                    utility.popMessage('success', res.message, ()=>{
                        this.$router.push({name: 'List'})
                    }, 2)
                })
        }
    },
}
</script>
