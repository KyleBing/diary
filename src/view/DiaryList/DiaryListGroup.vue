<template>
        <div class="diary-list-group" >
            <ListHeader :size="diaryListGroup.headerSize" :title="props.diaryListGroup.title"/>

            <div :class="['diary-list-group-content', {detail: props.listStyle === EnumListStyle.detail}]">
                <template v-if="props.listStyle === EnumListStyle.list">
                <DiaryListItem
                    v-for="item in props.diaryListGroup.diaries" :key="item.id"
                    @click="diaryListItemClick(item)"
                    :isActive="route.params.id === String(item.id)"
                    :category="item.category"
                    :diary="item"/>
            </template>
            <template v-else>
                <DiaryListItemLong
                    v-for="item in props.diaryListGroup.diaries" :key="item.id"
                    @click="diaryListItemClick(item)"
                    :isActive="route.params.id === String(item.id)"
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

const props = defineProps<{
    diaryListGroup: EntityDiaryListGroup
    listStyle: EnumListStyle
}>()

const router = useRouter()
const route = useRoute()


// 日记列表点击
function diaryListItemClick(item: EntityDiaryFromServerLocal) {
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
