import {defineStore} from "pinia";
import {CategoryEntity} from "../entity/Category.ts";
import {StatisticYearEntity} from "../entity/StatisticYear.ts";
import statisticApi from "../api/statisticApi.js";
import diaryApi from "../api/diaryApi.ts";

console.log('pinia statisticStore is loaded, inside pinia file')


// 处理 年月份、类别统计数据
export const useStatisticStore = defineStore('statisticStore', {
    state: () => ({
        categoryAll: [] as CategoryEntity[],

        statisticsCategory: {},                        // 统计信息
        statisticsYear: [] as StatisticYearEntity[],   // 统计信息

        dataArrayYear: [] as String[],
        dataArrayCategory: [] as CategoryEntity[],
    }),
    getters: {
        // 类别名称字典
        categoryNameMap(state) {
            let categoryNameMap = new Map()
            state.categoryAll.forEach(item => {
                categoryNameMap.set(item.name_en, item.name)
            })
            return categoryNameMap
        },
        // 类别对象字典
        categoryObjectMap(state): Map<string, CategoryEntity> {
            let categoryNameMap = new Map()
            state.categoryAll.forEach(item => {
                categoryNameMap.set(item.name_en, item)
            })
            return categoryNameMap
        },
    },
    actions: {
        // 设置类别数据到 LocalStorage
        setCategoryAllToLocalStorage(newValue: CategoryEntity[]) {
            localStorage.setItem('CategoryAll', JSON.stringify(newValue))
        },
        removeCategoryAllFromLocalStorage(newValue: CategoryEntity[]) {
            localStorage.removeItem('CategoryAll')
        },
        getCategoryAllFromLocalStorage(): CategoryEntity[] {
            let categoryAllString = localStorage.getItem('CategoryAll')
            if (categoryAllString) {
                return JSON.parse(categoryAllString) as CategoryEntity[]
            } else {
                return []
            }
        },

        // 获取类别数据
        getCategoryAll(): Promise<boolean> {
            return diaryApi
                .getCategoryAll()
                .then(res => {
                    if (res.success) {
                        this.categoryAll = res.data
                        this.setCategoryAllToLocalStorage(res.data)
                        console.log('app is loaded all categories')
                        return true
                    } else {
                        console.log('获取类别失败:', res.message)
                        return false
                    }
                })
                .catch(() => {
                    console.log('服务器错误，请联系管理员')
                    return false
                })
        },
        // 获取统计信息
        getStatistic() {
            statisticApi
                .category()
                .then(res => {
                    this.statisticsCategory = res.data
                    this.setDataArrayCategory(res.data)
                })
            statisticApi
                .year()
                .then(res => {
                    this.statisticsYear = res.data
                    this.setDataArrayYear(res.data)
                })
        },
        // 设置年月份数据
        setDataArrayYear(statisticsYear: StatisticYearEntity[]) {
            if (statisticsYear) {
                this.dataArrayYear = statisticsYear.reverse()
                    .map(year => {
                        return {
                            name: year.year,
                            value: year.count
                        }
                    })
            }
        },
        // 设置类别数据
        setDataArrayCategory(statisticsCategory) {
            let keys = Object.keys(statisticsCategory)
            keys = keys.filter(item => item !== 'amount' && item !== 'shared')
            this.dataArrayCategory = keys.map(key => {
                return {
                    name: this.categoryNameMap.get(key),
                    value: statisticsCategory[key]
                }
            })
        }

    }
})


