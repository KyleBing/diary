<template>
    <div class="diary-edit" :style="`min-height: ${insets.heightPanel}px`">
        <div class="editor-container">
            <!-- TITLE -->
            <div class="editor-title">
                <label  class="hidden"></label>
                <textarea ref="diaryTitle"
                          class="title" style="height: 150px"
                          placeholder="一句话，概括你的一天"
                          v-model="diary.title"/>
            </div>
            <!-- CONTENT -->
            <div class="editor-content">
                <label class="hidden"></label>
                <textarea class="content"
                          ref="diaryContent"
                          :style="insets.windowsWidth > 1440 ? `height: ${insets.heightPanel - 150 - 40 - 20}px`: ''"
                          placeholder="日记详细内容，如果你有很多要写的"
                          v-model="diary.content"/>
            </div>
        </div>
        <div class="meta-container">

            <!-- Category Selector -->
            <category-selector
                class="editor-form-category"
                :category="diary.category"
                @change="setCategory"
            />

            <div class="editor-form-input">
                <!-- DATE -->
                <div class="editor-input-item">
                    <label>日期</label>
                    <Datepicker :editable="false"
                                :show-now-button="true"
                                v-model="diary.date"
                                format="yyyy-MM-dd HH:mm:ss"
                                selectText="确定"
                                cancelText="取消"
                                locale="zh-CN"
                                placeholder="---- -- --"
                                input-class="date"
                                :clearable="false"
                    />
                </div>
                <!-- TEMPERATURE -->
                <div class="editor-input-item">
                    <label for="temperature">身处 ℃</label>
                    <input placeholder="--"
                           class="temperature"
                           type="number"
                           name="temperature"
                           id="temperature"
                           v-model="diary.temperature"
                    >
                </div>
                <div class="editor-input-item">
                    <label for="temperatureOutside">室外 ℃</label>
                    <input placeholder="--"
                           class="temperature"
                           type="number"
                           name="temperature"
                           id="temperatureOutside"
                           v-model="diary.temperatureOutside"
                    >
                    <div class="refresh" @click="getCurrentTemperature">刷新</div>
                </div>
                <div class="editor-input-item">
                    <label for="shareState">共享</label>
                    <div class="input">
                        <input class="share"
                               type="checkbox"
                               name="share"
                               id="shareState"
                               v-model="diary.isPublic"
                        >
                        <label class="switch" for="shareState"></label>
                    </div>
                </div>
            </div>

            <diary-btn :is-loading="isLoading" type="light"
                       v-if="diary.category === 'week'"
                       @click="loadCurrentWeekLogs">载入本周工作日志</diary-btn>
            <weather-selector
                class="editor-form-weather"
                :weather="diary.weather"
                @change="setWeather"
            />
        </div>
    </div>
</template>

<script>
import utility from "../../utility"
import categorySelector from "./CategorySelector"
import weatherSelector from "./WeatherSelector"
import {mapState, mapMutations} from 'vuex'
import axios from "axios"
import Moment from 'moment'
import DiaryBtn from "@/components/DiaryBtn"
import diaryApi from "@/api/diaryApi"
import ICONS from "@/assets/img/SvgIcons"
import projectConfig from "@/projectConfig";

export default {
    name: 'Edit',
    data() {
        return {
            isNew: true,
            isLoading: false,

            diary: {
                id: "",
                title: "",
                content: "",
                isPublic: false,
                date: new Date(),
                weather: 'sunny',
                category: 'life',
                temperature: '',
                temperatureOutside: '',
            },
            diaryOrigin: { // 不需要跟上面一样，但需要有提交声明好的属性，不然后面无法对比其值
                id: "",
                title: "",
                content: "",
                isPublic: false,
                date: new Date(),
                weather: 'sunny',
                category: 'life',
                temperature: '',
                temperatureOutside: '',
            },
            logoImageUrl: ICONS.logo,

            requestData: { // 请求本周日志的 requestData
                keywords: '',
                pageNo: 1,
                pageSize: 15, // 单页请求条数
                categories: JSON.stringify(['work']),
                filterShared: 0, // 1 是筛选，0 是不筛选
                dateFilter: '' // 日记年月筛选
            },
        }
    },
    components: {DiaryBtn, categorySelector, weatherSelector},
    beforeUnmount() {
        document.onkeydown = null // 去除按键绑定事件
    },
    mounted() {
        // 网页标签关闭前提醒
        window.onbeforeunload = () => {
            if (this.diaryHasChanged) {
                return "日记内容已改变，显示提示框"
            }
        }
        this.isNew = !(this.$route.params.id)
        if (this.isNew) {
            // 新建日记
            this.createDiary()
        } else {
            this.diary.id = this.$route.params.id
            this.getDiary(this.$route.params.id)
        }

        // 添加按键事件 ctrl + J 保存日记
        // 无法
        document.onkeydown = event => {
            if ((event.ctrlKey || event.metaKey) && event.code === 'KeyS'){
                event.preventDefault()
                console.log(event.key)
                this.saveDiary()
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        // 在跳转到其它页面之前判断日记是否已保存
        if (this.diaryHasChanged) {
            utility.popMessage('warning', '当前日记未保存', next(false))
        } else {
            next()
        }
    },
    computed: {
        ...mapState([
            'categoryAll',
            'currentDiary',
            'isDiaryNeedToBeSaved',
            'isDiaryNeedToBeRecovered',
            'insets',
            'editLogoImg',
            'isDiaryEditorContentHasChanged'
        ]),
        diaryHasChanged() {
            // 无内容时，改变任何其它位置的信息都不算变化
            if (this.diary.title === '' && this.diary.content === ''){
                return false
            } else {
                return (this.diary.title !== this.diaryOrigin.title ||
                    this.diary.content !== this.diaryOrigin.content ||
                    this.diary.temperature !== this.diaryOrigin.temperature ||
                    this.diary.temperatureOutside !== this.diaryOrigin.temperatureOutside ||
                    this.diary.weather !== this.diaryOrigin.weather ||
                    this.diary.category !== this.diaryOrigin.category ||
                    this.diary.isPublic !== this.diaryOrigin.isPublic)
            }
        },
    },

    watch: {
        $route(newValue) {
            if (newValue.params.id) {
                this.getDiary(newValue.params.id)
            } else {
                this.createDiary()
            }
        },
        diary: {
            handler(newValue) {
                this.updateDiaryIcon()
            },
            deep: true
        },
        isDiaryNeedToBeSaved() {
            if (this.isDiaryNeedToBeSaved) {
                this.saveDiary()
            }
        },
        isDiaryNeedToBeRecovered() {
            if (this.isDiaryNeedToBeRecovered) {
                this.recoverDiary()
            }
        }
    },
    methods: {
        ...mapMutations([
            'SET_EDIT_LOGO_IMG',
            'SET_IS_SAVING_DIARY',
            'SET_IS_DIARY_NEED_TO_BE_SAVED',
            'SET_IS_DIARY_NEED_TO_BE_RECOVERED',
            'SET_IS_LIST_NEED_BE_RELOAD',
            'SET_LIST_OPERATION',
            'SET_IS_DIARY_EDITOR_CONTENT_HAS_CHANGED',
            'SET_CATEGORY_ALL'
        ]),
        // 载入本星期的所有工作日志
        loadCurrentWeekLogs() {
            this.isLoading = true
            diaryApi
                .list(this.requestData)
                .then(res => {
                    this.isLoading = false
                    // TODO: 由于目前载入的日志内容是最近的15条，所以无法载入之前的日志内容，这个需要后台添加时间段获取日志的功能再完善
                    const currentWeekStart = new Moment(this.diary.date).startOf('week')
                    const currentWeekEnd = new Moment(this.diary.date).endOf('week')
                    let workList = res.data.filter(item => {
                        let diaryDate = new Moment(item.date)
                        return diaryDate.isBetween(currentWeekStart, currentWeekEnd)
                    })
                    this.diary.title = '周报'
                    this.diary.content = this.combineWeekWorkLog(workList)
                }).catch(err => {
                this.isLoading = false
            })
        },

        combineWeekWorkLog(workList){
            let contentStr = ''
            workList.forEach(item => {
                contentStr = contentStr + item.title + '\n' + item.content + '\n'
            })
            return contentStr
        },

        // 获取当前位置的天气气温信息
        getCurrentTemperature(){
            let geolocation = utility.getAuthorization().geolocation
            if (geolocation){
                axios
                    .get('https://devapi.qweather.com/v7/weather/now',
                        {
                            params: {
                                key: projectConfig.HefengWeatherKey,
                                location: geolocation
                            }
                        })
                    .then(res => {
                        if (res.data.code === '200'){
                            this.diary.temperatureOutside =  res.data.now.temp
                            this.diaryOrigin.temperatureOutside =  res.data.now.temp
                            this.diary.weather =  getWeatherNameFromCode(res.data.now.icon)
                            this.diaryOrigin.weather =  getWeatherNameFromCode(res.data.now.icon)
                        }
                    })
            }
        },

        goBack() {
            this.$router.back()
        },
        setCategory(data) {
            this.diary.category = data
            if (data === 'bill' && this.diary.title === ''){
                this.diary.title = '账单'
            }
        },
        setWeather(data) {
            this.diary.weather = data
        },
        updateDiaryIcon() {
            document.title = this.diaryHasChanged ? '日记 - 编辑中...' : '日记' // 变更标题
            this.SET_IS_DIARY_EDITOR_CONTENT_HAS_CHANGED(this.diaryHasChanged)
            if (this.diaryHasChanged) {
                this.SET_EDIT_LOGO_IMG(this.diary.content ? ICONS.logo_content: ICONS.logo_title)
            } else {
                this.SET_EDIT_LOGO_IMG(this.diary.content ? ICONS.logo_content_saved: ICONS.logo_title_saved)
            }
        },
        getDiary(id) {
            // 编辑日记
            diaryApi
                .detail({
                    diaryId: id
                })
                .then(res => {
                    let diary = res.data
                    this.diary.category = diary.category
                    this.diary.date = new Date(diary.date.replace(' ', 'T')) // safari 只识别 2020-10-27T14:35:33 格式的日期
                    this.diary.weather = diary.weather
                    this.diary.title = diary.title
                    this.diary.content = diary.content
                    this.diary.isPublic = diary.is_public === 1
                    this.diary.temperature = utility.temperatureProcessSTC(diary.temperature)
                    this.diary.temperatureOutside = utility.temperatureProcessSTC(diary.temperature_outside)
                    Object.assign(this.diaryOrigin, this.diary) // 不能直接赋值，赋值的是它的引用
                })
                .catch(() => {
                    this.$router.back()
                })
        },
        saveDiary() {
            if (this.diary.title.trim().length === 0) {
                this.diary.title = '' // clear content
                utility.popMessage('warning', '内容未填写', null)
                this.SET_IS_DIARY_NEED_TO_BE_SAVED(false) // 未能成功保存时，复位 isDiaryNeedToBeSaved 标识
                return
            }
            if (this.diary.temperature !== '' && !/^-?\d{1,2}$/.test(this.diary.temperature)) {
                utility.popMessage('warning', '室内温度格式不正确', null)
                this.SET_IS_DIARY_NEED_TO_BE_SAVED(false)
                return
            }
            if (this.diary.temperatureOutside !== '' && !/^-?\d{1,2}$/.test(this.diary.temperatureOutside)) {
                utility.popMessage('warning', '室外温度格式不正确', null)
                this.SET_IS_DIARY_NEED_TO_BE_SAVED(false)
                return
            }
            let requestData = {
                id: this.diary.id,
                title: this.diary.title,
                content: this.diary.content || null,
                category: this.diary.category,
                temperature: utility.temperatureProcessCTS(this.diary.temperature),
                temperatureOutside: utility.temperatureProcessCTS(this.diary.temperatureOutside),
                weather: this.diary.weather,
                isPublic: this.diary.isPublic ? 1 : 0,
                date: utility.dateFormatter(this.diary.date),
            }

            this.SET_IS_SAVING_DIARY(true)

            if (this.isNew){
                diaryApi
                    .add(requestData)
                    .then(this.processAfterSaveDiary)
                    .catch(err => {
                        utility
                            .popMessage('danger', err.message, () => {
                                this.SET_IS_SAVING_DIARY(false)
                                this.SET_IS_DIARY_NEED_TO_BE_SAVED(false)
                            })
                    })
            } else {
                diaryApi
                    .modify(requestData)
                    .then(this.processAfterSaveDiary)
                    .catch(err => {
                        utility
                            .popMessage('danger', err.message, () => {
                                this.SET_IS_SAVING_DIARY(false)
                                this.SET_IS_DIARY_NEED_TO_BE_SAVED(false)
                            })
                    })
            }
        },

        // 保存日记后要操作的
        processAfterSaveDiary(res){
            this.SET_IS_SAVING_DIARY(false)
            utility.popMessage('success', res.message, () => {
                // 成功后更新 origin 字符串
                Object.assign(this.diaryOrigin, this.diary)
                this.updateDiaryIcon() // 更新 navbar icon
                this.SET_IS_DIARY_NEED_TO_BE_SAVED(false)
                this.SET_LIST_OPERATION({type: 'change', diary: this.convertToServerVersion()}) // 向列表发送改变动作
                if (this.isNew) { // 如果是新建日记，跳转到对应路由
                    this.isNew = false
                    this.diary.id = res.data.id // 保存成功后需要将当前页的 diary id 设置为已经保存的 id
                    this.$router.push({
                        name: 'Edit',
                        params: {
                            id: res.data.id
                        }
                    })
                    this.SET_LIST_OPERATION({type: 'add', diary: this.convertToServerVersion()}) // 向列表发送添加动作
                }
            })
        },
        createDiary() {
            // 只有在当天写日记时，才自动获取实时天气
            if (Moment(this.diary.date).isSame(new Date(), 'day')){
                this.getCurrentTemperature()
            } else {
                this.diary.temperature = ''
                this.diary.temperatureOutside = ''
                this.diaryOrigin.temperature = ''
                this.diaryOrigin.temperatureOutside = ''
            }
            this.isNew = true
            this.diary = {
                id: "",
                title: "",
                content: "",
                isPublic: false,
                date: this.diary.date || new Date(), // 本页面新建时，保留之前日记的时间，因为可能一次性补全很多之前的日记
                weather: 'sunny',
                category: this.diary.category,
                temperature: '',
                temperatureOutside: '',
            }
            // 新建日记时也记录原始数据
            Object.assign(this.diaryOrigin, this.diary)
            this.updateDiaryIcon()
        },
        recoverDiary() {
            Object.assign(this.diary, this.diaryOrigin)
            this.SET_IS_DIARY_NEED_TO_BE_RECOVERED(false)
        },

        // TODO: 日记列表显示为展开的列表时，修改日记后，星期和日期都会消失，需要手动生成添加这两个字段
        convertToServerVersion() { // 转换为数据库格式的日记
            let date = utility.dateFormatter(this.diary.date)
            return {
                id: this.diary.id,
                date: date,
                title: this.diary.title,
                content: this.diary.content,
                temperature: utility.temperatureProcessCTS(this.diary.temperature),
                temperature_outside: utility.temperatureProcessCTS(this.diary.temperatureOutside),
                weather: this.diary.weather,
                category: this.diary.category,
                date_create: date,
                date_modify: "",
                is_public: this.diary.isPublic ? 1 : 0
            }
        }
    },
}


// 和风天气 API 天气图标对应： https://dev.qweather.com/docs/start/icons/
function getWeatherNameFromCode(code){
    let weatherDict = new Map([
        ['100', 'sunny'],        // 晴
        ['101', 'cloudy'],       // 多云
        ['104', 'overcast'],     // 阴
        ['305', 'sprinkle'],     // 小雨
        ['306', 'rain'],         // 中雨
        ['310', 'thunderstorm'], // 暴雨
        ['499', 'snow'],         // 雪
        ['501', 'fog'],          // 雾
        ['507', 'sandstorm'],    // 沙尘暴
        ['502', 'smog'],         // 霾

    ])
    return weatherDict.get(code) || 'sunny'
}
</script>

