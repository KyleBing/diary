<template>
    <div ref="refBar"
         class="charts"
         :style="`height: 300px; width: ${width}`"
    />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import {nextTick, onMounted, ref, watch} from "vue";

import {useProjectStore} from "../../pinia";
const storeProject = useProjectStore()
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);

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

const refBar = ref()

const props = defineProps({
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
    widthInit: {
        type: String,
        default: '100%'
    },
})

watch(() => props.data, newValue=>{
    if (newValue) {
        resetData(newValue)
    }
})

const chart = ref(null)
const option = ref(null)
const width = ref('500px') // 图表宽度 500

onMounted( () => {
    if (window.innerWidth< 400){
        width.value = '100%'
    } else {
        width.value = props.widthInit
    }
    nextTick(()=> {
        initChart()
        resetData(props.data)
    })
})

function resetData(newValue) {
    let xAxisData = []
    let seriesData = []
    let colorArray = []
    newValue.forEach(item => {
        seriesData.push(item.value)
        xAxisData.push(item.name)
        let color = storeProject.categoryNameMap.get(item.key) && storeProject.categoryObjectMap.get(item.key).color
        if (color){
            colorArray.push(color)
        }
    })

    // 如果有类别颜色，colorBy: data
    if (colorArray.length > 0){
        option.value.color = colorArray
    } else {
        option.value.color = COLORS
    }

    option.value.colorBy = 'data'
    option.value.xAxis[0].data = xAxisData
    option.value.series[0].data = seriesData
    chart.value.setOption(option.value)
}
function initChart() {
    option.value = {
        grid: {
            bottom: 40,
            right: 20,
            top: 30,
            left: 30
        },
        title: {
            text: '',
            left: 'center',
            textStyle:{
                color: '#666666'
            }
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
            axisLabel: {
                fontSize: 11,
                color: '#666666',
                rotate: -45
            }
        }],
        yAxis: [{
            type: 'value',
            axisLabel:{
                formatter: (value, index) => {
                    let k = value / 1000
                    let b = value % 1000
                    if (k >= 1){
                        return `${k}k`
                    } else {
                        return b
                    }
                }
            }
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

    option.value.title.text = props.title
    chart.value = echarts.init(refBar.value)
    chart.value.setOption(option.value)
    option.value.series[0].name = props.title
}
</script>

<style scoped>

</style>
