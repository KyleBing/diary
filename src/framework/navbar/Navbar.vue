<template>
    <div class="navbar-container">
        <!-- NAVBAR -->
        <nav class="navbar" id="navbar">
            <div class="nav-part-left">
                <div @click="menuShow"
                     v-if="
                         (!projectStore.isInMobileMode && !projectStore.isMenuShowed)
                         || projectStore.isInMobileMode
                         && (route.name === 'List' || route.name === 'WaterfallList')
                         && !projectStore.isMenuShowed
                    ">
                    <TabIcon v-if="projectStore.isInMobileMode" icon="菜单"/>
                    <TabIcon v-else icon="LOGO"/>
                </div>
                <div @click="menuClose" v-if="projectStore.isMenuShowed">
                    <TabIcon icon="关闭"/>
                </div>
                <div @click="commitBack"
                     v-if="projectStore.isInMobileMode && route.name !== 'List' && route.name !== 'WaterfallList' ">
                    <TabIcon icon="返回"/>
                </div>

                <div v-show="(!projectStore.isMenuShowed && !projectStore.isInMobileMode) ||
                            (!projectStore.isMenuShowed && projectStore.isInMobileMode
                            && (route.name === 'List' || route.name === 'WaterfallList'))"
                     @click="toggleSearchbar">
                    <TabIcon icon="搜索"/>
                </div>

                <div v-show="!projectStore.isMenuShowed" 
                v-if="!projectStore.isInMobileMode"
                     @click="toggleHideContent">
                    <TabIcon v-if="projectStore.isHideContent" icon="内容隐藏"/>
                    <TabIcon v-else icon="内容显示"/>
                </div>

                <div v-show="!projectStore.isMenuShowed" v-if="!projectStore.isInMobileMode"
                     @click="toggleListStyle">
                    <TabIcon
                        v-if="projectStore.listStyle === EnumListStyle.list"
                        icon="列表简洁"/>
                    <TabIcon
                        v-else-if="projectStore.listStyle === EnumListStyle.detail"
                        icon="列表详情"/>
                </div>


                <!-- <div class="waterfall-count"
                     v-if="projectStore.listStyle === EnumListStyle.waterfall">
                    {{projectStore.waterFallItemCount}}
                </div> -->

                <div v-show="!projectStore.isMenuShowed" v-if="!projectStore.isInMobileMode"
                     @click="calendarTaped">
                    <TabIcon icon="日历-选中" v-if="route.name === 'Calendar'"/>
                    <TabIcon v-else icon="日历"/>
                </div>

                <div v-show="!projectStore.isMenuShowed" v-if="!projectStore.isInMobileMode"
                     @click="goToPage('BankCard')">
                    <TabIcon icon="银行卡"/>
                </div>
                <div v-show="!projectStore.isMenuShowed" v-if="!projectStore.isInMobileMode"
                     @click="goToPage('Bill')">
                    <TabIcon icon="账单简单"/>
                </div>

                <div v-show="!projectStore.isMenuShowed" v-if="!projectStore.isInMobileMode && isAdminUser"
                     @click="goToPage('FileManager')">
                    <TabIcon icon="文件"/>
                </div>
                <div v-show="!projectStore.isMenuShowed" v-if="!projectStore.isInMobileMode"
                     @click="toggleTodoList">
                    <TabIcon
                        icon="待办-显示"
                        v-if="projectStore.filteredCategories.length === 1 && projectStore.filteredCategories[0] === 'todo'"/>
                    <TabIcon icon="待办" v-else/>
                </div>
                <div v-if="!projectStore.isInMobileMode && projectStore.dateFilterString"
                     v-show="!projectStore.isMenuShowed"
                     class="btn-text-group">
                    <div class="btn-text" @click="clearDateFilter">{{ projectStore.dateFilterString }}</div>
                </div>

                <NavbarCategorySelector
                    v-if="!projectStore.isInMobileMode && !projectStore.isMenuShowed"
                    class="ml-5"/>

            </div>

            <div class="nav-part-right">
                <!--时钟-->
                <!-- MacbookPro 屏幕宽度 1512 -->
                <Clock class="pr-6" v-if="!projectStore.isInMobileMode && projectStore.insets.windowsWidth > 1550"/>

                <!--详情按钮-->
                <div class="nav-btn-wrapper" v-if="route.name === 'Detail' && projectStore.currentDiary">
                    <div
                        v-if="projectStore.currentDiary && projectStore.currentDiary.is_public === 1"
                        class="clipboard-trigger"
                        :data-clipboard="shareUrl">
                        <TabIcon icon="分享"/>
                    </div>
                    <div @click="toastShow"> <TabIcon icon="删除"/> </div>
                    <div @click="editDiary"> <TabIcon icon="编辑"/> </div>
                </div>

                <!--编辑按钮-->
                <div class="nav-btn-wrapper" v-if="route.name === 'Edit' || route.name ==='EditNew' || route.name === 'CalendarEdit'">
                    <div @click="diaryRecover" v-if="projectStore.isDiaryEditorContentHasChanged">
                        <TabIcon icon="恢复"/>
                    </div>
                    <div v-if="projectStore.isSavingDiary">
                        <Loading :height="50" :loading="true"/>
                    </div>
                    <div @click="diarySave" v-else>
                        <TabIcon v-if="isNewDiary" icon="确定"/>
                        <TabIcon v-else-if="projectStore.isDiaryEditorContentHasChanged" icon="确定-已变化"/>
                        <TabIcon v-else icon="确定-已保存"/>
                    </div>
                </div>

                <div
                    v-if="(projectStore.isInMobileMode && route.name !== 'Detail' && !projectStore.isMenuShowed)
                            || !projectStore.isInMobileMode"
                    @click="addNewDiary"
                >
                    <TabIcon icon="添加"/>
                </div>
            </div>


            <!--LOGO-->
            <div class="brand" v-if="projectStore.isInMobileMode" @click="toggleListStyle">
                <img :src="projectStore.editLogoImg"
                     v-if="route.name === 'Edit' || route.name === 'EditNew'"
                     icon="LOGO">
                <a v-else-if="projectStore.listStyle === EnumListStyle.list">
                    <img :src="SVG_ICONS.logo_icons.logo" icon="日记">
                </a>
                <a v-else>
                    <img :src="SVG_ICONS.logo_icons.logo_content" icon="日记">
                </a>
            </div>


            <!-- MENU -->
            <NavMenu/>

        </nav>

        <!--TOAST-->
        <div id="toast" v-show="isToastShowed" class="fadeIn animated-fast">
            <div class="toast"
                 :style="projectStore.isInMobileMode? '': `left: ${toastPosition.x - 100}px; top: ${toastPosition.y + 100}px;`"
            >
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
import TabIcon from "@/components/TabIcon.vue"
import Loading from "@/components/Loading.vue";
import diaryApi from "@/api/diaryApi.ts";
import NavMenu from "@/view/Menu/NavMenu.vue";
import SVG_ICONS from "@/assets/icons/SVG_ICONS.ts";
import Clock from "./Clock.vue";
import NavbarCategorySelector from "@/framework/navbar/NavbarCategorySelector.vue";

import ClipboardJS from "clipboard"

import {getAuthorization, popMessage} from "@/utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
const projectStore = useProjectStore()
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {EnumListStyle} from "@/listStyle.ts";

const route = useRoute()
const router = useRouter()


const isAdminUser = computed(()=>{
    return getAuthorization()?.group_id === 1
})


// 新建日记
function addNewDiary() {
    // 新建日记时，如果存在缓存日记内容，清除它
    if (projectStore.cacheDiary) {
        projectStore.cacheDiary = undefined
        projectStore.cacheDiaryOrigin = undefined
    }
    if (route.path.includes('calendar')) {
        router.push({
            name: 'CalendarEditNew'
        })
    } else {
        router.push({
            name: 'EditNew'
        })
    }
}

// 编辑日记
function editDiary() {
    // 新建日记时，如果存在缓存日记内容，清除它
    if (projectStore.cacheDiary){
        projectStore.cacheDiary = undefined
        projectStore.cacheDiaryOrigin = undefined
    }
    router.push(`/edit/${projectStore.currentDiary.id}`)
}

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
const toastPosition = ref({x:0,y:0})
function toastHide() {
    isToastShowed .value= false
}
function toastShow(event: PointerEvent) {
    toastPosition.value = {x: event.clientX, y: event.clientY}
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
    return `${location.origin}/diary/#/share/${projectStore.currentDiary.id}`
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
    projectStore.SET_DATE_FILTER_STRING('')
    projectStore.isListNeedBeReload = true
}

function calendarTaped(){
    if (route.name === 'Calendar'){
        goToPage('List')
    } else {
        goToPage('Calendar')
    }
}


// 跳转到独立页面
function goToPage(pageName: string){
    router.push({name: pageName})
}

// 菜单操作
function menuShow() {
    projectStore.isMenuShowed = true
}
function menuClose() {
    projectStore.isMenuShowed = false
}

function toggleListStyle() {
    switch (projectStore.listStyle) {
        case EnumListStyle.list:
            if (route.name === 'List' || route.name === 'Detail' || route.name === 'Edit' || route.name === 'EditNew') {
                projectStore.listStyle = EnumListStyle.detail  // 点击时切换到下一个展示类别
                router.push({
                    name: 'List'
                })
            } else {
                // 如果不是列表显示，进入列表显示
                // 比如 日历显示时 点击进入列表模式
                projectStore.listStyle = EnumListStyle.list
                router.push({
                    name: 'List'
                })
            }
            break;
        case EnumListStyle.detail:
            projectStore.listStyle = EnumListStyle.list
            router.push({
                name: 'List'
            })
            break;
    }
}

// SEARCH BAR
function toggleSearchbar() {
    projectStore.isShowSearchBar = !projectStore.isShowSearchBar
}

function toggleTodoList(){
    let nextCategories: string[] = []
    if (projectStore.filteredCategories.length === 1 && projectStore.filteredCategories[0] === 'todo'){
        nextCategories = []
    } else {
        nextCategories = ['todo']
    }
    projectStore.isFilterShared = false
    projectStore.SET_FILTERED_CATEGORIES(nextCategories)
    projectStore.isListNeedBeReload = true
}

// HIDE CONTENT
function toggleHideContent() {
    projectStore.isHideContent = !projectStore.isHideContent
}
function diarySave() {
    projectStore.isDiaryNeedToBeSaved = true
}
function diaryRecover() {
    projectStore.isDiaryNeedToBeRecovered = true
}

/* DELETE */
function diaryDelete() {
    let requestData = {
        diaryId: projectStore.currentDiary.id,
    }
    diaryApi
        .delete(requestData)
        .then(res => {
            toastHide()
            popMessage('success', res.message, () => {
                if (projectStore.isInMobileMode){
                    router.back()
                } else {
                    projectStore.listOperation = {type: 'delete', diary: null, id: projectStore.currentDiary.id}
                }
            }, 0.5)
        })
}

</script>

<style lang="scss" scoped>
@import "navbar";
</style>
