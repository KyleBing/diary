<template>
    <div :class="['article', {active: isActive},]" :style="diaryArticleItemStyle">
        <RouterLink
            :style="diaryItemHeaderStyle"
            :to="`/detail/${props.diary.id}`"
            :class="['article-header']"
        >
            <div class="date">{{ props.diary.dateString }}</div>
            <div class="weather">
                <img v-if="props.diary.weather"
                     :src="SVG_ICONS.weather_icons[props.diary.weather + suffix]"
                     :alt="props.diary.weather">
            </div>
            <div class="week">{{ props.diary.weekday }}</div>
            <div class="category" :style="diaryItemCategoryTextStyle" >{{ props.diary.categoryString }}</div>
        </RouterLink>

        <div class="article-body" v-if="projectStore.isHideContent">
            <div class="title">{{ props.diary.title.replace(/[^，。 \n]/g, '*') }}</div>
            <div class="content" v-html="props.diary.contentHtml?.replace(/[^，。 \n]/g, '*')"/>
        </div>
        <div class="article-body" v-else>
            <div class="title">{{ props.diary.title }}</div>
            <div class="markdown" v-if="props.diary.is_markdown === 1" v-html="contentMarkDownHtml"/>
            <div class="content" v-else v-html="props.diary.contentHtml"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {marked} from "marked";
import {computed} from "vue";
import {useRoute} from "vue-router";
import SVG_ICONS from "../../../assets/icons/SVG_ICONS.ts";
import {DiaryEntityFromServer} from "../Diary.ts";

import {useStatisticStore} from "@/pinia/useStatisticStore.ts";
const statisticStore = useStatisticStore()

import {useProjectStore} from "@/pinia/useProjectStore.ts";
const projectStore = useProjectStore()

const route = useRoute()


const props = defineProps<{
    diary: DiaryEntityFromServer
}>()

const isActive = computed(() => {
    return Number(route.params.id) === Number(props.diary.id)
})
const suffix = computed(()=> {
    return isActive.value ? '_white' : ''
})
const diaryItemHeaderStyle = computed(()=>{
    if (isActive.value){
        return `
              background-color: ${statisticStore.categoryObjectMap.get(props.diary.category).color};
                `
    } else {
        return ''
    }
})
const diaryArticleItemStyle = computed(()=>{
    if (isActive.value){
        return `
              border-color: ${statisticStore.categoryObjectMap.get(props.diary.category).color};
                `
    } else {
        return ''
    }
})
const contentMarkDownHtml = computed(()=>{
    return marked.parse(props.diary.content)
})
const diaryItemCategoryTextStyle = computed(()=>{
    if (isActive.value){

    } else {
        return `
              color:  ${statisticStore.categoryObjectMap.get(props.diary.category).color}
                `
    }
})

</script>

<style lang="scss" scoped>
@import "./list-item-long";
</style>
