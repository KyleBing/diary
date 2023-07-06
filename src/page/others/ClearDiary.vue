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

export default {
    name: 'ClearDiary',
    data() {
        return {
            show: false,
            icons: SvgIcons,
        }
    },
    mounted() {
        this.show = true
        document.title = '日记 - 清空日记' // 变更标题
    },
    computed: {
        ...mapState(['insets']),
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
