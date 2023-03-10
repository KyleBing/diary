<template>
    <div ref="chart" class="chart" :style="height? `height: ${height}px` : ''"></div>
</template>

<script>
import * as echarts from 'echarts'
import chartOption from "../chartOption";

export default {
    name: "ChartLineTrend",
    props: {
        combineData: {
            type: Array,
            default: []
        },
        height: {
            type: Number
        }
    },
    data() {
        return {
            requestDataConstantly: true, // 持续请求数据
            timeoutHandle: null, // 定时请求的 handle

            dataCount: 20, // 展示的数据数量
            option: {
                // color: chartOption.COLOR_ARRAY,
                legend: {
                    textStyle: {},
                    type: 'scroll',
                    orient: 'vertical',
                    top: 0,
                    right: 0,
                    data: []
                },
                grid: {
                    top: 20,
                    bottom: 120,
                    left: 40,
                    right: 20,
                },

                dataZoom: [
                    {
                        startValue: '2014-06-01'
                    },
                    {
                        type: 'inside'
                    }
                ],

                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                xAxis: { // 横坐标轴
                    type: 'category',
                    data: [],
                    // data: [], // 横轴数据
                    axisLabel: {
                        fontSize: 10,
                        rotate: -70, // 角度值：Number
                    },
                    axisLine: {
                        lineStyle: {
                            color: chartOption.COLOR.gray
                        },  // 线的颜色
                    },
                },
                yAxis: { // 纵
                    type: 'value',
                    splitNumber: 3, // 显示的刻度数量
                    axisLabel: { // 坐标轴 label 样式
                        fontSize: 10
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: chartOption.COLOR.gray
                        },  // 线的颜色
                    },
                    splitLine: { // y 轴的分隔线样式
                        show: true,
                        lineStyle: {
                            color: chartOption.COLOR.line,  // 线的颜色
                            width: 1,           // 宽度
                            type: 'solid'       // 样式
                        },
                    },
                    max: function (value) {
                        return value.max + 10
                    }
                },
                series: []
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },
    beforeDestroy() {
        this.chart.clear()
        clearTimeout(this.timeoutHandle)
        this.timeoutHandle = null
        this.requestDataConstantly = false
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.chart)

            this.option.series.push({
                name: '室内温度',
                data: this.combineData.map(item => item.temperature).reverse(),
                lineStyle: {
                    width: 2,
                    opacity: 0,
                },
                color: chartOption.COLOR.orange,
                type: 'line',
                smooth: true,
                label: {
                    show: true,
                    fontSize: 10
                }
            },)
            this.option.xAxis.data =
                this.combineData
                    .map(item => item.date)
            this.option.legend.data.push('室内温度')

            this.option.series.push({
                name: '室外温度',
                data: this.combineData.map(item => item.temperature_outside),
                lineStyle: {
                    width: 2,
                    opacity: 0,
                },
                color: chartOption.COLOR.blue,
                type: 'line',
                smooth: true,
                label: {
                    show: true,
                    fontSize: 10
                }
            },)
            this.option.xAxis.data =
                this.combineData
                    .map(item => item.date)
            this.option.legend.data.push('室外温度')

            this.chart.setOption(this.option)
        },
    },
}
</script>

<style scoped lang="scss">
.chart {
    height: 400px;
}
</style>
