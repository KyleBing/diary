<template>
    <div class="statistic-info">
        <p>共享 {{ statisticsCategory.shared }} 篇</p>
        <p>总计 {{ statisticsCategory.amount }} 篇</p>
    </div>

</template>

<script>
import {mapState} from "vuex";

export default {
    name: "StatisticInfo",
    computed: {
        ...mapState(['statisticsCategory', 'statisticsYear',])
    },
    methods: {

    }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/plugin";
.statistic-info{
    margin-right: 20px;
    flex-shrink: 0;
    flex-grow: 1;
    width: 300px;
    background-color: $bg-light;
    @include border-radius($radius-pc);
    padding: 20px;
    color: $color-main;
    font-size: $fz-big;
}

</style>
