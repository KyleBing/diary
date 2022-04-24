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
                                <div :class="[`share-category-${diary.category}`, 'share-category']">
                                    <span>{{ diary.categoryString }}</span>
                                </div>
                            </div>
                            <div class="bottom">{{ dateObj.dateFull }}</div>
                        </div>

                        <!--META-->
                        <div class="share-meta">
                            <div class="weather">
                                <img v-if="diary.weather"
                                     :src="$icons.weather[`${diary.weather}_active`]"
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
                </div>

                <!-- NO DIARY -->
                <div v-else class="no-diary">
                    <p>无此日记</p>
                </div>

                <!--TODO: 来自谁的日记-->
            </div>

        </div>
        <router-link class="back-link" to="/"><img src="../assets/img/logo.svg" alt="logo">标题日记</router-link>

    </div>
</template>

<script>
import utility from "../utility"
import {mapState} from "vuex";
import Loading from "@/components/Loading";
import diaryApi from "@/api/diaryApi";

export default {
    name: 'Share',
    components: {Loading},
    data() {
        return {
            showToast: false,
            id: '',
            diary: {},
            dateObj: {},
            heightShare: 0,

            isLoadingDiary: false, // 日记请求中
        }
    },
    computed:{
        ...mapState(['categoryAll'])
    },
    mounted() {
        if (this.$route.params.id) {
            this.id = this.$route.params.id
        }
        this.heightShare = window.innerWidth > 375 ? window.innerHeight - 60 - 100 : window.innerHeight
        window.onresize = () => {
            this.heightShare = window.innerWidth > 375 ? window.innerHeight - 60 - 100 : window.innerHeight
        }
    },
    watch: {
        $route(to) {
            if (to.params.id) {
                this.id = to.params.id
            }
        },
        id() {
            this.isLoadingDiary = true
            let requestData = {
                'diaryId': this.id
            }
            diaryApi.detail(requestData)
                .then(res => {
                    this.isLoadingDiary = false
                    let diary = res.data
                    this.diary = diary
                    this.dateObj = utility.formatDate(diary.date)
                    document.title = '日记 - ' + this.dateObj.dateFull // 变更标题
                    if (this.diary.content) {
                        let contentArray = diary.content.split('\n')
                        let contentHtml = ""
                        contentArray.forEach(item => {
                            contentHtml += `<p>${item}</p>`
                        })
                        this.diary.contentHtml = contentHtml
                    }
                    this.diary.temperature = utility.temperatureProcessSTC(diary.temperature)
                    this.diary.temperatureOutside = utility.temperatureProcessSTC(diary.temperature_outside)

                    // category map
                    let categoryMap = new Map()
                    this.categoryAll.forEach(item => {
                        categoryMap.set(item.nameEn, item.name)
                    })
                    diary.categoryString = categoryMap.get(diary.category)
                })
                .catch(() => {
                    this.isLoadingDiary = false
                    this.diary = {}
                })
        }
    }
}

</script>
