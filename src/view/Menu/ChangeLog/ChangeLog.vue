<template>
    <MenuPanelContainer>
        <div class="change-log-container markdown changelog"
             v-html="contentMarkDownHtml"/>
    </MenuPanelContainer>
</template>

<script setup lang="ts">
import changeLog from "../../../../CHANGELOG.md"
import MenuPanelContainer from "@/framework/MenuPanelContainer.vue"
import { marked } from "marked"
import { computed } from "vue"

const contentMarkDownHtml = computed(()=>{
    return marked.parse(changeLog)
})

</script>

<style scoped lang="scss">
@import "../../../scss/plugin";
.change-log-container{
    color: $text-title;
}
</style>
