<template>
    <!--content-->
    <div class="diary-detail" id="diaryDetail" :style="`min-height: ${insets.heightPanel}px`">
        <!-- meta MOBILE-->
        <div class="diary-meta" v-if="isInMobileMode && !isLoading">
            <div class="date" >{{ diary.dateShort }}</div>
            <div class="weather">
                <img v-if="diary.weather" :src="icons.weather[`${diary.weather}_active`]" :alt="diary.weather">
            </div>

            <div class="temperature" v-if="diary.temperature || diary.temperatureOutside">
                <span v-if="diary.temperature">{{ diary.temperature }}</span>
                <span v-if="diary.temperatureOutside && diary.temperature"> / </span>
                <span v-if="diary.temperatureOutside">{{ diary.temperatureOutside }}</span>
                <span> ℃</span>
            </div>

            <div class="detail-category" :style="categoryBgColor">
                <span>{{ diary.categoryString }}</span>
            </div>
        </div>

        <!-- meta PC-->
        <div class="diary-meta" v-else>
            <div class="date">{{ diary.dateLong }}</div>
            <div class="weather">
                <img v-if="diary.weather" :src="icons.weather[`${diary.weather}_active`]" :alt="diary.weather">
            </div>

            <div class="temperature" v-if="diary.temperature">
                身处 <span :class="['temperature-number', getTemperatureClassName(Number(diary.temperature))]">{{ diary.temperature }}</span> ℃
            </div>
            <div class="temperature" v-if="diary.temperatureOutside">
                室外 <span :class="['temperature-number', getTemperatureClassName(Number(diary.temperatureOutside))]">{{ diary.temperatureOutside }}</span> ℃
            </div>

            <div class="detail-category" :style="categoryBgColor">
                <span>{{ diary.categoryString }}</span>
            </div>
        </div>

        <!-- pc 时不显示展示加载图标 -->
        <loading :loading="isLoading" v-if="isInMobileMode"/>

        <!--TITLE-->
        <div class="diary-title" v-if="diary.title">
            <h2>{{ isHideContent ? diary.title.replace(/[^，。]/g, '*') : diary.title }}</h2>
            <div class="clipboard ml-1" v-if="!isInMobileMode" :data-clipboard="diary.title">
                <img :src="icons.clipboard" alt="clipboard">
            </div>
        </div>

        <!--CONTENT-->
        <div class="diary-content" v-if="diary.content">
            <div v-if="diary.is_markdown === 1" class="markdown" v-html="contentMarkDownHtml"/>
            <div v-else class="content" v-html="getContentHtml(diary.content)"/>
            <div class="clipboard ml-1" v-if="!isInMobileMode" :data-clipboard="diary.content">
                <img :src="icons.clipboard" alt="clipboard">
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

export default {
    name: 'Detail',
    components: {Loading},
    data() {
        return {
            isShowToast: false,
            isLoading: false, // loading
            diary: {},
            icons: SvgIcons,
            clipboard: null, // clipboard obj
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
        categoryBgColor(){
            if (this.diary && this.diary.category){
                return `background-color: ${this.categoryObjectMap.get(this.diary.category).color}`
            } else {
                return ''
            }
        },
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
        getTemperatureClassName(temperature){
            if (temperature >= 35){
                return 'temperature-35'
            } else if (temperature < 35 && temperature >= 28){
                return 'temperature-35-28'
            } else if (temperature < 28 && temperature >= 22){
                return 'temperature-28-22'
            } else if (temperature < 22 && temperature >= 15) {
                return 'temperature-22-15'
            } else if (temperature < 15 && temperature >= 4) {
                return 'temperature-15-4'
            } else if (temperature < 4) {
                return 'temperature-4'
            }
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
                return `<pre class="code">${content}</pre>`
            } else {
                let contentArray = content.split('\n')
                let contentHtml = ""
                contentArray.forEach(item => {
                    if (item === ''){
                        contentHtml += '<br/>'
                    } else {
                        contentHtml += `<p>${this.isHideContent ? item.replace(/[^，。]/g, '*'): item}</p>`
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
                    this.SET_CURRENT_DIARY(diary) // 设置 store: currentDiary
                    let dateOjb = utility.dateProcess(diary.date)
                    document.title = '日记 - ' + dateOjb.dateFull // 变更当前标签的 Title
                    if (dateOjb.year === new Date().getFullYear()){ // 当不是本年时
                        this.diary.dateLong = dateOjb.date + ' ' + dateOjb.weekday + ' ' + dateOjb.timeLabel + ' ' + dateOjb.time
                        this.diary.dateShort = dateOjb.date + ' ' + dateOjb.weekday +  ' ' + dateOjb.time
                    } else {
                        if (this.isInMobileMode){ // 手机模式时，显示压缩版的日期
                            this.diary.dateLong = dateOjb.dateFullSlash + ' ' + dateOjb.weekday + ' ' + dateOjb.timeLabel + ' ' + dateOjb.time
                            this.diary.dateShort = dateOjb.dateFullSlash + ' ' + dateOjb.weekday +  ' ' + dateOjb.time
                        } else {
                            this.diary.dateLong = dateOjb.dateFull + ' ' + dateOjb.weekday + ' ' + dateOjb.timeLabel + ' ' + dateOjb.time
                            this.diary.dateShort = dateOjb.dateFull + ' ' + dateOjb.weekday +  ' ' + dateOjb.time
                        }
                    }
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
