<template>
    <div :class="['article', {active: isActive},]">
        <router-link
            :style="diaryItemHeaderStyle"
            :to="`/detail/${diary.id}`"
            :class="['article-header']"
        >
            <div class="date">{{ diary.dateString }}</div>
            <div class="weather">
                <img v-if="diary.weather"
                     :src="icons.weather[diary.weather + suffix]"
                     :alt="diary.weather">
            </div>
            <div class="week">{{ diary.weekday }}</div>
            <div class="category" :style="diaryItemCategoryTextStyle" >{{ diary.categoryString }}</div>
        </router-link>

        <div class="article-body" v-if="isHideContent">
            <div class="title">{{ diary.title.replace(/[^，。 \n]/g, '*') }}</div>
            <div class="content" v-html="diary.contentHtml.replace(/[^，。 \n]/g, '*')"/>
        </div>
        <div class="article-body" v-else>
            <div class="title">{{ diary.title }}</div>
            <div class="markdown" v-if="diary.is_markdown === 1" v-html="contentMarkDownHtml"/>
            <div class="content" v-else v-html="diary.contentHtml"/>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex"
import SvgIcons from "../../../assets/img/SvgIcons"
import {marked} from "marked";

export default {
    name: "DiaryListItemLong",
    props: {
        diary: Object,
    },
    data() {
        return {
            icons: SvgIcons,
        }
    },
    computed: {
        ...mapState(['isHideContent']),
        ...mapGetters(['categoryObjectMap']),
        isActive() {
            return Number(this.$route.params.id) === Number(this.diary.id)
        },
        suffix() {
            return this.isActive ? '_white' : ''
        },
        diaryItemHeaderStyle(){
            if (this.isActive){
                return `
                      background-color: ${this.categoryObjectMap.get(this.diary.category).color};
                `

            } else {
                return `
                `
            }
        },
        contentMarkDownHtml(){
            return marked.parse(this.diary.content)
        },
        diaryItemCategoryTextStyle(){
            if (this.isActive){

            } else {
                return `
                      color:  ${this.categoryObjectMap.get(this.diary.category).color}
                `
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./list-item-long";
</style>
