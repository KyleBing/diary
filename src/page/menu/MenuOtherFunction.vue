<template>
   <div class="menu-others-container">
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
           <div class="menu-section-title">导出</div>
           <div class="menu-section-subtitle">导出指定格式的文件</div>
           <div class="menu-section-content">
               <div class="btn-list">
                   <div class="btn btn-active" @click="exportDiary('csv')">csv</div>
                   <div class="btn btn-active" @click="exportDiary('json')">json</div>
                   <div class="btn btn-active" @click="exportDiary('text')">text</div>
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
                   <div class="btn btn-active" @click="destroyAccount">注销帐号 ？</div>
               </div>
           </div>
           <div class="desc" v-if="isDownloadingContent">导出中，请耐心等待，勿进行其它操作...</div>
       </div>
   </div>

</template>

<script>
import projectConfig from "@/projectConfig";
import {mapGetters, mapMutations} from "vuex";
import diaryApi from "@/api/diaryApi";
import utility from "@/utility";
import userApi from "@/api/userApi";

export default {
    name: "MenuOtherFunction",
    data(){
        return {
            projectConfig,
            isDownloadingContent: false,
            weatherMap: new Map(), // 天气 MAP
        }
    },
    computed: {
        ...mapGetters(['categoryNameMap'])
    },
    mounted() {
        this.weatherMap = new Map()
        utility.WEATHER.forEach(weather => {
            this.weatherMap.set(weather.title, weather.name)
        })
    },

    methods: {
        ...mapMutations(['SET_MENU_SHOWED']),
        clearDiary(){
            this.SET_MENU_SHOWED(false)
            this.$router.push({name: 'ClearDiary'})
        },
        destroyAccount(){
            this.SET_MENU_SHOWED(false)
            this.$router.push({name: 'DestroyAccount'})
        },
        goToChangePassword(){
            this.SET_MENU_SHOWED(false)
            this.$router.push({name: 'ChangePassword'})
        },
        exportDiary(fileFormat){
            this.isDownloadingContent = true
            diaryApi
                .export()
                .then(res => {
                    this.isDownloadingContent = false
                    let diaries = res.data
                    let fileName = `日记导出-${utility.getAuthorization().nickname}-${utility.dateFormatter(new Date(), 'yyyy-MM-dd_hhmmss')}`
                    if (diaries.length > 0){
                        switch (fileFormat){
                            case 'csv':
                                this.downloadFile(`${fileName}.csv`, this.getCVSData(diaries))
                                break;
                            case 'json':
                                this.downloadFile(`${fileName}.json`, JSON.stringify(diaries))
                                break;
                            case 'text':
                                this.downloadFile(`${fileName}.txt`, this.getTextData(diaries))
                                break;
                            case 'sql':
                                this.downloadFile(`${fileName}.sql`, this.getSqlData(diaries))
                                break;
                        }
                    } else {
                        utility.popMessage('warning', '日记为空')
                    }
                })
        },

        getSqlData(diaries){
            let finalData = ''
            diaries.forEach(diary => {
                let date = utility.dateFormatter(new Date(diary.date))
                let dateModify = utility.dateFormatter(new Date(diary.date_modify))
                let dateCreate = utility.dateFormatter(new Date(diary.date_create))
                let isMarkdown = diary.is_markdown === 0? '否': '是'
                let temperature = diary.temperature === -273? '':`${diary.temperature}℃`
                let temperature_outside = diary.temperature_outside === -273? '':`${diary.temperature_outside}℃`
                let weather = this.weatherMap.get(diary.weather)
                let category = this.categoryNameMap.get(diary.category)
                finalData =
                    finalData.concat(`
INSERT INTO
diaries(id, date, date_create, date_modify, category, is_markdown, is_public, temperature, temperature_outside, title, content, uid)
VALUES (${diary.id}, '${date}','${dateCreate}','${dateModify}','${category}',${diary.is_markdown},${diary.is_public},${diary.temperature},${diary.temperature_outside}, '${diary.title}', '${diary.content}',${utility.getAuthorization().uid});\n`)
            })
            return finalData
        },

        getCVSData(diaries){
            let finalData = 'ID,日期,编辑时间,创建时间,类别,天气,身处温度,外界气温,Markdown,标题,内容\n'
            diaries.forEach(diary => {
                let date = utility.dateFormatter(new Date(diary.date))
                let dateModify = utility.dateFormatter(new Date(diary.date_modify))
                let dateCreate = utility.dateFormatter(new Date(diary.date_create))
                let isMarkdown = diary.is_markdown === 0? '否': '是'
                let temperature = diary.temperature === -273? '':`${diary.temperature}℃`
                let temperature_outside = diary.temperature_outside === -273? '':`${diary.temperature_outside}℃`
                let weather = this.weatherMap.get(diary.weather)
                let category = this.categoryNameMap.get(diary.category)
                let content = diary.content.replace(/\"/g, '\"')
                finalData =
                    finalData.concat(`${diary.id},${date},${dateModify},${dateCreate},${category},${weather},${temperature},${temperature_outside},${isMarkdown},${diary.title},"${content}"\n`)
            })
            return finalData
        },

        getTextData(diaries){
            let finalData = `※※※※※※※※※※※※※※※※※※※※※※※※※※※※

    导出日期：${utility.dateFormatter(new Date())}
    用　　户：${utility.getAuthorization().nickname}
    总　　计：${diaries.length} 条
    Email：${utility.getAuthorization().email}
    UID：${utility.getAuthorization().uid}

※※※※※※※※※※※※※※※※※※※※※※※※※※※※
\n\n\n\n`
            diaries.forEach(diary => {
                let date = utility.dateFormatter(new Date(diary.date))
                let dateModify = utility.dateFormatter(new Date(diary.date_modify))
                let dateCreate = utility.dateFormatter(new Date(diary.date_create))
                let isMarkdown = diary.is_markdown === 0? '否': '是'
                let temperature = diary.temperature === -273? '':`${diary.temperature}℃`
                let temperature_outside = diary.temperature_outside === -273? '':`${diary.temperature_outside}℃`
                let weather = this.weatherMap.get(diary.weather)
                let category = this.categoryNameMap.get(diary.category)
                finalData =
                    finalData.concat(`=== ${diary.id} =====================\n
日　　期：${date}
编辑日期：${dateModify}
创建日期：${dateCreate}
类　　别：${category}
天　　气：${weather}
身处温度：${temperature}
室外温度：${temperature_outside}
MarkDown：${isMarkdown}
标　　题：${diary.title}
内　　容：${diary.content}
\n`)
            })
            return finalData
        },

        downloadFile(fileName, data) { // 下载文件
            let aLink = document.createElement('a')
            let blob = new Blob([data]); //new Blob([content])
            let evt = document.createEvent("HTMLEvents")
            evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
            aLink.download = fileName
            aLink.href = URL.createObjectURL(blob)
            aLink.click()
        },

    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";

</style>
