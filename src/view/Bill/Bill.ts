export const MonthNameMap: Map<string, string> = new Map([
    ['01', '一月'],
    ['02', '二月'],
    ['03', '三月'],
    ['04', '四月'],
    ['05', '五月'],
    ['06', '六月'],
    ['07', '七月'],
    ['08', '八月'],
    ['09', '九月'],
    ['10', '十月'],
    ['11', '十一月'],
    ['12', '十二月'],
])

// 月份账单
export interface EntityBillMonth {
    id: number,
    days: Array<EntityBillDay>,
    food: EntityBillFood,
    month: string,
    month_id: string,
    sum: number,
    sumIncome: number,
    sumOutput: number,
    incomeTop5: Array<EntityBillTop5Item>,
    outcomeTop5: Array<EntityBillTop5Item>,
}

// 日账单
export interface EntityBillDay {
    id: number,
    date: string,
    sum: number,
    sumIncome: number,
    sumOutput: number,
    items: Array<EntityBillItem>
}

// 吃饭账单
export interface EntityBillFood {
    breakfast: number, // 早
    launch: number, // 午
    dinner: number, // 晚
    supermarket: number, // 超市
    fruit: number, // 水果
    sum: number  // 合计
}

export interface EntityBillItem{
    item: string,
    price: number
}

// income top5 & outcome top5 item
export interface EntityBillTop5Item extends EntityBillItem{
    isFiltered?: boolean
}


export interface  BillKey {
    key: string, // 账单条目
    count: number, // 数量
    sort?: number, // 排序
}

