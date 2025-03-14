interface CalendarAttribute {
    key: number,
    bar: {
        style: {
            backgroundColor: string
        }
    },
    highlight: {
        fillMode: 'solid' | 'light' | 'outline',
        color: string,
    },
    color: string,
    dates: Date,
    popover: {
        label: string,
        visibility: 'click' | 'hover',
        hideIndicator: boolean, // 隐藏弹窗中不同条目的类别标识，在条目前面的标识
    }
}

interface CalendarEntity {
    name: string,
    color: string,
    dates: Array<[Array<Date>]>
}

export {
    type CalendarAttribute,
    type CalendarEntity
}
