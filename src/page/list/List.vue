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

        <div class="diary-list-group" v-if="!storeProject.isDiaryListShowedInFullStyle">
            <div v-for="(item, index) in diariesShow" :key="index">
                <ListHeader v-if="!item.title" size="" :title="item.date"/>
                <DiaryListItem v-else :isActive="$route.params.id === String(item.id)" :category="item.category" :diary="item"/>
            </div>
        </div>

        <div class="diary-list-group" v-else>
            <div v-for="(item, index) in diariesShow" :key="index">
                <ListHeader v-if="!item.title" size="big" :title="item.date"/>
                <DiaryListItemLong v-else :diary="item"/>
            </div>
        </div>

        <div class="pt-4 pb-4" v-if="isLoading">
            <Loading :loading="isLoading"/>
        </div>

        <div v-show="!isLoading && !isHasMore" class="end-of-diary">
            <div class="no-diary-list" v-if="diaries.length < 1">无日记</div>
            <p>
                <img v-if="storeProject.colorMode === 'light'" :src="SVG_ICONS.EOF" alt="EOF">
                <img v-else :src="SVG_ICONS.EOFDark" alt="EOF">
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import DiaryListItem from "./diaryListItem/DiaryListItem.vue"
import DiaryListItemLong from "./diaryListItemLong/DiaryListItemLong.vue"
import Loading from "../../components/Loading.vue"
import diaryApi from "../../api/diaryApi.ts"
import ListHeader from "../../page/list/ListHeader.vue"
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts"

import {dateProcess, getDiaryConfigFromLocalStorage, dateFormatter} from "../../utility.ts";

import {useProjectStore} from "../../pinia"

const storeProject = useProjectStore()
import {nextTick, onMounted, Ref, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {DiaryEntity, DiaryListOperation} from "./Diary.ts";
import {storeToRefs} from "pinia";
const router = useRouter()
const route = useRoute()


const showDiaryList: Ref<DiaryEntity[]> = ref(true)
const isHasMore = ref(true)
const isLoading = ref(true)
const diaries: Ref<DiaryEntity[]> = ref([])
const diariesShow: Ref<DiaryEntity[]> = ref([])

const {isShowSearchBar, isListNeedBeReload, listOperation} = storeToRefs(storeProject)


interface SearchParams {
    keywords: string[],
    pageNo: number,
    pageSize: number, // 单页请求条数
    categories: string[],
    filterShared: 0|1, // 1 是筛选，0 是不筛选
    dateFilterString: string // 日记年月筛选
}
const params: Ref<SearchParams> = ref({
    keywords: [],
    pageNo: 1,
    pageSize: 100, // 单页请求条数
    categories: [],
    filterShared: 0, // 1 是筛选，0 是不筛选
    dateFilterString: '' // 日记年月筛选
})


onMounted(()=>{
    document.title = '日记' // 变更标题
    // init
    keywordShow.value = storeProject.keywords && storeProject.keywords.join(' ')
    nextTick(()=>{
        addScrollEvent()
    })
    storeProject.isShowSearchBar = !!keywordShow.value
    reloadDiaryList() // 载入日记列表
})


// 刷新 diaries show
function refreshDiariesShow(){
    console.log('diaries changed')
    let tempShowArray = []
    if (diaries.value.length > 0) { // 在开始时，先把头问月份和第一个日记加到数组中
        let lastDiary = diaries.value[0]
        let lastDiaryDateString = dateFormatter(new Date(lastDiary.date), 'yyyy-MM-dd')
        tempShowArray.push({ // 添加年月
            date: lastDiaryDateString.substring(0, 7)
        })
        let currentDay = Number(lastDiaryDateString.slice(8, 10))
        let tempDiary: DiaryEntity = {}
        Object.assign(tempDiary, lastDiary)
        tempDiary.date = currentDay
        tempDiary.is_public = tempDiary.is_public === 1
        // 添加当前日记内容
        tempShowArray.push(tempDiary)

        if (diaries.value.length > 1) {  // 再判断第二个日记与第一个的关系
            for (let i = 1; i < diaries.value.length; i++) {
                lastDiary = diaries.value[i - 1] // 更新上一条日记指向
                let currentDiary = diaries.value[i]
                let lastDiaryDateString = dateFormatter(new Date(lastDiary.date), 'yyyy-MM-dd')
                let currentDiaryDateString = dateFormatter(new Date(currentDiary.date), 'yyyy-MM-dd')
                let lastDiaryMonth = lastDiaryDateString.substring(0, 7)
                let lastDiaryDay = Number(lastDiaryDateString.substring(8, 10))
                let currentDiaryMonth = currentDiaryDateString.substring(0, 7)
                let currentDiaryDay = Number(currentDiaryDateString.substring(8, 10))
                // console.log(lastDiaryMonth, currentDiaryMonth)
                if (lastDiaryMonth !== currentDiaryMonth) {
                    tempShowArray.push({ // 添加年月
                        date: currentDiaryDateString.substring(0, 7)
                    })
                }
                let tempDiary:DiaryEntity = {}
                Object.assign(tempDiary, currentDiary)
                tempDiary.is_public = currentDiary.is_public === 1
                // 判断前一个日记和后一个日记的日期字符串是否一致，‘年月日’ 搜索的时候可能会有月份不同但天数相同的情况，就会导致下一条的日期不会显示。
                tempDiary.date = currentDiaryDateString === lastDiaryDateString ? '' : currentDiaryDay
                tempShowArray.push(tempDiary) // 添加当前日记内容
            }
        }
    }
    diariesShow.value = tempShowArray
}

/* KEYWORD 相关 */
const keywordShow = ref('') // 关键词

function search() {
    reloadDiaryList()
}

watch(isShowSearchBar, newValue => {
    if (newValue){
        nextTick(() => {
            document.querySelector('#keyword').focus()
        })
    }
})
watch(keywordShow, newValue => {
    console.log(newValue, typeof newValue)
    storeProject.SET_KEYWORD(newValue.split(' '))
})
// route 载入 `/` 路径时，重载日记列表：比如删除日记后

function clearKeyword() {
    keywordShow.value = ''
    search()
}
function reloadDiaryList() {
    params.value.pageNo = 1
    params.value.keywords = JSON.stringify(storeProject.keywords)
    diaries.value = []
    diariesShow.value = []
    loadMore()
}

/* DIARY 相关 */
function loadMore() {
    isHasMore.value = false
    isLoading.value = true
    params.value.categories = JSON.stringify(storeProject.filteredCategories)
    params.value.dateFilterString = storeProject.dateFilterString // TODO: portal change dateFilter -> dateFilterString
    params.value.filterShared = storeProject.isFilterShared ? 1 : 0
    getDiaries()
}
function getDiaries() {
    diaryApi
        .list(params.value)
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
            if (res.data.length === params.value.pageSize) {
                isHasMore.value = true
                params.value.pageNo++
            } else {
                isHasMore.value = false
            }

            // diary operation
            diaries.value = diaries.value.concat(newDiariesList)
            refreshDiariesShow()
        })
        .finally(() => {
            // 列表加载完成后设置列表重载： false
            storeProject.isListNeedBeReload = false
            isLoading.value = false
        })
}
function addScrollEvent() {
    document.querySelector('.diary-list-container')!.addEventListener('scroll', () => { // 由于这里用的箭头方法，所以这里的 This 指向的是 VUE app
        /* 判断是否加载内容*/
        function needLoadContent() {
            let lastNode = document.querySelector('.diary-list-group > div:last-child') as HTMLDivElement
            if (!lastNode) {
                return false
            }
            let lastOffsetTop = lastNode.offsetTop
            let clientHeight = window.innerHeight
            let listEl = document.querySelector('.diary-list-container')
            let scrollTop = listEl!.scrollTop
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

watch(listOperation, ({type, diary, id}: DiaryListOperation) => {
    // console.log('list operation: ', type,diary,id)
    switch (type) {
        case 'add':
            let posInsert = 0
            for (let i = 0; i < diaries.value.length; i++) {
                let currentDiary = diaries.value[i]
                if (diary.date > currentDiary.date) {
                    posInsert = i
                    break
                }
            }
            diaries.value.splice(posInsert, 0, diary)
            refreshDiariesShow()
            break
        case 'delete':
            diaries.value.map((item, index) => {
                if (item.id === id) {
                    diaries.value.splice(index, 1)
                    if (diaries.value[index]) {
                        // 删除当前日记后，显示最近的一条日记，由于删除了一条，所以留下的 index 就是后面一个元素的 index
                        router.push({
                            name: 'Detail',
                            params: {
                                id: diaries.value[index].id
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
            diaries.value.map((item, index) => {
                if (Number(item.id) === Number(diary.id)) {
                    diaries.value.splice(index, 1, diary)
                }
            })
            refreshDiariesShow()
            break
    }
})

</script>

<style lang="scss" scoped>
@import "./list";
</style>
