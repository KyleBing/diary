export interface StatisticYearEntity{
    year: number,
    count: number,
    months: StatisticMonthEntity[]
}
export interface StatisticMonthEntity{
    id: string, // 202501
    month: number,
    count: number
}



