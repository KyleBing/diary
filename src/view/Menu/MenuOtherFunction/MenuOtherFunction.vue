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
            <div class="menu-section-subtitle">基于现有筛选条件导出日记内容到指定格式的文件</div>
            <div class="menu-section-content">

                <div class="description">
                    <div class="description-item">
                        <div class="description-item-title">已选择的日记类别：</div>
                        <div class="description-item-content">
                            <template v-if="projectStore.filteredCategories.length > 0">
                                <span v-for="(category, index) in projectStore.filteredCategories"
                                :style="`color: ${useStatisticStore().categoryObjectMap.get(category)?.color || '#666'}`"
                                :key="category">{{ useStatisticStore().categoryNameMap.get(category) || category }}{{ index < projectStore.filteredCategories.length - 1 ? '，' : '' }}</span>
                            </template>
                            <template v-else>
                                <span v-for="category in useStatisticStore().categoryAll"
                                :style="`color: ${category.color}`"
                                :key="category.name_en">{{ category.name }}，</span>
                            </template>
                        </div>
                    </div>
                    <div class="description-item" v-if="projectStore.keywords.length > 0">
                        <div class="description-item-title">关键字：</div>
                        <div class="description-item-content">
                            <span v-for="keyword in projectStore.keywords" :key="keyword">“{{ keyword }}”</span>
                        </div>
                    </div>
                    <div class="description-item" v-if="projectStore.dateFilterString">
                        <div class="description-item-title">时间跨度：</div>
                        <div class="description-item-content">
                            <span v-if="projectStore.dateFilterString">{{ projectStore.dateFilterString }}</span>
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
import {onMounted, ref} from "vue";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {useRouter} from "vue-router";
import {WeatherMap} from "@/entity/Weather.ts";
import {dateFormatter, getAuthorization, popMessage} from "@/utility.ts";
import {EntityDiaryForm, DiarySearchParams} from "@/view/DiaryList/Diary.ts";
import diaryApi from "@/api/diaryApi.js";
import MenuPanelContainer from "@/framework/MenuPanelContainer.vue";
import {useStatisticStore} from "@/pinia/useStatisticStore.ts";

const projectStore = useProjectStore()
const router = useRouter()
const statisticStore = useStatisticStore()
const isDownloadingContent = ref(false)

onMounted(() => {
})

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
    
    // 时间筛选
    if (projectStore.dateFilterString) {
        // 移除可能存在的特殊字符，替换为下划线
        const dateFilter = projectStore.dateFilterString.replace(/[<>:"/\\|?*]/g, '_')
        conditions.push(`${dateFilter}`)
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
        dateFilterString: projectStore.dateFilterString || ''
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

function getSqlData(diaryList: EntityDiaryForm[]) {
    let finalData = ''
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
            finalData.concat(`
INSERT INTO
diaryList(id, date, date_create, date_modify, category, is_markdown, is_public, temperature, temperature_outside, title, content, uid)
VALUES (${diary.id}, '${date}','${dateCreate}','${dateModify}','${category}',${diary.is_markdown},${diary.is_public},${diary.temperature},${diary.temperature_outside}, '${diary.title}', '${diary.content}',${getAuthorization().uid});\n`)
    })
    return finalData
}

function getCVSData(diaryList: EntityDiaryForm[]) {
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

function getTextData(diaryList: EntityDiaryForm[]) {
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

.description{
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
}
.description-item{
    font-size: 12px;
    color: #666;
    margin-bottom: 7px;
    display: flex;
    flex-flow: row nowrap;
    .description-item-title{
        white-space: nowrap;
        margin-right: 10px;
        font-size: 12px;
        color: $text-menu-second;
        font-weight: bold;
    }
    .description-item-content{
        font-size: 12px;
        color: $text-menu-second;
        display: flex;
        flex-flow: row wrap;
    }
}
</style>
