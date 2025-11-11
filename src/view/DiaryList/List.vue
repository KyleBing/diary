<template>
    <div class="diary-list-group-container" :style="`min-height: ${projectStore.insets.heightPanel}px`">
        <transition enter-active-class="animated-fast slideInDown" leave-active-class="animated-fast slideOutUp">
            <div class="search-bar" v-if="projectStore.isShowSearchBar">
                <form @submit.prevent="search">
                    <input id="keyword" type="text" placeholder="搜索内容" v-model="keywordShow">
                    <span v-show="keywordShow.length > 0" @click="clearKeyword" class="clear">✕</span>
                </form>
            </div>
        </transition>


        <div class="diary-list-group">
            <DiaryListGroup
                v-for="item in diaryListGroup" :key="item.title"
                :listStyle="projectStore.listStyle"
                :diaryListGroup="item" />
        </div>

        <div class="pt-4 pb-4" v-if="isLoading">
            <Loading :loading="isLoading" />
        </div>

        <div v-show="!isLoading && !isHasMore" class="end-of-diary">
            <div class="no-diary-list" v-if="diaryList.length < 1">无日记</div>
            <p>
                <img v-if="projectStore.colorMode === 'light'" :src="SVG_ICONS.EOF" alt="EOF">
                <img v-else :src="SVG_ICONS.EOFDark" alt="EOF">
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Loading from "@/components/Loading.vue"
import diaryApi from "@/api/diaryApi"
import SVG_ICONS from "@/assets/icons/SVG_ICONS"

import {dateFormatter, dateProcess, EnumWeekDayShort} from "@/utility"

import {useProjectStore} from "@/pinia/useProjectStore"
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {
    EntityDiaryListOperation,
    DiarySearchParams,
    EntityDiaryFromServerLocal, EntityDiaryFromServer
} from "./Diary"

import DiaryListGroup from "@/view/DiaryList/DiaryListGroup.vue"

import { EntityDiaryListGroup } from "./Diary"

import {storeToRefs} from "pinia"
import { useStatisticStore } from "@/pinia/useStatisticStore"
const projectStore = useProjectStore()
const router = useRouter()
const route = useRoute()

const isHasMore = ref(true)
const isLoading = ref(true)

const diaryList = ref<Array<EntityDiaryFromServerLocal>>([])  // 全部日记
const diaryListGroup = ref<Array<EntityDiaryListGroup>>([])   // 处理分组后的日记分组

const {isShowSearchBar, isListNeedBeReload, listOperation} = storeToRefs(projectStore)

const formSearch = ref<DiarySearchParams>({
    keywords: '',
    pageNo: 1,
    pageSize: 100, // 单页请求条数
    categories: '',
    filterShared: 0, // 1 是筛选，0 是不筛选
    dateFilterString: '' // 日记年月筛选
})

onMounted(() => {
    document.title = '日记' // 变更标题
    // init
    keywordShow.value = projectStore.keywords && projectStore.keywords.join(' ')
    nextTick(()=>{
        addScrollEvent()
    })
    projectStore.isShowSearchBar = !!keywordShow.value
    reloadDiaryList() // 载入日记列表
})



// 刷新 diaryList show
function refreshDiariesShow() {
    let tempGroupArray: Array<EntityDiaryListGroup> = []
    if (diaryList.value.length > 0) { // 在开始时，先把头问月份和第一个日记加到数组中
        let lastDiary = diaryList.value[0]
        let lastDiaryDateString = dateFormatter(new Date(lastDiary.date), 'yyyy-MM-dd')
        let yearDateString = lastDiaryDateString.substring(0, 7)

        let currentDay = Number(lastDiaryDateString.slice(8, 10))

        let tempDiary = {} as EntityDiaryFromServerLocal
        Object.assign(tempDiary, lastDiary)
        tempDiary.day = currentDay

        let tempGroup: EntityDiaryListGroup = {
            title: yearDateString,
            headerSize: "medium",
            diaries: [tempDiary]
        }

        // 如果只筛选 to-do 日记，则不显示年月标题
        // 只有 TODO 类别时，说明处于 TODO 模式
        let isUseTodoTitle = projectStore.filteredCategories.length === 1 && projectStore.filteredCategories[0] === 'todo'
        if (isUseTodoTitle) {
            tempGroup.title = '待办列表'
        }

        // 添加当前日记内容
        tempGroupArray.push(tempGroup)

        let sameDayIndex = 0 // 连续相同日期的日记 index

        if (diaryList.value.length > 1) {  // 再判断第二个日记与第一个的关系
            for (let i = 1; i < diaryList.value.length; i++) {
                lastDiary = diaryList.value[i - 1] // 更新上一条日记指向
                let currentDiary = diaryList.value[i]
                let lastDiaryDateString = dateFormatter(new Date(lastDiary.date), 'yyyy-MM-dd')
                let currentDiaryDateString = dateFormatter(new Date(currentDiary.date), 'yyyy-MM-dd')
                let lastDiaryYearMonth = lastDiaryDateString.substring(0, 7)
                let lastDiaryDay = Number(lastDiaryDateString.substring(8, 10))
                let currentDiaryYearMonth = currentDiaryDateString.substring(0, 7)
                let currentDiaryDay = Number(currentDiaryDateString.substring(8, 10))

                // 判断是否需要添加年月标题
                let isNeedAddAnotherGroup = lastDiaryYearMonth !== currentDiaryYearMonth

                let tempDiary = {} as EntityDiaryFromServerLocal
                Object.assign(tempDiary, currentDiary)

                // 判断前一个日记和后一个日记的日期字符串是否一致
                // 这里需要判断完整的日期字符串，列表执行搜索的时候可能会有 month 不同但 day 相同的情况，就会导致下一条的日期不会显示。
                if (currentDiaryDateString === lastDiaryDateString) {
                    tempDiary.day = ''
                } else {
                    sameDayIndex = 0
                    tempDiary.day = currentDiaryDay
                }

                // 添加标题
                if (isUseTodoTitle){ // TO-DO 列表模式时直接添加日记内容，不需要考虑添加新组
                    tempGroupArray[tempGroupArray.length - 1].diaries.push(tempDiary)
                    tempGroupArray[tempGroupArray.length - 1].headerSize = "big"
                } else {
                    if (isNeedAddAnotherGroup) {
                        tempGroupArray.push({
                            title: currentDiaryYearMonth,
                            headerSize: "medium",
                            diaries: [tempDiary]
                        })
                    } else {
                        tempGroupArray[tempGroupArray.length - 1].diaries.push(tempDiary)
                    }
                }
            }
        }
        diaryListGroup.value = tempGroupArray
    }
}

/* KEYWORD 相关 */
const keywordShow = ref('') // 关键词

function search() {
    reloadDiaryList()
}

watch(isShowSearchBar, newValue => {
    if (newValue){
        nextTick(() => {
            (document.querySelector('#keyword') as HTMLInputElement).focus()
        })
    }
})

let timeoutHandle: ReturnType<typeof setTimeout> | null = null
let currentListRequestController: AbortController | null = null
watch(keywordShow, newValue => {
    if (newValue){ // 当有内容时才变化， '' 将不存储
        projectStore.SET_KEYWORD(newValue.split(' '))
        if (timeoutHandle){
            clearTimeout(timeoutHandle)
        }
        timeoutHandle = setTimeout(search, 200)
    } else {
        projectStore.SET_KEYWORD([])
    }
})
// route 载入 `/` 路径时，重载日记列表：比如删除日记后

function clearKeyword() {
    projectStore.SET_KEYWORD([])
    keywordShow.value = ''
    search()
}
function reloadDiaryList() {
    formSearch.value.pageNo = 1
    formSearch.value.keywords = JSON.stringify(projectStore.keywords)
    diaryList.value = []
    diaryListGroup.value = []
    loadMore()
}

/* DIARY 相关 */
function loadMore() {
    if (currentListRequestController) {
        currentListRequestController.abort()
    }
    const controller = new AbortController()
    currentListRequestController = controller

    isHasMore.value = false
    isLoading.value = true
    formSearch.value.categories = JSON.stringify(projectStore.filteredCategories)
    formSearch.value.dateFilterString = projectStore.dateFilterString
    formSearch.value.filterShared = projectStore.isFilterShared ? 1 : 0
    getDiaries(controller)
}

// 将服务器返回的 diary 格式转换成 diary 展示时的格式
function processDiaryToShowType(diary: EntityDiaryFromServerLocal): EntityDiaryFromServerLocal{
    if (diary.content) {
        diary.contentHtml = diary.content.replace(/\n/g, '<br/>')
    }
    diary.categoryString = useStatisticStore().categoryNameMap.get(diary.category)
    diary.weekday = dateProcess(diary.date).weekday
    diary.weekdayShort = EnumWeekDayShort[new Date(diary.date).getDay()]
    diary.dateString = dateProcess(diary.date).date
    return diary
}

function getDiaries(controller: AbortController) {
    diaryApi
        .list(formSearch.value, controller.signal)
        .then(res => {
            if (controller !== currentListRequestController) {
                return
            }
            let newDiariesList = res.data.map(diary => {
                let diaryObj = {} as EntityDiaryFromServerLocal
                Object.assign(diaryObj, diary)

                return processDiaryToShowType(diaryObj)
            })

            // page operation
            if (res.data.length === formSearch.value.pageSize) {
                isHasMore.value = true
                formSearch.value.pageNo++
            } else {
                isHasMore.value = false
            }

            // diary operation
            diaryList.value = diaryList.value.concat(newDiariesList)
            refreshDiariesShow()
        })
        .finally(() => {
            if (controller !== currentListRequestController) {
                return
            }
            // 列表加载完成后设置列表重载： false
            projectStore.isListNeedBeReload = false
            isLoading.value = false
            currentListRequestController = null
        })
}
function addScrollEvent() {
    document.querySelector('.diary-list-container')!.addEventListener('scroll', () => { // 由于这里用的箭头方法，所以这里的 This 指向的是 VUE app
        /* 判断是否加载内容*/
        function isNeedLoadMoreDidary() {
            // Get the last diary group element
            let lastGroupNode = document.querySelector('.diary-list-group > .diary-list-group:last-child') as HTMLDivElement
            if (!lastGroupNode) {
                return false
            }

            // Get the last diary item within the last group
            let lastDiaryNode = lastGroupNode.querySelector('.diary-list-group-content > :last-child') as HTMLDivElement
            if (!lastDiaryNode) {
                return false
            }

            let lastOffsetTop = lastDiaryNode.offsetTop + lastGroupNode.offsetTop
            let clientHeight = window.innerHeight
            let listEl = document.querySelector('.diary-list-container')
            let scrollTop = listEl!.scrollTop
            // console.clear()
            // window.console.log(`${lastOffsetTop} | ${clientHeight} | ${scrollTop}`)
            // 当 list 滚动到上面的部分 + 屏幕高度 >  最后一个元素的 offsetTop 的时候，就说明已经触底了
            return (lastOffsetTop < clientHeight + scrollTop + innerHeight) // 添加 100% 触发高度
        }

        if (isHasMore.value && isNeedLoadMoreDidary()) {
            loadMore()
        }
    })
}



watch(route, (newValue) => {
    if (newValue.path === '/') {
        reloadDiaryList()
    }
})

watch(isListNeedBeReload, newValue => {
    if (newValue) {
        reloadDiaryList()
    }
})

watch(listOperation, ({type, diary, id}: EntityDiaryListOperation) => {
    console.log('list operation: ', type,diary,id)
    switch (type) {
        case 'add':
            let posInsert = 0
            for (let i = 0; i < diaryList.value.length; i++) {
                let currentDiary = diaryList.value[i]
                if (diary!.date > currentDiary.date) {
                    posInsert = i
                    break
                }
            }
            diaryList.value.splice(posInsert, 0, diary!)
            refreshDiariesShow()
            break
        case 'delete':
            diaryList.value.map((item, index) => {
                if (item.id === id) {
                    diaryList.value.splice(index, 1)
                    if (diaryList.value[index]) {
                        // 删除当前日记后，显示最近的一条日记，由于删除了一条，所以留下的 index 就是后面一个元素的 index
                        router.push({
                            name: 'Detail',
                            params: {
                                id: diaryList.value[index].id
                            }
                        })
                    } else {
                        // 如果没有，就跳转到主页
                        router.push({
                            name: 'Index'
                        })
                    }
                }
            })
            refreshDiariesShow()
            break
        case 'change':
            // TODO: 修改日记的日期时排序调整位置
            diaryList.value.map((item, index) => {
                if (Number(item.id) === Number(diary!.id)) {
                    diaryList.value.splice(index, 1, processDiaryToShowType(diary))
                }
            })
            refreshDiariesShow()
            break
    }
})

onBeforeUnmount(() => {
    if (currentListRequestController) {
        currentListRequestController.abort()
        currentListRequestController = null
    }
})

</script>

<style lang="scss" scoped>
@import "./list";
</style>
