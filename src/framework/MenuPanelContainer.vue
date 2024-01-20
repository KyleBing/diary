<template>
    <div class="menu-panel-container" :style="`height:  ${storeProject.insets.heightPanel}px`">
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import {useProjectStore} from "@/pinia";
const storeProject = useProjectStore()

</script>

<style lang="scss" scoped>
@import "../scss/plugin";
.menu-panel-container{
    padding: 30px;
    overflow-y: auto;
    background-color: $bg-menu;
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
