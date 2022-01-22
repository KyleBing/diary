<template>
    <div :class="['article', {active: active}, `article-${diary.category}`]">
        <router-link :to="`/detail/${diary.id}`"
                     class="article-header">
            <div class="week">{{ diary.weekday }}</div>
            <div class="date">{{ diary.dateString }}</div>
            <div class="weather">
                <img v-if="diary.weather"
                     :src="$icons.weather[diary.weather + suffix]"
                     :alt="diary.weather">
            </div>
            <div class="category">{{ diary.categoryString }}</div>
        </router-link>
        <div class="article-body">
            <div class="title">{{ isHideContent ? diary.title.replace(/[^，。《》【】]/g, '*'): diary.title }}</div>
            <div class="content" v-html="isHideContent ? diary.content.replace(/[^，。《》【】]/g, '*'): diary.content"></div>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "DiaryListItemLong",
    props: {
        diary: Object
    },
    computed: {
        ...mapState(['isHideContent']),
        active() {
            return this.$route.params.id === this.diary.id
        },
        suffix() {
            return this.active ? '_white' : '_active'
        }
    }
}
</script>

