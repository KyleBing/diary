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
        padding: 20px 25px;
    }
}



</style>

