<template>
    <div class="diary-detail" id="diaryDetail" :style="`min-height: ${storeProject.insets.heightPanel}px`">

            <DetailHeader
                :isLoading="isLoading"
                :diary="diary"
                :lunar-object="lunarObject"
            />

            <!-- pc 时不显示展示加载图标 -->
            <Loading :loading="isLoading" v-if="storeProject.isInMobileMode"/>

            <!--TITLE-->
            <div class="diary-title" v-if="diary.title">
                <h2>{{ storeProject.isHideContent ? diary.title.replace(/[^，。 \n]/g, '*') : diary.title }}</h2>
                <div class="toolbar">
                    <ButtonNormal class="clipboard" :data-clipboard="diary.title">复制</ButtonNormal>
                </div>
            </div>

            <!--CONTENT-->
            <div class="diary-content" v-if="diary.content">
                <div v-if="diary.category === 'todo'">
                    <ToDo :readonly="false" :diary="diary"/>
                </div>

                <div v-else>
                    <div class="toolbar">
                        <ButtonNormal class="clipboard" type="confirm" :data-clipboard="diary.content">全部复制</ButtonNormal>
                        <ButtonNormal class="clipboard" v-if="isShowExplode" @click="toggleContentType">普通</ButtonNormal>
                        <ButtonNormal class="clipboard" v-else @click="toggleContentType">炸词</ButtonNormal>
                    </div>
                    <div v-if="isShowExplode">
                        <WordExplode v-if="diary.content" :content="diary.content"/>
                    </div>

                    <div v-else>
                        <div v-if="diary.is_markdown === 1 && !storeProject.isHideContent" class="markdown" v-html="contentMarkDownHtml"/>
                        <div v-else class="content" v-html="getContentHtml(diary.content)"/>
                    </div>

                </div>
            </div>

        </div>
</template>

<script lang="ts" setup>
import ClipboardJS from "clipboard"
import Loading from "../../components/Loading.vue"
import diaryApi from "../../api/diaryApi.js"
import {marked} from "marked"
import calendar from "js-calendar-converter";
import Moment from "moment";
import DetailHeader from "../detail/DetailHeader";
import WordExplode from "../detail/WordExplode";
import ButtonNormal from "../../components/ButtonNormal";
import ToDo from "./ToDo.vue";

import {popMessage, dateProcess, temperatureProcessSTC} from "../../utility.ts";

import {useProjectStore} from "../../pinia";

const storeProject = useProjectStore();
import {computed, onMounted, onUnmounted, Ref, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
const router = useRouter()
const route = useRoute()

import SVG_ICONS from "../../assets/img/SVG_ICONS.ts";
import {DiaryEntity} from "../list/Diary.ts";

const isShowToast = ref(false)
const isLoading = ref(false) // loading
const diary: Ref<DiaryEntity> = ref({})
const clipboard = ref(null) // clipboard obj
const lunarObject = ref({})
const isShowExplode = ref(false)


onMounted(()=>{
    // 初始化时，载入第一次点击的 id 内容
    if (route.params.id){
        showDiary(route.params.id)
    }

    // 绑定剪贴板操作方法
    clipboard.value = new ClipboardJS('.clipboard', {
        text: trigger => {
            return trigger.getAttribute('data-clipboard')
        },
    })
    clipboard.value.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
        popMessage('success', '已复制到 剪贴板', null, 1)
    })
})

onUnmounted(()=>{
    clipboard.value.destroy()
})

const contentMarkDownHtml = computed(()=>{
    return marked.parse(diary.value.content)
})

watch('route.params.id', (newValue) => {
    if (newValue){
        showDiary(newValue)
    }
})

function toggleContentType(){
    isShowExplode.value = !isShowExplode.value
}
function goBack() {
    router.back()
}
function show() {
    isShowToast.value = true
}
function hide() {
    isShowToast.value = false
}
function getContentHtml(content: string){
    let isInCodeMode = /\[ ?code ?\]/i.test(content)

    if (isInCodeMode){
        return `<pre class="code">${storeProject.isHideContent? content.replace(/[^，。 \n]/g, '*'): content}</pre>`
    } else {
        let contentArray = content.split('\n')
        let contentHtml = ""
        contentArray.forEach(item => {
            if (item === ''){
                contentHtml += '<br/>'
            } else {
                contentHtml += `<p>${storeProject.isHideContent ? item.replace(/[^，。 \n]/g, '*'): item}</p>`
            }
        })
        return contentHtml
    }

}
function  showDiary(id: number) {
    isLoading.value = true
    let requestData = {diaryId: id}
    diaryApi
        .detail(requestData)
        .then(res => {
            isLoading.value = false // loading off
            let diary = res.data
            diary.value = diary
            let dateMoment = new Moment(diary.value.date)
            lunarObject.value = calendar.solar2lunar(dateMoment.year(), dateMoment.month()+1, dateMoment.date())
            storeProject.currentDiary = diary // 设置 store: currentDiary
            let dateObj = dateProcess(diary.date)
            diary.value.dateObj = dateObj
            document.title = '日记 - ' + dateObj.dateFull // 变更当前标签的 Title
            diary.value.temperature = temperatureProcessSTC(diary.temperature)
            diary.value.temperatureOutside = temperatureProcessSTC(diary.temperature_outside)

            diary.categoryString = storeProject.categoryNameMap.get(diary.category)
        })
        .catch(() => {
            isLoading.value = false // loading off
            router.push({name: 'List'})
        })
}

</script>

<style lang="scss">
@import "detail";
</style>
