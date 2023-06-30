<template>
    <router-link ref="listItem"
                 :class="['diary-list-item', {active: isActive}]"
                 :to="`/detail/${diary.id}`"
                 :style="diaryItemStyle"
    >
        <i :class="['category']" :style="`background-color: ${categoryObjectMap.get(diary.category).color}`"></i>
        <span class="date">{{ diary.date }}</span>
        <div class="detail">
            <p class="title" v-if="isHideContent">{{ diary.title.replace(/[^，。 \n]/g, '*') }}</p>
            <p class="title" v-else>{{ diary.title }}</p>
            <div class="bill-amount" v-if="diary.hasOwnProperty('billData')">{{diary.billData.sum.toFixed(moneyAccuracy)}}</div>
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

<script>
import {mapGetters, mapState} from "vuex"
import ICONS from "../../../assets/img/SvgIcons"
import SvgIcons from "../../../assets/img/SvgIcons"

export default {
    name: "DiaryListItem",
    props: {
        isActive: {
            type: Boolean,
            default: false
        },
        diary: Object
    },
    data() {
        return {
            icons: SvgIcons,
        }
    },
    mounted() {

    },
    computed: {
        ...mapState(['isHideContent', 'moneyAccuracy']),
        ...mapGetters(['categoryObjectMap']),
        weatherIcon() {
            if (this.isActive) {
                return ICONS.weather[`${this.diary.weather}_white`]
            } else {
                if (this.diary.isPublic) {
                    return ICONS.weather[`${this.diary.weather}_active`]
                } else {
                    return ICONS.weather[this.diary.weather]
                }
            }
        },
        diaryItemStyle(){
            if (this.isActive){
                return `background-color: ${this.categoryObjectMap.get(this.diary.category).color}`
            }
        },
        contentIcon(){
            if (this.diary.is_markdown){
                if (this.isActive){
                    return this.icons.content_md_white
                } else {
                    return this.icons.content_md
                }
            } else {
                if (this.isActive){
                    return this.icons.content_white
                } else {
                    return this.icons.content
                }
            }
        }
    },
}
</script>

<style lang="scss" scoped>
@import "list-item";
</style>

