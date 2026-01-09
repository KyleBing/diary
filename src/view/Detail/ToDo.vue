<template>
    <div class="todo-list">
        <draggable 
            v-model="todoList"
            item-key="id"
            @end="onDragEnd"
            :disabled="props.readonly"
        >
            <template #item="{ element: item }">
                <div :class="['todo-list-item', {done: item.isDone}]">
                    <div class="checkbox-wrapper">
                        <div :class="['checkbox', {checked: item.isDone}]"
                             :style="{'--todo-color': statisticStore.categoryObjectMap.get('todo')?.color}"
                             @click="toggleDoneStatus(item)">
                        </div>
                    </div>
                    <div class="content-wrapper">
                        <div 
                            contenteditable="true" 
                            @input="handleContentChange(item, $event)"
                            @blur="handleContentBlur(item, $event)"
                            @focus="handleContentFocus(item, $event)"
                            :ref="(el) => setContentRef(el as HTMLDivElement, item.id)"
                            class="content">
                        </div>
                        <div
                            v-if="item.note"
                            contenteditable="true" 
                            @input="handleNoteChange(item, $event)"
                            @blur="handleNoteBlur(item, $event)"
                            @focus="handleNoteFocus(item, $event)"
                            :ref="(el) => setNoteRef(el as HTMLDivElement, item.id)"
                            class="note">
                        </div>
                    </div>
                </div>
            </template>
        </draggable>
    </div>
</template>

<script lang="ts" setup>
import diaryApi from "@/api/diaryApi.ts"
import {onMounted, ref, watch, nextTick} from "vue";
import {EntityDiaryForm, DiarySubmitEntity} from "@/view/DiaryList/Diary.ts";
import {dateFormatter, popMessage, temperatureProcessCTS} from "@/utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import draggable from 'vuedraggable';
import { TodoEntity } from '@/entity/Todo';
import { useStatisticStore } from '@/pinia/useStatisticStore.ts';

const projectStore = useProjectStore();
const statisticStore = useStatisticStore();



const props = defineProps<{
    readonly: boolean,
    diary: EntityDiaryForm
}>()

const todoList= ref<Array<TodoEntity>>([])
const lastId = ref(0) // 最后一个修改后的 id，用于将最后一个标记的 todoItem 移到列表最后
const contentElements = new Map<number, HTMLDivElement>()
const noteElements = new Map<number, HTMLDivElement>()

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

// Update display when hide content setting changes
watch(() => projectStore.isHideContent, () => {
    nextTick(() => {
        todoList.value.forEach(item => {
            const contentEl = contentElements.get(item.id)
            if (contentEl && document.activeElement !== contentEl) {
                updateContentElement(contentEl, item.id)
            }
            const noteEl = noteElements.get(item.id)
            if (noteEl && document.activeElement !== noteEl && item.note) {
                updateNoteElement(noteEl, item.id)
            }
        })
    })
})

function toggleDoneStatus(todoItem: TodoEntity){
    if (!props.readonly){
        if (todoItem.isDone){
            lastId.value = lastId.value + 1
            todoItem.id = lastId.value
        }
        todoItem.isDone = !todoItem.isDone


        todoList.value = todoList.value.filter(item => item.id !== todoItem.id)  // 先删除，再添加

        // 拆分 标记 | 未标记的，并通过 id 排序，实现类似 iPhone todoList 的效果
        let unfinished = todoList.value
            .filter(item => !item.isDone)
            .sort((a, b) => a.id - b.id)
        let finished = todoList.value
            .filter(item => item.isDone)
            .sort((a,b) => a.id - b.id)

        if (todoItem.isDone){
            finished.unshift(todoItem)
        } else {
            unfinished.unshift(todoItem)
        }
        todoList.value = unfinished.concat(finished)
        saveDiary()
    }
}
// 将日记内容转换成 TODOS
function processContent(diary: EntityDiaryForm){
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
        
        // Sync content to DOM after processing
        nextTick(() => {
            todoList.value.forEach(item => {
                const contentEl = contentElements.get(item.id)
                if (contentEl) {
                    updateContentElement(contentEl, item.id)
                }
                const noteEl = noteElements.get(item.id)
                if (noteEl && item.note) {
                    updateNoteElement(noteEl, item.id)
                }
            })
        })
        
        saveDiary()
    }
}
function toDiaryString(todoList: TodoEntity[]){
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
 * Save and restore cursor position for contenteditable
 */
function saveCursorPosition(element: HTMLDivElement): number {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return 0
    
    const range = selection.getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(element)
    preCaretRange.setEnd(range.endContainer, range.endOffset)
    return preCaretRange.toString().length
}

function restoreCursorPosition(element: HTMLDivElement, position: number) {
    const selection = window.getSelection()
    if (!selection) return
    
    const range = document.createRange()
    let currentPos = 0
    let nodeStack: Node[] = [element]
    let node: Node | undefined
    let foundStart = false
    
    while (!foundStart && (node = nodeStack.pop())) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent?.length || 0
            if (currentPos + nodeLength >= position) {
                range.setStart(node, position - currentPos)
                range.setEnd(node, position - currentPos)
                foundStart = true
            } else {
                currentPos += nodeLength
            }
        } else {
            let i = node.childNodes.length
            while (i--) {
                nodeStack.push(node.childNodes[i] as Node)
            }
        }
    }
    
    if (foundStart) {
        selection.removeAllRanges()
        selection.addRange(range)
    }
}

function setContentRef(el: HTMLDivElement | null, id: number) {
    if (el) {
        contentElements.set(id, el)
        updateContentElement(el, id)
    }
}

function setNoteRef(el: HTMLDivElement | null, id: number) {
    if (el) {
        noteElements.set(id, el)
        updateNoteElement(el, id)
    }
}

function updateContentElement(el: HTMLDivElement, id: number) {
    const item = todoList.value.find(t => t.id === id)
    if (item && el.textContent !== getDisplayContent(item.content)) {
        el.textContent = getDisplayContent(item.content)
    }
}

function updateNoteElement(el: HTMLDivElement, id: number) {
    const item = todoList.value.find(t => t.id === id)
    if (item && item.note && el.textContent !== getDisplayContent(item.note)) {
        el.textContent = getDisplayContent(item.note)
    }
}

function getDisplayContent(content: string): string {
    return projectStore.isHideContent ? content.replace(/[^，。 \n]/g, '*') : content
}

function handleContentFocus(_todoItem: TodoEntity, _ev: Event) {
    // Focus handled, content already in DOM
}

function handleContentBlur(todoItem: TodoEntity, ev: Event) {
    const element = ev.target as HTMLDivElement
    todoItem.content = element.textContent || ''
}

function handleNoteFocus(_todoItem: TodoEntity, _ev: Event) {
    // Focus handled, content already in DOM
}

function handleNoteBlur(todoItem: TodoEntity, ev: Event) {
    const element = ev.target as HTMLDivElement
    todoItem.note = element.textContent || ''
}

/**
 * 实时修改 to-do 内容
 * @param todoItem
 * @param ev
 */
function handleContentChange(todoItem: TodoEntity, ev: Event){
    const element = ev.target as HTMLDivElement
    const cursorPos = saveCursorPosition(element)
    todoItem.content = element.textContent || ''
    
    // Restore cursor position after Vue updates
    nextTick(() => {
        restoreCursorPosition(element, cursorPos)
    })
}

function handleNoteChange(todoItem: TodoEntity, ev: Event){
    const element = ev.target as HTMLDivElement
    const cursorPos = saveCursorPosition(element)
    todoItem.note = element.textContent || ''
    
    // Restore cursor position after Vue updates
    nextTick(() => {
        restoreCursorPosition(element, cursorPos)
    })
}

function onDragEnd() {
    // Update IDs to maintain order
    todoList.value.forEach((item, index) => {
        item.id = index;
    });
    saveDiary();
}

</script>

<style lang="scss">
@import "todo";
</style>
