<template>
    <component :is="icon" class="fill-current" />
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});

const icon = defineAsyncComponent(() =>
    import(`./logo/${props.name}.svg`)
);
</script>
