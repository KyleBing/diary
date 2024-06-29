<template>
    <div class="brief-amount">
        <div class="number text-income">
            +{{ (props.billMonth.sumIncome).toFixed(storeProject.moneyAccuracy)  }} <span class="bill-sum-label">收入</span>
        </div>
        <div class="number text-outcome">
            {{ (props.billMonth.sumOutput - exceptSum ).toFixed(storeProject.moneyAccuracy)}} <span class="bill-sum-label">支出</span>
        </div>
        <div class="number sum text-black">
            {{ (props.billMonth.sum - exceptSum ).toFixed(storeProject.moneyAccuracy)}} <span class="bill-sum-label">合计</span>
        </div>
    </div>
</template>


<script setup lang="ts">

import {useProjectStore} from "@/pinia";
import {EntityBillMonth} from "@/view/Bill/Bill.ts";

const storeProject = useProjectStore();
interface Props {
    billMonth: EntityBillMonth,
    exceptSum: number // 排除的消费项目总和，如果除去这些消费，显示能在总结余里剩余多少
}
const props = defineProps<Props>()



</script>

<style scoped lang="scss">
@import "../../scss/plugin";

.brief-amount{
    font-weight: bold;
    font-size: $fz-main;
    letter-spacing: 1px;
    align-items: stretch;
    flex-flow: column nowrap;
    display: flex;
    justify-content: space-between;
    > * {
        text-align: right;
    }
    .sum{
        position: relative;
        margin-top: 5px;
        padding-top: 5px;
        &:after{
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 120%;
            border-bottom: 1px dashed $color-border-highlight;
            display: block;
        }
    }
}
</style>
