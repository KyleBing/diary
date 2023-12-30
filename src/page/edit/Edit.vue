<template>
    <div class="diary-edit-container" :style="`min-height: ${storeProject.insets.heightPanel}px`">
        <div class="diary-edit-content">
            <!-- TITLE -->
            <div class="editor-title">
                <label  class="hidden"></label>
                <textarea ref="refDiaryTitle"
                          class="title" style="height: 150px"
                          placeholder="一句话，概括你的一天"
                          v-model="diary.title"/>
            </div>
            <!-- CONTENT -->
            <div class="editor-content">
                <PossibleBillKeySelector
                    :possible-bill-items="possibleBillItems"
                    :position-left="keysPanelPositionLeft"
                    :position-top="keysPanelPositionTop"
                    @selectKey="insertNewBillKey"
                />
                <label class="hidden"></label>
                <textarea
                    ref="refDiaryContent"
                    v-model="diary.content"
                    :style="storeProject.insets.windowsWidth > 1366 ? `height: ${storeProject.insets.heightPanel - 150 - 40 - 20}px`: ''"
                    placeholder="日记详细内容，如果你有很多要写的"
                    @input="contentUpdate($event)"
                    class="content"></textarea>
                <div class="editor-float-btn" v-if="diary.is_markdown">
                    <ButtonSmall @click="toggleSpaceShow">切换空格显示</ButtonSmall>
                </div>
            </div>
        </div>
        <div class="diary-edit-meta">
            <!--  主参数区 -->
            <div class="editor-form">
                <!-- 日期选择-->
                <EditorDateSelector @dayChange="dayHasChanged" v-model="diary.date"/>

                <div class="editor-meta-switches">
                    <div class="editor-form-item">
                        <label for="markdown">身处</label>
                        <TemperatureSetItem
                            unit="℃"
                            v-model="diary.temperature"/>
                    </div>
                    <div class="editor-form-item">
                        <label for="markdown">室外</label>
                        <TemperatureSetItem
                            unit="℃"
                            v-model="diary.temperature_outside"/>
                    </div>

                    <div class="editor-form-item">
                        <label for="shareState">共享</label>
                        <div class="input">
                            <input class="share"
                                   type="checkbox"
                                   name="share"
                                   id="shareState"
                                   v-model="diary.is_public"
                            >
                            <label class="switch" for="shareState"></label>
                        </div>
                    </div>
                    <div class="editor-form-item">
                        <label for="markdown">MD</label>
                        <div class="input">
                            <input class="share"
                                   type="checkbox"
                                   name="share"
                                   id="markdown"
                                   v-model="diary.is_markdown"
                            >
                            <label class="switch" for="markdown"></label>
                        </div>
                    </div>
                </div>

            </div>

            <!-- 类别选择 -->
            <EditCategorySelector :category="diary.category" @change="setCategory"/>

            <!--  周报载入按钮  -->
            <LoadingButton
                :is-loading="isLoading"
                type="light"
                v-if="diary.category === 'week'"
                @click="loadCurrentWeekLogs">载入本周工作日志</LoadingButton>


            <WeatherSelector :weather="diary.weather" @change="setWeather"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import axios from "axios"
import Moment from 'moment'

// components
import EditCategorySelector from "./CategorySelector/EditorCategorySelector.vue"
import weatherSelector from "./WeatherSelector/WeatherSelector.vue"
import LoadingButton from "../../components/LoadingButton.vue"
import EditorDateSelector from "./EditorDateSelector.vue";
import ButtonSmall from "../../components/ButtonSmall.vue";
import TemperatureSetItem from "./TemperatureSetItem.vue";
import PossibleBillKeySelector from "./PossibleBillKeySelector.vue";

import {
    popMessage,
    getBillKeys,
    getAuthorization,
    temperatureProcessSTC, temperatureProcessCTS, dateFormatter
} from "../../utility.ts";
import diaryApi from "../../api/diaryApi.js"
import projectConfig from "../../projectConfig.js";
import {useProjectStore} from "../../pinia";
const storeProject = useProjectStore()
import {computed, nextTick, onBeforeMount, onMounted, Ref, ref, watch} from "vue";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
import SVG_ICONS from "../../assets/img/SVG_ICONS.ts";

// ENTITY
import {DiaryEntity} from "../list/Diary.ts";
import {CategoryEntity} from "../../entity/Category.ts";

const route = useRoute()
const router = useRouter()


const spaceIdentifier = ref('✎') // 为了判断目前是否处于空格显示状态
const isNew = ref(true)
const isLoading = ref(false)

const diary: Ref<DiaryEntity> = ref({
    id: "",
    title: "",
    content: "",
    is_public: false,
    is_markdown: false,
    date: new Date(),
    weather: 'sunny',
    category: 'life',
    temperature: '',
    temperature_outside: '',
})
const diaryOrigin: Ref<DiaryEntity> = ref({ // 不需要跟上面一样，但需要有提交声明好的属性，不然后面无法对比其值
    id: "",
    title: "",
    content: "",
    is_public: false,
    is_markdown: false,
    date: new Date(),
    weather: 'sunny',
    category: 'life',
    temperature: '',
    temperature_outside: '',
})
const recoverDiaryContent = ref({  // 编辑过程中点击了隐藏按钮，此时记录没有保存的内容。供一会恢复
    title: '',
    content: ''
})

const requestData = ref({ // 请求本周日志的 requestData
    keywords: '',
    pageNo: 1,
    pageSize: 15, // 单页请求条数
    categories: JSON.stringify(['work']),
    filterShared: 0, // 1 是筛选，0 是不筛选
    dateFilter: '' // 日记年月筛选
})

/**
 * Bill Keys
 */
const billKeys = ref([])
const possibleBillItems = ref([])
const keysPanelPositionLeft = ref(150)
const keysPanelPositionTop = ref(20)


const refDiaryContent = ref()


onBeforeMount(()=>{
    refDiaryContent.value.onkeydown = null // 去除按键绑定事件
    window.onkeydown = null // 去除 edit 页面的绑定事件
})


onMounted(()=>{
    // 获取账单常用项目列表
    billKeys.value = getBillKeys()

    // 网页标签关闭前提醒
    window.onbeforeunload = () => {
        if (diaryHasChanged) {
            return "日记内容已改变，显示提示框"
        }
    }
    isNew.value = !(route.params.id)
    if (isNew.value) {
        // 新建日记
        createDiary()
    } else {
        diary.value.id = route.params.id
        getDiary(route.params.id)
    }

    // key binding
    nextTick( _=> {
        // 页面快捷键
        window.onkeydown = event => {
            // CTRL + S 保存
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault()
                saveDiary()
            }
        }
        // 编辑器快捷键
        refDiaryContent.value.onkeydown = event => {
            if (possibleBillItems.value.length > 0) {
                switch (event.key) {
                    case 'Tab':
                        insertNewBillKey(possibleBillItems.value[0].item)
                        event.preventDefault()
                        break;
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        insertNewBillKey(possibleBillItems.value[Number(event.key) - 1].item)
                        event.preventDefault()
                        break;
                    default:
                        break;
                }
            } else {
                // CTRL + ArrowLeft 移到最左端
                if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowLeft') {
                    event.preventDefault()
                    let textarea = refDiaryContent.value // dom
                    let textAreaInfo = getTextareaInfo(textarea, diary.value.content)
                    let linesBefore = textAreaInfo.textLineArray.slice(0, textAreaInfo.cursorLineIndex)
                    let textBefore = linesBefore.join('\n')
                    let newCursorLocation = 0
                    if (textBefore.length === 0) {

                    } else {
                        newCursorLocation = textBefore.length + 1  // -1行末尾 + 1
                    }
                    nextTick(_ => {
                        textarea.setSelectionRange(newCursorLocation, newCursorLocation)
                    })
                }

                // CTRL + ArrowRight 移到最右端
                if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowRight') {
                    event.preventDefault()
                    let textarea = refDiaryContent.value // dom
                    let textAreaInfo = getTextareaInfo(textarea, diary.value.content)
                    let linesBefore = textAreaInfo.textLineArray.slice(0, textAreaInfo.cursorLineIndex + 1)
                    let textBefore = linesBefore.join('\n')
                    let newCursorLocation = textBefore.length
                    nextTick(_ => {
                        textarea.setSelectionRange(newCursorLocation, newCursorLocation) // 定位光标
                    })
                }

                // CTRL + D 复选行
                if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
                    event.preventDefault()
                    let textarea = refDiaryContent.value // dom
                    let textAreaInfo = getTextareaInfo(textarea, diary.value.content)

                    textAreaInfo.textLineArray.splice(textAreaInfo.cursorLineIndex, 0, textAreaInfo.cursorLineContent)
                    diary.value.content = textAreaInfo.textLineArray.join('\n')
                    nextTick(_ => {
                        textarea.setSelectionRange(textAreaInfo.cursorSelectionStart, textAreaInfo.cursorSelectionStart) // 定位光标
                    })
                }

                // CTRL + X 删除行
                if ((event.ctrlKey || event.metaKey) && event.key === 'x') {
                    let textarea = refDiaryContent.value // dom
                    let textAreaInfo = getTextareaInfo(textarea, diary.value.content)
                    // 只有未选择任何内容的时候
                    if (textAreaInfo.cursorSelectionStart === textAreaInfo.cursorSelectionEnd) {
                        event.preventDefault()
                        navigator.clipboard.writeText(textAreaInfo.cursorLineContent)
                            .then(_ => {
                                console.log('✓ moved')
                            })
                        textAreaInfo.textLineArray.splice(textAreaInfo.cursorLineIndex, 1)
                        diary.value.content = textAreaInfo.textLineArray.join('\n')
                        nextTick(_ => {
                            textarea.setSelectionRange(textAreaInfo.cursorSelectionStart, textAreaInfo.cursorSelectionStart) // 定位光标
                        })
                    }
                }

                // CTRL + C 复制行
                if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
                    let textarea = refDiaryContent.value // dom
                    let textAreaInfo = getTextareaInfo(textarea, diary.value.content)

                    // 只有未选择任何内容的时候
                    if (textAreaInfo.cursorSelectionStart === textAreaInfo.cursorSelectionEnd) {
                        navigator.clipboard.writeText(textAreaInfo.cursorLineContent)
                            .then(_ => {
                                console.log('✓ copied')
                            })
                    }
                }

                // shift + tab
                if (event.shiftKey && event.key === 'Tab') {
                    event.preventDefault()
                    let textarea = refDiaryContent.value // dom
                    let textAreaInfo = getTextareaInfo(textarea, diary.value.content)

                    let tempLine = textAreaInfo.cursorLineContent
                    let deleteSpaceCount = 0
                    if (tempLine.substring(0, 4) === '    ') {
                        tempLine = tempLine.substring(4)
                        deleteSpaceCount = 4
                    } else {
                        let trimSpaceResult = this.removeSpaceBeforeLine(0, tempLine)
                        tempLine = trimSpaceResult.lineContent
                        deleteSpaceCount = trimSpaceResult.countSpace
                    }
                    textAreaInfo.textLineArray.splice(textAreaInfo.cursorLineIndex, 1, tempLine)
                    diary.value.content = textAreaInfo.textLineArray.join('\n')

                    nextTick(_ => {
                        textarea.setSelectionRange(textAreaInfo.cursorSelectionStart - deleteSpaceCount, textAreaInfo.cursorSelectionStart - deleteSpaceCount)
                    })

                } else if (event.key === 'Tab') {
                    // tab
                    event.preventDefault()
                    let textarea = refDiaryContent.value // dom
                    let textAreaInfo = getTextareaInfo(textarea, diary.value.content)
                    let contentBeforeCursor = diary.value.content.substring(0, textAreaInfo.cursorSelectionStart)
                    let contentAfterCursor = diary.value.content.substring(textAreaInfo.cursorSelectionStart)
                    diary.value.content = contentBeforeCursor + '    ' + contentAfterCursor
                    nextTick(_ => {
                        textarea.setSelectionRange(textAreaInfo.cursorSelectionStart + 4, textAreaInfo.cursorSelectionStart + 4)
                    })

                }
            }
        }
    })
})

onBeforeRouteLeave((to, from, next) => {
    // 在跳转到其它页面之前判断日记是否已保存
    if (diaryHasChanged) {
        popMessage('warning', '当前日记未保存', next(false))
    } else {
        next()
    }
})

const diaryHasChanged = computed(() => {
    // 无内容时，改变任何其它位置的信息都不算变化
    if (diary.value.title === '' && diary.value.content === ''){
        return false
    } else {
        return (
            diary.value.title !== diaryOrigin.value.title ||
            diary.value.content !== diaryOrigin.value.content ||
            diary.value.temperature !== diaryOrigin.value.temperature ||
            diary.value.temperature_outside !== diaryOrigin.value.temperature_outside ||
            diary.value.weather !== diaryOrigin.value.weather ||
            diary.value.category !== diaryOrigin.value.category ||
            diary.value.is_public !== diaryOrigin.value.is_public ||
            diary.value.is_markdown !== diaryOrigin.value.is_markdown
        )
    }
})


watch(route, newValue => {
    if (newValue.params.id) {
        getDiary(newValue.params.id)
    } else {
        createDiary()
    }
})
watch(diary, {
    handler(newValue) {
        updateDiaryIcon()
        if(newValue.content === ''){
            possibleBillItems.value = []
        }
    },
    deep: true
})
watch(storeProject.isDiaryNeedToBeSaved,() => {
    if (storeProject.isDiaryNeedToBeSaved) {
        saveDiary()
    }
})
watch(storeProject.isDiaryNeedToBeRecovered, () => {
    if (storeProject.isDiaryNeedToBeRecovered) {
        recoverDiary()
    }
})
watch(isHideContent, newValue => {
    if (newValue){ // 保存当前未保存的日记内容
        if (storeProject.isDiaryEditorContentHasChanged){
            recoverDiaryContent.value = {
                title: diary.value.title,
                content: diary.value.content
            }
        }
        diary.value.title = diary.value.title.replace(/[^，。 \n]/g, '*')
        diary.value.content = diary.value.content.replace(/[^，。 \n]/g, '*')
    } else {
        if (recoverDiaryContent.value.title || recoverDiaryContent.value.content) { // 如果存在没有保存的日记内容
            diary.value.title = recoverDiaryContent.value.title
            diary.value.content = recoverDiaryContent.value.content
        } else {
            diary.value.title = diaryOrigin.value.title
            diary.value.content = diaryOrigin.value.content
        }
    }
})

// bill insert prompt
function insertNewBillKey(billKey: string){
    // console.log(billKey)
    possibleBillItems.value = []

    let lineArray = diary.value.content.split('\n').filter(item => item !== '')
    lineArray.pop()
    lineArray.push(billKey + ' ')
    diary.value.content = lineArray.join('\n')
    refDiaryContent.value.focus()
}

// contentUpdate
function contentUpdate(event: InputEvent){
    if (diary.value.category === 'bill'){
        let content = event.target.value
        if (content){
            let lineArray = content.split('\n')
            keysPanelPositionTop.value = lineArray.length * 24 + 15
            let lastWord = lineArray[lineArray.length - 1]
            keysPanelPositionLeft.value = lastWord.length * 15 + 30
            // possibleBillItems.value = billKeys.value.filter(item => item.item.indexOf(lastWord) === 0)
            if (lastWord !== ''){
                possibleBillItems.value = billKeys.value.filter(item => item.item.indexOf(lastWord) > -1).splice(0,10)
            }
            // console.log(possibleBillItems.value.map(item => item.item).join(','))
        } else {
            possibleBillItems.value = []
        }
    }
}

function toggleSpaceShow(){
    if (diary.value.content.indexOf(spaceIdentifier.value) > -1){
        // 显示 space 模式
        diary.value.content = diary.value.content.substring(0, diary.value.content.length - 1)
        diary.value.content = diary.value.content.replace(/·/ig, ' ')
    } else {
        // 正常模式
        diary.value.content = diary.value.content.replace(/ /ig, '·')
        diary.value.content = diary.value.content + spaceIdentifier.value
    }
}
// 日期前后移动
function dayHasChanged(isToday: boolean){
    if (isToday){
        getCurrentTemperature()
    } else {
        diary.value.temperature = ''
        diary.value.temperature_outside = ''
        diary.value.weather = 'sunny'
    }
}

/**
 * 去除前面的空格
 * @param initSpaceCount 初始空格数
 * @param lineContent 行的内容
 * @returns {*}
 */
function removeSpaceBeforeLine(initSpaceCount: number, lineContent: string){  // 去除字符行中前面的空格
    let countSpace = initSpaceCount
    if (lineContent.substring(0,1) === ' '){
        countSpace  = countSpace + 1
        lineContent = lineContent.substring(1)
        return removeSpaceBeforeLine(countSpace, lineContent)
    } else {
        return {countSpace, lineContent}
    }
}

function getTextareaInfo(textarea: HTMLTextAreaElement, textContent: string){
    let cursorSelectionStart = textarea.selectionStart // cursorPos
    let cursorSelectionEnd = textarea.selectionEnd // cursorPos
    let cursorLineIndex = textContent.substring(0, cursorSelectionStart).split('\n').length - 1 // 光标所在行
    let textLineArray = textContent.split('\n') // 原始文字 行数组
    let cursorLineContent = textLineArray[cursorLineIndex] // 光标所在行的内容

    return {
        cursorSelectionStart,
        cursorSelectionEnd,
        cursorLineIndex,
        textLineArray,
        cursorLineContent
    }
}
// 载入本星期的所有工作日志
function loadCurrentWeekLogs() {
    isLoading.value = true
    diaryApi
        .list(requestData.value)
        .then(res => {
            isLoading.value = false
            const currentWeekStart = new Moment(diary.value.date).startOf('week')
            const currentWeekEnd = new Moment(diary.value.date).endOf('week')
            let workList = res.data.filter(item => {
                let diaryDate = new Moment(item.date)
                return diaryDate.isBetween(currentWeekStart, currentWeekEnd)
            })
            diary.value.title = '周报'
            diary.value.content = this.combineWeekWorkLog(workList)
        })
        .catch(_ => {
            isLoading.value = false
        })
}

function combineWeekWorkLog(workList: DiaryEntity[]){
    let contentStr = ''
    workList.forEach(item => {
        contentStr = contentStr + item.title + '\n' + item.content + '\n'
    })
    return contentStr
}

// 获取当前位置的天气气温信息
function getCurrentTemperature(){
    let geolocation = getAuthorization().geolocation
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
                    diary.value.temperature_outside =  res.data.now.temp
                    diaryOrigin.value.temperature_outside =  res.data.now.temp
                    diary.value.weather =  getWeatherNameFromCode(res.data.now.icon)
                    diaryOrigin.value.weather =  getWeatherNameFromCode(res.data.now.icon)
                }
            })
    } else {
        console.log('没有配置地域信息')
        // popMessage('warning', '没有配置地域信息', null)
    }
}

function goBack() {
    router.back()
}
function setCategory(data: CategoryEntity) {
    diary.value.category = data
    if (data === 'bill' && diary.value.title === ''){
        diary.value.title = '账单'
    }
}
function setWeather(data) {
    diary.value.weather = data
}
function updateDiaryIcon() {
    document.title = diaryHasChanged ? '日记 - 编辑中...' : '日记' // 变更标题
    storeProject.isDiaryEditorContentHasChanged = diaryHasChanged
    if (diaryHasChanged) {
        storeProject.editLogoImg = diary.value.content ? SVG_ICONS.logo_content: SVG_ICONS.logo_title
    } else {
        storeProject.editLogoImg = diary.value.content ? SVG_ICONS.logo_content_saved: SVG_ICONS.logo_title_saved
    }
}
function getDiary(id: number) {
    // 编辑日记
    diaryApi
        .detail({
            diaryId: id
        })
        .then(res => {
            let diary = res.data

            if (storeProject.isHideContent){
                diary.value.title = diary.title.replace(/[^，。 \n]/g, '*')
                diary.value.content = diary.content.replace(/[^，。 \n]/g, '*')
            } else {
                diary.value.title = diary.title
                diary.value.content = diary.content
            }

            diary.value.category = diary.category
            diary.value.date = new Date(diary.date.replace(' ', 'T')) // safari 只识别 2020-10-27T14:35:33 格式的日期
            diary.value.weather = diary.weather
            diary.value.is_public = diary.is_public === 1
            diary.value.is_markdown = diary.is_markdown === 1
            diary.value.temperature = temperatureProcessSTC(diary.temperature)
            diary.value.temperature_outside = temperatureProcessSTC(diary.temperature_outside)
            Object.assign(diaryOrigin.value, diary.value) // 不能直接赋值，赋值的是它的引用

        })
        .catch(() => {
            router.push({name: 'List'})
        })
}
function saveDiary() {
    if (diary.value.title.trim().length === 0) {
        diary.value.title = '' // clear content
        popMessage('warning', '内容未填写', null)
        storeProject.isDiaryNeedToBeSaved = false// 未能成功保存时，复位 isDiaryNeedToBeSaved 标识
        return
    }
    if (diary.value.temperature !== '' && !/^-?\d{1,2}$/.test(diary.value.temperature)) {
        popMessage('warning', '室内温度格式不正确', null)
        storeProject.isDiaryNeedToBeSaved = false
        return
    }
    if (diary.value.temperature_outside !== '' && !/^-?\d{1,2}$/.test(diary.value.temperature_outside)) {
        popMessage('warning', '室外温度格式不正确', null)
        storeProject.isDiaryNeedToBeSaved = false
        return
    }
    let requestData = {
        id: diary.value.id,
        title: diary.value.title,
        content: diary.value.content || null,
        category: diary.value.category,
        temperature: temperatureProcessCTS(diary.value.temperature),
        temperature_outside: temperatureProcessCTS(diary.value.temperature_outside),
        weather: diary.value.weather,
        is_public: diary.value.is_public ? 1 : 0,
        is_markdown: diary.value.is_markdown ? 1 : 0,
        date: dateFormatter(diary.value.date),
    }

    storeProject.isDiaryNeedToBeSaved = true

    if (isNew.value){
        diaryApi
            .add(requestData)
            .then(processAfterSaveDiary)
            .catch(err => {
                popMessage('danger', err.message, () => {
                    storeProject.isSavingDiary = false
                    storeProject.isDiaryNeedToBeSaved = false
                }, 3)
            })
    } else {
        diaryApi
            .modify(requestData)
            .then(processAfterSaveDiary)
            .catch(err => {
                popMessage('danger', err.message, () => {
                    storeProject.isSavingDiary = false
                    storeProject.isDiaryNeedToBeSaved = false
                }, 3)
            })
    }
}

// 保存日记后要操作的
function processAfterSaveDiary(res){
    storeProject.isSavingDiary = false
    popMessage('success', res.message, () => {
        // 成功后更新 origin 字符串
        Object.assign(diaryOrigin.value, diary.value)
        updateDiaryIcon() // 更新 navbar icon
        storeProject.isDiaryNeedToBeSaved = false
        storeProject.listOperation = {type: 'change', diary: convertToServerVersion()}// 向列表发送改变动作

        if (isNew.value) { // 如果是新建日记，跳转到对应路由
            isNew.value = false
            diary.value.id = res.data.id // 保存成功后需要将当前页的 diary id 设置为已经保存的 id
            router.push({
                name: 'Edit',
                params: {
                    id: res.data.id
                }
            })
            storeProject.listOperation = {type: 'add', diary: convertToServerVersion()} // 向列表发送添加动作
        }
    })
}
function createDiary() {
    // 只有在当天写日记时，才自动获取实时天气
    if (Moment(diary.value.date).isSame(new Date(), 'day')){
        getCurrentTemperature()
    } else {
        diary.value.temperature = ''
        diary.value.temperature_outside = ''
        diaryOrigin.value.temperature = ''
        diaryOrigin.value.temperature_outside = ''
    }
    isNew.value = true
    diary.value = {
        id: "",
        title: "",
        content: "",
        is_public: 0,
        is_markdown: 0,
        date: diary.value.date || new Date(), // 本页面新建时，保留之前日记的时间，因为可能一次性补全很多之前的日记
        weather: 'sunny',
        category: diary.value.category,
        temperature: '',
        temperature_outside: '',
    }
    // 新建日记时也记录原始数据
    Object.assign(diaryOrigin.value, diary.value)
    updateDiaryIcon()
}

function recoverDiary() {
    Object.assign(diary.value, diaryOrigin.value)
    recoverDiaryContent.value = {
        title: '',
        content: ''
    }
    storeProject.isDiaryNeedToBeRecovered = false
}

function convertToServerVersion() { // 转换为数据库格式的日记
    let date = dateFormatter(diary.value.date)
    return {
        id: diary.value.id,
        date: date,
        title: diary.value.title,
        content: diary.value.content,
        temperature: temperatureProcessCTS(diary.value.temperature),
        temperature_outside: temperatureProcessCTS(diary.value.temperature_outside),
        weather: diary.value.weather,
        category: diary.value.category,
        date_create: date,
        date_modify: "",
        is_public: diary.value.is_public ? 1 : 0,
        is_markdown: diary.value.is_markdown ? 1 : 0
    }
}


// 和风天气 API 天气图标对应： https://dev.qweather.com/docs/start/icons/
function getWeatherNameFromCode(code: string){
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

<style lang="scss">
@import "edit";
</style>
