<template>
    <div class="todo-list">
        <div v-for="item in todoList" :key="item.id" :class="['todo-list-item', 'small',{done: item.isDone}]">
            <div class="checkbox-wrapper">
                <div :class="['checkbox', {checked: item.isDone}]"></div>
            </div>
            <div class="content-wrapper">
                <div class="content">
                    {{projectStore.isHideContent? item.content.replace(/[^，。 \n]/g, '*'): item.content}}
                </div>
                <div v-if="item.note" class="note">
                    {{projectStore.isHideContent? item.note?.replace(/[^，。 \n]/g, '*'): item.note}}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {DiaryEntity} from "@/view/DiaryList/Diary.ts";
import { TodoEntity } from '@/entity/Todo';
import { useProjectStore } from "@/pinia/useProjectStore";

const projectStore = useProjectStore();

const props = defineProps<{
    diary: DiaryEntity
}>()

const todoList= ref<Array<TodoEntity>>([])
const lastId = ref(0) // 最后一个修改后的 id，用于将最后一个标记的 todoItem 移到列表最后

onMounted(()=>{
    processContent(props.diary)
    window.onkeydown = event => {
        // CTRL + S 保存
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault()
        }
    }
})

watch(() => props.diary, newValue => {
    processContent(newValue)
})

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
    }
}


</script>

<style lang="scss">
@import "todo";
</style>
