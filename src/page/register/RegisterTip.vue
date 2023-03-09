<template>
    <transition
        enter-active-class="animated-fast fadeIn"
        leave-active-class="animated-fast faceOut"
    >
        <div class="register-tip mb-6">
            <h3>注册说明</h3>
            <p><a target="_blank" href="https://kylebing.cn">kylebing.cn</a> 网站下面的所有应用都共用一个用户数据库，也就是说，账号支持下面的所有网站：</p>
            <ol>
                <li><a target="_blank" href="https://kylebing.cn/diary">标题日记</a></li>
                <li><a target="_blank" href="https://kylebing.cn/tools/map">路书</a></li>
                <li><a target="_blank" href="https://kylebing.cn/manager">后台</a></li>
                <li><a target="_blank" href="https://kylebing.cn/qr">挪车二维码</a></li>
                <li><a target="_blank" href="https://github.com/KyleBing/wubi-dict-editor">五笔码表同步功能</a></li>
            </ol>
            <p>关于邀请码：为了避免恶意注册，注册规则现为一人一码。</p>
            <p>请发邮件向管理员免费获取： <a :href="`mailto:${adminEmail}`">{{adminEmail}}</a></p>
        </div>
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

<style lang="scss" scoped>
@import "../../scss/plugin";
.register-tip {
    width: 100%;
    padding: 20px;
    font-size: $fz-small;
    @include border-radius($radius-pc);
    background-color: $bg-menu;
    color: $dark-text-title;
    h3{
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
        color: inherit;
        &:hover{
            color: $color-main;
        }
    }
}
</style>
