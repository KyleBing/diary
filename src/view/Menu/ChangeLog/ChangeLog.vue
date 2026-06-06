<template>
    <MenuPanelContainer>
        <div class="change-log-container markdown changelog"
             v-html="contentMarkDownHtml"/>
    </MenuPanelContainer>
</template>

<script setup lang="ts">
import changeLog from "../../../../CHANGELOG.md"
import MenuPanelContainer from "@/framework/MenuPanelContainer.vue"
import {parseMarkdown} from "@/utility/markedHighlight.ts"
import { computed } from "vue"

const contentMarkDownHtml = computed(()=>{
    return parseMarkdown(changeLog)
})

</script>

<style scoped lang="scss">
@use "../../../scss/plugin" as *;
.change-log-container{
    color: $text-title;
}
</style>
