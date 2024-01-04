interface StatisticYearEntity{
    year: number,
    count: number,
    months: StatisticMonthEntity[]
}
interface StatisticMonthEntity{
    id: number,
    month: number,
    count: number
}

export {
    type StatisticYearEntity,
    type StatisticMonthEntity
}

