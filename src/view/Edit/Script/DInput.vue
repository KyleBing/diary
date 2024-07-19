<template>
    <textarea
        :class="[{header: isHeader}]"
        :rows="rows"
        v-model="text"/>
</template>

<script setup lang="ts">
const text = defineModel()

withDefaults(defineProps<{
    isHeader: boolean
    rows: number
}>(), {
    rows: 5,
    isHeader: false
})
</script>


<style scoped lang="scss">
@import "../../../scss/plugin";
textarea{
    display: block;
    border: 1px solid $color-border;
    border-left-width: 2px;
    width: 100%;
    @include border-radius(0);
    padding: 8px 15px;
    &.header{
        background-color: $bg-light-td;
    }
    &:focus{
        border-left-color: $color-main;
    }
}

</style>
