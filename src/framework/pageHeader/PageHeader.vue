<template>
    <div class="page-header">
        <div class="page-back-btn" @click="$router.back()">
            <tab-icon alt="关闭"/>
        </div>
        <div class="page-title">{{ title }}</div>
        <slot/>
    </div>
</template>

<script>
import TabIcon from "../../components/TabIcon";
export default {
    name: "PageHeader",
    props:{
        title: {
            type: String,
            default: '标题'
        }
    },
    components: {TabIcon}
}
</script>

<style lang="scss" scoped>
@import "page-header";
</style>


