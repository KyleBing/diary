<template>
    <div class="statistic-info">
        <statistic-panel>
            <div class="main-statistic">
                <span>共享 {{ statisticsCategory.shared }} 篇，</span>
                <span>总计 {{ statisticsCategory.amount }} 篇</span>
            </div>

        </statistic-panel>

        <div class="info-list-group">
            <statistic-panel title="年份统计">
                <div class="info-list">
                    <div class="info-item" v-for="year in dataArrayYear">
                        <div class="key">{{ year.name }}</div>
                        <div class="value">{{ year.value }}</div>
                    </div>
                </div>
            </statistic-panel>

            <statistic-panel title="类别统计">
                <div class="info-list">
                    <div class="info-item" v-for="year in dataArrayCategory">
                        <div class="key">{{ year.name }}</div>
                        <div class="value">{{ year.value }}</div>
                    </div>
                </div>
            </statistic-panel>
        </div>

    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import StatisticPanel from "@/page/statistics/StatisticPanel";

export default {
    name: "StatisticInfo",
    components: {StatisticPanel},
    computed: {
        ...mapState(['statisticsCategory', 'statisticsYear', 'dataArrayCategory', 'dataArrayYear']),
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/plugin";
.statistic-info{
    flex-shrink: 0;
    flex-grow: 1;
}

.main-statistic{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: $fz-big;
}

$show-value-dash: true;

.info-list-group{
    display: flex;
    justify-content: space-between;
    flex-flow: row nowrap;
    > * {
        width: 50%;
    }
}
.info-list{
    font-size: $fz-list-content;
    margin-bottom: 15px;
    &:last-child{
        margin-bottom: 0;
    }
    .info-item{
        position: relative;
        justify-content: space-between;
        align-items: flex-start;
        display: flex;
        line-height: 1.8;
        &:hover{
            &:after{
                border-bottom-color: $color-main;
            }
        }
        &.invalid{
            @if $show-value-dash {
                &::after{
                    content: none;
                }
            }
            .key{
                color: $text-label;
            }
            .value{
                color: $text-label;
                &:before{
                    content: '--';
                }
            }
        }
        .key{
            @if $show-value-dash {
                padding-right: 20px;
                z-index: 10;
                background-color: $bg-light;
            }
            color: $text-label;
            flex-shrink: 0;
        }
        .value-group{
            line-height: 1.4;
            margin-bottom: 10px;
        }
        .unit{
            margin-left: 3px;
            font-size: 0.7rem;
            font-weight: normal;
        }

        .value{
            @if $show-value-dash {
                padding-left: 20px;
                z-index: 10;
                background-color: $bg-light;
            }
            font-weight: bold;
            color: $color-main;
            text-align: right;
            letter-spacing: 0.5px;
            font-family: 'PTSans', sans-serif;
        }
        @if $show-value-dash {
            &::after{
                z-index: 1;
                content: '';
                top: 50%;
                width: 100%;
                display: block;
                border-bottom: 1px dashed $color-border;
                position: absolute;
            }
        }
    }
}

@media (min-width: $grid-separate-width-sm) and (max-width: $grid-separate-width-md) {
    .info-list-group{
        flex-flow: column nowrap;
    }
}



</style>
