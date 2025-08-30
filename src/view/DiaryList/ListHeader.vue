<template>
    <div :class="[
        'list-header',
        {big: size === 'big'}, 
        {medium: size === 'medium'},
        {'with-search': isWithSearch}
    ]">{{ title }}</div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useProjectStore } from "@/pinia/useProjectStore"
const projectStore = useProjectStore()

defineProps<{
    title: string,
    size?: 'big' | 'medium'
}>()

const isWithSearch = computed(() => {
    return projectStore.isShowSearchBar
})

</script>

<style scoped lang="scss">
@import "../../scss/plugin";

.list-header{
    position: sticky;
    top: 0;
    z-index: $z-header;
    font-size: $fz-list-header;
    text-align: left;
    padding: 3px 20px;
    background-color: $bg-light;
    line-height: $height-header;
    font-family: "Galvji", sans-serif;
    color: black;
    font-weight: bold;
    text-shadow: 1px 1px 0 rgba(0,0,0,0.1);
    transition: top 0.3s ease-in-out;
    border-bottom: 1px solid $color-border;
    &.big{
        padding: 10px 20px;
        height: auto;
        font-size: $fz-big;
    }
    &.medium{
        border-bottom: none;
        padding: 3px 20px;
        height: auto;
        font-size: $fz-list-header + 3;
    }
    &.with-search{
        transition: top 0.3s ease-in-out;
        top: 50px;
    }
}

// Mobile
@media (max-width: $grid-separate-width-sm) {
    .list-header {
        font-size: $fz-list-header-mobile;
    }
}

@media (prefers-color-scheme: dark) {
    .list-header{
        border-color: $dark-border !important;
        background-color: $dark-list-header-bg !important;
        @include border-radius($radius-mobile);
        color: white !important;
        &.big{
            margin: 0 10px;
        }
        border-bottom: 1px solid $dark-border !important;
    }
}




</style>
