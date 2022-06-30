<template>
    <div ref="BarDom" class="charts" :style="`height: 350px; width: ${width}`"></div>
</template>

<script>
import * as echarts from 'echarts'
import {mapState} from "vuex";

const COLORS =  [
    '#FFA41C',
    '#2F3037',
    '#9FE080',
    '#5C7BD9',
    '#7ED3F4',
    '#EE6666',
    '#c7c7c7',
    '#FFDC60'
]

export default {
    name: "ChartPie",
    props: {
        data: {
            type: Array,
            default: []
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
        ...mapState(['categoryMap']),
        xAxisData() {
            return this.data
        }
    },
    methods: {
        resetData(newValue) {
            this.option.series[0].data = newValue
            this.chart.setOption(this.option)
        },
        initChart() {

            this.option = {

                grid: {
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20
                },
                title: {
                    text: '',
                    left: 'center',
                    textStyle:{
                        color: '#666666'
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        name: '饼状图',
                        type: 'pie',
                        radius: '60%',
                        data: [
                            // {value: 1048, name: '搜索引擎'},
                        ],
                        itemStyle: {
                            color: item => {
                                if (item.data.key){
                                    return  this.categoryMap.get(item.data.key).color // 返回类别对应的颜色
                                } else {
                                    return COLORS[item.dataIndex%(COLORS.length - 1)]
                                }
                            }
                        },
                        label: {
                            show: true,
                            position: 'outside',
                            fontSize: 12,
                            formatter: '{b} {d}%'
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.2)'
                            }
                        }
                    }
                ]
            }

            if (window.innerWidth< 400){
                this.option.series[0].radius = '40%'
            }

            this.option.title.text = this.title
            this.chart = echarts.init(this.$refs.BarDom);
            this.chart.setOption(this.option);
            this.option.series[0].name = this.title
        },
        resize() {
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
