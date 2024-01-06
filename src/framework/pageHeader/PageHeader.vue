<template>
    <div class="page-header">
        <div class="page-back-btn" @click="$router.back()">
            <TabIcon alt="关闭"/>
        </div>
        <div class="page-title">{{ props.title }}</div>
        <div class="page-subtitle">{{ props.subtitle }}</div>
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import TabIcon from "../../components/TabIcon.vue";

const props = defineProps({
    title: {
        type: String,
        default: '标题'
    },
    subtitle: {
        type: String,
        default: ''
    }
})
</script>

<style lang="scss" scoped>
@import "page-header";
</style>


