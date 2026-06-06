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
                <h2>{{ projectStore.isHideContent ? diary.title.replace(/[^，。 \n]/g, '*') : diary.title }}</h2>
                <div class="toolbar">
                    <template v-if="diary.category === 'todo'">
                        <ButtonSmall class="clipboard" v-if="hasHideAllComplatedTodoItems" @click="toggleTodoList">显示已完成事项</ButtonSmall>
                        <ButtonSmall class="clipboard" v-else @click="toggleTodoList">隐藏已完成事项</ButtonSmall>
                    </template>

                    <ButtonSmall class="clipboard ml-2" v-if="isShowExplode" @click="toggleContentType">普通</ButtonSmall>
                    <ButtonSmall class="clipboard ml-2" v-else @click="toggleContentType">炸词</ButtonSmall>
                    <ButtonSmall class="clipboard ml-2" :data-clipboard="`${diary.title}\n------------------------\n${diary.content}`">复制标题和内容</ButtonSmall>
                </div>
            </div>

            <!--CONTENT-->
            <div class="diary-content" v-if="diary.content">

                <!-- todo 类别 -->
                <div v-if="diary.category === 'todo'">
                    <ToDo :readonly="false" :diary="diary" :hasHideAllComplatedTodoItems="hasHideAllComplatedTodoItems"/>
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
import ClipboardJS from "clipboard"
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

const projectStore = useProjectStore();
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
const router = useRouter()
const route = useRoute()


const isLoading = ref(false) // loading
const diary = ref<EntityDiaryFromServer>({})
const clipboard = ref() // clipboard obj
const lunarObject = ref<LunarDateEntity>({})
const isShowExplode = ref(false) // 是否显示炸词
const hasHideAllComplatedTodoItems = ref(false) // 是否隐藏所有已完成事项


onMounted(()=>{
    // 初始化时，载入第一次点击的 id 内容
    if (route.params.id){
        showDiary(Number(route.params.id))
    }

    // 绑定剪贴板操作方法
    clipboard.value = new ClipboardJS('.clipboard', {
        text: trigger => {
            return trigger.getAttribute('data-clipboard') || ''
        },
    })
    clipboard.value.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
        popMessage('success', '已复制到 剪贴板', null, 1)
    })
})

onUnmounted(()=>{
    clipboard.value.destroy()
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
function toggleTodoList(){
    hasHideAllComplatedTodoItems.value = !hasHideAllComplatedTodoItems.value
}

function toggleContentType(){
    isShowExplode.value = !isShowExplode.value
}

function getContentHtml(content: string){
    return buildDiaryContentHtml(content, '', projectStore.isHideContent)
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
