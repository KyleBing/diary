<template>
    <div class="todo-list">
        <draggable 
            v-model="todoListShow"
            item-key="id"
            @end="onDragEnd"
            :disabled="!isEditable || editingItemId !== null"
        >
            <template #item="{ element: item }">
                <div :class="['todo-list-item', {done: item.isDone, editing: isItemEditing(item)}]">
                    <div class="checkbox-wrapper">
                        <div :class="['checkbox', {checked: item.isDone}]"
                             :style="{'--todo-color': statisticStore.categoryObjectMap.get('todo')?.color}"
                             @click="toggleDoneStatus(item)">
                        </div>
                    </div>
                    <div
                        class="content-wrapper"
                        @mousedown="handleEditMouseDown(item, $event)"
                        @focusout="handleEditFocusOut(item, $event)"
                    >
                        <template v-if="isItemEditing(item)">
                            <div
                                contenteditable="true"
                                @input="handleContentChange(item, $event)"
                                @keydown.enter.prevent="handleContentEnter"
                                :ref="(el) => setContentRef(el as HTMLDivElement, item.id)"
                                data-placeholder="待办内容"
                                class="content">
                            </div>
                            <div
                                contenteditable="true"
                                @input="handleNoteChange(item, $event)"
                                @keydown.enter.prevent="handleContentEnter"
                                :ref="(el) => setNoteRef(el as HTMLDivElement, item.id)"
                                data-placeholder="备注（可选）"
                                class="note">
                            </div>
                        </template>
                        <template v-else>
                            <div class="content">{{ getDisplayContent(item.content) }}</div>
                            <div v-if="item.note" class="note">{{ getDisplayContent(item.note) }}</div>
                        </template>
                    </div>
                    <div v-if="isEditable" class="item-actions">
                        <TabIcon
                            size="small"
                            icon="黑色-编辑"
                            :title="isItemEditing(item) ? '完成' : '编辑'"
                            @mousedown.prevent
                            @click="toggleItemEdit(item)"
                        />
                        <TabIcon
                            size="small"
                            icon="黑色-删除"
                            title="删除"
                            @mousedown.prevent
                            @click="deleteTodo(item.id)"
                        />
                    </div>
                </div>
            </template>
        </draggable>

        <div v-if="isEditable" class="todo-add-row">
            <div class="checkbox-wrapper">
                <div class="checkbox add-placeholder"></div>
            </div>
            <input
                ref="addInputRef"
                v-model="newTodoContent"
                type="text"
                class="add-input"
                placeholder="添加待办事项，回车确认"
                @keydown.enter.prevent="submitNewTodo"
            />
            <TabIcon size="small" icon="黑色-添加" title="添加" @click="submitNewTodo"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import diaryApi from "@/api/diaryApi.ts"
import {onMounted, ref, watch, nextTick, computed} from "vue";
import {EntityDiaryForm, DiarySubmitEntity} from "@/view/DiaryList/Diary.ts";
import {dateFormatter, popMessage, temperatureProcessCTS} from "@/utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import draggable from 'vuedraggable';
import { TodoEntity } from '@/entity/Todo';
import { useStatisticStore } from '@/pinia/useStatisticStore.ts';
import TabIcon from "@/components/TabIcon.vue";

const projectStore = useProjectStore();
const statisticStore = useStatisticStore();



const props = withDefaults(defineProps<{
    readonly: boolean,  // 是否只能读，不能编辑
    diary: EntityDiaryForm,
    hasHideAllComplatedTodoItems?: boolean // 是否隐藏所有已完成事项
}>(), {
    hasHideAllComplatedTodoItems: false,
})

const todoList= ref<Array<TodoEntity>>([])
const lastId = ref(0) // 最后一个修改后的 id，用于将最后一个标记的 todoItem 移到列表最后
const contentElements = new Map<number, HTMLDivElement>()
const noteElements = new Map<number, HTMLDivElement>()
const editingItemId = ref<number | null>(null)
const newTodoContent = ref('')
const addInputRef = ref<HTMLInputElement>()

const isEditable = computed(() => !props.readonly && !projectStore.isHideContent)

function isItemEditing(item: TodoEntity) {
    return isEditable.value && editingItemId.value === item.id
}

onMounted(()=>{
    window.onkeydown = event => {
        // CTRL + S 保存
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault()
            saveDiary(true)
        }
    }
})

const todoListShow = computed({
    get: () => {
        if (props.hasHideAllComplatedTodoItems){
            return todoList.value.filter(item => !item.isDone)
        }
        return todoList.value
    },
    set: (newList: TodoEntity[]) => {
        // Hide completed mode: drag only reorders visible unfinished items.
        if (props.hasHideAllComplatedTodoItems){
            const finished = todoList.value.filter(item => item.isDone)
            todoList.value = newList.concat(finished)
            return
        }
        todoList.value = newList
    }
})

watch(
    () => [props.diary.id, props.diary.content],
    ([id, content], prev) => {
        if (content === toDiaryString(todoList.value) && id === prev?.[0]) {
            return
        }
        processContent(props.diary)
    },
    { immediate: true }
)


// Update display when hide content setting changes
watch(() => projectStore.isHideContent, () => {
    editingItemId.value = null
})

function toggleDoneStatus(todoItem: TodoEntity){
    if (!props.readonly){
        if (editingItemId.value === todoItem.id) {
            finishEdit(todoItem)
        }
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
    if (!diary.content){
        todoList.value = []
        lastId.value = 0
        editingItemId.value = null
        return
    }
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
    editingItemId.value = null
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
    const content = toDiaryString(todoList.value)
    props.diary.content = content
    let requestData: DiarySubmitEntity = {
        id: props.diary.id,
        title: props.diary.title,
        content,
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

function deleteTodo(id: number){
    if (!isEditable.value) return
    if (editingItemId.value === id) {
        editingItemId.value = null
    }
    todoList.value = todoList.value.filter(item => item.id !== id)
    saveDiary()
}

function submitNewTodo(){
    const content = newTodoContent.value.trim()
    if (!content || !isEditable.value) return
    lastId.value = lastId.value + 1
    const newItem: TodoEntity = {
        id: lastId.value,
        isDone: false,
        content,
        note: '',
    }
    const unfinished = todoList.value.filter(item => !item.isDone)
    const finished = todoList.value.filter(item => item.isDone)
    todoList.value = unfinished.concat(newItem, finished)
    newTodoContent.value = ''
    saveDiary()
    nextTick(() => addInputRef.value?.focus())
}

function toggleItemEdit(item: TodoEntity){
    if (editingItemId.value === item.id) {
        finishEdit(item)
        return
    }
    if (editingItemId.value !== null) {
        const prev = todoList.value.find(t => t.id === editingItemId.value)
        if (prev) finishEdit(prev)
    }
    editingItemId.value = item.id
    nextTick(() => {
        nextTick(() => {
            contentElements.get(item.id)?.focus()
        })
    })
}

function finishEdit(item: TodoEntity) {
    const contentEl = contentElements.get(item.id)
    const noteEl = noteElements.get(item.id)
    if (contentEl) {
        const text = (contentEl.textContent || '').trim()
        if (!text) {
            editingItemId.value = null
            deleteTodo(item.id)
            return
        }
        item.content = text
    }
    if (noteEl) {
        item.note = (noteEl.textContent || '').trim()
    }
    editingItemId.value = null
    saveDiary()
}

let editFocusGuard = false

function handleEditMouseDown(item: TodoEntity, ev: MouseEvent) {
    if (!isItemEditing(item)) return
    const wrapper = ev.currentTarget as HTMLElement
    if (!wrapper.contains(ev.target as Node)) return
    editFocusGuard = true
    window.setTimeout(() => { editFocusGuard = false }, 200)
}

function handleEditFocusOut(todoItem: TodoEntity, ev: FocusEvent) {
    if (editingItemId.value !== todoItem.id) return

    const wrapper = ev.currentTarget as HTMLElement
    const relatedTarget = ev.relatedTarget as Node | null
    if (relatedTarget && wrapper.contains(relatedTarget)) {
        return
    }

    window.setTimeout(() => {
        if (editFocusGuard) return
        if (editingItemId.value !== todoItem.id) return
        if (wrapper.contains(document.activeElement)) return
        finishEdit(todoItem)
    }, 0)
}

function handleContentEnter(ev: Event){
    (ev.target as HTMLDivElement).blur()
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
    if (item && el.textContent !== item.content) {
        el.textContent = item.content
    }
}

function updateNoteElement(el: HTMLDivElement, id: number) {
    const item = todoList.value.find(t => t.id === id)
    const noteText = item?.note || ''
    if (item && el.textContent !== noteText) {
        el.textContent = noteText
    }
}

function getDisplayContent(content: string): string {
    return projectStore.isHideContent ? content.replace(/[^，。 \n]/g, '*') : content
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
@use "todo" as *;
</style>
