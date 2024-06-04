<template>
    <div class="share-container">
        <div class="share" :style="`min-height:${heightShare}px`">
            <!-- LOADING -->
            <div v-if="isLoadingDiary">
                <Loading :loading="isLoadingDiary"/>
            </div>

            <div v-else>
                <div v-if="currentDiary.title">
                    <!--CONTENT-->
                    <div class="share-head">
                        <!--head-->
                        <div class="share-title">
                            <h2>{{ currentDiary.title }}</h2>
                        </div>
                        <div class="share-date">
                            <div class="above">
                                <h3>{{ dateObj.weekday }} </h3>
                                <div class="share-category" :style="shareCategoryStyle">
                                    <span>{{ currentDiary.categoryString }}</span>
                                </div>
                            </div>
                            <div class="bottom">{{ dateObj.dateFull }}</div>
                        </div>

                        <!--META-->
                        <div class="share-meta">
                            <div class="weather">
                                <img v-if="currentDiary.weather"
                                     :src="SVG_ICONS.weather_icons[`${currentDiary.weather}_active`]"
                                     :alt="currentDiary.weather">
                            </div>
                            <div class="temperature" v-if="currentDiary.temperature || currentDiary.temperature_outside">
                                <span v-if="currentDiary.temperature">{{ currentDiary.temperature }}</span>
                                <span v-if="currentDiary.temperature && currentDiary.temperature_outside"> / </span>
                                <span v-if="currentDiary.temperature_outside">{{ currentDiary.temperature_outside }}</span>
                                <span>℃</span>
                            </div>
                        </div>

                        <!--end of head-->
                    </div>

                    <div class="divider" v-if="currentDiary.content"></div>

                    <!--CONTENT-->
                    <div class="share-content">
                        <ToDo v-if="currentDiary.category === 'todo'" :readonly="true" :diary="currentDiary"/>
                        <div v-else>
                            <div v-if="currentDiary.is_markdown === 1" class="markdown" v-html="contentMarkDownHtml"/>
                            <div v-else class="content" v-html="currentDiary.contentHtml"/>
                        </div>
                    </div>

                    <div class="share-author">
                        <div class="line"></div>
                        <div class="name">
                            <div class="nickname">{{ currentDiary.nickname }}</div>
                            <div class="username">{{ currentDiary.username }}</div>
                        </div>
                    </div>
                </div>

                <!-- NO DIARY -->
                <div v-else class="no-diary">
                    <p>无此日记</p>
                </div>
            </div>

        </div>
        <router-link class="back-link" to="/"><img :src="SVG_ICONS.logo_icons.logo" alt="logo">标题日记</router-link>

    </div>
</template>

<script lang="ts" setup>
import Loading from "../../components/Loading.vue"
import diaryApi from "../../api/diaryApi.ts"
import {marked} from "marked";
import ToDo from "../detail/ToDo.vue";

import {
    dateProcess,
    temperatureProcessSTC,
    getCategoryAll,
    DateUtilityObject
} from "@/utility.ts";
import {useProjectStore} from "@/pinia";

const storeProject = useProjectStore();
import {computed, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {DiaryEntityDatabase} from "../list/Diary.ts";
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";
const route = useRoute()

const currentDiary = ref<DiaryEntityDatabase>(null)
const dateObj = ref<DateUtilityObject>({})
const isLoadingDiary = ref(false) // 日记请求中


const heightShare = computed(()=>{
    return storeProject.insets.windowsWidth > 375 ? storeProject.insets.windowsHeight - 60 - 100 : storeProject.insets.windowsHeight
})
const shareCategoryStyle = computed(()=>{
    return `background-color: ${storeProject.categoryObjectMap.get(currentDiary.value.category).color}`
})
const contentMarkDownHtml = computed(()=>{
    return marked.parse(currentDiary.value.content)
})

onMounted(()=>{
    getDiaryInfo(Number(route.params.id))
})


function getDiaryInfo(diaryId: number){
    isLoadingDiary.value = true
    let requestData = {
        diaryId: diaryId
    }
    diaryApi
        .detail(requestData)
        .then(res => {

            // 日记信息
            const tempDiary = res.data

            isLoadingDiary.value = false
            currentDiary.value = tempDiary
            dateObj.value = dateProcess(tempDiary.date)
            document.title = '日记 - ' + dateObj.value.dateFull // 变更标题
            if (currentDiary.value.content) {
                currentDiary.value.contentHtml = getContentHtml(tempDiary.content)
            }
            currentDiary.value.temperature = temperatureProcessSTC(tempDiary.temperature)
            currentDiary.value.temperature_outside = temperatureProcessSTC(tempDiary.temperature_outside)

            // category map
            let categoryNameMap = new Map()
            getCategoryAll().forEach(item => {
                categoryNameMap.set(item.name_en, item.name)
            })
            currentDiary.value.categoryString = categoryNameMap.get(tempDiary.category)

        })
        .catch(() => {
            isLoadingDiary.value = false
            currentDiary.value = null
        })
}
function getContentHtml(content: string){
    let isInCodeMode = /\[ ?code ?\]/i.test(content)
    let contentArray = content.split('\n')
    let contentHtml = ""
    if (isInCodeMode){
        return `<pre class="code">${storeProject.isHideContent? content.replace(/[^，。 \n]/g, '*'): content}</pre>`
    } else {
        contentArray.forEach(item => {
            if (item === '') {
                contentHtml += '<br/>'
            } else {
                contentHtml += `<p>${storeProject.isHideContent ? item.replace(/[^，。 \n]/g, '*') : item}</p>`
            }
        })
        return contentHtml
    }
}

watch(() => route.params.id, newValue => {
    console.log(newValue)
    getDiaryInfo(Number(newValue))
})

</script>
<style lang="scss">
@import "./share";
</style>
