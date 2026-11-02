<template>
    <div class="bill-side-summary">
        <div class="bill-side-summary-main">
            <span class="label">收入</span>
            <span class="value text-income number">{{ formatSigned(summaryData.sumIncome) }}</span>
            <span class="label">支出</span>
            <span class="value text-expense number">{{ formatSigned(summaryData.sumExpense) }}</span>
            <span class="label">合计</span>
            <span :class="['value', 'net', 'number', summaryData.sumNet >= 0 ? 'text-income' : 'text-expense']">
                {{ formatSigned(summaryData.sumNet) }}
            </span>
        </div>
        <div class="bill-side-summary-meta">
            <span>{{ summaryData.totalIncomeCount }}收</span>
            <span>{{ summaryData.totalExpenseCount }}支</span>
            <span>{{ summaryData.totalDayCount }}天</span>
            <span>{{ summaryData.totalCount }}笔</span>
        </div>
    </div>
</template>

<script setup lang="ts">

import {EntityBillMonth} from "@/view/Bill/Bill.ts";
import {ref, watch} from "vue";

const props = defineProps<{
    monthDataOfBill: Array<EntityBillMonth>
}>()

const summaryData = ref({
    totalExpenseCount: 0,
    totalIncomeCount: 0,
    sumIncome: 0,
    sumExpense: 0,
    sumNet: 0,
    totalDayCount: 0,
    totalCount: 0,
})

function resetCount(){
    summaryData.value = {
        totalExpenseCount: 0,
        totalIncomeCount: 0,
        sumIncome: 0,
        sumExpense: 0,
        sumNet: 0,
        totalDayCount: 0,
        totalCount: 0,
    }
}

// 正数补 +
function formatSigned(value: number){
    const text = value.toFixed(2)
    return value > 0 ? `+${text}` : text
}

watch(() => props.monthDataOfBill, () => {
    resetCount()
    recalculateData()
}, { deep: true, immediate: true })

// 按当前月份列表重算年度合计
function recalculateData(){
    props.monthDataOfBill.forEach(monthBill => {
        summaryData.value.sumIncome = summaryData.value.sumIncome + monthBill.sumIncome
        summaryData.value.sumExpense = summaryData.value.sumExpense + monthBill.sumOutput
        summaryData.value.sumNet = summaryData.value.sumNet + monthBill.sum
        summaryData.value.totalDayCount = summaryData.value.totalDayCount + monthBill.days.length

        monthBill.days.forEach(dayBill => {
            summaryData.value.totalCount = summaryData.value.totalCount + dayBill.items.length
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

.bill-side-summary{
    margin-bottom: 8px;
}
.bill-side-summary-main{
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 10px;
    row-gap: 2px;
    align-items: baseline;
}
.label{
    font-size: $fz-small;
    opacity: 0.7;
}
.value{
    min-width: 0;
    overflow: visible;
    font-size: $fz-main;
    font-weight: bold;
    font-family: "JetBrainsMonoDiary", sans-serif;
    font-variant-numeric: tabular-nums;
    text-align: right;
    white-space: nowrap;
    &.net{
        font-size: $fz-title;
        line-height: 1.2;
    }
}
.bill-side-summary-meta{
    display: flex;
    flex-wrap: wrap;
    gap: 8px 10px;
    margin-top: 6px;
    font-size: $fz-small;
    opacity: 0.75;
}
</style>
