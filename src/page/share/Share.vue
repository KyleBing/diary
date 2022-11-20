<template>
    <div class="share-container">
        <div class="share" :style="`min-height:${heightShare}px`">
            <!-- LOADING -->
            <div v-if="isLoadingDiary">
                <Loading :loading="isLoadingDiary"/>
            </div>

            <div v-else>
                <div v-if="diary.title">
                    <!--CONTENT-->
                    <div class="share-head">
                        <!--head-->
                        <div class="share-title">
                            <h2>{{ diary.title }}</h2>
                        </div>
                        <div class="share-date">
                            <div class="above">
                                <h3>{{ dateObj.weekday }} </h3>
                                <div class="share-category" :style="shareCategoryStyle">
                                    <span>{{ diary.categoryString }}</span>
                                </div>
                            </div>
                            <div class="bottom">{{ dateObj.dateFull }}</div>
                        </div>

                        <!--META-->
                        <div class="share-meta">
                            <div class="weather">
                                <img v-if="diary.weather"
                                     :src="icons.weather[`${diary.weather}_active`]"
                                     :alt="diary.weather">
                            </div>
                            <div class="temperature" v-if="diary.temperature || diary.temperatureOutside">
                                <span v-if="diary.temperature">{{ diary.temperature }}</span>
                                <span v-if="diary.temperature && diary.temperatureOutside"> / </span>
                                <span v-if="diary.temperatureOutside">{{ diary.temperatureOutside }}</span>
                                <span>℃</span>
                            </div>
                        </div>

                        <!--end of head-->
                    </div>

                    <div class="divider" v-if="diary.content"></div>

                    <!--CONTENT-->
                    <div class="share-content" v-html="diary.contentHtml"></div>

                    <div class="share-author">
                        <div class="line"></div>
                        <div class="name">
                            <div class="nickname">{{diary.nickname}}</div>
                            <div class="username">{{diary.username}}</div>
                        </div>
                    </div>
                </div>

                <!-- NO DIARY -->
                <div v-else class="no-diary">
                    <p>无此日记</p>
                </div>

                <!--TODO: 来自谁的日记-->
            </div>

        </div>
        <router-link class="back-link" to="/"><img src="../../assets/img/logo.svg" alt="logo">标题日记</router-link>

    </div>
</template>

<script>
import utility from "../../utility"
import {mapGetters, mapMutations, mapState} from "vuex"
import Loading from "@/components/Loading"
import diaryApi from "@/api/diaryApi"
import SvgIcons from "@/assets/img/SvgIcons"
import axios from "axios"

export default {
    name: 'Share',
    components: {Loading},
    data() {
        return {
            icons: SvgIcons,
            diary: {},
            dateObj: {},

            isShowToast: false,
            isLoadingDiary: false, // 日记请求中
        }
    },
    computed:{
        ...mapState(['categoryAll', 'insets']),
        ...mapGetters(['categoryNameMap', 'categoryObjectMap']),
        heightShare(){
            return this.insets.windowsWidth > 375 ? this.insets.windowsHeight - 60 - 100 : this.insets.windowsHeight
        },
        shareCategoryStyle(){
            return `background-color: ${this.categoryObjectMap.get(this.diary.category).color}`
        }
    },
    mounted() {
        this.getDiaryInfo(this.$route.params.id)
    },
    methods: {
        ...mapMutations([ 'SET_CATEGORY_ALL']),
        getDiaryInfo(diaryId){
            this.isLoadingDiary = true
            let requestData = {
                'diaryId': this.$route.params.id
            }
            diaryApi
                .detail(requestData)
                .then(res => {

                    // 日记信息
                    const diary = res.data

                    this.isLoadingDiary = false
                    this.diary = diary
                    this.dateObj = utility.dateProcess(diary.date)
                    document.title = '日记 - ' + this.dateObj.dateFull // 变更标题
                    if (this.diary.content) {
                        this.diary.contentHtml = this.getContentHtml(this.diary.content)
                    }
                    this.diary.temperature = utility.temperatureProcessSTC(diary.temperature)
                    this.diary.temperatureOutside = utility.temperatureProcessSTC(diary.temperature_outside)

                    // category map
                    let categoryNameMap = new Map()
                    this.categoryAll.forEach(item => {
                        categoryNameMap.set(item.name_en, item.name)
                    })
                    diary.categoryString = categoryNameMap.get(diary.category)

                })
                .catch(() => {
                    this.isLoadingDiary = false
                    this.diary = {}
                })
        },
        getContentHtml(content){
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
        },
    },
    watch: {
        '$route.params.id'(newValue) {
            this.getDiaryInfo(newValue)
        },
    }
}

</script>
