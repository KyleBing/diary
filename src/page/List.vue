<template>
    <div class="diary-list-group-container" :style="`min-height: ${insets.heightPanel}px`">
        <div class="search-bar" v-show="isShowSearchBar">
            <form @submit.prevent="search">
                <input id="keyword" type="text" placeholder="搜索内容" v-model="keywordShow">
                <span v-show="keywordShow.length > 0" @click="clearKeyword" class="clear">✕</span>
            </form>
        </div>

        <div class="diary-list-group" v-if="!diaryListShowedInFullStyle">
            <div v-for="(item, index) in diariesShow" :key="index">
                <div v-if="!item.title" class="list-header">{{ item.date.split('-').join(' - ') }}</div>
                <diary-list-item v-else :category="item.category" :diary="item"/>
            </div>
        </div>

        <div class="diary-list-group" v-else>
            <div v-for="(item, index) in diaries" :key="index">
                <div v-if="!item.title" class="list-header">{{ item.date }}</div>
                <diary-list-item-long v-else :diary="item"/>
            </div>
        </div>

        <div class="pt-4 pb-4" v-if="isLoading">
            <loading :loading="isLoading"/>
        </div>

        <div v-show="!isLoading && !haveMore" class="end-of-diary">

            <div class="no-diary-list" v-if="diaries.length < 1">无日记</div>

            <p><img :src="$icons.EOF" alt="EOF"></p>
        </div>
    </div>
</template>

<script>
import utility from "../utility"
import diaryListItem from "../components/DiaryListItem"
import diaryListItemLong from "../components/DiaryListItemLong"
import {mapState, mapMutations} from 'vuex'
import Loading from "@/components/Loading"
import diaryApi from "@/api/diaryApi";

export default {
    name: 'List',
    data() {
        return {
            showDiaryList: true,

            haveMore: true,
            isLoading: true,

            keywordShow: '', // 关键词

            requestData: {
                keywords: [],
                pageNo: 1,
                pageCount: 100, // 单页请求条数
                categories: [],
                filterShared: 0, // 1 是筛选，0 是不筛选
                dateFilter: '' // 日记年月筛选
            },
            diaries: [],
            diariesShow: [],
        }
    },
    components: {Loading, diaryListItem, diaryListItemLong},
    mounted() {
        document.title = '日记' // 变更标题
        // init
        this.keywordShow = utility.getDiaryConfig().keywords && utility.getDiaryConfig().keywords.join(' ')
        this.reload()
        this.addScrollEvent()
        this.SET_IS_SHOW_SEARCH_BAR(!!this.keywordShow)
    },

    computed: {
        ...mapState([
            'keywords',
            'categoryAll',
            'diaryListShowedInFullStyle',
            'listNeedBeReload',
            'listOperation',
            'isShowSearchBar',
            'insets'
        ])
    },
    watch: {
        // route 载入 `/` 路径时，重载日记列表：比如删除日记后
        $route(to) {
            if (to.path === '/') {
                this.reload()
            }
        },
        keywordShow(newValue){
            this.SET_KEYWORD(newValue.split(' '))
        },
        diaries() {
            let tempShowArray = []
            if (this.diaries.length > 0) { // 在开始时，先把头问月份和第一个日记加到数组中
                let lastDiary = this.diaries[0]
                tempShowArray.push({ // 添加年月
                    date: lastDiary.date.substring(0, 7)
                })
                let currentDay = Number(lastDiary.date.slice(8, 10))
                tempShowArray.push({  // 添加当前日记内容
                    id: lastDiary.id,
                    date: currentDay,
                    title: lastDiary.title,
                    content: lastDiary.content,
                    weather: lastDiary.weather,
                    category: lastDiary.category,
                    isPublic: lastDiary.is_public === '1'
                })

                if (this.diaries.length > 1) {  // 再判断第二个日记与第一个的关系
                    for (let i = 1; i < this.diaries.length; i++) {
                        lastDiary = this.diaries[i - 1] // 更新上一条日记指向
                        let currentDiary = this.diaries[i]
                        let lastDiaryMonth = lastDiary.date.substring(0, 7)
                        let lastDiaryDay = Number(lastDiary.date.substring(8, 10))
                        let currentDiaryMonth = currentDiary.date.substring(0, 7)
                        let currentDiaryDay = Number(currentDiary.date.substring(8, 10))
                        // console.log(lastDiaryMonth, currentDiaryMonth)
                        if (lastDiaryMonth !== currentDiaryMonth) {
                            tempShowArray.push({ // 添加年月
                                date: currentDiary.date.substring(0, 7)
                            })
                        }
                        tempShowArray.push({  // 添加当前日记内容
                            id: currentDiary.id,
                            date: currentDiaryDay === lastDiaryDay ? '' : currentDiaryDay,
                            title: currentDiary.title,
                            content: currentDiary.content,
                            weather: currentDiary.weather,
                            category: currentDiary.category,
                            isPublic: currentDiary.is_public === 1
                        })
                    }
                }
            }
            this.diariesShow = tempShowArray
        },
        listNeedBeReload() {
            if (this.listNeedBeReload) {
                this.reload()
            }
        },
        listOperation({type, diary, id}) {
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
                    break
                case 'delete':
                    this.diaries.map((item, index) => {
                        if (item.id === id) {
                            this.diaries.splice(index, 1)
                            if (this.diaries[index]) {
                                // 删除当前日记后，显示最近的一条日记，由于删除了一条，所以留下的 index 就是后面一个元素的 index
                                this.$router.push('/detail/' + this.diaries[index].id)
                            } else {
                                // 如果没有，就跳转到主页
                                this.$router.push('/')
                            }
                        }
                    })
                    break
                case 'change':
                    // TODO: 修改日记的日期时排序调整位置
                    this.diaries.map((item, index) => {
                        if (Number(item.id) === Number(diary.id)) {
                            this.diaries.splice(index, 1, diary)
                        }
                    })
                    break
            }
        }
    },
    methods: {
        ...mapMutations([
            'SET_KEYWORD',
            "SET_STATISTICS_CATEGORY",
            "SET_STATISTICS_YEAR",
            'SET_LIST_NEED_BE_RELOAD',
            'SET_IS_SHOW_SEARCH_BAR']
        ),
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
            this.requestData.pageNo = 1
            this.requestData.keywords = JSON.stringify(this.keywords)
            this.diaries = []
            this.diariesShow = []
            this.loadMore()
        },

        /* DIARY 相关 */
        loadMore() {
            this.haveMore = false
            this.isLoading = true
            this.requestData.categories = JSON.stringify(utility.getDiaryConfig().filteredCategories)
            this.requestData.dateFilter = utility.getDiaryConfig().dateFilter
            this.requestData.filterShared = utility.getDiaryConfig().isFilterShared ? 1 : 0
            this.getDiaries(this.requestData)
        },
        getDiaries(requestData) {
            diaryApi.list(requestData)
                .then(res => {
                    let newDiariesList = res.data.map(diary => {
                        if (diary.content) {
                            diary.content = diary.content.replace(/\n/g, '<br/>')
                        }

                        // category map
                        let categoryMap = new Map()
                        this.categoryAll.forEach(item => {
                            categoryMap.set(item.nameEn, item.name)
                        })
                        diary.categoryString = categoryMap.get(diary.category)

                        diary.weekday = utility.dateProcess(diary.date).weekday
                        diary.dateString = utility.dateProcess(diary.date).date
                        return diary
                    })

                    // page operation
                    if (res.data.length === this.requestData.pageCount) {
                        this.haveMore = true
                        this.requestData.pageNo++
                    } else {
                        this.haveMore = false
                    }

                    // diary operation
                    this.diaries = this.diaries.concat(newDiariesList)
                })
                .finally(() => {
                    // 列表加载完成后设置列表重载： false
                    this.SET_LIST_NEED_BE_RELOAD(false)
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

                if (this.haveMore && needLoadContent()) {
                    this.loadMore()
                }
            })
        },
    }
}

</script>

