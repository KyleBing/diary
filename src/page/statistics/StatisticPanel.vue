<template>
    <div class="statistic-panel-container">
        <div class="statistic-panel">
            <h3 v-if="title">{{title}}</h3>
            <slot/>
        </div>
    </div>

</template>

<script>
export default {
    name: "StatisticPanel",
    props: {
        title: ''
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/plugin";
.statistic-panel-container{
    padding: 10px;
}
.statistic-panel{
    flex-shrink: 0;
    background-color: $bg-light;
    @include border-radius($radius-pc);
    padding: 20px 30px;
}
h3{
    color: $text-title;
    font-size: $fz-big;
    line-height: 1;
    padding-bottom: 15px;
}

</style>

