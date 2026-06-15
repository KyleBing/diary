<template>
    <div class="bill-navbar-statistic">
        <div class="bill-navbar-statistic-item">
            <div class="label">总收入</div>
            <div class="value text-income">￥{{ summaryData.sumIncome.toFixed(2) }}</div>
        </div>
        <div class="bill-navbar-statistic-item">
            <div class="label">总支出</div>
            <div class="value text-expense">￥{{ summaryData.sumExpense.toFixed(2) }}</div>
        </div>
        <div class="bill-navbar-statistic-item">
            <div class="label">收入条目</div>
            <div class="value text-income">{{ summaryData.totalIncomeCount }}</div>
        </div>
        <div class="bill-navbar-statistic-item">
            <div class="label">支出条目</div>
            <div class="value text-expense">{{ summaryData.totalExpenseCount }}</div>
        </div>
        <div class="bill-navbar-statistic-item">
            <div class="label">总天数</div>
            <div class="value">{{ summaryData.totalDayCount }}</div>
        </div>
        <div class="bill-navbar-statistic-item">
            <div class="label">总条目</div>
            <div class="value">{{ summaryData.totalCount }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {EntityBillMonth} from "@/view/Bill/Bill.ts";
import {onMounted, ref, watch} from "vue";

const props = defineProps<{
    monthDataOfBill: Array<EntityBillMonth>
}>()

onMounted(()=>{
    recalculateData()
})

const summaryData = ref({
    totalExpenseCount: 0,
    totalIncomeCount: 0,
    sumIncome: 0,
    sumExpense: 0,
    totalMonthCount: 0,
    totalDayCount: 0,
    totalCount: 0,
})

function resetCount(){
    summaryData.value = {
        totalExpenseCount: 0,
        totalIncomeCount: 0,
        sumIncome: 0,
        sumExpense: 0,
        totalMonthCount: 0,
        totalDayCount: 0,
        totalCount: 0,
    }
}

watch(() => props.monthDataOfBill, () => {
    resetCount()
    recalculateData()
})

/**
 * 重新计算统计数据
 */
function recalculateData(){
    props.monthDataOfBill.forEach(monthBill => {
        // 总 支出/收入
        summaryData.value.sumIncome = summaryData.value.sumIncome + monthBill.sumIncome
        summaryData.value.sumExpense = summaryData.value.sumExpense + monthBill.sumOutput

        // 总天数
        summaryData.value.totalDayCount = summaryData.value.totalDayCount + monthBill.days.length

        monthBill.days.forEach(dayBill => {
            // 总条目数量
            summaryData.value.totalCount = summaryData.value.totalCount + dayBill.items.length
            // 支出/收入条目的数量
            dayBill.items.forEach(item => {
                if (item.price > 0){
                    summaryData.value.totalIncomeCount++
                } else {
                    summaryData.value.totalExpenseCount++
                }
            })
        })
    })
}
</script>

<style scoped lang="scss">
@use "../../scss/plugin" as *;

.bill-navbar-statistic{
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    overflow-x: auto;
    flex-shrink: 1;
    min-width: 0;
    .bill-navbar-statistic-item{
        flex-shrink: 0;
        margin-left: 16px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        white-space: nowrap;
        .label{
            font-size: $fz-main;
            margin-right: 6px;
            opacity: 0.75;
        }
        .value{
            font-size: $fz-main;
            font-weight: bold;
            font-family: "JetBrainsMonoDiary";
        }
    }
}

@media (max-width: $grid-separate-width-sm) {
    .bill-navbar-statistic{
        .bill-navbar-statistic-item{
            margin-left: 10px;
            .label{
                font-size: $fz-small;
            }
            .value{
                font-size: $fz-small;
            }
        }
    }
}

</style>
