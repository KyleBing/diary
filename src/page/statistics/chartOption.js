/* 通用 echart 配置 */

const COLOR = {
    main   : '#00deff',
    label  : '#aaa',
    title  : '#fff',
    white  : '#fff',
    line   : 'rgba(0,0,0,0.2)',
    green  : '#2bb06a',
    cyan   : '#5AC8FA',
    blue   : '#007AFF',
    purple : '#5856D6',
    magenta: '#FF2D70',
    red    : '#FF3B30',
    orange : '#FF9500',
    yellow : '#FFCC00',
    gray   : '#8E8E93',
    primary: '#409EFF'
}
const COLOR_ARRAY = [
    '#FF9500',
    '#007AFF',
    '#4CD964',
    '#5AC8FA',
    '#5856D6',
    '#FF2D70',
    '#FF3B30',
    '#FFCC00',
    '#8E8E93',
]

const LEGEND =  { // 图例样式
    textStyle: {
        color: '#fff'
    },
    type: 'scroll',
    orient: 'vertical',
    top: 0,
    right: 0,
    data: []
}
const TOOLTIP = {
    trigger: 'axis',
}
const GRID = { // 图表边界
    top: 20,
    bottom: 20,
    left: 40,
    right: 20,
    borderColor: COLOR.green
}

export default {
    COLOR,
    LEGEND,
    GRID,
    TOOLTIP,
    COLOR_ARRAY,
    COLOR_OPTION: [COLOR.main, COLOR.green],
    COLOR_BAR: [COLOR.green, COLOR.purple],
}
