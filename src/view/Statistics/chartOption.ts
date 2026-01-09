/* 通用 echart 配置 */

// Base colors (data series colors - remain the same)
const COLOR = {
    main   : '#00deff',
    label  : '#aaa',
    title  : '#fff',
    white  : '#fff',
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

// Light theme colors for chart UI elements (axes, labels, etc.)
const COLOR_LIGHT = {
    axisLabel: '#666666',
    axisLine: COLOR.gray,
    splitLine: 'rgba(0,0,0,0.1)',
    title: '#333333',
    legend: '#666666',
    tooltipBg: '#ffffff',
    tooltipBorder: '#ccc',
    valueLabel: '#000000', // Black text for chart item labels
    valueLabelBorder: '#ffffff', // White outline for black text in light mode
    valueLabelBorderWidth: 2 // Width of white outline
}

// Dark theme colors for chart UI elements
const COLOR_DARK = {
    axisLabel: '#ffffff',
    axisLine: COLOR.gray,
    splitLine: 'rgba(255,255,255,0.2)',
    title: '#ffffff',
    legend: '#ffffff',
    tooltipBg: '#2a2a2a',
    tooltipBorder: '#555',
    valueLabel: '#ffffff', // White font for value labels in dark mode
    valueLabelBorder: '#000000', // Black outline for readability on colored items
    valueLabelBorderWidth: 1 // Subtle outline in dark mode
}

/**
 * Get theme-aware colors based on system theme
 * @param isDark - whether dark theme is active
 */
function getThemeColors(isDark: boolean) {
    return isDark ? COLOR_DARK : COLOR_LIGHT
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
    COLOR_LIGHT,
    COLOR_DARK,
    getThemeColors,
}
