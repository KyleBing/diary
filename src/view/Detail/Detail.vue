<template>
    <div
        class="diary-detail"
        id="diaryDetail"
        :class="{'is-compact': compact}"
        :style="compact ? undefined : `min-height: ${projectStore.insets.heightPanel}px`"
    >

            <DetailHeader
                :isLoading="isLoading"
                :diary="diary"
                :lunar-object="lunarObject"
                :compact="compact"
            />

            <!-- pc 时不显示展示加载图标 -->
            <Loading :loading="isLoading" v-if="projectStore.isInMobileMode"/>

            <!--TITLE-->
            <div class="diary-title" v-if="diary.title">
                <h2
                    :class="{'mobile-copyable': projectStore.isInMobileMode}"
                    @touchend="onTitleMobileDoubleTapEnd($event)"
                >{{ projectStore.isHideContent ? diary.title.replace(/[^，。 \n]/g, '*') : diary.title }}</h2>
                <div class="toolbar" v-if="!compact && !projectStore.isInMobileMode">
                    <template v-if="diary.category === 'todo'">
                        <!-- 图标表示当前筛选状态：隐藏已完成 → 未完成；显示全部 → 全部 -->
                        <TabIcon
                            v-if="hasHideAllCompletedTodoItems"
                            size="small"
                            :icon="toolbarIcon('待办-未完成')"
                            title="显示已完成事项"
                            @click="toggleTodoList"
                        />
                        <TabIcon
                            v-else
                            size="small"
                            :icon="toolbarIcon('待办-全部')"
                            title="隐藏已完成事项"
                            @click="toggleTodoList"
                        />
                        <TabIcon size="small" :icon="toolbarIcon('复制')" title="复制标题" @click="copyTitle"/>
                        <TabIcon size="small" :icon="toolbarIcon('复制全部')" title="复制全部" @click="copyTodosAll"/>
                        <TabIcon size="small" :icon="toolbarIcon('复制未完成')" title="复制未完成" @click="copyTodosUndone"/>
                        <ButtonSmall v-if="hasCompletedTodos" @click="showClearCompletedToast">删除已完成</ButtonSmall>
                    </template>
                    <template v-else>
                        <TabIcon size="small" :icon="toolbarIcon('复制')" title="复制标题" @click="copyTitle"/>
                    </template>
                </div>
            </div>

            <!--CONTENT-->
            <div
                class="diary-content"
                :class="{'mobile-copyable': projectStore.isInMobileMode && diary.category !== 'todo'}"
                v-if="diary.category === 'todo' || diary.content"
                @touchend="onContentMobileDoubleTapEnd($event)"
            >
                <!-- 非 todo：悬停显示复制内容；无标题 todo：在内容区提供复制 -->
                <div class="toolbar" v-if="!compact && !projectStore.isInMobileMode && showContentCopyToolbar">
                    <template v-if="diary.category === 'todo'">
                        <TabIcon size="small" :icon="toolbarIcon('复制全部')" title="复制全部" @click.stop="copyTodosAll"/>
                        <TabIcon size="small" :icon="toolbarIcon('复制未完成')" title="复制未完成" @click.stop="copyTodosUndone"/>
                        <ButtonSmall v-if="hasCompletedTodos" @click.stop="showClearCompletedToast">删除已完成</ButtonSmall>
                    </template>
                    <TabIcon v-else size="small" :icon="toolbarIcon('复制')" title="复制内容" @click.stop="copyContent"/>
                </div>

                <!-- todo 类别 -->
                <div v-if="diary.category === 'todo'">
                    <ToDo
                        ref="todoRef"
                        :readonly="false"
                        :diary="diary"
                        :hasHideAllCompletedTodoItems="hasHideAllCompletedTodoItems"
                    />
                </div>

                <!-- code 类别 -->
                <div v-else-if="diary.category === 'code'"
                    class="markdown code-category-size"
                    v-html="contentCodeHtml"/>

                <!-- 其他类别 -->
                <div v-else>
                    <div v-if="diary.is_markdown === 1 && !projectStore.isHideContent" class="markdown" v-html="contentMarkDownHtml"/>
                    <div v-else class="content" v-html="getContentHtml(diary.content)"/>
                </div>
            </div>

        <!-- 删除已完成确认：不遮盖背景，仅浮层弹窗 -->
        <div
            v-show="isClearCompletedToastShowed"
            class="toast fadeIn animated-fast"
            :style="projectStore.isInMobileMode ? '' : `left: ${clearCompletedToastPosition.x - 100}px; top: ${clearCompletedToastPosition.y + 100}px;`"
        >
            <div class="toast-header">确定删除已完成事项吗</div>
            <div class="toast-body"></div>
            <div class="toast-footer">
                <div class="btn-cancel" @click="hideClearCompletedToast">取消</div>
                <div class="btn-confirm" @click="confirmClearCompletedTodos">确定</div>
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
import ToDo from "./ToDo.vue";
import {EntityDiaryFromServer} from "@/view/DiaryList/Diary.ts";
import {LunarDateEntity} from "@/entity/LunarDate.ts";
import TabIcon from "@/components/TabIcon.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";

import {popMessage, dateProcess, temperatureProcessSTC} from "@/utility.ts";

import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {useStatisticStore} from "@/pinia/useStatisticStore.ts";
import {useUserConfigStore} from "@/pinia/useUserConfigStore.ts";

import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const projectStore = useProjectStore();
const userConfigStore = useUserConfigStore();
// 日历侧栏预览：去掉整页高度和工具栏，避免把头图挤乱
const {compact = false} = defineProps<{compact?: boolean}>()
const router = useRouter()
const route = useRoute()


const isLoading = ref(false) // loading
const diary = ref<EntityDiaryFromServer>({})
const lunarObject = ref<LunarDateEntity>({})
const hasHideAllCompletedTodoItems = ref(false) // 是否隐藏所有已完成事项
const todoRef = ref<InstanceType<typeof ToDo> | null>(null)

// 无标题时内容区提供复制；有标题的 todo 复制放在标题工具栏
const showContentCopyToolbar = computed(() => {
    if (diary.value.category === 'todo') {
        return !diary.value.title
    }
    return true
})

// 内容里是否还有 `= ` 开头的已完成行
const hasCompletedTodos = computed(() => {
    return (diary.value.content || '')
        .split('\n')
        .some(line => line.startsWith('= '))
})

onMounted(async ()=>{
    await loadUserConfig()

    // 初始化时，载入第一次点击的 id 内容
    if (route.params.id){
        showDiary(Number(route.params.id))
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

// 浅色底用黑色图标，暗黑模式用白色图标
type ToolbarIconName =
    | '复制' | '复制全部' | '复制未完成'
    | '待办-全部' | '待办-未完成'
function toolbarIcon(name: ToolbarIconName) {
    return projectStore.isDarkMode ? name : `黑色-${name}`
}

// 删除已完成确认 toast（交互对齐 navbar 删除日记）
const isClearCompletedToastShowed = ref(false)
const clearCompletedToastPosition = ref({x: 0, y: 0})

function hideClearCompletedToast() {
    isClearCompletedToastShowed.value = false
}

function showClearCompletedToast(event: MouseEvent) {
    if (!hasCompletedTodos.value) return
    clearCompletedToastPosition.value = {x: event.clientX, y: event.clientY}
    isClearCompletedToastShowed.value = true
}

function confirmClearCompletedTodos() {
    hideClearCompletedToast()
    todoRef.value?.clearCompletedTodos()
}

// 移动端双击复制判定阈值
const MOBILE_DOUBLE_TAP_MS = 300
const MOBILE_DOUBLE_TAP_MOVE_PX = 24
let lastTitleTapAt = 0
let lastContentTapAt = 0
let lastTitleTapPoint = { x: 0, y: 0 }
let lastContentTapPoint = { x: 0, y: 0 }

// 触摸目标在待办交互区域时不触发正文区长按复制
function shouldIgnoreMobileLongPress(event: Event) {
    const target = event.target as HTMLElement | null
    if (!target) return true
    return !!target.closest('.todo-list, .checkbox, .item-actions, .todo-add-row, .todo-add-trigger, [contenteditable="true"]')
}

// 检测两次触摸是否可视为双击
function isMobileDoubleTap(
    currentAt: number,
    lastAt: number,
    currentPoint: { x: number; y: number },
    lastPoint: { x: number; y: number },
) {
    const deltaAt = currentAt - lastAt
    const deltaMove = Math.hypot(currentPoint.x - lastPoint.x, currentPoint.y - lastPoint.y)
    return deltaAt > 0 && deltaAt <= MOBILE_DOUBLE_TAP_MS && deltaMove <= MOBILE_DOUBLE_TAP_MOVE_PX
}

// 标题双击复制标题
function onTitleMobileDoubleTapEnd(event: TouchEvent) {
    if (!projectStore.isInMobileMode) return
    const touch = event.changedTouches[0]
    if (!touch) return
    const now = Date.now()
    const point = { x: touch.clientX, y: touch.clientY }
    if (isMobileDoubleTap(now, lastTitleTapAt, point, lastTitleTapPoint)) {
        copyTitle()
        lastTitleTapAt = 0
        return
    }
    lastTitleTapAt = now
    lastTitleTapPoint = point
}

// 正文双击复制（todo 类别不触发，避免与拖动/行内操作冲突）
function onContentMobileDoubleTapEnd(event: TouchEvent) {
    if (!projectStore.isInMobileMode) return
    if (diary.value.category === 'todo') return
    if (shouldIgnoreMobileLongPress(event)) return
    const touch = event.changedTouches[0]
    if (!touch) return
    const now = Date.now()
    const point = { x: touch.clientX, y: touch.clientY }
    if (isMobileDoubleTap(now, lastContentTapAt, point, lastContentTapPoint)) {
        copyContentOrTodosAll()
        lastContentTapAt = 0
        return
    }
    lastContentTapAt = now
    lastContentTapPoint = point
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
