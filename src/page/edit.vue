<template>
    <div class="body-normal" :style="'min-height:' + heightBg + 'px'">
        <!-- navbar -->
        <nav class="navbar" id="navbar">
            <div class="navbar-btn-group left">
                <img alt="返回" @click="goBack" src="img/tabicon/back.svg">
            </div>
            <div class="navbar-btn-group right">
                <img @click="createDiary" alt="新建" src="img/tabicon/add.svg">
                <img @click="saveDiary" alt="保存" src="img/tabicon/done.svg">
            </div>
            <div class="brand">
                <a><img :src="logoImageUrl" alt="日记"></a>
            </div>
        </nav>

        <!--content-->
        <div class="container" id="this">
            <div class="editor-title">
                <textarea id="diary-editor-title" placeholder="一句话，概括你的一天" v-model="title"></textarea>
            </div>
            <div class="editor-content">
                <textarea class="diary-editor-content" placeholder="日记详细内容，如果你有很多要写的" v-model="content"></textarea>
            </div>
            <div class="editor-input-group">
                <label for="date">日期</label>
                <date-picker :editable="false"
                             v-model="date"
                             :confirm="true"
                             :default-value="new Date()"
                             placeholder="---- -- --"
                             input-class="date"
                             :clearable="false" id="date" type="datetime"/>
            </div>
            <div class="editor-input-group">
                <label for="temperature">身处 ℃</label>
                <input placeholder="--" class="temperature" type="number" name="temperature" id="temperature" v-model="temperature">
            </div>
            <div class="editor-input-group">
                <label for="temperatureOutside">室外 ℃</label>
                <input placeholder="--" class="temperature" type="number" name="temperature" id="temperatureOutside" v-model="temperatureOutside">
            </div>
            <div class="editor-input-group">
                <label for="shareState">共享</label>
                <div class="input">
                    <input class="share" type="checkbox" name="share" id="shareState" v-model="isPublic">
                    <label class="switch" for="shareState"></label>
                </div>
            </div>
            <category-selector @change="setCategory"/>
            <weather-selector :weather="weather" @change="setWeather"/>
        </div>
    </div>
</template>

<script>
import utility from "../utility"
import categorySelector from "../components/categorySelector"
import weatherSelector from "../components/weatherSelector"
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/locale/zh-cn'
import 'vue2-datepicker/index.css'
import axios from "axios";

export default {
    data() {
        return {
            isNew: true,

            id: "",
            title: "",
            titleOrigin: "",
            content: "",
            contentOrigin: "",
            isPublic: false,
            date: '',
            weather: '',
            temperature: '-273',
            temperatureOutside: '-273',
            heightBg: 0,
            logoImageUrl: 'img/logo.svg'
        }
    },
    components: {categorySelector, weatherSelector, DatePicker},
    mounted() {
        this.heightBg = window.innerHeight
        this.id = this.$route.params.id

        // this.date = new Date()
        // 标签关闭提醒
        window.onbeforeunload = () => {
            if (this.diaryHasChanged) {
                return "日记内容已改变，显示提示框"
            }
        }
        this.isNew = !(this.$route.params.id)
        if (this.isNew) {
            // 新建日记
            this.id = ''
            this.date = new Date()
            this.title = ''
            this.content = ''
            this.category = 'life'
            this.temperature = ''
            this.temperatureOutside = ''
            this.weather = 'sunny'
            this.getCurrentTemperature() // 获取当前天气信息
            this.updateDiaryIcon()
        } else {
            // 编辑日记
            utility.getData(utility.URL.diaryOperation, {
                'type': 'query',
                'diaryId': this.id
            }).then(res => {
                let diary = res.data
                this.category = diary.category
                this.date = new Date(diary.date.replace(' ', 'T')); // safari 只识别 2020-10-27T14:35:33 格式的日期
                this.temperature = diary.temperature
                this.weather = diary.weather
                this.title = diary.title
                this.titleOrigin = diary.title
                this.content = diary.content
                this.contentOrigin = diary.content
                this.isPublic = diary.is_public === '1'
                this.temperature = diary.temperature === '-273' ? '' : diary.temperature
                this.temperatureOutside = diary.temperature_outside === '-273' ? '' : diary.temperature_outside
            })
        }
    },

    watch: {
        title: function () {
            this.updateDiaryIcon()
        },
        content: function () {
            this.updateDiaryIcon()
        },
    },
    methods: {
        getCurrentTemperature() {
            axios
                .get('https://devapi.qweather.com/v7/weather/now',
                    {
                        params: {
                            key: 'c5894aea6ce2495ca0f78a2963c04d57',
                            location: '117.109678,36.695865'
                        }
                    })
                .then(res => {
                    if (res.data.code === '200') {
                        this.temperatureOutside = res.data.now.temp
                        this.weather = getWeatherNameFromCode(res.data.now.icon)
                    }
                })
        },
        goBack() {
            this.$router.back()
        },
        setCategory(data) {
            this.category = data
        },
        setWeather(data) {
            this.weather = data
        },
        updateDiaryIcon() {
            if (this.diaryHasChanged) {
                this.logoImageUrl = this.content ? 'img/logo_content.svg' : 'img/logo_title.svg'
            } else {
                this.logoImageUrl = this.content ? 'img/logo_content_saved.svg' : 'img/logo_title_saved.svg'
            }
        },
        saveDiary() {
            if (this.title.trim().length === 0) {
                this.title = ''; // clear content
                utility.popMessage(utility.POP_MSG_TYPE.warning, '内容未填写', null)
                return
            }
            if (this.temperature !== '' && !/^-?\d{1,2}$/.test(this.temperature)) {
                utility.popMessage(utility.POP_MSG_TYPE.warning, '温度格式不正确', null)
                return
            }
            if (this.temperature !== '' && !/^-?\d{1,2}$/.test(this.temperature)) {
                utility.popMessage(utility.POP_MSG_TYPE.warning, '温度格式不正确', null)
                return
            }
            let queryData = {
                diaryId: this.id,
                diaryTitle: this.title,
                diaryContent: this.content || null,
                diaryCategory: this.category,
                diaryTemperature: this.temperature === '' ? -273 : this.temperature,
                diaryTemperatureOutside: this.temperatureOutside === '' ? -273 : this.temperatureOutside,
                diaryWeather: this.weather,
                diaryPublic: this.isPublic ? '1' : '0',
                diaryDate: utility.dateFormatter(this.date),
                type: this.isNew ? 'add' : 'modify'
            }

            utility.postData(utility.URL.diaryOperation, queryData).then(res => {
                // 成功后更新 origin 字符串
                this.titleOrigin = this.title
                this.contentOrigin = this.content
                this.updateDiaryIcon()

                utility.popMessage(utility.POP_MSG_TYPE.success, res.info); // 提示
                if (res.data) {
                    this.isNew = false
                    this.id = res.data.id
                }
            })
        },
        createDiary() {
            this.isNew = true
            this.title = ''
            this.titleOrigin = ''
            this.content = ''
            this.contentOrigin = ''
            this.id = ''
            this.isPublic = false
            this.category = 'life'
            this.temperature = ''
            this.temperatureOutside = ''
            this.weather = 'sunny'
        },
    },
    computed: {
        diaryHasChanged() {
            return this.title !== this.titleOrigin || this.content !== this.contentOrigin
        }
    },
}

// 和风天气 API 天气图标对应： https://dev.qweather.com/docs/start/icons/
function getWeatherNameFromCode(code) {
    let weatherDict = new Map([
        ['100', 'sunny'],  //晴
        ['101', 'cloudy'],  //多云
        ['104', 'overcast'],  //阴
        ['305', 'sprinkle'],  //小雨
        ['306', 'rain'],  //中雨
        ['310', 'thunderstorm'],  //暴雨
        ['499', 'snow'],  //雪
        ['501', 'fog'],  //雾
        ['507', 'sandstorm'],  //沙尘暴
        ['502', 'smog'],  //霾
    ])
    return weatherDict.get(code) || 'sunny'
}
</script>

<style lang="scss">
// 重置 Vue2-datepicker 样式
.mx-icon-clear, .mx-icon-calendar {
    display: none
}
</style>
