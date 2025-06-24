<template>
    <div>
        <Navbar/>
        <RouterView/>
    </div>
</template>

<script lang="ts" setup>
import Navbar from "./navbar/Navbar.vue"
import {onMounted} from "vue";
import {useStatisticStore} from "../pinia/useStatisticStore.ts";

onMounted(() => {
    useStatisticStore().getStatistic() // 载入统计信息
})

</script>

<style lang="scss" scoped>
.diary-list-container-mobile{
    width: 100%;
}
</style>
