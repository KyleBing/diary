<template>
    <!--加载动画-->
    <div v-if="loading" class="loading">
        <div class="loading-1 loading-item"></div>
        <div class="loading-2 loading-item"></div>
        <div class="loading-3 loading-item"></div>
    </div>
</template>

<script>
export default {
    name: "Loading",
    props: {
        loading: false
    }
}
</script>

<style scoped>

</style>
