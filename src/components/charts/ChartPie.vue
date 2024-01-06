<template>
    <div
        ref="refPieDom"
        class="charts"
        :style="`height: 300px; width: ${width}`"
    />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useProjectStore} from "../../pinia";

const storeProject = useProjectStore()

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    PieChart,
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

const props = defineProps({
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
})

watch( () => props.data, newValue => {
    if (newValue) {
        resetData(newValue)
    }
})

const refPieDom = ref()
const chart = ref(null)
const option = ref(null)
const width = ref('100%') // 图表宽度 500

onMounted(()=>{
    if (window.innerWidth< 400){
        width.value = '100%'
    }
    nextTick(() => {
        initChart()
        resetData(props.data)
    })
})

const xAxisData = computed( () => {
    return props.data
})

function resetData(newValue) {
    option.value.series[0].data = newValue
    chart.value.setOption(option.value)
}
function initChart() {
    option.value = {
        grid: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
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
                            return  storeProject.categoryObjectMap.get(item.data.key).color // 返回类别对应的颜色
                        } else {
                            return COLORS[item.dataIndex%(COLORS.length - 1)]
                        }
                    }
                },
                label: {
                    show: true,
                    position: 'outside',
                    fontSize: 12,
                    formatter: data => {
                        return `${data.name}\t${Math.ceil(data.percent)}%`
                    }
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
        option.value.series[0].radius = '40%'
    }
    option.value.title.text = props.title
    chart.value = echarts.init(refPieDom.value);
    chart.value.setOption(option.value);
    option.value.series[0].name = props.title
}
function resize() {
    chart.value.resize()
}

</script>
