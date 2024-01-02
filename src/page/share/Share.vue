<template>
    <div class="share-container">
        <div class="share" :style="`min-height:${heightShare}px`">
            <!-- LOADING -->
            <div v-if="isLoadingDiary">
                <Loading :loading="isLoadingDiary"/>
            </div>

            <div v-else>
                <div v-if="diary.title">
                    <!--CONTENT-->
                    <div class="share-head">
                        <!--head-->
                        <div class="share-title">
                            <h2>{{ diary.title }}</h2>
                        </div>
                        <div class="share-date">
                            <div class="above">
                                <h3>{{ dateObj.weekday }} </h3>
                                <div class="share-category" :style="shareCategoryStyle">
                                    <span>{{ diary.categoryString }}</span>
                                </div>
                            </div>
                            <div class="bottom">{{ dateObj.dateFull }}</div>
                        </div>

                        <!--META-->
                        <div class="share-meta">
                            <div class="weather">
                                <img v-if="diary.weather"
                                     :src="SVG_ICONS.weather_icons[`${diary.weather}_active`]"
                                     :alt="diary.weather">
                            </div>
                            <div class="temperature" v-if="diary.temperature || diary.temperature_outside">
                                <span v-if="diary.temperature">{{ diary.temperature }}</span>
                                <span v-if="diary.temperature && diary.temperature_outside"> / </span>
                                <span v-if="diary.temperature_outside">{{ diary.temperature_outside }}</span>
                                <span>℃</span>
                            </div>
                        </div>

                        <!--end of head-->
                    </div>

                    <div class="divider" v-if="diary.content"></div>

                    <!--CONTENT-->
                    <div class="share-content">
                        <ToDo v-if="diary.category === 'todo'" :readonly="true" :diary="diary"/>
                        <div v-else>
                            <div v-if="diary.is_markdown === 1" class="markdown" v-html="contentMarkDownHtml"/>
                            <div v-else class="content" v-html="diary.contentHtml"/>
                        </div>
                    </div>

                    <div class="share-author">
                        <div class="line"></div>
                        <div class="name">
                            <div class="nickname">{{diary.nickname}}</div>
                            <div class="username">{{diary.username}}</div>
                        </div>
                    </div>
                </div>

                <!-- NO DIARY -->
                <div v-else class="no-diary">
                    <p>无此日记</p>
                </div>
            </div>

        </div>
        <router-link class="back-link" to="/"><img src="../../assets/icons/logo/logo.svg" alt="logo">标题日记</router-link>

    </div>
</template>

<script lang="ts" setup>
import Loading from "../../components/Loading.vue"
import diaryApi from "../../api/diaryApi.ts"
import {marked} from "marked";
import ToDo from "../detail/ToDo.vue";

import {popMessage, dateProcess, temperatureProcessSTC} from "../../utility.ts";
import {useProjectStore} from "../../pinia";

const storeProject = useProjectStore();
import {computed, onMounted, onUnmounted, Ref, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {DiaryEntity} from "../list/Diary.ts";
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";
const router = useRouter()
const route = useRoute()

const diary: Ref<DiaryEntity> = ref({})
const dateObj = ref({})
const isShowToast = ref(false)
const isLoadingDiary = ref(false) // 日记请求中


const heightShare = computed(()=>{
    return storeProject.insets.windowsWidth > 375 ? storeProject.insets.windowsHeight - 60 - 100 : storeProject.insets.windowsHeight
})
const shareCategoryStyle = computed(()=>{
    return `background-color: ${storeProject.categoryObjectMap.get(diary.value.category).color}`
})
const contentMarkDownHtml = computed(()=>{
    return marked.parse(diary.value.content)
})

onMounted(()=>{
    getDiaryInfo(route.params.id)
})


function getDiaryInfo(diaryId: number){
    isLoadingDiary.value = true
    let requestData = {
        'diaryId': route.params.id
    }
    diaryApi
        .detail(requestData)
        .then(res => {

            // 日记信息
            const tempDiary = res.data

            isLoadingDiary.value = false
            diary.value = tempDiary
            dateObj.value = dateProcess(tempDiary.date)
            document.title = '日记 - ' + dateObj.value.dateFull // 变更标题
            if (diary.value.content) {
                diary.value.contentHtml = getContentHtml(tempDiary.value.content)
            }
            diary.value.temperature = temperatureProcessSTC(tempDiary.temperature)
            diary.value.temperature_outside = temperatureProcessSTC(tempDiary.temperature_outside)

            // category map
            let categoryNameMap = new Map()
            storeProject.categoryAll.forEach(item => {
                categoryNameMap.set(item.name_en, item.name)
            })
            diary.categoryString = categoryNameMap.get(tempDiary.category)

        })
        .catch(() => {
            isLoadingDiary.value = false
            diary.value = {}
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

watch('route.params.id', (newValue) => {
    getDiaryInfo(newValue)
})

</script>
<style lang="scss">
@import "./share";
</style>
