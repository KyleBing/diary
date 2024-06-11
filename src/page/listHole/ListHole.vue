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
            <diary-list-hole-item
                v-for="diary in diariesShow" :key="diary.id"
                :width="colWidth"
                :diary="diary"/>
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
import {DiaryEntity, DiaryEntityDatabase, DiaryEntityHole} from "../list/Diary.ts";
import {last} from "v-calendar/dist/types/src/utils/helpers";

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



const diaries = ref<Array<DiaryEntityDatabase>>([])  // 实际日记


onMounted(()=>{
    document.title = '日记' // 变更标题
    // init
    keywordShow.value = getDiaryConfigFromLocalStorage().keywords && getDiaryConfigFromLocalStorage().keywords.join(' ')
    nextTick(()=>{
        addScrollEvent()
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
    diariesShow.value = []

    // 卡片载入的相关变量重置
    lastCol = 0
    lastTopPos = 0
    lastDiaryIndex = 0

    clearTimeout(loadTimeOutHandle.value)
    loadTimeOutHandle.value = null

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

            renderingHoleList(newDiariesList, 0)

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


/**
 * 列表渲染
 */
const diariesShow = ref<Array<DiaryEntityHole>>([])  // 列表展示的日记
const loadGap = 20 // 卡片加载间隔时长，单位 ms
const isShowLoadProcess = true // 是否显示卡片加载的过程


const colCount = 10 // 列数
let lastDiaryIndex = 1  // 最后一个日记的 index
let lastTopPos = 0  // 最后一个日记的末尾位置： 距离 TOP
let lastCol = 0  // 下次该放置的 col index，哪一列
let colWidth = storeProject.insets.windowsWidth / colCount  // 每个元素的宽度

const loadTimeOutHandle = ref()  // 载入过程的 timeOut handle
const isNeedLoadNextTimeout = true  // 是否要打断 timeout 的载入过程

function renderingHoleList(newDiaries: Array<DiaryEntityDatabase>, index: number){
    // 如果不需要载入下面的内容，在 reload 的时候会遇到这种情况
    if (!isNeedLoadNextTimeout){
        return
    }

    // 1. 转成 DiaryEntityHole 对象
    let diary = newDiaries[index] as DiaryEntityHole
    diary.position = {
        top:  lastTopPos,
        left: lastCol * colWidth,
        col: lastCol
    }
    // 2. 添加到展示的列表中
    diariesShow.value.push(diary)

    nextTick(()=>{
        // 3. 待其渲染完成后再去处理下一个
        let domItems = Array.from((document.querySelector('.diary-list-hole') as HTMLDivElement).children) // Elements 转成数组

        // 3.1 第一排，前 colCount 个是不需要知道位置的，因为 top 都为 0
        if (lastDiaryIndex < colCount - 1){
            lastCol = lastCol + 1
            lastTopPos = 0
        }
        // 3.2 以后其它的
        else {
            // 取后 colCount 个元素的 lastTopPos
            let countInDomItems = domItems.length > 50? domItems.slice(domItems.length - 50):domItems
            let domItemsHeightColArray = countInDomItems
                                            .map(item => {
                                                let dom = item as HTMLDivElement
                                                let col = Number(dom.getAttribute('data-col'))
                                                let posTop = dom.offsetTop + dom.offsetHeight
                                                return {
                                                    posTop,
                                                    col
                                                }
                                            })

            // Map 放置第 col 的最大高度值，这里用 Map 或 Set 都可以，反正就是为了使值唯一
            let everyColLastMaxPosMap = new Map()  // [2,345],[3,234],[4,456]
            domItemsHeightColArray.forEach(item => {
                // 获取已经存在的 lastPos
                let existColPos = everyColLastMaxPosMap.get(item.col)
                if (existColPos === undefined){
                    everyColLastMaxPosMap.set(item.col, item.posTop)
                } else {
                    if (item.posTop >= existColPos){ // 如果有更大的，使用最大的
                        everyColLastMaxPosMap.set(item.col, item.posTop)
                    }
                }
            })

            // 将 Map 转成数组
            let everyColLastPosArray: Array<{posTop: number, col: number}> = []
            everyColLastMaxPosMap.forEach((value, key) => {
                everyColLastPosArray.push({
                    posTop: value,
                    col: key
                })
            })
            everyColLastPosArray
                .sort((a,b) => b.col - a.col) // 小值在前
                .sort((a,b) => a.posTop - b.posTop) // 大值在前


            lastTopPos = everyColLastPosArray[0].posTop
            lastCol = everyColLastPosArray[0].col
            // console.log(`${lastDiaryIndex}: `, lastTopPos, lastCol,  everyColLastPosArray, domItemsHeightColArray)
        }

        // 4. index + 1
        index = index + 1
        lastDiaryIndex = lastDiaryIndex + 1

        // 5. 退出递归条件
        if (index < newDiaries.length){
            if (isShowLoadProcess){
                loadTimeOutHandle.value = setTimeout(()=>{
                    renderingHoleList(newDiaries, index)
                }, loadGap)
            } else {
                renderingHoleList(newDiaries, index)
            }
        }
    })
}


function addScrollEvent() {
    (document.querySelector('.diary-list-hole') as HTMLDivElement)
        .addEventListener('scroll', event => {
            console.log(event)
            // 判断是否加载内容
            function needLoadContent() {
                let lastNode = document.querySelector('.diary-list-hole > div:last-child') as HTMLDivElement
                if (!lastNode) {
                    return false
                }
                let lastOffsetTop = lastNode.offsetTop
                let clientHeight = window.innerHeight
                let listEl = document.querySelector('.diary-list-hole') as HTMLDivElement
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
    position: relative;
}


</style>
