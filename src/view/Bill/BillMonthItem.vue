<template>
    <div class="bill">
        <div class="bill-header">
            <div>
                <div class="title">{{ MonthNameMap.get(billMonthData.month) }}</div>
                <div class="subtitle">{{billMonthData.month_id.substring(0,4)}}</div>
            </div>
            <BillMonthSummary
                :bill-month="billMonthData"
                :exceptSum="exceptSum"

            />
        </div>

        <!-- FOOD -->
        <!-- <BillFoodSummary :bill-food="billMonthData.food"/> -->

        <!--  TOP INCOME & OUTCOME   -->
        <BillTop5 v-model="outcomeTop5" title="单项支出 TOP 5" :month-data="billMonthData"/>

        <table>
            <tr>
                <th class="center">日期</th>
                <th>收入</th>
                <th>支出</th>
                <th class="label center">具体</th>
            </tr>
            <tr
                v-for="item in billMonthData.days"
                :key="item.date"
                class="bill-day-row"
                @click="openDayPopup(item)"
            >
                <td class="date center number link">
                    {{ dateProcess(item.date).day }}
                    <span class="text-gray">{{ dateProcess(item.date).weekShort }}</span>
                </td>
                <td class="income amount number">
                    <span v-if="item.sumIncome === 0" class="text-invalid">~</span>
                    <span v-else-if="item.sumIncome > 0" class="text-income">
                        +{{ item.sumIncome.toFixed(projectStore.moneyAccuracy) || '-' }}
                    </span>
                    <span v-else>
                        {{ item.sumIncome.toFixed(projectStore.moneyAccuracy) || '-' }}
                    </span>
                </td>
                <td class="output amount number">
                    <span v-if="item.sumOutput === 0" class="text-invalid">~</span>
                    <span v-else-if="item.sumOutput > 0" class="text-income">+{{ item.sumOutput.toFixed(projectStore.moneyAccuracy) || '-' }}</span>
                    <span v-else>{{ item.sumOutput.toFixed(projectStore.moneyAccuracy) || '-' }}</span>
                </td>
                <td class="label center">
                    {{ tooltipContentWithoutReturn(item.items) }}
                </td>
            </tr>
        </table>
        <BillDayPopup
            v-if="popupDay"
            :day="popupDay"
            open-mode="detail"
            @close="popupDay = null"
        />
    </div>
</template>


<script setup lang="ts">
import {EntityBillDay, EntityBillItem, EntityBillMonth, EntityBillTop5Item, MonthNameMap} from "@/view/Bill/Bill.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {dateProcess} from "@/utility.ts";
import BillMonthSummary from "@/view/Bill/BillMonthSummary.vue";
import BillTop5 from "@/view/Bill/BillTop5.vue";
import BillDayPopup from "@/view/Bill/BillDayPopup.vue";
import {onMounted, ref, watch} from "vue";

const projectStore = useProjectStore();

interface Props {
    billMonthData: EntityBillMonth,
}
const props = defineProps<Props>()
const popupDay = ref<EntityBillDay | null>(null)

function openDayPopup(day: EntityBillDay){
    popupDay.value = day
}

// 过滤排除的消费项目
const outcomeTop5 = ref<Array<EntityBillTop5Item>>([])
const exceptSum = ref(0)

watch(outcomeTop5, newValue => {
    exceptSum.value = 0
    newValue.filter(item => item.isFiltered).forEach(item => {
        exceptSum.value = exceptSum.value + item.price
    })
    return exceptSum.value
}, {
    deep: true
})

onMounted(()=> {
    outcomeTop5.value = props.billMonthData.outcomeTop5.map(item => {
        item.isFiltered = false
        return item
    })
})



// 获取每月吃饭账单统计
function getBillMonthFood(billMonth: EntityBillMonth): Array<EntityBillItem>{
    return [
        {item: '早餐', price: billMonth.food.breakfast},
        {item: '午餐', price: billMonth.food.launch},
        {item: '晚餐', price: billMonth.food.dinner},
        {item: '超市', price: billMonth.food.supermarket},
        {item: '水果', price: billMonth.food.fruit},
        {item: '总计', price: billMonth.food.sum},
    ]
}

function tooltipContentWithoutReturn(billItemArray: Array<EntityBillItem>) {
    return billItemArray
        .map(item => {
            return `${item.item}`
        })
        .join('，')
}


</script>



<style scoped lang="scss">
@use "../../scss/plugin" as *;

.bill-day-row{
    cursor: pointer;
}
</style>
