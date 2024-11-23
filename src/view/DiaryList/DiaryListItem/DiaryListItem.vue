<template>
    <RouterLink ref="listItem"
                 :class="['diary-list-item', {active: isActive}]"
                 :to="`/detail/${diary.id}`"
                 :style="diaryItemStyle"
    >
        <i :class="['category']" :style="`background-color: ${projectStore.categoryObjectMap.get(diary.category).color}`"></i>

        <span class="date">{{ diary.date }}</span>

        <div class="detail">
            <p class="title" v-if="projectStore.isHideContent">{{ diary.title.replace(/[^，。 \n]/g, '*') }}</p>
            <p class="title" v-else>{{ diary.title }}</p>
            <template v-if="diary.hasOwnProperty('billData')">
                <div v-if="projectStore.isHideContent" :class="['bill-amount', {'bill-in': diary.billData.sum > 0}]">
                    {{diary.billData.sum.toFixed(projectStore.moneyAccuracy).replace(/[^，。 \n]/g, '*')}}
                </div>
                <div v-else :class="['bill-amount', {'bill-in': diary.billData.sum > 0}]">
                    {{diary.billData.sum>0?'+ ':''}}{{diary.billData.sum.toFixed(projectStore.moneyAccuracy)}}
                </div>
            </template>

            <img alt="Content"
                 v-if="diary.content"
                 class="icon"
                 :src="contentIcon"/>
            <img :alt="diary.weather"
                 v-if="diary.weather"
                 class="icon"
                 :src="weatherIcon"/>
        </div>
    </RouterLink>
</template>

<script lang="ts" setup>
import SVG_ICONS from "../../../assets/icons/SVG_ICONS.ts"
import {computed} from "vue";
import {useProjectStore} from "@/pinia";
import {DiaryEntityFromServer} from "@/view/DiaryList/Diary.ts";
const projectStore = useProjectStore()

const props = withDefaults(defineProps<{
    isActive: boolean,
    diary: DiaryEntityFromServer
}>(), {
    isActive: false
})

const weatherIcon = computed(() => {
    if (props.isActive) {
        return SVG_ICONS.weather_icons[`${props.diary.weather}_white`]
    } else {
        if (props.diary.is_public) {
            return SVG_ICONS.weather_icons[`${props.diary.weather}_active`]
        } else {
            return SVG_ICONS.weather_icons[props.diary.weather]
        }
    }
})
const diaryItemStyle = computed(() => {
    if (props.isActive){
        return `background-color: ${projectStore.categoryObjectMap.get(props.diary.category).color}`
    }
})
const contentIcon = computed(() => {
    if (props.diary.is_markdown){
        if (props.isActive){
            return SVG_ICONS.content_md_white
        } else {
            return SVG_ICONS.content_md
        }
    } else {
        if (props.isActive){
            return SVG_ICONS.content_white
        } else {
            return SVG_ICONS.content
        }
    }
})

</script>

<style lang="scss" scoped>
@import "list-item";
</style>

