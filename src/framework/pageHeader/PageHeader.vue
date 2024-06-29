<template>
    <div class="page-header">
        <div class="page-back-btn" @click="router.back()">
            <TabIcon alt="关闭"/>
        </div>
        <div class="page-title">{{ title }}</div>
        <div class="page-subtitle">{{ subtitle }}</div>
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import TabIcon from "../../components/TabIcon.vue";
import {useRouter} from "vue-router";
const router = useRouter()

withDefaults(defineProps<{
    title: string,
    subtitle?: string
}>(), {
    title: "标题"
})
</script>

<style lang="scss" scoped>
@import "page-header";
</style>


