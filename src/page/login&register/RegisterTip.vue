<template>
    <transition
        enter-active-class="animated-fast fadeIn"
        leave-active-class="animated-fast faceOut"
    >
        <div v-if="projectTip" class="register-tip mb-6" v-html="projectTip"/>
    </transition>
</template>


<script>
import {mapState} from "vuex"
import projectConfig from "../../projectConfig";

export default {
    name: 'RegisterTip',
    data() {
        return {
            show: false,
            adminEmail: projectConfig.adminEmail,
            projectTip: projectConfig.registerTip
        }
    },
    mounted() {
        this.show = true
        document.title = '日记 - 注册' // 变更标题
    },
    computed: {
        ...mapState(['insets']),
        verified() {
            // return this.emailVerified && this.invitationVerified && this.nicknameVerified && this.password1Verified && this.password2Verified
            return this.emailVerified && this.nicknameVerified && this.password1Verified && this.password2Verified
        },
    },
    methods: {},
    watch: {}
}
</script>

<style lang="scss">
@import "../../scss/plugin";
.register-tip {
    width: 100%;
    padding: 20px;
    font-size: $fz-small;
    @include border-radius($radius-pc);
    background-color: $bg-menu;
    color: $dark-text-title;
    line-height: 1.3;

    h1,h2,h3,h4,h5,h6{
        text-align: center;
        margin-bottom: 20px;
        font-size: $fz-title;
    }
    p{
    }
    ol{
        padding: 10px;
        margin-left: 30px;
        li{
        }
    }
    a{
        color: $green;
        &:hover{
            color: $color-main;
        }
    }
}
</style>
