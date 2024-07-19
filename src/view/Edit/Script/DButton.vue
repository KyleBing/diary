<template>
    <div class="d-button">
        <TabIcon alt="添加"/>
    </div>
</template>

<script setup lang="ts">
import TabIcon from "@/components/TabIcon.vue";

const text = defineModel()

withDefaults(defineProps<{
    rows: number
}>(), {
    rows: 5
})
</script>


<style scoped lang="scss">
@import "../../../scss/plugin";
.d-button{
    @extend .btn-like;
    background-color: $orange;
    @include border-radius(100px);
    height: 45px;
    width: 45px;
}
</style>
