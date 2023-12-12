<template>
    <div class="todo-list">
        <div :class="['todo-list-item', {done: item.isDone}]"
             v-for="(item, index) in todoList" :key="index">
            <div class="checkbox-wrapper">
                <div :class="['checkbox', {checked: item.isDone}]"
                     @click="toggleDoneStatus(item)"></div>
            </div>
            <div class="content-wrapper">
                <div class="content">{{item.content}}</div>
                <div class="note">{{item.note}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import utility from "../../utility"
import {mapGetters, mapState} from "vuex"
import diaryApi from "../../api/diaryApi"

export default {
    name: 'ToDo',
    components: {},
    props: {
        readonly: {
            type: Boolean,
            default: false
        },
        diary: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            todoList : [],
            lastId: 0, // 最后一个修改后的 id，用于将最后一个标记的 todoItem 移到列表最后
        }
    },
    mounted() {
        this.processContent(this.diary)
    },
    computed:{
        ...mapState(['categoryAll', 'insets', 'isHideContent']),
        ...mapGetters(['isInMobileMode', 'categoryNameMap', 'categoryObjectMap']),
    },
    watch: {
        diary(newValue){
            this.processContent(newValue)
        },
    },
    methods: {
        toggleDoneStatus(todoItem){
            if (!this.readonly){
                if (todoItem.isDone){
                    this.lastId = this.lastId + 1
                    todoItem.id = this.lastId
                }
                todoItem.isDone = !todoItem.isDone
                // 拆分 标记 | 未标记的，并通过 id 排序，实现类似 iPhone todoList 的效果
                let unfinished = this.todoList
                    .filter(item => !item.isDone)
                    .sort((a,b) => a.id - b.id)
                let finished = this.todoList
                    .filter(item => item.isDone)
                    .sort((a,b) => a.id - b.id)
                this.todoList = unfinished.concat(finished)
                this.saveDiary()
            }
        },
        processContent(diary){
            if (diary.content){
                let todoStringList = diary.content.split('\n')
                this.todoList = todoStringList
                    .filter(item => /^[\-\=]/.test(item)) // 只保留开头是 - | = 的
                    .map((item, index) => {
                        let isDone = item.substring(0, 1) === '='
                        let content = item.substring(2).split('#') //
                        return {
                            id: index,
                            isDone: isDone,
                            content: content[0].trim(),
                            note: content[1]? content[1].trim(): ''
                        }
                    })
                this.lastId = this.todoList.length
            }
        },
        toDiaryString(todoList){
            let finalString = ''
            if (todoList.length > 0){
                todoList.forEach(item => {
                    let prefix = item.isDone ? '= ':'- '
                    let note = item.note? ` #${item.note}`:''
                    finalString = finalString.concat(`${prefix}${item.content}${note}\n`)
                })
            }
            return finalString
        },
        saveDiary(){
            let requestData = {
                id: this.diary.id,
                title: this.diary.title,
                content: this.toDiaryString(this.todoList),
                category: this.diary.category,
                temperature: utility.temperatureProcessCTS(this.diary.temperature),
                temperatureOutside: utility.temperatureProcessCTS(this.diary.temperatureOutside),
                weather: this.diary.weather,
                isPublic: this.diary.isPublic ? 1 : 0,
                isMarkdown: this.diary.isMarkdown ? 1 : 0,
                date: utility.dateFormatter(new Date(this.diary.date)),
            }
            diaryApi
                .modify(requestData)
                .then()
                .catch(err => {
                    utility
                        .popMessage('danger', err.message, 1)
                })
        }
    }
}

</script>

<style lang="scss">
@import "todo";
</style>
