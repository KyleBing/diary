<template>
    <page-header title="邀请码（点击复制）">
        <tab-icon @click="generateNewInvitationCode" alt="添加"/>
    </page-header>

    <div class="invitation-container">
        <div v-if="isLoading" class="pt-8 pb-8" :style="'height:' + insets.heightPanel + 'px'">
            <loading :loading="isLoading"/>
        </div>

        <div v-else
             :style="'height:' + insets.heightPanel + 'px'">
            <div class="invitation-list" >
                <div :class="['invitation-list-item', {shared: item.is_shared === 1}]"
                     v-for="(item,index) in invitationList" :key="item.id">
                    <div class="index">{{ index + 1 }}</div>
                    <div
                        class="invitation-code"
                        :data-clipboard="item.id"
                    >{{ item.id }}
                    </div>
                    <div class="operation-btns">
                        <tab-icon alt="关闭" @click="deleteInvitationCode(item.id)"/>
                        <tab-icon v-if="item.is_shared === 0" alt="确定" @click="markAsShared(item.id)"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import Loading from "../../components/Loading"
import utility from "../../utility"
import BankCard from "../../page/bankCard/BankCard"
import ClipboardJS from "clipboard"
import TabIcon from "../../components/TabIcon"
import PageHeader from "../../framework/PageHeader"
import invitationApi from "../../api/invitationApi";

export default {
    name: "InvitationList",
    components: {PageHeader, TabIcon, BankCard, Loading},
    data() {
        return {
            isLoading: false,
            invitationList: [],
            clipboard: null, // clipboard obj
        }
    },
    mounted() {
        // 只在第一次请求的时候显示载入 loading
        this.isLoading = true
        this.getInvitationList()

        // 绑定剪贴板操作方法
        this.clipboard = new ClipboardJS('.invitation-code', {
            text: trigger => {
                return trigger.getAttribute('data-clipboard')
            },
        })
        this.clipboard.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
            utility.popMessage('success', '卡号已复制到剪贴板', null, 2)
        })
    },
    beforeUnmount() {
        this.clipboard.destroy()
    },

    computed: {
        ...mapState({
            years: 'statisticsYear',
        }),
        ...mapState(['insets', 'categoryAll'])
    },
    methods: {
        getInvitationList(){
            invitationApi
                .list()
                .then(res => {
                    this.isLoading = false
                    if (res.data) {
                        this.invitationList = res.data
                    } else {
                        // 没有设置任何银行卡信息
                    }
                })
                .catch(err => {
                    this.isLoading = false
                })
        },
        // 生成新的邀请码
        generateNewInvitationCode(){
            invitationApi
                .generate()
                .then(res => {
                    utility.popMessage('success', res.message, null)
                    this.getInvitationList()
                })
                .catch(err => {
                })
        },

        // 删除邀请码
        deleteInvitationCode(invitationId){
            invitationApi
                .delete({
                    id: invitationId
                })
                .then(res => {
                    utility.popMessage('success', res.message, null)
                    this.getInvitationList()
                })
                .catch(err => {
                })
        },
        // 邀请码为已分享状态
        markAsShared(invitationId){
            invitationApi
                .markAsShared({
                    id: invitationId
                })
                .then(res => {
                    utility.popMessage('success', res.message, null)
                    this.getInvitationList()
                })
                .catch(err => {
                })
        },
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";

.invitation-container{
    padding: 30px;
    overflow-y: auto;
    background-color: $bg-menu;
}
.invitation-list{
    display: flex;
    justify-content: flex-start;
    flex-flow: row wrap;
    &-item{
        @include transition(all 0.3s);
        align-items: center;
        margin-right: 15px;
        margin-bottom: 15px;
        padding: 10px 10px 10px 30px;
        background-color: white;
        @include border-radius($radius-pc);
        border: 1px solid white;
        display: flex;
        font-family: 'JetBrainsMonoDiary', sans-serif;
        flex-flow: row nowrap;
        .index{
            color: $magenta;
            font-size: $fz-title;
            font-weight: bold;
            margin-right: 10px;
        }
        .invitation-code{
            @extend .btn-like;
            overflow: hidden;
            flex-grow: 1;
            font-size: $fz-title;
        }
        .operation-btns{
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            margin-left: 10px;
            flex-shrink: 0;
        }
        &.shared{
            background: linear-gradient(lighten($green, 20%), $green);
            border-top-color: lighten($green, 20%);
            border-bottom-color: $green;
            border-left-color: $green;
            border-right-color: $green;
        }
    }
}

// MOBILE
@media (max-width: $grid-separate-width-sm) {
    .invitation-container{
        padding: 20px;
    }
    .invitation-list-item{
        margin-right: 0;
        width: 100%;
        padding: 15px;
    }
}

// DARK
@media (prefers-color-scheme: dark) {
    .invitation-container{
        background-color: $dark-bg;
    }
    .invitation-list {
        display: flex;
        justify-content: flex-start;
        flex-flow: row wrap;

        &-item {
            background-color: $dark-bg-dark;
            border-color: $dark-border;
            .index{
                color: white;
            }
            .invitation-code{
                color: $color-main;
            }
        }
    }
}

</style>
