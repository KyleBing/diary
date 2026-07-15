<template>
    <div class="diary-detail" id="diaryDetail" :style="`min-height: ${projectStore.insets.heightPanel}px`">

            <DetailHeader
                :isLoading="isLoading"
                :diary="diary"
                :lunar-object="lunarObject"
            />

            <!-- pc 时不显示展示加载图标 -->
            <Loading :loading="isLoading" v-if="projectStore.isInMobileMode"/>

            <!--TITLE-->
            <div class="diary-title" v-if="diary.title">
                <h2
                    :class="{'mobile-copyable': projectStore.isInMobileMode}"
                    @touchend="onTitleMobileGesture($event)"
                    @click="onTitleMobileGesture($event)"
                    @dblclick="onMobileDblClick(copyTitle)"
                >{{ projectStore.isHideContent ? diary.title.replace(/[^，。 \n]/g, '*') : diary.title }}</h2>
                <div class="toolbar" v-if="!projectStore.isInMobileMode">
                    <template v-if="diary.category === 'todo'">
                        <ButtonSmall v-if="hasHideAllCompletedTodoItems" @click="toggleTodoList">显示已完成事项</ButtonSmall>
                        <ButtonSmall v-else @click="toggleTodoList">隐藏已完成事项</ButtonSmall>
                        <ButtonSmall class="ml-2" @click="copyTitle">复制标题</ButtonSmall>
                        <ButtonSmall class="ml-2" @click="copyTodosAll">复制全部</ButtonSmall>
                        <ButtonSmall class="ml-2" @click="copyTodosUndone">复制未完成</ButtonSmall>
                    </template>
                    <template v-else>
                        <ButtonSmall v-if="isShowExplode" @click="toggleContentType">普通</ButtonSmall>
                        <ButtonSmall v-else @click="toggleContentType">炸词</ButtonSmall>
                        <ButtonSmall class="ml-2" @click="copyTitle">复制标题</ButtonSmall>
                    </template>
                </div>
            </div>

            <!--CONTENT-->
            <div
                class="diary-content"
                :class="{'mobile-copyable': projectStore.isInMobileMode}"
                v-if="diary.category === 'todo' || diary.content"
                @touchend="onContentMobileGesture($event)"
                @click="onContentMobileGesture($event)"
                @dblclick="onMobileDblClick(copyContentOrTodosAll)"
            >
                <!-- 非 todo：悬停显示复制内容；无标题 todo：在内容区提供复制 -->
                <div class="toolbar" v-if="!projectStore.isInMobileMode && showContentCopyToolbar">
                    <template v-if="diary.category === 'todo'">
                        <ButtonSmall @click.stop="copyTodosAll">复制全部</ButtonSmall>
                        <ButtonSmall @click.stop="copyTodosUndone">复制未完成</ButtonSmall>
                    </template>
                    <ButtonSmall v-else @click.stop="copyContent">复制内容</ButtonSmall>
                </div>

                <!-- todo 类别 -->
                <div v-if="diary.category === 'todo'">
                    <ToDo :readonly="false" :diary="diary" :hasHideAllCompletedTodoItems="hasHideAllCompletedTodoItems"/>
                </div>

                <!-- code 类别 -->
                <div v-else-if="diary.category === 'code'"
                    class="markdown code-category-size"
                    v-html="contentCodeHtml"/>

                <!-- 其他类别 -->
                <div v-else>
                    <div v-if="isShowExplode">
                        <WordExplode v-if="diary.content" :content="diary.content"/>
                    </div>

                    <div v-else>
                        <div v-if="diary.is_markdown === 1 && !projectStore.isHideContent" class="markdown" v-html="contentMarkDownHtml"/>
                        <div v-else class="content" v-html="getContentHtml(diary.content)"/>
                    </div>

                </div>
            </div>

        </div>
</template>

<script lang="ts" setup>
import Loading from "@/components/Loading.vue"
import diaryApi from "@/api/diaryApi.ts"
import {buildDiaryContentHtml, parseMarkdown} from "@/utility/markedHighlight.ts";
import calendar from "js-calendar-converter";
import Moment from "moment";
import DetailHeader from "@/view/Detail/DetailHeader.vue";
import WordExplode from "@/view/Detail/WordExplode.vue";
import ToDo from "./ToDo.vue";
import {EntityDiaryFromServer} from "@/view/DiaryList/Diary.ts";
import {LunarDateEntity} from "@/entity/LunarDate.ts";
import ButtonSmall from "@/components/ButtonSmall.vue";

import {popMessage, dateProcess, temperatureProcessSTC} from "@/utility.ts";

import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {useStatisticStore} from "@/pinia/useStatisticStore.ts";
import {useUserConfigStore} from "@/pinia/useUserConfigStore.ts";

const projectStore = useProjectStore();
const userConfigStore = useUserConfigStore();
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
const router = useRouter()
const route = useRoute()


const isLoading = ref(false) // loading
const diary = ref<EntityDiaryFromServer>({})
const lunarObject = ref<LunarDateEntity>({})
const isShowExplode = ref(false) // 是否显示炸词
const hasHideAllCompletedTodoItems = ref(false) // 是否隐藏所有已完成事项

// 无标题时内容区提供复制；有标题的 todo 复制放在标题工具栏
const showContentCopyToolbar = computed(() => {
    if (diary.value.category === 'todo') {
        return !diary.value.title
    }
    return true
})

onMounted(async ()=>{
    await loadUserConfig()

    // 初始化时，载入第一次点击的 id 内容
    if (route.params.id){
        showDiary(Number(route.params.id))
    }
})

onUnmounted(()=>{
    if (multiTapTimer) {
        clearTimeout(multiTapTimer)
    }
})

// 内容 html - 其他类别内容
const contentMarkDownHtml = computed(()=>{
    return parseMarkdown(diary.value.content)
})
// 内容 html - code 类别内容
const contentCodeHtml = computed(()=>{
    return buildDiaryContentHtml(diary.value.content, diary.value.category, projectStore.isHideContent, diary.value.title)
})

watch(() => route.params.id, (newValue) => {
    if (newValue){
        showDiary(Number(newValue))
    }
})

// TODO 列表的 显示|隐藏 已完成事项
async function toggleTodoList(){
    const nextValue = !hasHideAllCompletedTodoItems.value
    hasHideAllCompletedTodoItems.value = nextValue
    try {
        await userConfigStore.saveConfigJson({isHideCompletedTodos: nextValue})
    } catch (err) {
        hasHideAllCompletedTodoItems.value = !nextValue
        popMessage('danger', err instanceof Error ? err.message : '保存用户配置失败', null, 1)
    }
}

function toggleContentType(){
    isShowExplode.value = !isShowExplode.value
}


// 移动端多击复制（双击 / 三击）
const mobileTapState = { time: 0, key: '', count: 0 }
let multiTapTimer: ReturnType<typeof setTimeout> | undefined
const MOBILE_MULTI_TAP_MS = 500
const MOBILE_TRIPLE_WAIT_MS = 280

/**
 * 判断是否是触摸设备
 * @returns 是否是触摸设备
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * 移动端双击 / 可选三击复制
 * @param key 手势区域标识
 * @param onDouble 双击回调
 * @param event 事件
 * @param onTriple 三击回调（仅标题+todo 用于复制未完成）
 */
function onMobileCopyGesture(
    key: string,
    onDouble: () => void,
    event: Event,
    onTriple?: () => void
) {
    if (!projectStore.isInMobileMode) return
    // 触摸设备上忽略 touchend 之后合成的 click，避免单次点击被误判为双击
    if (isTouchDevice() && event.type === 'click') return

    const now = Date.now()
    if (now - mobileTapState.time < MOBILE_MULTI_TAP_MS && mobileTapState.key === key) {
        mobileTapState.count += 1
    } else {
        mobileTapState.count = 1
    }
    mobileTapState.time = now
    mobileTapState.key = key

    if (event.type === 'touchend' && mobileTapState.count >= 2) {
        event.preventDefault()
    }

    if (multiTapTimer) {
        clearTimeout(multiTapTimer)
        multiTapTimer = undefined
    }

    // 三击：复制未完成
    if (onTriple && mobileTapState.count >= 3) {
        mobileTapState.count = 0
        mobileTapState.time = 0
        onTriple()
        return
    }

    // 双击：若支持三击则短暂等待，否则立即复制
    if (mobileTapState.count === 2) {
        if (onTriple) {
            multiTapTimer = setTimeout(() => {
                mobileTapState.count = 0
                mobileTapState.time = 0
                multiTapTimer = undefined
                onDouble()
            }, MOBILE_TRIPLE_WAIT_MS)
        } else {
            mobileTapState.count = 0
            mobileTapState.time = 0
            onDouble()
        }
    }
}

// 标题区移动端手势：双击复制标题，todo 三击复制未完成
function onTitleMobileGesture(event: Event) {
    onMobileCopyGesture(
        'title',
        copyTitle,
        event,
        diary.value.category === 'todo' ? copyTodosUndone : undefined
    )
}

// 正文区移动端手势：双击复制内容或全部待办
function onContentMobileGesture(event: Event) {
    onMobileCopyGesture('content', copyContentOrTodosAll, event)
}

function onMobileDblClick(copyFn: () => void) {
    if (!projectStore.isInMobileMode) return
    if (multiTapTimer) {
        clearTimeout(multiTapTimer)
        multiTapTimer = undefined
    }
    mobileTapState.time = 0
    mobileTapState.key = ''
    mobileTapState.count = 0
    copyFn()
}

/**
 * 复制到剪贴板
 * @param text 复制的内容
 */
async function copyToClipboard(text: string) {
    if (!text) return
    try {
        if (window.isSecureContext && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text)
        } else {
            const textarea = document.createElement('textarea')
            textarea.value = text
            textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'
            document.body.appendChild(textarea)
            textarea.focus()
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
        }
        popMessage('success', '已复制到 剪贴板', null, 1)
    } catch {
        popMessage('danger', '复制失败', null, 1)
    }
}

// 复制标题
function copyTitle() {
    copyToClipboard(diary.value.title || '')
}

// 复制正文
function copyContent() {
    copyToClipboard(diary.value.content || '')
}

// 复制全部待办
function copyTodosAll() {
    copyToClipboard(diary.value.content || '')
}

// 复制未完成待办（`- ` 开头的行）
function copyTodosUndone() {
    const content = diary.value.content || ''
    const undone = content
        .split('\n')
        .filter(line => line.startsWith('- '))
        .join('\n')
    copyToClipboard(undone)
}

// 正文双击：todo 复制全部，其它复制正文
function copyContentOrTodosAll() {
    if (diary.value.category === 'todo') {
        copyTodosAll()
    } else {
        copyContent()
    }
}

function getContentHtml(content: string){
    return buildDiaryContentHtml(content, '', projectStore.isHideContent)
}
async function loadUserConfig() {
    try {
        await userConfigStore.fetchConfig()
        hasHideAllCompletedTodoItems.value = userConfigStore.isHideCompletedTodos
    } catch (err) {
        popMessage('danger', err instanceof Error ? err.message : '读取用户配置失败', null, 1)
    }
}
function showDiary(diaryId: number) {
    isLoading.value = true
    let requestData = {diaryId: diaryId}
    diaryApi
        .detail(requestData)
        .then(res => {
            isLoading.value = false // loading off
            let tempDiary = res.data
            diary.value = tempDiary
            let dateMoment = Moment(diary.value.date)
            lunarObject.value = calendar.solar2lunar(dateMoment.year(), dateMoment.month()+1, dateMoment.date())
            projectStore.currentDiary = tempDiary // 设置 store: currentDiary
            let dateObj = dateProcess(tempDiary.date)
            diary.value.dateObj = dateObj
            document.title = '日记 - ' + dateObj.dateFull // 变更当前标签的 Title
            diary.value.temperature = temperatureProcessSTC(tempDiary.temperature)
            diary.value.temperature_outside = temperatureProcessSTC(tempDiary.temperature_outside)

            tempDiary.categoryString = useStatisticStore().categoryNameMap.get(tempDiary.category)
        })
        .catch(() => {
            isLoading.value = false // loading off
            router.push({name: 'List'})
        })
}

</script>

<style lang="scss">
@use "detail" as *;
</style>
