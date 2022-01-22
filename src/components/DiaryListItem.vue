<template>
    <router-link :to="`/detail/${diary.id}`"
                 :class="['list-item', 'diary-list-item-' + diary.category, {active: active}]">
        <i :class="['category', 'bg-' + diary.category]"></i>
        <span class="date">{{ diary.date }}</span>
        <div class="detail">
            <p class="title">{{ isHideContent ? diary.title.replace(/[^，。《》【】]/g, '*'): diary.title }}</p>
            <img alt="Content" v-if="diary.content" class="icon"
                 :src="active? $icons.content_white: $icons.content"/>
            <img :alt="diary.weather" v-if="diary.weather"
                 class="icon" :src="weatherIcon"/>
        </div>
    </router-link>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "DiaryListItem",
    props: {
        diary: Object
    },
    computed: {
        ...mapState(['isHideContent']),
        active() {
            return this.$route.params.id === this.diary.id
        },
        weatherIcon() {
            if (this.active) {
                return this.$icons.weather[`${this.diary.weather}_white`]
            } else {
                if (this.diary.isPublic) {
                    return this.$icons.weather[`${this.diary.weather}_active`]
                } else {
                    return this.$icons.weather[this.diary.weather]
                }
            }
        },
    }
}
</script>

