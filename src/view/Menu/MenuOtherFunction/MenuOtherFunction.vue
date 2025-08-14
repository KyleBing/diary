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

               <div class="desc">忘记密码，可以通过注册的邮箱给管理员 {{ projectConfig.adminEmail }} 发邮件重置密码</div>
           </div>
       </div>
       <div class="menu-section">
           <div class="menu-section-title">导出日记</div>
           <div class="menu-section-subtitle">导出所有日记内容到指定格式的文件</div>
           <div class="menu-section-content">
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
import projectConfig from "../../../../config/projectConfig.json";
import {onMounted, ref} from "vue";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {useRouter} from "vue-router";
import {WeatherArray} from "@/entity/Weather.ts";
import {dateFormatter, getAuthorization, popMessage} from "@/utility.ts";
import {DiaryEntity} from "@/view/DiaryList/Diary.ts";
import diaryApi from "@/api/diaryApi.js";
import MenuPanelContainer from "@/framework/MenuPanelContainer.vue";
import { useStatisticStore } from "@/pinia/useStatisticStore.ts";
const projectStore = useProjectStore()
const router = useRouter()
const statisticStore = useStatisticStore()
const isDownloadingContent = ref(false)
const weatherMap = ref(new Map()) // 天气 MAP

onMounted(()=>{
    weatherMap.value = new Map()
    WeatherArray.forEach(weather => {
        weatherMap.value.set(weather.title, weather.name)
    })
})

function clearDiary(){
    projectStore.isMenuShowed = false
    router.push({name: 'RemoveAllYourDiary'})
}
function destroyAccount(){
    projectStore.isMenuShowed = false
    router.push({name: 'DestroyAccount'})
}
function goToChangePassword(){
    projectStore.isMenuShowed = false
    router.push({name: 'ChangePassword'})
}
function exportDiary(fileFormat){
    isDownloadingContent.value = true
    diaryApi
        .export()
        .then(res => {
            isDownloadingContent.value = false
            let diaries = res.data
            let fileName = `日记导出-${getAuthorization().nickname}-${dateFormatter(new Date(), 'yyyy-MM-dd_hhmmss')}`
            if (diaries.length > 0){
                switch (fileFormat){
                    case 'csv':
                        downloadFile(`${fileName}.csv`, getCVSData(diaries))
                        break;
                    case 'json':
                        downloadFile(`${fileName}.json`, JSON.stringify(diaries))
                        break;
                    case 'text':
                        downloadFile(`${fileName}.txt`, getTextData(diaries))
                        break;
                    case 'sql':
                        downloadFile(`${fileName}.sql`, getSqlData(diaries))
                        break;
                }
            } else {
                popMessage('warning', '日记为空')
            }
        })
}

function getSqlData(diaries: DiaryEntity[]){
    let finalData = ''
    diaries.forEach(diary => {
        let date = dateFormatter(new Date(diary.date))
        let dateModify = dateFormatter(new Date(diary.date_modify))
        let dateCreate = dateFormatter(new Date(diary.date_create))
        let is_markdown = diary.is_markdown === 0? '否': '是'
        let temperature = diary.temperature === -273? '':`${diary.temperature}℃`
        let temperature_outside = diary.temperature_outside === -273? '':`${diary.temperature_outside}℃`
        let weather = weatherMap.value.get(diary.weather)
        let category = statisticStore.categoryNameMap.get(diary.category)
        finalData =
            finalData.concat(`
INSERT INTO
diaries(id, date, date_create, date_modify, category, is_markdown, is_public, temperature, temperature_outside, title, content, uid)
VALUES (${diary.id}, '${date}','${dateCreate}','${dateModify}','${category}',${diary.is_markdown},${diary.is_public},${diary.temperature},${diary.temperature_outside}, '${diary.title}', '${diary.content}',${getAuthorization().uid});\n`)
    })
    return finalData
}

function getCVSData(diaries: DiaryEntity[]){
    let finalData = 'ID,日期,编辑时间,创建时间,类别,天气,身处温度,外界气温,Markdown,标题,内容\n'
    diaries.forEach(diary => {
        let date = dateFormatter(new Date(diary.date))
        let dateModify = dateFormatter(new Date(diary.date_modify))
        let dateCreate = dateFormatter(new Date(diary.date_create))
        let is_markdown = diary.is_markdown === 0? '否': '是'
        let temperature = diary.temperature === -273? '':`${diary.temperature}℃`
        let temperature_outside = diary.temperature_outside === -273? '':`${diary.temperature_outside}℃`
        let weather = weatherMap.value.get(diary.weather)
        let category = statisticStore.categoryNameMap.get(diary.category)
        let content = diary.content.replace(/\"/g, '\"')
        finalData =
            finalData.concat(`${diary.id},${date},${dateModify},${dateCreate},${category},${weather},${temperature},${temperature_outside},${is_markdown},${diary.title},"${content}"\n`)
    })
    return finalData
}

function getTextData(diaries: DiaryEntity[]){
    let finalData = `※※※※※※※※※※※※※※※※※※※※※※※※※※※※

    导出日期：${dateFormatter(new Date())}
    用　　户：${getAuthorization().nickname}
    总　　计：${diaries.length} 条
    Email：${getAuthorization().email}
    UID：${getAuthorization().uid}

※※※※※※※※※※※※※※※※※※※※※※※※※※※※
\n\n\n\n`
    diaries.forEach(diary => {
        let date = dateFormatter(new Date(diary.date))
        let dateModify = dateFormatter(new Date(diary.date_modify))
        let dateCreate = dateFormatter(new Date(diary.date_create))
        let is_markdown = diary.is_markdown === 0? '否': '是'
        let temperature = diary.temperature === -273? '':`${diary.temperature}℃`
        let temperature_outside = diary.temperature_outside === -273? '':`${diary.temperature_outside}℃`
        let weather = weatherMap.value.get(diary.weather)
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

</style>
