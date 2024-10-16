<template>
    <div class="navbar-container">
        <!-- NAVBAR -->
        <nav class="navbar" id="navbar">
            <div class="nav-part-left">
                <div @click="menuShow"
                     v-if="(!storeProject.isInMobileMode && !storeProject.isMenuShowed)
                     || storeProject.isInMobileMode && route.name === 'List' && !storeProject.isMenuShowed">
                    <TabIcon v-if="storeProject.isInMobileMode" alt="菜单"/>
                    <TabIcon v-else alt="LOGO"/>
                </div>
                <div @click="menuClose" v-if="storeProject.isMenuShowed">
                    <TabIcon alt="关闭"/>
                </div>
                <div @click="commitBack"
                     v-if="storeProject.isInMobileMode && route.name !== 'List'">
                    <TabIcon alt="返回"/>
                </div>
                <div v-show="!storeProject.isMenuShowed"
                     v-if="!storeProject.isInMobileMode"
                     @click="toggleHideContent">
                    <TabIcon v-if="storeProject.isHideContent" alt="内容隐藏"/>
                    <TabIcon v-else alt="内容显示"/>
                </div>
                <div v-show="!storeProject.isMenuShowed"
                     v-if="!storeProject.isInMobileMode"
                     @click="toggleListStyle">
                    <TabIcon v-if="storeProject.listStyle === EnumListStyle.list" alt="列表简洁"/>
                    <TabIcon v-if="storeProject.listStyle === EnumListStyle.detail" alt="列表详情"/>
                    <TabIcon v-if="storeProject.listStyle === EnumListStyle.waterfall" alt="列表瀑布"/>
                </div>

                <div class="waterfall-count" v-if="storeProject.listStyle === EnumListStyle.waterfall">{{storeProject.waterFallItemCount}}</div>
                <div v-show="!storeProject.isMenuShowed"
                     v-if="!storeProject.isInMobileMode"
                     @click="toggleSearchbar">
                    <TabIcon alt="搜索"/>
                </div>
                <div v-show="!storeProject.isMenuShowed"
                     v-if="!storeProject.isInMobileMode"
                     @click="goToPage('BankCard')">
                    <TabIcon alt="银行卡"/>
                </div>
                <div v-show="!storeProject.isMenuShowed"
                     v-if="!storeProject.isInMobileMode"
                     @click="goToPage('Bill')">
                    <TabIcon alt="账单"/>
                </div>
                <div v-show="!storeProject.isMenuShowed"
                     v-if="!storeProject.isInMobileMode && isAdminUser"
                     @click="goToPage('FileManager')">
                    <TabIcon alt="文件"/>
                </div>
                <div v-show="!storeProject.isMenuShowed"
                     v-if="!storeProject.isInMobileMode" @click="toggleTodoList">
                    <TabIcon
                        alt="待办-显示"
                        v-if="storeProject.filteredCategories.length === 1 && storeProject.filteredCategories[0] === 'todo'"/>
                    <TabIcon alt="待办" v-else/>
                </div>
                <div class="btn-text-group"
                     v-show="!storeProject.isMenuShowed"
                     v-if="!storeProject.isInMobileMode && storeProject.dateFilterString">
                    <div class="btn-text" @click="clearDateFilter">{{ storeProject.dateFilterString }}</div>
                </div>

                <NavbarCategorySelector
                    v-if="!storeProject.isInMobileMode && !storeProject.isMenuShowed"
                    class="ml-5"/>

            </div>

            <div class="nav-part-right">
                <!--时钟-->
                <Clock class="pr-6" v-if="!storeProject.isInMobileMode && storeProject.insets.windowsWidth > 1352"/>

                <!--详情按钮-->
                <div class="nav-btn-wrapper" v-if="route.name === 'Detail' && storeProject.currentDiary">
                    <div
                        v-if="storeProject.currentDiary && storeProject.currentDiary.is_public === 1"
                        class="clipboard-trigger"
                        :data-clipboard="shareUrl">
                        <TabIcon alt="分享"/>
                    </div>
                    <div @click="toastShow">
                        <TabIcon alt="删除"/>
                    </div>
                    <RouterLink :to="`/edit/${storeProject.currentDiary.id}`">
                        <TabIcon alt="编辑"/>
                    </RouterLink>
                </div>

                <!--编辑按钮-->
                <div class="nav-btn-wrapper" v-if="route.name === 'Edit' || route.name ==='EditNew'">
                    <div @click="diaryRecover" v-if="storeProject.isDiaryEditorContentHasChanged">
                        <TabIcon alt="恢复"/>
                    </div>
                    <div v-if="storeProject.isSavingDiary">
                        <Loading :height="50" :loading="true"/>
                    </div>
                    <div @click="diarySave" v-else>
                        <TabIcon v-if="isNewDiary" alt="确定"/>
                        <TabIcon v-else-if="storeProject.isDiaryEditorContentHasChanged" alt="确定-已变化"/>
                        <TabIcon v-else alt="确定-已保存"/>
                    </div>
                </div>

                <RouterLink
                    v-if="(storeProject.isInMobileMode && route.name !== 'Detail' && !storeProject.isMenuShowed)
                    || !storeProject.isInMobileMode"
                    to="/edit"
                >
                    <TabIcon alt="添加"/>
                </RouterLink>
            </div>


            <!--LOGO-->
            <div class="brand" v-if="storeProject.isInMobileMode" @click="toggleListStyle">
                <img :src="storeProject.editLogoImg"
                     v-if="route.name === 'Edit' || route.name === 'EditNew'"
                     alt="LOGO">
                <a v-else-if="storeProject.listStyle === EnumListStyle.list">
                    <img :src="SVG_ICONS.logo_icons.logo" alt="日记">
                </a>
                <a v-else>
                    <img :src="SVG_ICONS.logo_icons.logo_content" alt="日记">
                </a>
            </div>


            <!-- MENU -->
            <NavMenu/>

        </nav>

        <!--TOAST-->
        <div id="toast" class="fadeIn animated-fast" v-show="isToastShowed">
            <div class="toast">
                <div class="toast-header">确定删除吗</div>
                <div class="toast-body"></div>
                <div class="toast-footer">
                    <div class="btn-cancel" @click="toastHide">取消</div>
                    <div class="btn-confirm" @click="diaryDelete">确定</div>
                </div>
            </div>
            <div class="mask"></div>
        </div>
    </div>

</template>

<script lang="ts" setup>
// COMPONENTS
import TabIcon from "../../components/TabIcon.vue"
import Loading from "../../components/Loading.vue";
import diaryApi from "../../api/diaryApi.ts";
import NavMenu from "@/view/Menu/NavMenu.vue";
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";
import Clock from "./Clock.vue";
import NavbarCategorySelector from "../../framework/navbar/NavbarCategorySelector.vue";

import ClipboardJS from "clipboard"

import {getAuthorization, popMessage} from "../../utility.ts";
import {useProjectStore} from "../../pinia";
const storeProject = useProjectStore()
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {EnumListStyle} from "@/listStyle.ts";

const route = useRoute()
const router = useRouter()


const isAdminUser = computed(()=>{
    return getAuthorization()?.group_id === 1
})


/**
 * Clipboard
 */
const clipboard= ref<ClipboardJS>()
let location = window.location

onUnmounted(()=>{
    clipboard.value.destroy()
})


onMounted(()=> {
    location = window.location

    isNewDiary.value = !(route.params.id)

    // 绑定剪贴板操作方法
    clipboard.value = new ClipboardJS('.clipboard-trigger', {
        text: trigger => {
            return trigger.getAttribute('data-clipboard')
        },
    })
    clipboard.value.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
        popMessage('success', '分享链接 已复制到 剪贴板', ()=>{}, 2)
    })
})



/**
 * TOAST Show | Hide
 */
const isToastShowed = ref(false)
function toastHide() {
    isToastShowed .value= false
}
function toastShow() {
    isToastShowed.value = true
}


/**
 * 新日记
 */
const isNewDiary = ref(true) // 是否为新日记
watch(route, newValue => {
    isNewDiary.value = !(newValue.params.id)
})

const shareUrl = computed(() => {
    return `${location.origin}/diary/#/share/${storeProject.currentDiary.id}`
})

function commitBack(){
    switch (route.name){
        case 'Edit':
        case 'Detail':
            router.push({name: 'List'});
            break
        default:
            router.push({name: 'List'})
    }
}
function clearDateFilter(){
    storeProject.SET_DATE_FILTER_STRING('')
    storeProject.isListNeedBeReload = true
}

// 跳转到独立页面
function goToPage(pageName: string){
    router.push({name: pageName})
}

// 菜单操作
function menuShow() {
    storeProject.isMenuShowed = true
}
function menuClose() {
    storeProject.isMenuShowed = false
}
function toggleListStyle() {
    switch (storeProject.listStyle){
        case EnumListStyle.list:
            storeProject.listStyle = EnumListStyle.detail

            break;
        case EnumListStyle.detail:
            storeProject.listStyle = EnumListStyle.waterfall
            router.push({
                name: 'Waterfall'
            })
            break;
        case EnumListStyle.waterfall:
            storeProject.listStyle = EnumListStyle.list
            router.push({
                name: 'List'
            })
            break;

    }
}

// SEARCH BAR
function toggleSearchbar() {
    storeProject.isShowSearchBar = !storeProject.isShowSearchBar
}

function toggleTodoList(){
    let nextCategories: string[] = []
    if (storeProject.filteredCategories.length === 1 && storeProject.filteredCategories[0] === 'todo'){
        nextCategories = []
    } else {
        nextCategories = ['todo']
    }
    storeProject.isFilterShared = false
    storeProject.SET_FILTERED_CATEGORIES(nextCategories)
    storeProject.isListNeedBeReload = true
}

// HIDE CONTENT
function toggleHideContent() {
    storeProject.isHideContent = !storeProject.isHideContent
}
function diarySave() {
    storeProject.isDiaryNeedToBeSaved = true
}
function diaryRecover() {
    storeProject.isDiaryNeedToBeRecovered = true
}

/* DELETE */
function diaryDelete() {
    let requestData = {
        diaryId: storeProject.currentDiary.id,
    }
    diaryApi
        .delete(requestData)
        .then(res => {
            toastHide()
            popMessage('success', res.message, () => {
                if (storeProject.isInMobileMode){
                    router.back()
                } else {
                    storeProject.listOperation = {type: 'delete', diary: null, id: storeProject.currentDiary.id}
                }
            }, 0.5)
        })
}

</script>

<style lang="scss" scoped>
@import "navbar";
</style>
