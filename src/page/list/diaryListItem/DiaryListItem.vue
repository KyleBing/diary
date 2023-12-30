<template>
    <router-link ref="listItem"
                 :class="['diary-list-item', {active: isActive}]"
                 :to="`/detail/${diary.id}`"
                 :style="diaryItemStyle"
    >
        <i :class="['category']" :style="`background-color: ${storeProject.categoryObjectMap.get(diary.category).color}`"></i>
        <span class="date">{{ diary.date }}</span>
        <div class="detail">
            <p class="title" v-if="isHideContent">{{ diary.title.replace(/[^，。 \n]/g, '*') }}</p>
            <p class="title" v-else>{{ diary.title }}</p>
            <template v-if="diary.hasOwnProperty('billData')">
                <div v-if="isHideContent" :class="['bill-amount', {'bill-in': diary.billData.sum > 0}]">
                    {{diary.billData.sum.toFixed(moneyAccuracy).replace(/[^，。 \n]/g, '*')}}
                </div>
                <div v-else :class="['bill-amount', {'bill-in': diary.billData.sum > 0}]">
                    {{diary.billData.sum>0?'+ ':''}}{{diary.billData.sum.toFixed(moneyAccuracy)}}
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
    </router-link>
</template>

<script lang="ts" setup>
import SVG_ICONS from "../../../assets/img/SVG_ICONS.ts"
import {computed} from "vue";
import {useProjectStore} from "../../../pinia";
const storeProject = useProjectStore()

const props = defineProps({
    isActive: {
        type: Boolean,
        default: false
    },
    diary: {
        type: Object,
        required: true
    }
})

const weatherIcon = computed(() => {
    if (props.isActive) {
        return SVG_ICONS.weather[`${props.diary.weather}_white`]
    } else {
        if (props.diary.is_public) {
            return SVG_ICONS.weather[`${props.diary.weather}_active`]
        } else {
            return SVG_ICONS.weather[props.diary.weather]
        }
    }
})
const diaryItemStyle = computed(() => {
    if (props.isActive){
        return `background-color: ${storeProject.categoryObjectMap.get(props.diary.category).color}`
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

