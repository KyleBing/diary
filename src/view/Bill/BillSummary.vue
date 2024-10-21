<template>
    <BillPanel title="总计" padding="20px 20px">
        <div class="bill-list-big">
            <div class="bill-list-big-item">
                <div class="name">总收入</div>
                <div class="price text-income">￥ {{summaryData.sumIncome.toFixed(2)}}</div>
            </div>
            <div class="bill-list-big-item">
                <div class="name">总支出</div>
                <div class="price text-expense">￥ {{summaryData.sumExpense.toFixed(2)}}</div>
            </div>

            <div class="bill-list-big-item mt-3">
                <div class="name">收入条目数</div>
                <div class="price text-income">{{summaryData.totalIncomeCount}}</div>
            </div>
            <div class="bill-list-big-item">
                <div class="name">支出条目数</div>
                <div class="price text-expense">{{summaryData.totalExpenseCount}}</div>
            </div>

            <div class="bill-list-big-item mt-3">
                <div class="name">总天数</div>
                <div class="price text-income">{{summaryData.totalDayCount}}</div>
            </div>
            <div class="bill-list-big-item">
                <div class="name">总条目数</div>
                <div class="price text-income">{{summaryData.totalCount}}</div>
            </div>
        </div>
    </BillPanel>
</template>

<script setup lang="ts">

import {EntityBillMonth} from "@/view/Bill/Bill.ts";
import {onMounted, ref, watch} from "vue";
import BillPanel from "@/view/Bill/BillPanel.vue";

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
@import "../../scss/plugin";

.bill-list-big{
    .bill-list-big-item{
        cursor: pointer;
        @extend .btn-like;
        margin-bottom: 6px;
        font-size: $fz-main;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        &.filtered{
            text-decoration: line-through;
        }
        &:after{
            position: absolute;
            content: '';
            height: 1px;
            width: 100%;
            border-bottom: 1px dashed $color-border;
        }
        > * {
            z-index: 10;
            background-color: white;
        }
        .name{
            padding-right: 15px;
        }
        .price{
            font-weight: bold;
            font-family: "JetBrainsMonoDiary";
            padding-left: 15px;
        }
    }
}

@media (prefers-color-scheme: dark) {
    .summary{
        color: $dark-text;
    }
    .title{
        color: $dark-text;
    }
    .bill-list-big{
        .bill-list-big-item{
            &:after{
                border-bottom: 1px dashed $dark-border;
            }
            > * {
                background-color: $dark-bg-dark;
            }
            .name{}
            .price{}
        }
    }
}

</style>
