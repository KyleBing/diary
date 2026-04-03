<template>
    <MenuPanelContainer>
        <div class="menu-section">
            <div class="menu-section-title">密码</div>
            <div class="menu-section-subtitle"></div>
            <div class="menu-section-content">
                <div class="btn-list">
                    <div class="btn btn-active" @click="goToChangePassword">修改密码</div>
                    <!--                   <div class="btn btn-active" @click="goToChangePassword">找回密码</div>-->
                </div>

                <div class="desc">忘记密码，可以通过注册的邮箱给管理员 {{ projectConfig.admin_email }} 发邮件重置密码</div>
            </div>
        </div>
        <div class="menu-section">
            <div class="menu-section-title">导出日记</div>
            <div class="menu-section-content">

                <div class="description">

                    <div class="description-item">
                        <div class="description-item-title">基于现有筛选条件导出日记内容到指定格式的文件。</div>
                    </div>

                    <div class="filter-wrapper">
                        <div class="description-item">
                            <div class="description-item-title">日记类别：</div>
                            <div class="description-item-content">
                                <ExportCategorySelector />
                            </div>
                        </div>
                        <div class="description-item" v-if="projectStore.keywords.length > 0">
                            <div class="description-item-title">关键字：</div>
                            <div class="description-item-content">
                                <span v-for="keyword in projectStore.keywords" :key="keyword">“{{ keyword }}”</span>
                            </div>
                        </div>
                        <div class="description-item">
                            <div class="description-item-title">时间区间：</div>
                            <div class="description-item-content">
                                <DatePicker
                                    locale="zh"
                                    v-model="exportTimeRange"
                                    mode="date"
                                    is-range
                                    :popover="exportPopoverOptions"
                                >
                                    <template #default="{ togglePopover }">
                                        <div class="export-datetime" @click="() => togglePopover()">
                                            <div class="value">
                                                {{ exportTimeRange?.start ? dateFormatter(exportTimeRange.start, 'yyyy-MM-dd') : '—' }}
                                                ~
                                                {{ exportTimeRange?.end ? dateFormatter(exportTimeRange.end, 'yyyy-MM-dd') : '—' }}
                                            </div>
                                        </div>
                                    </template>
                                    <template #footer>
                                        <div class="p-2 pt-0"></div>
                                    </template>
                                </DatePicker>
                            </div>
                    </div>


                    </div>
                    <div class="description-item" v-if="projectStore.isFilterShared">
                        <div class="description-item-title">是否筛选共享日记：</div>
                        <div class="description-item-content">
                            <span v-if="projectStore.isFilterShared">是</span>
                        </div>
                    </div>
                </div>
                <div class="btn-list">
                    <div class="btn btn-active" @click="exportDiary('csv')">csv</div>
                    <div class="btn btn-active" @click="exportDiary('json')">json</div>
                    <div class="btn btn-active" @click="exportDiary('text')">txt</div>
                    <div class="btn btn-active" @click="exportDiary('sql')">sql</div>
                </div>
            </div>
            <div class="desc" v-if="isDownloadingContent">导出中，请耐心等待，勿进行其它操作...</div>
        </div>
        <div class="menu-section">
            <div class="menu-section-title">再见</div>
            <div class="menu-section-subtitle">清空日记内容</div>
            <div class="menu-section-content">
                <div class="btn-list">
                    <div class="btn btn-active" @click="clearDiary">清空日记 ？</div>
                    <div class="btn btn-active" @click="destroyAccount">注销账号 ？</div>
                </div>
            </div>
            <div class="desc" v-if="isDownloadingContent">导出中，请耐心等待，勿进行其它操作...</div>
        </div>
    </MenuPanelContainer>
</template>

<script lang="ts" setup>
import projectConfig from "../../../../config/project_config.json";
import {onMounted, ref, watch} from "vue";
import {useProjectStore} from "@/pinia/useProjectStore";
import {useRouter} from "vue-router";
import {WeatherMap} from "@/entity/Weather";
import {
    dateFormatter,
    formatDiaryDateRangeLabel,
    getAuthorization,
    getDiaryConfigFromLocalStorage,
    popMessage,
    setDiaryConfig
} from "@/utility";
import {EntityDiaryFromServer, DiarySearchParams} from "@/view/DiaryList/Diary";
import diaryApi from "@/api/diaryApi.js";
import MenuPanelContainer from "@/framework/MenuPanelContainer.vue";
import {useStatisticStore} from "@/pinia/useStatisticStore";
import Moment from "moment";
import {DatePicker} from "v-calendar";
import ExportCategorySelector from "@/view/Menu/MenuOtherFunction/ExportCategorySelector.vue";

const projectStore = useProjectStore()
const router = useRouter()
const statisticStore = useStatisticStore()
const isDownloadingContent = ref(false)

type ExportRange = { start: Date, end: Date } | null
const exportTimeRange = ref<ExportRange>(null)
const exportPopoverOptions = ref({
    visibility: 'click' as const,
    placement: 'bottom' as const,
    autoHide: true,
    showDelay: 0,
    hideDelay: 0,
})

onMounted(() => {
    // 初始化：从 store（本地持久化的）时间区间恢复到选择器
    if (projectStore.dateFilterTimeStart && projectStore.dateFilterTimeEnd) {
        const start = Moment(projectStore.dateFilterTimeStart, 'YYYY-MM-DD HH:mm:ss', true)
        const end = Moment(projectStore.dateFilterTimeEnd, 'YYYY-MM-DD HH:mm:ss', true)
        if (start.isValid() && end.isValid()) {
            exportTimeRange.value = { start: start.toDate(), end: end.toDate() }
        }
    }
})

watch(exportTimeRange, (newValue) => {
    if (newValue) {
        projectStore.dateFilterTimeStart = Moment(newValue.start).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        projectStore.dateFilterTimeEnd = Moment(newValue.end).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    } else {
        projectStore.dateFilterTimeStart = ''
        projectStore.dateFilterTimeEnd = ''
    }
    const diaryConfig = getDiaryConfigFromLocalStorage()
    diaryConfig.dateFilterTimeStart = projectStore.dateFilterTimeStart
    diaryConfig.dateFilterTimeEnd = projectStore.dateFilterTimeEnd
    setDiaryConfig(diaryConfig)
}, {deep: true})

function clearDiary() {
    projectStore.isMenuShowed = false
    router.push({name: 'RemoveAllYourDiary'})
}

function destroyAccount() {
    projectStore.isMenuShowed = false
    router.push({name: 'DestroyAccount'})
}

function goToChangePassword() {
    projectStore.isMenuShowed = false
    router.push({name: 'ChangePassword'})
}

function getFilterConditionsForFileName(): string {
    const conditions: string[] = []

    // 类别筛选
    if (projectStore.filteredCategories.length === 0) {
        // 如果为空，表示选择了全部类别
        conditions.push('全部类别')
    } else {
        // 检查是否选择了所有类别
        const allCategoryNames = statisticStore.categoryAll.map(cat => cat.name_en)
        const isAllSelected = projectStore.filteredCategories.length === allCategoryNames.length &&
            projectStore.filteredCategories.every(cat => allCategoryNames.includes(cat))

        if (isAllSelected) {
            conditions.push('全部类别')
        } else {
            const categoryNames = projectStore.filteredCategories
                .map(cat => statisticStore.categoryNameMap.get(cat) || cat)
                .join('+')
            conditions.push(`${categoryNames}`)
        }
    }

    // 关键字
    if (projectStore.keywords.length > 0) {
        const keywords = projectStore.keywords.join('+')
        conditions.push(`${keywords}`)
    }

    // 时间筛选（与导航栏一致的日期区间）
    const rangeLabel = formatDiaryDateRangeLabel(projectStore.dateFilterTimeStart, projectStore.dateFilterTimeEnd)
    if (rangeLabel) {
        const safe = rangeLabel.replace(/[<>:"/\\|?*]/g, '_')
        conditions.push(safe)
    }

    // 共享筛选
    if (projectStore.isFilterShared) {
        conditions.push('仅共享')
    }

    return conditions.length > 0 ? `-${conditions.join('-')}` : ''
}

function exportDiary(fileFormat: string) {
    isDownloadingContent.value = true
    // Build params same as list params
    const exportParams: DiarySearchParams = {
        keywords: JSON.stringify(projectStore.keywords),
        pageNo: 1,
        pageSize: 100,
        categories: JSON.stringify(projectStore.filteredCategories),
        filterShared: (projectStore.isFilterShared ? 1 : 0) as 0 | 1,
        timeStart: projectStore.dateFilterTimeStart || undefined,
        timeEnd: projectStore.dateFilterTimeEnd || undefined,
    }
    diaryApi
        .export(exportParams)
        .then(res => {
            isDownloadingContent.value = false
            let diaryList = res.data
            const filterConditions = getFilterConditionsForFileName()
            let fileName = `日记导出-${getAuthorization()?.nickname}${filterConditions}-${dateFormatter(new Date(), 'yyyy-MM-dd_hhmmss')}`

            if (diaryList.length > 0) {
                switch (fileFormat) {
                    case 'csv':
                        downloadFile(`${fileName}.csv`, getCVSData(diaryList))
                        break;
                    case 'json':
                        downloadFile(`${fileName}.json`, JSON.stringify(diaryList))
                        break;
                    case 'text':
                        downloadFile(`${fileName}.txt`, getTextData(diaryList))
                        break;
                    case 'sql':
                        downloadFile(`${fileName}.sql`, getSqlData(diaryList))
                        break;
                }
            } else {
                popMessage('warning', '日记为空')
            }
        })
}

function getSqlData(diaryList: EntityDiaryFromServer[]) {
    let finalData = ''
    diaryList.forEach(diary => {
        let date = dateFormatter(new Date(diary.date))
        let dateModify = dateFormatter(new Date(diary.date_modify))
        let dateCreate = dateFormatter(new Date(diary.date_create))
        let category = statisticStore.categoryNameMap.get(diary.category)
        const uid = getAuthorization()?.uid ?? 0
        finalData =
            finalData.concat(`
INSERT INTO
diaryList(id, date, date_create, date_modify, category, is_markdown, is_public, temperature, temperature_outside, title, content, uid)
VALUES (${diary.id}, '${date}','${dateCreate}','${dateModify}','${category}',${diary.is_markdown},${diary.is_public},${diary.temperature},${diary.temperature_outside}, '${diary.title}', '${diary.content}',${uid});\n`)
    })
    return finalData
}

function getCVSData(diaryList: EntityDiaryFromServer[]) {
    let finalData = 'ID,日期,编辑时间,创建时间,类别,天气,身处温度,外界气温,Markdown,标题,内容\n'
    diaryList.forEach(diary => {
        let date = dateFormatter(new Date(diary.date))
        let dateModify = dateFormatter(new Date(diary.date_modify))
        let dateCreate = dateFormatter(new Date(diary.date_create))
        let is_markdown = diary.is_markdown === 0 ? '否' : '是'
        let temperature = diary.temperature === -273 ? '' : `${diary.temperature}℃`
        let temperature_outside = diary.temperature_outside === -273 ? '' : `${diary.temperature_outside}℃`
        let weather = WeatherMap.get(diary.weather)
        let category = statisticStore.categoryNameMap.get(diary.category)
        let content = diary.content.replace(/\"/g, '\"')
        finalData =
            finalData.concat(`${diary.id},${date},${dateModify},${dateCreate},${category},${weather},${temperature},${temperature_outside},${is_markdown},${diary.title},"${content}"\n`)
    })
    return finalData
}

function getTextData(diaryList: EntityDiaryFromServer[]) {
    let finalData = `※※※※※※※※※※※※※※※※※※※※※※※※※※※※

    导出日期：${dateFormatter(new Date())}
    用　　户：${getAuthorization()?.nickname}
    总　　计：${diaryList.length} 条
    Email：${getAuthorization()?.email}
    UID：${getAuthorization()?.uid}

※※※※※※※※※※※※※※※※※※※※※※※※※※※※
\n\n\n\n`
    diaryList.forEach(diary => {
        let date = dateFormatter(new Date(diary.date))
        let dateModify = dateFormatter(new Date(diary.date_modify))
        let dateCreate = dateFormatter(new Date(diary.date_create))
        let is_markdown = diary.is_markdown === 0 ? '否' : '是'
        let temperature = diary.temperature === -273 ? '' : `${diary.temperature}℃`
        let temperature_outside = diary.temperature_outside === -273 ? '' : `${diary.temperature_outside}℃`
        let weather = WeatherMap.get(diary.weather)
        let category = statisticStore.categoryNameMap.get(diary.category)
        finalData =
            finalData.concat(`=== ${diary.id} =====================\n
日　　期：${date}
编辑日期：${dateModify}
创建日期：${dateCreate}
类　　别：${category}
天　　气：${weather}
身处温度：${temperature}
室外温度：${temperature_outside}
MarkDown：${is_markdown}
标　　题：${diary.title}
内　　容：${diary.content}
\n`)
    })
    return finalData
}

function downloadFile(fileName: string, data: any) { // 下载文件
    let aLink = document.createElement('a')
    let blob = new Blob([data]); //new Blob([content])
    let evt = document.createEvent("HTMLEvents")
    evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)
    aLink.click()
}
</script>

<style scoped lang="scss">
@import "../../../scss/plugin";

.filter-wrapper{
    border: 1px solid $color-border-menu;
    padding: 8px 10px;
    border-radius: 5px;
}

.description{
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
}
.description-item{
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
    display: flex;
    flex-flow: row nowrap;
    &:last-child{
        margin-bottom: 0;
    }
    .description-item-title{
        white-space: nowrap;
        margin-right: 10px;
        font-size: 12px;
        color: $text-menu-second;
    }
    .description-item-content{
        font-size: 12px;
        color: $text-menu-second;
        display: flex;
        flex-flow: row wrap;
    }
}

.export-datetime{
    user-select: none;
    width: 100%;
    cursor: pointer;

    .value{
        color: $text-menu-second;
        white-space: nowrap;
        &:hover{
            color: $color-main;
            text-decoration: underline;
        }
    }
}
</style>
