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
@import "../../scss/plugin";
.statistic-panel-container{
    padding: 10px;
}
.statistic-panel{
    flex-shrink: 0;
    background-color: $bg-light;
    @include border-radius($radius-pc);
    padding: 30px 30px;
}
h3{
    color: $text-title;
    font-size: $fz-title;
    line-height: 1;
    padding-bottom: 15px;
}

@media (max-width: $grid-separate-width-sm) {
    .statistic-panel-container{
        padding: 5px;
    }
    .statistic-panel{
        padding: 15px;
    }
}


@media (prefers-color-scheme: dark) {
    .statistic-panel {
        background-color: $dark-bg !important;
        h3{
            color: $dark-text-title !important;
        }
    }
}



</style>

