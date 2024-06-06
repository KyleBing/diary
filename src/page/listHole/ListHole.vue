<template>
    <div class="diary-list-group-container" :style="`min-height: ${storeProject.insets.heightPanel}px`">
        <transition
            enter-active-class="animated-fast slideInDown"
            leave-active-class="animated-fast slideOutUp"
        >
            <div class="search-bar" v-if="storeProject.isShowSearchBar">
                <form @submit.prevent="search">
                    <input id="keyword" type="text" placeholder="搜索内容" v-model="keywordShow">
                    <span v-show="keywordShow.length > 0" @click="clearKeyword" class="clear">✕</span>
                </form>
            </div>
        </transition>

        <div class="diary-list-hole">
            <div class="diary-list-hole-col"
                 :style="`width:${((storeProject.insets.windowsWidth - 3) / 10)}px`"
                 v-for="colIndex in 10" :key="colIndex"
            >
                <diary-list-hole-item v-for="diary in diaries.filter((_, index) => index % 10 === colIndex - 1)" :key="diary.id" :diary="diary"/>
            </div>

        </div>

        <div class="pt-4 pb-4" v-if="isLoading">
            <Loading :loading="isLoading"/>
        </div>

        <div v-show="!isLoading && !isHasMore" class="end-of-diary">
            <div class="no-diary-list" v-if="diaries.length < 1">无日记</div>
            <p><img :src="SVG_ICONS.EOF" alt="EOF"></p>
        </div>
    </div>
</template>

<script lang="ts" setup>

import diaryApi from "../../api/diaryApi.ts"

import Loading from "../../components/Loading.vue"
import DiaryListHoleItem from "./DiaryListHoleItem.vue"

import {dateProcess, getDiaryConfigFromLocalStorage} from "../../utility.ts";
import {useProjectStore} from "../../pinia";
const storeProject = useProjectStore()
import {nextTick, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";
import {DiaryEntity} from "../list/Diary.ts";

const route = useRoute()
const router = useRouter()

const isHasMore = ref(true)
const isLoading = ref(true)

const keywordShow = ref('') // 关键词
const showDiaryList = ref(true)
interface SearchParamsDiaryList {
    keywords: string[],
    pageNo: number,
    pageSize: number, // 单页请求条数
    categories: string[],
    filterShared: 0 | 1, // 1 是筛选，0 是不筛选
    dateFilterString: string // 日记年月筛选
}
const params = ref<SearchParamsDiaryList>({
    keywords: [],
    pageNo: 1,
    pageSize: 150, // 单页请求条数
    categories: [],
    filterShared: 0, // 1 是筛选，0 是不筛选
    dateFilterString: '' // 日记年月筛选
})
const diaries = ref<Array<DiaryEntity>>([])

onMounted(()=>{
    document.title = '日记' // 变更标题
    // init
    keywordShow.value = getDiaryConfigFromLocalStorage().keywords && getDiaryConfigFromLocalStorage().keywords.join(' ')
    nextTick(()=>{
        // addScrollEvent()
    })
    storeProject.isShowSearchBar = !!keywordShow.value

    reload() // 载入日记列表
})


watch(()=> storeProject.isShowSearchBar, newValue => {
    if (newValue){
        nextTick(() => {
            document.querySelector('#keyword').focus()
        })
    }
})
// route 载入 `/` 路径时，重载日记列表：比如删除日记后
watch(route, newValue => {
    if (newValue.path === '/') {
        reload()
    }
})
watch(keywordShow, newValue => {
    storeProject.keywords = newValue.split((' '))
})
watch(() => storeProject.isListNeedBeReload, ()=> {
    if (storeProject.isListNeedBeReload) {
        reload()
    }
})


/* MENU 相关 */
function search() {
    storeProject.keywords = keywordShow.value.split(' ')
    reload()
}
function clearKeyword() {
    keywordShow.value = ''
    search()
}
function reload() {
    params.value.pageNo = 1
    params.value.keywords = JSON.stringify(storeProject.keywords)
    diaries.value = []
    loadMore()
}

/* DIARY 相关 */
function loadMore() {
    isHasMore.value = false
    isLoading.value = true
    params.value.categories = JSON.stringify(getDiaryConfigFromLocalStorage().filteredCategories)
    params.value.dateFilterString = getDiaryConfigFromLocalStorage().dateFilterString
    params.value.filterShared = getDiaryConfigFromLocalStorage().isFilterShared ? 1 : 0
    getDiaries(params.value)
}
function getDiaries(params: SearchParamsDiaryList) {
    diaryApi
        .list(params)
        .then(res => {
            let newDiariesList = res.data.map(diary => {
                if (diary.content) {
                    diary.contentHtml = diary.content.replace(/\n/g, '<br/>')
                }
                diary.categoryString = storeProject.categoryNameMap.get(diary.category)
                diary.weekday = dateProcess(diary.date).weekday
                diary.dateString = dateProcess(diary.date).date
                return diary
            })

            // page operation
            if (res.data.length === params.pageSize) {
                isHasMore.value = true
                params.pageNo++
            } else {
                isHasMore.value = false
            }

            // diary operation
            diaries.value = diaries.value.concat(newDiariesList)
        })
        .finally(() => {
            // 列表加载完成后设置列表重载： false
            storeProject.isListNeedBeReload = false
            isLoading.value = false
        })
}
function addScrollEvent() {
    document.querySelector('.diary-list-container').addEventListener('scroll', () => { // 由于这里用的箭头方法，所以这里的 This 指向的是 VUE app
        /* 判断是否加载内容*/
        function needLoadContent() {
            let lastNode: HTMLDivElement = document.querySelector('.diary-list-group > div:last-child')
            if (!lastNode) {
                return false
            }
            let lastOffsetTop = lastNode.offsetTop
            let clientHeight = window.innerHeight
            let listEl: HTMLDivElement = document.querySelector('.diary-list-container')
            let scrollTop = listEl.scrollTop
            // console.clear()
            // window.console.log(`${lastOffsetTop} | ${clientHeight} | ${scrollTop}`)
            // 当 list 滚动到上面的部分 + 屏幕高度 >  最后一个元素的 offsetTop 的时候，就说明已经触底了
            return (lastOffsetTop < clientHeight + scrollTop + innerHeight) // 添加 100% 触发高度
        }

        if (isHasMore.value && needLoadContent()) {
            loadMore()
        }
    })
}

</script>

<style lang="scss" scoped>

.diary-list-hole{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-flow: row wrap;
}
.diary-list-hole-col {
    width: 200px;
    display: flex;
    flex-flow: column nowrap;
}

</style>
