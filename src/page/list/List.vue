<template>
    <div class="diary-list-group-container" :style="`min-height: ${insets.heightPanel}px`">
        <transition
            enter-active-class="animated-fast slideInDown"
            leave-active-class="animated-fast slideOutUp"
        >
            <div class="search-bar" v-if="isShowSearchBar">
                <form @submit.prevent="search">
                    <input id="keyword" type="text" placeholder="搜索内容" v-model="keywordShow">
                    <span v-show="keywordShow.length > 0" @click="clearKeyword" class="clear">✕</span>
                </form>
            </div>
        </transition>

        <div class="diary-list-group" v-if="!isDiaryListShowedInFullStyle">
            <div v-for="(item, index) in diariesShow" :key="index">
                <ListHeader v-if="!item.title" size="" :title="item.date"/>
                <diary-list-item v-else :isActive="$route.params.id === String(item.id)" :category="item.category" :diary="item"/>
            </div>
        </div>

        <div class="diary-list-group" v-else>
            <div v-for="(item, index) in diariesShow" :key="index">
                <ListHeader v-if="!item.title" size="big" :title="item.date"/>
                <diary-list-item-long v-else :diary="item"/>
            </div>
        </div>

        <div class="pt-4 pb-4" v-if="isLoading">
            <loading :loading="isLoading"/>
        </div>

        <div v-show="!isLoading && !isHasMore" class="end-of-diary">
            <div class="no-diary-list" v-if="diaries.length < 1">无日记</div>
            <p><img :src="icons.EOF" alt="EOF"></p>
        </div>
    </div>
</template>

<script>
import utility from "../../utility"
import diaryListItem from "./diaryListItem/DiaryListItem"
import diaryListItemLong from "./diaryListItemLong/DiaryListItemLong"
import {mapState, mapMutations, mapGetters} from 'vuex'
import Loading from "../../components/Loading"
import diaryApi from "../../api/diaryApi"
import SvgIcons from "../../assets/img/SvgIcons"
import ListHeader from "../../page/list/ListHeader"

export default {
    name: 'List',
    data() {
        return {
            showDiaryList: true,
            icons: SvgIcons,

            isHasMore: true,
            isLoading: true,

            keywordShow: '', // 关键词

            params: {
                keywords: [],
                pageNo: 1,
                pageSize: 100, // 单页请求条数
                categories: [],
                filterShared: 0, // 1 是筛选，0 是不筛选
                dateFilter: '' // 日记年月筛选
            },
            diaries: [],
            diariesShow: [],
        }
    },
    components: {
        ListHeader,
        Loading,
        diaryListItem,
        diaryListItemLong
    },
    mounted() {
        document.title = '日记' // 变更标题

        // init
        this.keywordShow = utility.getDiaryConfig().keywords && utility.getDiaryConfig().keywords.join(' ')
        this.$nextTick(()=>{
            this.addScrollEvent()
        })
        this.SET_IS_SHOW_SEARCH_BAR(!!this.keywordShow)

        this.reload() // 载入日记列表
    },

    computed: {
        ...mapState([
            'keywords',
            'categoryAll',
            'isDiaryListShowedInFullStyle',
            'isListNeedBeReload',
            'listOperation',
            'isShowSearchBar',
            'insets'
        ]),
        ...mapGetters(['categoryNameMap'])
    },
    watch: {
        isShowSearchBar(newValue){
            if (newValue){
                this.$nextTick(() => {
                    document.querySelector('#keyword').focus()
                })
            }
        },
        // route 载入 `/` 路径时，重载日记列表：比如删除日记后
        $route(newValue) {
            if (newValue.path === '/') {
                this.reload()
            }
        },
        keywordShow(newValue) {
            this.SET_KEYWORD(newValue.split(' '))

        },
        isListNeedBeReload() {
            if (this.isListNeedBeReload) {
                this.reload()
            }
        },
        listOperation({type, diary, id}) {
            // console.log('list operation: ', type,diary,id)
            switch (type) {
                case 'add':
                    let posInsert = 0
                    for (let i = 0; i < this.diaries.length; i++) {
                        let currentDiary = this.diaries[i]
                        if (diary.date > currentDiary.date) {
                            posInsert = i
                            break
                        }
                    }
                    this.diaries.splice(posInsert, 0, diary)
                    this.refreshDiariesShow()
                    break
                case 'delete':
                    this.diaries.map((item, index) => {
                        if (item.id === id) {
                            this.diaries.splice(index, 1)
                            if (this.diaries[index]) {
                                // 删除当前日记后，显示最近的一条日记，由于删除了一条，所以留下的 index 就是后面一个元素的 index
                                this.$router.push({
                                    name: 'Detail',
                                    params: {
                                        id: this.diaries[index].id
                                    }
                                })
                            } else {
                                // 如果没有，就跳转到主页
                                this.$router.push({
                                    name: 'Index'
                                })
                            }
                        }
                    })
                    this.refreshDiariesShow()
                    break
                case 'change':
                    // TODO: 修改日记的日期时排序调整位置
                    this.diaries.map((item, index) => {
                        if (Number(item.id) === Number(diary.id)) {
                            this.diaries.splice(index, 1, diary)
                        }
                    })
                    this.refreshDiariesShow()
                    break
            }
        }
    },
    methods: {
        ...mapMutations([
            'SET_KEYWORD',
            "SET_STATISTICS_CATEGORY",
            "SET_STATISTICS_YEAR",
            'SET_IS_LIST_NEED_BE_RELOAD',
            'SET_IS_SHOW_SEARCH_BAR',
            'SET_CATEGORY_ALL'
        ]),
        // 刷新 diaries show
        refreshDiariesShow(){
            console.log('diaries changed')
            let tempShowArray = []
            if (this.diaries.length > 0) { // 在开始时，先把头问月份和第一个日记加到数组中
                let lastDiary = this.diaries[0]
                let lastDiaryDateString = utility.dateFormatter(new Date(lastDiary.date), 'yyyy-MM-dd')
                tempShowArray.push({ // 添加年月
                    date: lastDiaryDateString.substring(0, 7)
                })
                let currentDay = Number(lastDiaryDateString.slice(8, 10))
                let tempDiary = {}
                Object.assign(tempDiary, lastDiary)
                tempDiary.date = currentDay
                tempDiary.isPublic = tempDiary.is_public === 1
                // 添加当前日记内容
                tempShowArray.push(tempDiary)

                if (this.diaries.length > 1) {  // 再判断第二个日记与第一个的关系
                    for (let i = 1; i < this.diaries.length; i++) {
                        lastDiary = this.diaries[i - 1] // 更新上一条日记指向
                        let currentDiary = this.diaries[i]
                        let lastDiaryDateString = utility.dateFormatter(new Date(lastDiary.date), 'yyyy-MM-dd')
                        let currentDiaryDateString = utility.dateFormatter(new Date(currentDiary.date), 'yyyy-MM-dd')
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
                        let tempDiary = {}
                        Object.assign(tempDiary, currentDiary)
                        tempDiary.isPublic = currentDiary.is_public === 1
                        // 判断前一个日记和后一个日记的日期字符串是否一致，‘年月日’ 搜索的时候可能会有月份不同但天数相同的情况，就会导致下一条的日期不会显示。
                        tempDiary.date = currentDiaryDateString === lastDiaryDateString ? '' : currentDiaryDay
                        tempShowArray.push(tempDiary) // 添加当前日记内容
                    }
                }
            }
            this.diariesShow = tempShowArray
        },

        /* MENU 相关 */
        search() {
            this.SET_KEYWORD(this.keywordShow.split(' '))
            this.reload()
        },
        clearKeyword() {
            this.keywordShow = ''
            this.search()
        },
        reload() {
            this.params.pageNo = 1
            this.params.keywords = JSON.stringify(this.keywords)
            this.diaries = []
            this.diariesShow = []
            this.loadMore()
        },

        /* DIARY 相关 */
        loadMore() {
            this.isHasMore = false
            this.isLoading = true
            this.params.categories = JSON.stringify(utility.getDiaryConfig().filteredCategories)
            this.params.dateFilter = utility.getDiaryConfig().dateFilter
            this.params.filterShared = utility.getDiaryConfig().isFilterShared ? 1 : 0
            this.getDiaries(this.params)
        },
        getDiaries(params) {
            diaryApi
                .list(params)
                .then(res => {
                    let newDiariesList = res.data.map(diary => {
                        if (diary.content) {
                            diary.contentHtml = diary.content.replace(/\n/g, '<br/>')
                        }
                        diary.categoryString = this.categoryNameMap.get(diary.category)
                        diary.weekday = utility.dateProcess(diary.date).weekday
                        diary.dateString = utility.dateProcess(diary.date).date
                        return diary
                    })

                    // page operation
                    if (res.data.length === this.params.pageSize) {
                        this.isHasMore = true
                        this.params.pageNo++
                    } else {
                        this.isHasMore = false
                    }

                    // diary operation
                    this.diaries = this.diaries.concat(newDiariesList)
                    this.refreshDiariesShow()
                })
                .finally(() => {
                    // 列表加载完成后设置列表重载： false
                    this.SET_IS_LIST_NEED_BE_RELOAD(false)
                    this.isLoading = false
                })
        },
        addScrollEvent() {
            document.querySelector('.diary-list-container').addEventListener('scroll', () => { // 由于这里用的箭头方法，所以这里的 This 指向的是 VUE app
                /* 判断是否加载内容*/
                function needLoadContent() {
                    let lastNode = document.querySelector('.diary-list-group > div:last-child')
                    if (!lastNode) {
                        return false
                    }
                    let lastOffsetTop = lastNode.offsetTop
                    let clientHeight = window.innerHeight
                    let listEl = document.querySelector('.diary-list-container')
                    let scrollTop = listEl.scrollTop
                    // console.clear()
                    // window.console.log(`${lastOffsetTop} | ${clientHeight} | ${scrollTop}`)
                    // 当 list 滚动到上面的部分 + 屏幕高度 >  最后一个元素的 offsetTop 的时候，就说明已经触底了
                    return (lastOffsetTop < clientHeight + scrollTop + innerHeight) // 添加 100% 触发高度
                }

                if (this.isHasMore && needLoadContent()) {
                    this.loadMore()
                }
            })
        },
    }
}

</script>

<style lang="scss" scoped>
@import "./list";
</style>
