<template>
    <div class="menu-panel-container" :style="`height:  ${projectStore.insets.heightPanel}px`">
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import {useProjectStore} from "@/pinia/useProjectStore.ts";
const projectStore = useProjectStore()

</script>

<style lang="scss" scoped>
@import "../scss/plugin";
.menu-panel-container{
    padding: 30px;
    overflow-y: auto;
    background-color: $bg-menu;
}

// MacbookPro
@media (min-width: $grid-separate-width-sm ) and (max-width: $grid-separate-width-big) {
    .menu-panel-container {
        padding: 20px 15px;
    }
}

// MOBILE
@media (max-width: $grid-separate-width-sm) {
    .menu-panel-container {
        padding: 20px 15px;
    }
}

// DARK
@media (prefers-color-scheme: dark) {
    .menu-panel-container{
        background-color: $dark-bg-menu;
    }

}
</style>
