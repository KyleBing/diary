<template>
    <div ref="BarDom" class="charts" :style="`height: 350px; width: ${width}`"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    // TODO: 对应类别的颜色展示图表
    name: "ChartBar",
    props: {
        data: {
            type: Array,
            default: [],
            // {value: 1048, name: '搜索引擎'},
        },
        title: {
            type: String,
            default: ''
        },
        subTitle: {
            type: String,
            default: ''
        },
    },
    watch: {
        data(newValue) {
            if (newValue) {
                this.resetData(newValue)
            }
        },
    },
    data() {
        return {
            chart: null,
            option: null,
            width: '500px' // 图表宽度 500
        }
    },
    mounted() {
        if (window.innerWidth< 400){
            this.width = '100%'
        }
        this.$nextTick(() => {
            this.initChart()
            this.resetData(this.data)
        })
    },
    computed: {
        xAxisData() {
            return this.data
        }
    },
    methods: {
        resetData(newValue) {
            let xAxisData = []
            let seriesData = []
            newValue.forEach(item => {
                seriesData.push(item.value)
                xAxisData.push(item.name)
            })
            this.option.xAxis[0].data = xAxisData
            this.option.series[0].data = seriesData
            this.chart.setOption(this.option)
        },
        initChart() {
            this.option = {
                color: [
                    '#FFA41C',
                    '#2F3037',
                    '#EE6666',
                    '#FFDC60',
                    '#5C7BD9',
                    '#7ED3F4',
                    '#c7c7c7',
                    '#9FE080'
                ],
                grid: {
                    bottom: 30,
                    right: 10
                },
                title: {
                    text: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: [],
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '到访人员类型',
                    type: 'bar',
                    data: [],
                    // barWidth: 20, //柱子宽度
                    label: {
                        show: true,
                        position: 'top',
                        fontSize: 12,
                    },
                }]
            }

            if (window.innerWidth< 400){
            }

            this.option.title.text = this.title
            this.chart = echarts.init(this.$refs.BarDom)
            this.chart.setOption(this.option)
            this.option.series[0].name = this.title
        },
        resize () {
            this.chart.resize()
        }
    },
    beforeDestroy() {
        window.onresize = null
    }
}

</script>

<style scoped>

</style>
