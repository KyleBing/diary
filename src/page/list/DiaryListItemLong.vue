<template>
    <div :class="['article', {active: active},]" :style="diaryItemStyle">
        <router-link
            :to="`/detail/${diary.id}`"
            :class="['article-header']"
        >
            <div class="week">{{ diary.weekday }}</div>
            <div class="date">{{ diary.dateString }}</div>
            <div class="weather">
                <img v-if="diary.weather"
                     :src="icons.weather[diary.weather + suffix]"
                     :alt="diary.weather">
            </div>
            <div class="category">{{ diary.categoryString }}</div>
        </router-link>

        <div class="article-body" v-if="isHideContent">
            <div class="title">{{ diary.title.replace(/[^，。]/g, '*') }}</div>
            <div class="content" v-html="diary.content.replace(/[^，。]/g, '*')"/>
        </div>
        <div class="article-body" v-else>
            <div class="title">{{ diary.title }}</div>
            <div class="content" v-html="diary.content"/>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";
import SvgIcons from "@/assets/img/SvgIcons";

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
        active() {
            return Number(this.$route.params.id) === Number(this.diary.id)
        },
        suffix() {
            return this.active ? '_white' : '_active'
        },
        diaryItemStyle(){
            if (this.isActive){
                return `background-color: ${this.categoryObjectMap.get(this.diary.category).color}`
            }
        }
    }
}
</script>

