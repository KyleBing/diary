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
import TabIcon from "@/components/TabIcon";
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

<style scoped lang="scss">
@import "../assets/scss/plugin";

.page-header{
    z-index: $z-header;
    position: sticky;
    top: 0;
    height: $height-navbar;
    background-color: $bg-main;
    display: flex;
    color: white;
    justify-content: space-between;
    align-items: center;
    .page-title{
        flex-grow: 1;
        font-size: $fz-title;
        font-weight: bold;
        text-align: left;
    }
    .page-back-btn{
    }
}

</style>
