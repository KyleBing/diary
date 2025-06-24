<template>
    <div class="diary-edit-container" :style="`min-height: ${projectStore.insets.heightPanel}px`">
        <div class="diary-edit-content">
            <!-- TITLE -->
            <div class="editor-title">
                <label class="hidden"></label>
                <textarea ref="refDiaryTitleTextArea"
                          class="title"
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
                    ref="refDiaryContentTextArea"
                    v-model="diary.content"
                    :style="projectStore.insets.windowsWidth > 1366 ? `height: ${projectStore.insets.heightPanel - 150 - 40 - 20}px`: ''"
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
                <EditorVCalendarSelector @dayChange="dayHasChanged" v-model="diary.date"/>
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
                        <label for="markdown">MarkDown</label>
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
import WeatherSelector from "./WeatherSelector/WeatherSelector.vue"
import LoadingButton from "../../components/LoadingButton.vue"
import ButtonSmall from "../../components/ButtonSmall.vue";
import TemperatureSetItem from "./TemperatureSetItem.vue";
import PossibleBillKeySelector from "./PossibleBillKeySelector.vue";

import {
    popMessage,
    getBillKeys,
    getAuthorization,
    temperatureProcessSTC, temperatureProcessCTS, dateFormatter
} from "@/utility.ts";
import diaryApi from "../../api/diaryApi.ts"
import projectConfig from "../../projectConfig.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
const projectStore = useProjectStore()
import {computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, Ref, ref, watch} from "vue";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";

// ENTITY
import {
    DiaryEntity,
    DiaryEntityFromServer,
    DiarySearchParams,
    DiarySubmitEntity, EnumWeather,
    ResponseDiaryAdd
} from "@/view/DiaryList/Diary.ts";
import {storeToRefs} from "pinia";

const route = useRoute()
const router = useRouter()


const spaceIdentifier = ref('✎') // 为了判断目前是否处于空格显示状态
const isNew = ref(true)
const isLoading = ref(false)

const diary = ref<DiaryEntity>({
    id: -1,
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
const diaryOrigin = ref<DiaryEntity>({ // 不需要跟上面一样，但需要有提交声明好的属性，不然后面无法对比其值
    id: -1,
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

const requestData = ref<DiarySearchParams>({ // 请求本周日志的 requestData
    keywords: [],
    pageNo: 1,
    pageSize: 15, // 单页请求条数
    categories: JSON.stringify(['work']),
    filterShared: 0, // 1 是筛选，0 是不筛选
    dateFilterString: '' // 日记年月筛选
})

/**
 * Date Picker
 */
import 'v-calendar/style.css';
import EditorVCalendarSelector from "@/view/Edit/EditorVCalendarSelector.vue";
import {BillKey} from "@/view/Bill/Bill.ts";


/**
 * Bill Keys
 */
const billKeys = ref<Array<BillKey>>([])
const possibleBillItems = ref<Array<BillKey>>([])
const keysPanelPositionLeft = ref(150)
const keysPanelPositionTop = ref(20)

const refDiaryContentTextArea = ref()
const refDiaryTitleTextArea = ref()

onBeforeMount(() => {
    // console.log(refDiaryContentTextArea)
    // (refDiaryContentTextArea.value as HTMLTextAreaElement).removeEventListener('keydown', ()=>{}) // 去除按键绑定事件
    window.onkeydown = null // 去除 edit 页面的绑定事件

    // 如果存在缓存日记内容，载入它
    if (projectStore.cacheDiary){
        if (Number(route.params.id) === projectStore.cacheDiary.id){  // 只有是同一个日记时
            diary.value = projectStore.cacheDiary
            diaryOrigin.value = projectStore.cacheDiaryOrigin
            projectStore.cacheDiary = undefined
        } else {

        }
    }
})

onMounted(()=>{
    // 获取账单常用项目列表
    billKeys.value = getBillKeys()

    // 网页标签关闭前提醒
    window.onbeforeunload = () => {
        if (diaryHasChanged.value) {
            return "日记内容已改变，显示提示框"
        }
    }

    // 如果已经存在日记内容，不需要重新获取日记、新建日记
    if (diary.value.title || diary.value.content){

    } else {
        isNew.value = !(route.params.id)
        if (isNew.value) {
            // 新建日记
            createDiary()
        } else {
            getDiary(Number(route.params.id))
        }
    }

    // key binding
    nextTick( () => {
        // 页面快捷键
        window.onkeydown = event => {
            // CTRL + S 保存
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault()
                saveDiary()
            }
        }

        // 编辑器快捷键
        refDiaryTitleTextArea.value.addEventListener('keydown', (event: KeyboardEvent) => {
                addKeyboardEventListener(event, refDiaryTitleTextArea, diary, 'title')
        })

        // 编辑器快捷键
        refDiaryContentTextArea.value.addEventListener('keydown', (event: KeyboardEvent) => {
            if (possibleBillItems.value.length > 0) {
                // 账单待选项选择
                switch (event.key) {
                    case 'Tab':
                        insertNewBillKey(possibleBillItems.value[0].key)
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
                        insertNewBillKey(possibleBillItems.value[Number(event.key) - 1].key)
                        event.preventDefault()
                        break;
                    default:
                        break;
                }
            } else {
                addKeyboardEventListener(event, refDiaryContentTextArea, diary, 'content')
            }
        })
    })
})

/**
 * 标题和内容通用方法
 * @param event   keyboard event
 * @param textareaRef   ref of Textarea
 * @param diaryObj   ref of diary Object
 * @param key  key of diary Object
 */
function addKeyboardEventListener(event: KeyboardEvent, textareaRef: Ref, diaryObj: Ref<DiaryEntity>, key: string) {

    // CTRL + ArrowLeft 移到最左端
    if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowLeft') {
        event.preventDefault()
        let textarea = textareaRef.value as HTMLTextAreaElement // dom
        let textAreaInfo = getTextareaInfo(textarea, diaryObj.value[key])
        let linesBefore = textAreaInfo.textLineArray.slice(0, textAreaInfo.cursorLineIndex)
        let textBefore = linesBefore.join('\n')
        let newCursorLocation = 0
        if (textBefore.length === 0) {

        } else {
            newCursorLocation = textBefore.length + 1  // -1行末尾 + 1
        }
        nextTick(() => {
            textarea.setSelectionRange(newCursorLocation, newCursorLocation)
        })
    }

    // CTRL + ArrowRight 移到最右端
    if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowRight') {
        event.preventDefault()
        let textarea = textareaRef.value as HTMLTextAreaElement // dom
        let textAreaInfo = getTextareaInfo(textarea, diaryObj.value[key])
        let linesBefore = textAreaInfo.textLineArray.slice(0, textAreaInfo.cursorLineIndex + 1)
        let textBefore = linesBefore.join('\n')
        let newCursorLocation = textBefore.length
        nextTick(() => {
            textarea.setSelectionRange(newCursorLocation, newCursorLocation) // 定位光标
        })
    }

    // CTRL + D 复选行
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {

        event.preventDefault()
        let textarea = textareaRef.value as HTMLTextAreaElement// dom
        let textAreaInfo = getTextareaInfo(textarea, diaryObj.value[key])

        textAreaInfo.textLineArray.splice(textAreaInfo.cursorLineIndex, 0, textAreaInfo.cursorLineContent)
        diaryObj.value[key] = textAreaInfo.textLineArray.join('\n')

        console.log(event, textareaRef, diaryObj.value[key])

        nextTick(() => {
            textarea.setSelectionRange(textAreaInfo.cursorSelectionStart, textAreaInfo.cursorSelectionStart) // 定位光标
        })
    }

    // CTRL + X 删除行
    if ((event.ctrlKey || event.metaKey) && event.key === 'x') {
        let textarea = textareaRef.value as HTMLTextAreaElement // dom
        let textAreaInfo = getTextareaInfo(textarea, diaryObj.value[key])
        // 只有未选择任何内容的时候
        if (textAreaInfo.cursorSelectionStart === textAreaInfo.cursorSelectionEnd) {
            event.preventDefault()
            // 只有在 localhost 或 https 的环境下才能使用 navigator.clipboard
            if (window.isSecureContext){
                navigator.clipboard.writeText(textAreaInfo.cursorLineContent)
                    .then(() => {
                        console.log('✓ moved')
                    })
                textAreaInfo.textLineArray.splice(textAreaInfo.cursorLineIndex, 1)
                diaryObj.value[key] = textAreaInfo.textLineArray.join('\n')
                nextTick(() => {
                    textarea.setSelectionRange(textAreaInfo.cursorSelectionStart, textAreaInfo.cursorSelectionStart) // 定位光标
                })
            } else {
                // 照样删除
                textAreaInfo.textLineArray.splice(textAreaInfo.cursorLineIndex, 1)
                diaryObj.value[key] = textAreaInfo.textLineArray.join('\n')
            }
        }
    }

    // CTRL + C 复制行
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        let textarea = textareaRef.value as HTMLTextAreaElement // dom
        let textAreaInfo = getTextareaInfo(textarea, diaryObj.value[key])

        // 只有未选择任何内容的时候
        if (textAreaInfo.cursorSelectionStart === textAreaInfo.cursorSelectionEnd) {
            // 只有在 localhost 或 https 的环境下才能使用 navigator.clipboard
            if (window.isSecureContext){
                navigator.clipboard.writeText(textAreaInfo.cursorLineContent)
                    .then(() => {
                        console.log('✓ copied')
                    })
            }
        }
    }

    // shift + tab
    if (event.shiftKey && event.key === 'Tab') {
        event.preventDefault()
        let textarea = textareaRef.value as HTMLTextAreaElement // dom
        let textAreaInfo = getTextareaInfo(textarea, diaryObj.value[key])

        let tempLine = textAreaInfo.cursorLineContent
        let deleteSpaceCount = 0
        if (tempLine.substring(0, 4) === '    ') {
            tempLine = tempLine.substring(4)
            deleteSpaceCount = 4
        } else {
            let trimSpaceResult = removeSpaceBeforeLine(0, tempLine)
            tempLine = trimSpaceResult.lineContent
            deleteSpaceCount = trimSpaceResult.countSpace
        }
        textAreaInfo.textLineArray.splice(textAreaInfo.cursorLineIndex, 1, tempLine)
        diaryObj.value[key] = textAreaInfo.textLineArray.join('\n')

        nextTick(() => {
            textarea.setSelectionRange(textAreaInfo.cursorSelectionStart - deleteSpaceCount, textAreaInfo.cursorSelectionStart - deleteSpaceCount)
        })

    } else if (event.key === 'Tab') {
        // tab
        event.preventDefault()
        let textarea = textareaRef.value as HTMLTextAreaElement // dom
        let textAreaInfo = getTextareaInfo(textarea, diaryObj.value[key])
        let contentBeforeCursor = diaryObj.value[key].substring(0, textAreaInfo.cursorSelectionStart)
        let contentAfterCursor = diaryObj.value[key].substring(textAreaInfo.cursorSelectionStart)
        diaryObj.value[key] = contentBeforeCursor + '    ' + contentAfterCursor
        nextTick(() => {
            textarea.setSelectionRange(textAreaInfo.cursorSelectionStart + 4, textAreaInfo.cursorSelectionStart + 4)
        })
    }
}

onBeforeUnmount(() => {
    // 退出 Edit 之前，如果存在日记内容，缓存它。
    // 目前只有一个场景用到，就是屏幕窗口大小变化时， Edit 会消失再出现，结果就是
    // 会选择用户在这期间写的内容，这是极不应该的。
    if (diary.value.title || diary.value.content){
        projectStore.cacheDiary = diary.value
        projectStore.cacheDiaryOrigin = diaryOrigin.value
    }
})

onBeforeRouteLeave((_, __, next) => {
    // 在跳转到其它页面之前判断日记是否已保存
    if (diaryHasChanged.value) {
        popMessage('warning', '当前日记未保存', ()=>{})
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


watch(() => route.params.id, newDiaryId => {
    console.log('edit: watch: diary-id: triggered.', newDiaryId)
    if (newDiaryId) {
        getDiary(Number(newDiaryId))
    } else {
        createDiary()
    }
})
watch(diary, newValue => {
        updateDiaryIcon()
        if (newValue.content === '') {
            possibleBillItems.value = []
        }
    },
    {deep: true}
)

const {isDiaryNeedToBeSaved, isDiaryNeedToBeRecovered, isHideContent} = storeToRefs(projectStore)
watch(isDiaryNeedToBeSaved,newValue => {
    if (newValue) {
        saveDiary()
    }
})
watch(isDiaryNeedToBeRecovered, newValue => {
    if (newValue) {
        recoverDiary()
    }
})
watch(isHideContent, newValue => {
    if (newValue){ // 保存当前未保存的日记内容
        if (projectStore.isDiaryEditorContentHasChanged){
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

    let lineArray = diary.value.content.split('\n').filter((item: string) => item !== '')
    lineArray.pop()
    lineArray.push(billKey + ' ')
    diary.value.content = lineArray.join('\n')
    refDiaryContentTextArea.value.focus()
}

// contentUpdate
function contentUpdate(event: Event){
    if (diary.value.category === 'bill'){
        let content = (event.target as HTMLTextAreaElement).value
        if (content){
            let lineArray = content.split('\n')
            keysPanelPositionTop.value = lineArray.length * 24 + 15
            let lastWord = lineArray[lineArray.length - 1]
            keysPanelPositionLeft.value = lastWord.length * 15 + 30
            // possibleBillItems.value = billKeys.value.filter(item => item.item.indexOf(lastWord) === 0)
            // console.log('lastWord:', lastWord, 'word length:', lastWord.length)
            if (lastWord !== ''){
                possibleBillItems.value = billKeys.value.filter(item => item.key.indexOf(lastWord) > -1).splice(0,9)
            } else {
                possibleBillItems.value = []
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
            const currentWeekStart = Moment(diary.value.date).startOf('week')
            const currentWeekEnd = Moment(diary.value.date).endOf('week')
            let workList = res.data.filter(item => {
                let diaryDate = Moment(item.date)
                return diaryDate.isBetween(currentWeekStart, currentWeekEnd)
            })
            diary.value.title = '周报'
            diary.value.content = combineWeekWorkLog(workList)
        })
        .catch(() => {
            isLoading.value = false
        })
}

function combineWeekWorkLog(workList: DiaryEntityFromServer[]){
    let contentStr = ''
    workList.forEach(item => {
        contentStr = contentStr + item.title + '\n' + item.content + '\n'
    })
    return contentStr
}

// 获取当前位置的天气气温信息
function getCurrentTemperature(){
    let geolocation = getAuthorization()?.geolocation
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
            .catch(err => {
                console.log(err)
            })
    } else {
        console.log('没有配置地域信息')
        // popMessage('warning', '没有配置地域信息', null)
    }
}

function setCategory(categoryNameEn: string) {
    diary.value.category = categoryNameEn
    if (categoryNameEn === 'bill' && diary.value.title === ''){
        diary.value.title = '账单'
    }
}
function setWeather(weather: string) {
    diary.value.weather = weather
}
function updateDiaryIcon() {
    document.title = diaryHasChanged.value ? '日记 - 编辑中...' : '日记' // 变更标题
    projectStore.isDiaryEditorContentHasChanged = diaryHasChanged.value
    if (diaryHasChanged.value) {
        projectStore.editLogoImg = diary.value.content ? SVG_ICONS.logo_icons.logo_content: SVG_ICONS.logo_icons.logo_title
    } else {
        projectStore.editLogoImg = diary.value.content ? SVG_ICONS.logo_icons.logo_content_saved: SVG_ICONS.logo_icons.logo_title_saved
    }
}
function getDiary(diaryId: number) {
    // 编辑日记
    diaryApi
        .detail({
            diaryId: diaryId
        })
        .then(res => {
            let tempDiary = res.data

            if (projectStore.isHideContent){
                diary.value.title = tempDiary.title.replace(/[^，。 \n]/g, '*')
                diary.value.content = tempDiary.content.replace(/[^，。 \n]/g, '*')
            } else {
                diary.value.title = tempDiary.title
                diary.value.content = tempDiary.content
            }

            diary.value.id = tempDiary.id
            diary.value.category = tempDiary.category
            diary.value.date = new Date(tempDiary.date.replace(' ', 'T')) // safari 只识别 2020-10-27T14:35:33 格式的日期
            diary.value.weather = tempDiary.weather
            diary.value.is_public = !!tempDiary.is_public
            diary.value.is_markdown = !!tempDiary.is_markdown
            diary.value.temperature = temperatureProcessSTC(tempDiary.temperature)
            diary.value.temperature_outside = temperatureProcessSTC(tempDiary.temperature_outside)
            Object.assign(diaryOrigin.value, diary.value) // 不能直接赋值，赋值的是它的引用

        })
        .catch(err => {
            console.log('EDIT: get diary info error: ', err)
            router.push({name: 'List'})
        })
}
function saveDiary() {
    if (projectStore.isHideContent) {
        popMessage('warning', '请退出当前隐藏模式，再进行保存操作', ()=>{}, 2)
        return
    } else if (!/^(-?\d{1,3}(\.\d{1,2})?)?$/.test(diary.value.temperature)){
        popMessage('warning', '身处温度填写错误，应为 23.45 这样', ()=>{}, 2)
        return
    } else if (!/^(-?\d{1,3}(\.\d{1,2})?)?$/.test(diary.value.temperature)){
        popMessage('warning', '室外温度填写错误，请检查 23.45 这样', ()=>{}, 2)
        return
    } else if  (diary.value.title.trim().length === 0) {
        diary.value.title = '' // clear content
        popMessage('warning', '内容未填写', null)
        projectStore.isDiaryNeedToBeSaved = false// 未能成功保存时，复位 isDiaryNeedToBeSaved 标识
        return
    }
    let requestData: DiarySubmitEntity = {
        id: diary.value.id,
        title: diary.value.title,
        content: diary.value.content,
        category: diary.value.category,
        temperature: temperatureProcessCTS(diary.value.temperature),
        temperature_outside: temperatureProcessCTS(diary.value.temperature_outside),
        weather: diary.value.weather,
        is_public: diary.value.is_public ? 1 : 0,
        is_markdown: diary.value.is_markdown ? 1 : 0,
        date: dateFormatter(diary.value.date),
    }
    if (isNew.value){
        diaryApi
            .add(requestData)
            .then(processAfterSaveDiary)
            .catch(err => {
                popMessage('danger', err.message, () => {
                    projectStore.isSavingDiary = false
                    projectStore.isDiaryNeedToBeSaved = false
                }, 3)
            })
    } else {
        diaryApi
            .modify(requestData)
            .then(processAfterSaveDiary)
            .catch(err => {
                popMessage('danger', err.message, () => {
                    projectStore.isSavingDiary = false
                    projectStore.isDiaryNeedToBeSaved = false
                }, 3)
            })
    }
}

// 保存日记后要操作的
function processAfterSaveDiary(res: ResponseDiaryAdd){
    projectStore.isSavingDiary = false

    // 成功后更新 origin 字符串
    Object.assign(diaryOrigin.value, diary.value)
    updateDiaryIcon() // 更新 navbar icon
    projectStore.isDiaryNeedToBeSaved = false

    if (isNew.value) { // 如果是新建日记，跳转到对应路由
        diary.value.id = res.data.id // 保存成功后需要将当前页的 diary id 设置为已经保存的 id
        popMessage('success', res.message, ()=>{
            projectStore.listOperation = {type: 'add', diary: convertToServerVersion()} // 向列表发送添加动作
            nextTick(()=>{
                router.push({
                    name: 'Edit',
                    params: {
                        id: res.data.id
                    }
                })
            })
        }, 1)  // 日记保存完成之后，应立即处理上面的内容，再显示消息，而不是等消息消失再处理，会有问题
    } else {
        popMessage('success', res.message, ()=>{
            projectStore.listOperation = {type: 'change', diary: convertToServerVersion()}// 向列表发送改变动作
            nextTick(()=>{
                router.push({
                    name: 'Edit',
                    params: {
                        id: res.data.id
                    }
                })
            })
        }, 1)  // 日记保存完成之后，应立即处理上面的内容，再显示消息，而不是等消息消失再处理，会有问题
    }

    isNew.value = false


}
function createDiary() {
    isNew.value = true

    // 只有在当天写日记时，才自动获取实时天气
    if (Moment(diary.value.date).isSame(new Date(), 'day')){
        getCurrentTemperature()
    } else {
        diary.value.temperature = ''
        diary.value.temperature_outside = ''
        diaryOrigin.value.temperature = ''
        diaryOrigin.value.temperature_outside = ''
    }

    diary.value = {
        id: -1,
        title: diary.value.category === 'bill'? '账单': '', // 在账单类别下新建时，自动填充标题为 账单
        content: "",
        is_public: false,
        is_markdown: false,
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
    projectStore.isDiaryNeedToBeRecovered = false
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
function getWeatherNameFromCode(code: string): string{
    return EnumWeather[Number(code)] || 'sunny'
}
</script>

<style lang="scss">
@import "edit";
</style>
