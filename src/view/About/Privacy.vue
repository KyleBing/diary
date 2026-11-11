<template>
    <div class="body-login-bg privacy-page" :style="`min-height: ${projectStore.insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <div class="logo-wrapper">
                    <div class="logo">
                        <img :src="SVG_ICONS.logo_icons.logo_rounded" alt="标题日记">
                    </div>
                    <div class="project-name">隐私说明</div>
                    <p class="privacy-meta">标题日记 · iOS 与网页</p>
                </div>

                <article class="privacy-card">
                    <p class="lead">
                        「标题日记」尊重你写下的内容。本说明对应 iOS App（标题日记）与网页端（diary-vue）实际会处理的数据，不收集广告标识，也不把日记卖给任何人。
                    </p>
                    <p class="updated">最近更新：2026 年 11 月 11 日</p>

                    <h2>1. 我们是谁</h2>
                    <p>
                        服务由个人开发者邴新科运营，网站与接口位于
                        <a href="https://kylebing.cn" target="_blank" rel="noopener">kylebing.cn</a>。
                        iOS 与网页使用同一套账号和云端数据。
                    </p>

                    <h2>2. 账号与资料</h2>
                    <p>注册或登录时，我们会保存：</p>
                    <ul>
                        <li>邮箱、密码（密码不以明文存储）</li>
                        <li>昵称；手机号为可选项</li>
                        <li>头像（你选择上传时）</li>
                        <li>城市（你在资料里填写）</li>
                        <li>经纬度：根据你填写的城市，向和风天气做一次地名查询得到，<strong>不是手机 GPS</strong>，App 也不会在后台持续定位</li>
                    </ul>
                    <p>登录成功后，本机会保存登录令牌，用于之后的请求；你可以随时退出登录以清除。</p>

                    <h2>3. 日记、账单与文件</h2>
                    <p>登录后写入服务器的内容包括：</p>
                    <ul>
                        <li>日记标题、正文、日期、类别、天气与温度、是否公开</li>
                        <li>账单记录、银行卡信息（由你自行录入）</li>
                        <li>文件库中的图片与文件</li>
                    </ul>
                    <p>这些内容用于向你展示、搜索、统计和备份。默认仅你自己可见。</p>

                    <h2>4. iOS 系统权限</h2>
                    <p>仅在你主动使用对应功能时申请，可在系统设置里随时关闭：</p>
                    <ul>
                        <li><strong>相机</strong>：拍摄个人头像</li>
                        <li><strong>相册</strong>：选择头像，或把照片上传到日记文件库</li>
                    </ul>
                    <p>不申请通讯录、麦克风、精确持续定位或广告追踪。</p>

                    <h2>5. 天气</h2>
                    <p>
                        写「今天」的新日记时，若资料里已有城市对应的经纬度，且服务端配置了和风天气接口，会请求当日天气与室外温度，填进日记草稿。你可以改掉或留空。天气服务本身还受
                        <a href="https://dev.qweather.com" target="_blank" rel="noopener">和风天气</a>
                        条款约束。
                    </p>

                    <h2>6. 第三方存储</h2>
                    <p>
                        头像与文件库上传到七牛云对象存储；日记正文、账单等存放在 kylebing.cn 的服务端。
                        请求会携带你的登录令牌，用于鉴权，不会把内容用于广告画像。
                    </p>

                    <h2>7. 公开分享</h2>
                    <p>
                        只有你把某篇日记设为公开后，他人才能通过分享链接（无需登录）阅读该篇。未公开的日记不会出现在分享页。
                    </p>

                    <h2>8. 你的选择</h2>
                    <ul>
                        <li>修改资料、修改密码</li>
                        <li>删除单篇日记，或清空全部日记</li>
                        <li>注销账号：将删除该账号下的内容</li>
                    </ul>

                    <h2>9. 儿童</h2>
                    <p>本服务不以 13 岁以下儿童为对象。若发现儿童在未经监护人同意的情况下注册，请联系我们删除。</p>

                    <h2>10. 说明的变更</h2>
                    <p>功能若增加新的数据用途，会更新本页并调整「最近更新」日期。继续使用即表示知悉更新后的说明。</p>

                    <h2>11. 联系</h2>
                    <p>
                        邮箱
                        <a href="mailto:kylebing@163.com">kylebing@163.com</a>
                    </p>
                </article>

                <div class="footer center">
                    <RouterLink to="/login">登录</RouterLink>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue"
import {useProjectStore} from "@/pinia/useProjectStore.ts"
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts"

const projectStore = useProjectStore()
const show = ref(false)

onMounted(() => {
    show.value = true
    document.title = '日记 - 隐私说明'
})
</script>

<style lang="scss" scoped>
@use "../../scss/plugin" as *;

.privacy-page {
    align-items: flex-start;

    .body-login {
        padding-top: 36px;
        padding-bottom: 48px;
    }

    .logo-wrapper {
        padding: 10px 0 20px;

        .logo {
            width: 80px;
            height: 80px;
            border: none;
            box-shadow: none;
            border-radius: 18px;
        }
    }

    .privacy-meta {
        margin-top: 8px;
        text-align: center;
        color: $text-label;
        font-size: $fz-small;
    }
}

.privacy-card {
    width: 100%;
    padding: 22px 20px 24px;
    font-size: $fz-note;
    border-radius: $radius-pc;
    background-color: $bg-menu;
    color: $dark-text-title;
    line-height: 1.65;

    .lead {
        color: white;
        font-size: $fz-main;
        line-height: 1.6;
    }

    .updated {
        margin: 10px 0 18px;
        color: $text-label;
        font-size: $fz-small;
    }

    h2 {
        margin: 22px 0 8px;
        font-size: $fz-label;
        font-weight: bold;
        color: $color-main;
        text-align: left;
    }

    p, ul {
        margin-bottom: 8px;
    }

    ul {
        padding-left: 1.2em;
        color: $dark-text-title;
    }

    li + li {
        margin-top: 4px;
    }

    a {
        color: $green;
        &:hover {
            color: $color-main;
        }
    }
}

@media (prefers-color-scheme: dark) {
    .privacy-card {
        background-color: $dark-bg-menu;
        color: $dark-text;
        .lead {
            color: $dark-text-title;
        }
    }
}
</style>
