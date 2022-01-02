<template>
    <!--content-->
    <div class="diary-detail" id="diaryDetail" :style="`min-height: ${insets.heightPanel}px`">
        <!-- meta MOBILE-->
        <div class="diary-meta" v-if="isInMobileMode && !isLoading">
            <div class="date" >{{ diary.dateShort }}</div>
            <div class="weather">
                <img v-if="diary.weather" :src="$icons.weather[`${diary.weather}_active`]" :alt="diary.weather">
            </div>

            <div class="temperature" v-if="diary.temperature || diary.temperatureOutside">
                <span v-if="diary.temperature">{{ diary.temperature }}</span>
                <span v-if="diary.temperatureOutside">/{{ diary.temperatureOutside }}</span>
                <span> ℃</span>
            </div>

            <div :class="[`detail-category-${diary.category}`, 'detail-category']">
                <span>{{ diary.categoryString }}</span>
            </div>
        </div>

        <!-- meta PC-->
        <div class="diary-meta" v-else>
            <div class="date">{{ diary.dateLong }}</div>
            <div class="weather">
                <img v-if="diary.weather" :src="$icons.weather[`${diary.weather}_active`]" :alt="diary.weather">
            </div>

            <div class="temperature" v-if="diary.temperature">
                <span>内：{{ diary.temperature }} ℃</span>
            </div>
            <div class="temperature" v-if="diary.temperatureOutside">
                <span>外：{{ diary.temperatureOutside }} ℃</span>
            </div>

            <div :class="[`detail-category-${diary.category}`, 'detail-category']">
                <span>{{ diary.categoryString }}</span>
            </div>
        </div>


        <loading :loading="isLoading"></loading>


        <!--TITLE-->
        <div class="diary-title" v-if="diary.title">
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
import {mapGetters, mapMutations, mapState} from "vuex";
import Loading from "@/components/Loading";

export default {
    name: 'Detail',
    components: {Loading},
    data() {
        return {
            showToast: false,
            id: '',
            diary: {},
            isLoading: false, // loading

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
            utility.popMessage('success', '已复制到 剪贴板', null, 2)
        })
    },
    beforeDestroy() {
        this.clipboard.destroy()
    },
    computed:{
        ...mapState(['categoryAll', 'insets']),
        ...mapGetters(['isInMobileMode']),
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
            this.isLoading = true
            utility.getData(
                utility.URL.diaryOperation,
                {
                    type: 'query',
                    diaryId: id
                })
                .then(res => {
                    this.isLoading = false // loading off
                    let diary = res.data
                    this.diary = diary
                    this.setCurrentDiary(diary) // 设置 store: currentDiary
                    let dateOjb = utility.formatDate(diary.date)
                    document.title = '日记 - ' + dateOjb.dateFull // 变更当前标签的 Title
                    this.diary.dateLong = dateOjb.date + ' ' + dateOjb.weekday + ' ' + dateOjb.timeName + ' ' + dateOjb.time
                    this.diary.dateShort = dateOjb.date + ' ' + dateOjb.weekday +  ' ' + dateOjb.time
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
                    this.diary.temperature = utility.temperatureProcessSTC(diary.temperature)
                    this.diary.temperatureOutside = utility.temperatureProcessCTS(diary.temperature)

                    // category map
                    let categoryMap = new Map()
                    this.categoryAll.forEach(item => {
                        categoryMap.set(item.nameEn, item.name)
                    })
                    diary.categoryString = categoryMap.get(diary.category)
                })
                .catch(() => {
                    this.isLoading = false // loading off
                    this.$router.back()
                })
        },
    }
}

</script>
