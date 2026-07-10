<template>
    <div class="todo-list">
        <div v-for="item in todoListShow" :key="item.id" :class="['todo-list-item', 'small',{done: item.isDone}]">
            <div class="checkbox-wrapper">
                <div :class="['checkbox', {checked: item.isDone}]"
                     :style="{'--todo-color': statisticStore.categoryObjectMap.get('todo')?.color}"></div>
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
import {computed, onMounted, ref, watch} from "vue";
import {EntityDiaryForm} from "@/view/DiaryList/Diary.ts";
import { TodoEntity } from '@/entity/Todo';
import { useProjectStore } from "@/pinia/useProjectStore";
import { useStatisticStore } from '@/pinia/useStatisticStore.ts';
import { useUserConfigStore } from '@/pinia/useUserConfigStore.ts';

const projectStore = useProjectStore();
const statisticStore = useStatisticStore();
const userConfigStore = useUserConfigStore();

const props = defineProps<{
    diary: EntityDiaryForm
}>()

const todoList= ref<Array<TodoEntity>>([])
const lastId = ref(0) // 最后一个修改后的 id，用于将最后一个标记的 todoItem 移到列表最后

// 与详情页同步：读取用户配置决定是否隐藏已完成事项
const todoListShow = computed(() => {
    if (userConfigStore.isHideCompletedTodos) {
        return todoList.value.filter(item => !item.isDone)
    }
    return todoList.value
})

onMounted(()=>{
    userConfigStore.fetchConfig()
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
    }
}


</script>

<style lang="scss">
@use "todo" as *;
</style>
