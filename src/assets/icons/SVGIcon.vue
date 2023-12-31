<template>
    <svg class="icon" aria-hidden="true">
        <use :xlink:href="`/images/sprite.svg#${props.icon}`"></use>
    </svg>
</template>

<script lang="ts" setup>
const props = defineProps({
    icon: {
        type: String,
        required: true
    }
})

</script>
<style lang="scss">
.icon{
    width: 100px;
    height: 100px;
}
</style>
