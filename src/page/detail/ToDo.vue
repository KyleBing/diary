<template>
    <div class="todo-list">
        <div :class="['todo-list-item', {done: item.isDone}]"
             v-for="(item, index) in todoList" :key="index">
            <div class="checkbox-wrapper">
                <div :class="['checkbox', {checked: item.isDone}]"
                     @click="toggleDoneStatus(item)"></div>
            </div>
            <div class="content-wrapper">
                <div contenteditable="true" @input="handleContentChange(item, $event)" class="content">
                    {{storeProject.isHideContent? item.content.replace(/[^，。 \n]/g, '*'): item.content}}
                </div>
                <div
                    v-if="item.note"
                    contenteditable="true" @input="handleNoteChange(item, $event)" class="note">
                    {{storeProject.isHideContent? item.note?.replace(/[^，。 \n]/g, '*'): item.note}}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import diaryApi from "../../api/diaryApi.ts"
import {nextTick, onMounted, ref, watch} from "vue";
import {DiaryEntity, DiarySubmitEntity} from "../list/Diary.ts";
import {dateFormatter, popMessage, temperatureProcessCTS} from "@/utility.ts";
import {useProjectStore} from "../../pinia";
const storeProject = useProjectStore();

interface TODOEntity {
    id: number,
    isDone: boolean,
    content: string,
    note?: string
}

interface Props {
    readonly: boolean,
    diary: DiaryEntity
}
const props = defineProps<Props>()

const todoList= ref<Array<TODOEntity>>([])
const lastId = ref(0) // 最后一个修改后的 id，用于将最后一个标记的 todoItem 移到列表最后

onMounted(()=>{
    processContent(props.diary)
    window.onkeydown = event => {
        // CTRL + S 保存
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault()
            saveDiary(true)
        }
    }
})

watch(() => props.diary, newValue => {
    processContent(newValue)
})

function toggleDoneStatus(todoItem: TODOEntity){
    if (!props.readonly){
        if (todoItem.isDone){
            lastId.value = lastId.value + 1
            todoItem.id = lastId.value
        }
        todoItem.isDone = !todoItem.isDone
        // 拆分 标记 | 未标记的，并通过 id 排序，实现类似 iPhone todoList 的效果
        let unfinished = todoList.value
            .filter(item => !item.isDone)
            .sort((a, b) => a.id - b.id)
        let finished = todoList.value
            .filter(item => item.isDone)
            .sort((a,b) => a.id - b.id)
        todoList.value = unfinished.concat(finished)
        saveDiary()
    }
}
// 将日记内容转换成 TODOS
function processContent(diary: DiaryEntity){
    if (diary.content){
        let todoStringList = diary.content.split('\n')
        todoList.value = todoStringList
            .filter(item => /^[\-=]/.test(item)) // 只保留开头是 - | = 的
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
        const todoDone = todoList.value.filter(item => item.isDone)
        const todoUndone = todoList.value.filter(item => !item.isDone)
        todoList.value = todoUndone.concat(todoDone)
        lastId.value = todoList.value.length
        saveDiary()
    }
}
function toDiaryString(todoList: TODOEntity[]){
    let finalString = ''
    if (todoList.length > 0){
        todoList.forEach(item => {
            let prefix = item.isDone ? '= ':'- '
            let note = item.note? ` #${item.note}`:''
            finalString = finalString.concat(`${prefix}${item.content}${note}\n`)
        })
    }
    return finalString
}
function saveDiary(isShowNotification?: boolean){
    let requestData: DiarySubmitEntity = {
        id: props.diary.id,
        title: props.diary.title,
        content: toDiaryString(todoList.value),
        category: props.diary.category,
        temperature: temperatureProcessCTS(props.diary.temperature),
        temperature_outside: temperatureProcessCTS(props.diary.temperature_outside),
        weather: props.diary.weather,
        is_public: props.diary.is_public ? 1 : 0,
        is_markdown: props.diary.is_markdown ? 1 : 0,
        date: dateFormatter(new Date(props.diary.date)),
    }
    diaryApi
        .modify(requestData)
        .then(res => {
            if (isShowNotification){
                popMessage('success', res.message, ()=>{}, 1)
            }
        })
        .catch(err => {
            popMessage('danger', err.message, ()=>{},1)
        })
}

// DELETE
function deleteToDo(index: number){
    todoList.value.splice(index, 1)
    saveDiary()
}


/**
 * 实时修改 todo 内容
 * @param todoItem
 * @param ev
 */
function handleContentChange(todoItem: TODOEntity, ev: Event){
    todoItem.content = (ev.target as HTMLDivElement).innerText
}
function handleNoteChange(todoItem: TODOEntity, ev: Event){
    todoItem.note =  (ev.target as HTMLDivElement).innerText
}



</script>

<style lang="scss">
@import "todo";
</style>
