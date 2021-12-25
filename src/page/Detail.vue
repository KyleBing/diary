<template>
    <!--content-->
    <div class="diary-detail" id="diaryDetail">
        <!--META-->
        <div class="diary-meta">
            <div class="date">{{ diary.date }}</div>
            <div class="weather">
                <img v-if="diary.weather" :src="$icons.weather[`${diary.weather}_active`]" :alt="diary.weather">
            </div>

            <div class="temperature" v-if="diary.temperature">
                <span>内：{{ diary.temperature }} ℃</span>
            </div>
            <div class="temperature" v-if="diary.temperatureOutside">
                <span>外：{{ diary.temperatureOutside }} ℃</span>
            </div>
            <div :class="[`detail-category-${diary.category}`, 'detail-category']"><span>{{ diary.categoryName }}</span>
            </div>
        </div>
        <!--TITLE-->
        <div class="diary-title">
            <h2>{{ diary.title }}</h2>
            <div class="clipboard ml-1" :data-clipboard="diary.title">
                <img :src="$icons.clipboard" alt="clipboard">
            </div>
        </div>

        <!--CONTENT-->
        <div class="diary-content" v-if="diary.content">
            <div class="content" v-html="diary.contentHtml"/>
            <div class="clipboard ml-1" :data-clipboard="diary.content">
                <img :src="$icons.clipboard" alt="clipboard">
            </div>
        </div>
    </div>
</template>

<script>
import ClipboardJS from "clipboard";
import utility from "../utility"
import {mapMutations} from "vuex";

export default {
    name: 'Detail',
    data() {
        return {
            showToast: false,
            id: '',
            diary: {},

            clipboard: null // clipboard obj
        }
    },
    mounted() {
        this.id = this.$route.params.id
        this.showDiary(this.id)
        // 绑定剪贴板操作方法
        this.clipboard = new ClipboardJS('.clipboard', {
            text: trigger => {
                return trigger.getAttribute('data-clipboard')
            },
        })
        this.clipboard.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
            utility.popMessage(utility.POP_MSG_TYPE.success, '已复制到 剪贴板', null, 2)
        })
    },
    beforeDestroy() {
        this.clipboard.destroy()
    },
    watch: {
        $route(to) {
            this.showDiary(to.params.id)
        }
    },
    methods: {
        ...mapMutations(['setCurrentDiary']),
        goBack() {
            this.$router.back()
        },
        show() {
            this.showToast = true
        },
        hide() {
            this.showToast = false
        },
        showDiary(id) {
            utility.getData(
                utility.URL.diaryOperation,
                {
                    type: 'query',
                    diaryId: id
                })
                .then(res => {
                    let diary = res.data
                    this.diary = diary
                    this.setCurrentDiary(diary) // 设置 store: currentDiary
                    let dateOjb = utility.formatDate(diary.date)
                    document.title = '日记 - ' + dateOjb.dateFull // 变更当前标签的 Title
                    this.diary.date = dateOjb.date + ' ' + dateOjb.weekday + ' ' + dateOjb.timeName + ' ' + dateOjb.time
                    if (diary.content) {
                        let contentArray = diary.content.split('\n')
                        let contentHtml = ""
                        contentArray.forEach(item => {
                            if (item === ''){
                                contentHtml += '<br/>'
                            } else {
                                contentHtml += `<p>${item}</p>`
                            }
                        })
                        this.diary.contentHtml = contentHtml
                    }
                    this.diary.temperature = diary.temperature === '-273' ? '' : diary.temperature
                    this.diary.temperatureOutside = diary.temperature_outside === '-273' ? '' : diary.temperature_outside
                    this.diary.categoryName = utility.CATEGORIES[diary.category]
                })
                .catch(() => {
                    this.$router.back()
                })
        },
    }
}

</script>
