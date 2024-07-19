<template>
    <textarea
        :placeholder="placeholder"
        :class="[{header: isHeader}, {bold: isBold}]"
        :rows="rows"
        v-model="modelText"/>
</template>

<script setup lang="ts">
const modelText = defineModel()

withDefaults(defineProps<{
    isHeader?: boolean,
    isBold?: boolean,
    placeholder?: string,
    rows: number
}>(), {
    rows: 5,
    isHeader: false,
    isBold: false,
})
</script>


<style scoped lang="scss">
@import "../../../scss/plugin";
textarea{
    font-size: 1rem;
    line-height: 1.5;
    resize: vertical;
    display: block;
    border: 1px solid $color-border-light;
    border-left-width: 5px;
    width: 100%;
    padding: 6px 15px;
    &.header{
        background-color: $bg-light-td;
    }
    &.bold{
        font-weight: bold;
    }
    &:focus{
        border-left-color: $color-main;
    }

}

::-webkit-input-placeholder{
    color: $text-comment;
}

</style>
