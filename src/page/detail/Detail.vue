<template>
    <div class="diary-detail" id="diaryDetail" :style="`min-height: ${insets.heightPanel}px`">

            <DetailHeader
                :isLoading="isLoading"
                :diary="diary"
                :lunar-object="lunarObject"
            />

            <!-- pc 时不显示展示加载图标 -->
            <loading :loading="isLoading" v-if="isInMobileMode"/>

            <!--TITLE-->
            <div class="diary-title" v-if="diary.title">
                <h2>{{ isHideContent ? diary.title.replace(/[^，。 \n]/g, '*') : diary.title }}</h2>
                <div class="toolbar">
                    <ButtonNormal class="clipboard" v-if="!isInMobileMode" :data-clipboard="diary.title">复制</ButtonNormal>
                </div>
            </div>

            <!--CONTENT-->
            <div class="diary-content" v-if="diary.content">

                <div class="toolbar">
                    <ButtonNormal class="clipboard" v-if="!isInMobileMode" :data-clipboard="diary.content">全部复制</ButtonNormal>
                    <ButtonNormal class="clipboard" v-if="isShowExplode" @click="toggleContentType">普通</ButtonNormal>
                    <ButtonNormal class="clipboard" v-else @click="toggleContentType">炸词</ButtonNormal>
                </div>

                <div v-if="isShowExplode">
                    <WordExplode v-if="diary.content" :content="diary.content"/>
                </div>

                <div v-else>
                    <div v-if="diary.is_markdown === 1 && !isHideContent" class="markdown" v-html="contentMarkDownHtml"/>
                    <div v-else class="content" v-html="getContentHtml(diary.content)"/>
                </div>
            </div>

        </div>
</template>

<script>
import ClipboardJS from "clipboard"
import utility from "../../utility"
import {mapGetters, mapMutations, mapState} from "vuex"
import Loading from "../../components/Loading"
import diaryApi from "../../api/diaryApi"
import SvgIcons from "../../assets/img/SvgIcons"
import {marked} from "marked"
import calendar from "js-calendar-converter";
import Moment from "moment";
import DetailHeader from "@/page/detail/DetailHeader";
import WordExplode from "@/page/detail/WordExplode";
import ButtonNormal from "@/components/ButtonNormal";

export default {
    name: 'Detail',
    components: {ButtonNormal, WordExplode, DetailHeader, Loading},
    data() {
        return {
            isShowToast: false,
            isLoading: false, // loading
            diary: {},
            icons: SvgIcons,
            clipboard: null, // clipboard obj
            lunarObject: {},

            isShowExplode: false,
        }
    },
    mounted() {
        // 初始化时，载入第一次点击的 id 内容
        if (this.$route.params.id){
            this.showDiary(this.$route.params.id)
        }

        // 绑定剪贴板操作方法
        this.clipboard = new ClipboardJS('.clipboard', {
            text: trigger => {
                return trigger.getAttribute('data-clipboard')
            },
        })
        this.clipboard.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
            utility.popMessage('success', '已复制到 剪贴板', null, 1)
        })
    },
    beforeUnmount() {
        this.clipboard.destroy()
    },
    computed:{
        ...mapState(['categoryAll', 'insets', 'isHideContent']),
        ...mapGetters(['isInMobileMode', 'categoryNameMap', 'categoryObjectMap']),

        contentMarkDownHtml(){
            return marked.parse(this.diary.content)
        }
    },
    watch: {
        '$route.params.id'(newValue){
            if (newValue){
                this.showDiary(newValue)
            }
        }
    },
    methods: {
        ...mapMutations([
            'SET_CURRENT_DIARY',
            'SET_CATEGORY_ALL',
        ]),

        toggleContentType(){
            this.isShowExplode = !this.isShowExplode
        },
        goBack() {
            this.$router.back()
        },
        show() {
            this.isShowToast = true
        },
        hide() {
            this.isShowToast = false
        },
        getContentHtml(content){
            let isInCodeMode = /\[ ?code ?\]/i.test(content)

            if (isInCodeMode){
                return `<pre class="code">${this.isHideContent? content.replace(/[^，。 \n]/g, '*'): content}</pre>`
            } else {
                let contentArray = content.split('\n')
                let contentHtml = ""
                contentArray.forEach(item => {
                    if (item === ''){
                        contentHtml += '<br/>'
                    } else {
                        contentHtml += `<p>${this.isHideContent ? item.replace(/[^，。 \n]/g, '*'): item}</p>`
                    }
                })
                return contentHtml
            }

        },
        showDiary(id) {
            this.isLoading = true
            let requestData = {diaryId: id}
            diaryApi
                .detail(requestData)
                .then(res => {
                    this.isLoading = false // loading off
                    let diary = res.data
                    this.diary = diary
                    let dateMoment = new Moment(this.diary.date)
                    this.lunarObject = calendar.solar2lunar(dateMoment.year(), dateMoment.month()+1, dateMoment.date())
                    this.SET_CURRENT_DIARY(diary) // 设置 store: currentDiary
                    let dateObj = utility.dateProcess(diary.date)
                    this.diary.dateObj = dateObj
                    document.title = '日记 - ' + dateObj.dateFull // 变更当前标签的 Title
                    this.diary.temperature = utility.temperatureProcessSTC(diary.temperature)
                    this.diary.temperatureOutside = utility.temperatureProcessSTC(diary.temperature_outside)

                    diary.categoryString = this.categoryNameMap.get(diary.category)
                })
                .catch(() => {
                    this.isLoading = false // loading off
                    this.$router.push({name: 'List'})
                })
        },
    }
}

</script>

<style lang="scss">
@import "detail";
</style>
