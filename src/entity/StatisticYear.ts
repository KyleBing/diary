interface StatisticYearEntity{
    year: number,
    count: number,
    months: StatisticMonthEntity[]
}
interface StatisticMonthEntity{
    id: string, // 202501
    month: number,
    count: number
}

export {
    type StatisticYearEntity,
    type StatisticMonthEntity
}

