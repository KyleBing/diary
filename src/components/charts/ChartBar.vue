<template>
    <div ref="BarDom" class="charts" style="height: 350px; width: 500px"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
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
            if(newValue) {
                console.log('inside watch')
                this.resetData(newValue)
            }
        },
    },
    data() {
        return {
            chart: null,
            option: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart()
            this.resetData(this.data)
        })
    },
    computed: {
        xAxisData(){
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
                    barWidth: 24, //柱子宽度
                    label: {
                        show: true,
                        position: 'top',
                        fontSize: 12,
                    },
                }]
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
