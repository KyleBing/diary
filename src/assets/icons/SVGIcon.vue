<template>
    <component
        :viewBox="`0 0 ${size} ${size}`"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        :is="svgIcon" />
</template>

<script lang="ts" setup>
import {defineAsyncComponent} from "vue";

const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        default: 50,
        required: true
    }
})

const svgIcon = defineAsyncComponent(() =>
    import(`./${props.icon}.svg?url`)
)

</script>

<style lang="scss">

</style>
