<template>
    <PageHeader title="邀请码" subtitle="点击可复制">
        <TabIcon v-if="isAdminUser" @click="generateNewInvitationCode" alt="添加"/>
    </PageHeader>

    <MenuPanelContainer>
        <div v-if="isLoading" class="pt-8 pb-8" :style="`height:  ${projectStore.insets.heightPanel}px`">
            <Loading :loading="isLoading"/>
        </div>

        <div v-else class="invitation-list" >
            <div :class="['invitation-list-item', {shared: item.is_shared === 1}]"
                 v-for="(item,index) in invitationList" :key="item.id">
                <div class="index">{{ index + 1 }}</div>
                <div class="invitation-code-wrapper">
                    <div
                        class="invitation-code"
                        :data-clipboard="`邀请码（时效7天）：\n\n${item.id}`"
                    >{{ item.id }}
                    </div>
                    <div class="create-time">{{item.date_create}}</div>

                </div>
                <div class="operation-btns" v-if="isAdminUser">
                    <TabIcon alt="黑色-关闭" @click="deleteInvitationCode(item.id)"/>
                    <TabIcon v-if="item.is_shared === 0" alt="黑色-确定" @click="markAsShared(item.id)"/>
                </div>
            </div>
        </div>
    </MenuPanelContainer>
</template>

<script lang="ts" setup>
import Loading from "../../components/Loading.vue"
import TabIcon from "../../components/TabIcon.vue"
import PageHeader from "../../framework/pageHeader/PageHeader.vue"

import ClipboardJS from "clipboard"
import invitationApi from "../../api/invitationApi.ts";
import {popMessage, dateFormatter, getAuthorization} from "@/utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
const projectStore = useProjectStore()
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {InvitationEntity} from "./InvitationEntity.ts";
import MenuPanelContainer from "@/framework/MenuPanelContainer.vue";

const isLoading = ref(false)
const invitationList = ref<Array<InvitationEntity>>([])
const clipboard = ref(null) // clipboard obj

const isAdminUser = computed(()=>{
    return getAuthorization().group_id === 1
})

onMounted(()=>{
    // 只在第一次请求的时候显示载入 loading
    isLoading.value = true
    getInvitationList()
    // 绑定剪贴板操作方法
    clipboard.value = new ClipboardJS('.invitation-code', {
        text: trigger => {
            return trigger.getAttribute('data-clipboard')
        },
    })
    clipboard.value.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
        popMessage('success', '邀请码已复制到剪贴板', null, 2)
    })
})
onBeforeUnmount(()=>{
    clipboard.value && clipboard.value.destroy()
})

function getInvitationList(){
    invitationApi
        .list()
        .then(res => {
            isLoading.value = false
            if (res.data) {
                invitationList.value = res.data.map(item => {
                    item.date_create = dateFormatter(new Date(item.date_create))
                    return item
                })
            } else {
                // 没有设置任何银行卡信息
            }
        })
        .catch(() => {
            isLoading.value = false
        })
}
// 生成新的邀请码
function generateNewInvitationCode(){
    invitationApi.generate().then(() => getInvitationList())
}

// 删除邀请码
function deleteInvitationCode(invitationId: number | string){
    invitationApi
        .delete({
            id: invitationId
        })
        .then(res => {
            popMessage('success', res.message, null)
            getInvitationList()
        })
}
// 邀请码为已分享状态
function markAsShared(invitationId: number | string){
    invitationApi
        .markAsShared({
            id: invitationId
        })
        .then(res => {
            popMessage('success', res.message)
            getInvitationList()
        })
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
        font-family: "JetBrainsMonoDiary", "SF UI Display", "PingFang SC", "Microsoft Yahei UI", "Microsoft Yahei", "Helvetica", sans-serif;
        @include transition(all 0.3s);
        align-items: center;
        margin-right: 15px;
        margin-bottom: 15px;
        padding: 10px;
        background-color: white;
        @include border-radius($radius-pc);
        border: 1px solid white;
        display: flex;
        flex-flow: row nowrap;
        .index{
            flex-shrink: 0;
            width: 30px;
            text-align: center;
            color: $magenta;
            font-size: $fz-title;
            font-weight: bold;
            margin-right: 10px;
        }
        .invitation-code-wrapper{
            padding-right: 10px;
            flex-grow: 1;
            .invitation-code{
                @extend .btn-like;
                overflow: hidden;
                font-size: $fz-title;
            }
            .create-time{
                font-size: $fz-small;
                color: $text-content;
            }
        }

        .operation-btns{
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            flex-shrink: 0;
        }
        &.shared{
            background: linear-gradient(lighten($green, 15%), $green);
            border-top-color: lighten($green, 15%);
            border-bottom-color: $green;
            border-left-color: $green;
            border-right-color: $green;
        }
    }
}

// MOBILE
@media (max-width: $grid-separate-width-sm) {
    .invitation-container{
        padding: 20px 15px;
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
            .invitation-code-wrapper {
                .invitation-code{
                    color: $color-main;
                }
                .create-time{
                    color: $color-main;
                }
            }
            &.shared{
                .index{
                    color: $text-content;
                }
                .invitation-code-wrapper {
                    .invitation-code{
                        color: $text-content;
                    }
                    .create-time{
                        color: $text-content;
                    }
                }

            }
        }
    }
}

</style>
