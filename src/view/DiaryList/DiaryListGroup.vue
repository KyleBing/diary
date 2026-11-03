<template>
        <div class="diary-list-group" >
            <ListHeader :size="diaryListGroup.headerSize" :title="props.diaryListGroup.title"/>

            <div :class="['diary-list-group-content', {detail: props.listStyle === EnumListStyle.detail}]">
                <template v-if="props.listStyle === EnumListStyle.list">
                <DiaryListItem
                    v-for="item in props.diaryListGroup.diaries" :key="item.id"
                    @click="diaryListItemClick(item)"
                    :isActive="isDiaryActive(item)"
                    :category="item.category"
                    :diary="item"/>
            </template>
            <template v-else>
                <DiaryListItemLong
                    v-for="item in props.diaryListGroup.diaries" :key="item.id"
                    @click="diaryListItemClick(item)"
                    :isActive="isDiaryActive(item)"
                    :category="item.category"
                    :diary="item"/>
            </template>
            </div>

        </div>
</template>

<script lang="ts" setup>
import { EntityDiaryListGroup, EntityDiaryFromServerLocal } from "./Diary"
import { useRouter, useRoute } from "vue-router"

import ListHeader from "@/view/DiaryList/ListHeader.vue"
import DiaryListItem from "@/view/DiaryList/DiaryListItem/DiaryListItem.vue"
import DiaryListItemLong from "@/view/DiaryList/DiaryListItemLong/DiaryListItemLong.vue"
import {EnumListStyle} from "@/listStyle.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";

const props = defineProps<{
    diaryListGroup: EntityDiaryListGroup
    listStyle: EnumListStyle
}>()

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()

// 列表页没有 id，用刚看过的日记保持选中
function isDiaryActive(item: EntityDiaryFromServerLocal) {
    const activeId = route.params.id || projectStore.currentDiary?.id
    return activeId != null && String(activeId) === String(item.id)
}

// 日记列表点击
function diaryListItemClick(item: EntityDiaryFromServerLocal) {
    // 点进去立刻记下，返回列表时还没拉完详情也能高亮
    projectStore.currentDiary = {
        ...projectStore.currentDiary,
        id: item.id
    }
    router.push({
        name: 'Detail',
        params: {id: item.id}
    })
}

</script>

<style lang="scss" scoped>
.diary-list-group{
    position: relative;
    .diary-list-group-content{
        &.detail{
            padding: 10px;
        }
    }
}
</style>
