<template>
    <div class="bill bill-horizontal">
        <div class="bill-header">
            <div>
                <div class="title">{{ MonthNameMap.get(billMonthData.month) }}</div>
                <div class="subtitle">{{billMonthData.month_id.substring(0,4)}}</div>
            </div>
        </div>
        <div style="flex-grow: 1">
            <!-- SUMMARY -->
            <BillMonthSummary :bill-month="billMonthData"/>

            <!-- FOOD -->
            <BillFoodSummaryHorizontal :bill-food="billMonthData.food"/>

            <!-- TOP INCOME & OUTCOME -->
            <BillTop5 :bill-top5="getBillMonthTop5(billMonthData).outcome" title="支出单项 TOP 5"/>
        </div>
        <table v-for="(dayArray, index) in monthBillArray" :key="index">
            <tr>
                <th class="center">日期</th>
                <th>收入</th>
                <th>支出</th>
                <th class="label center">具体</th>
            </tr>
            <tr v-for="item in dayArray" :key="item.date">
                <td class="center number link"  @click="goToDiaryDetail(item.id)">
                    {{ dateProcess(item.date).day }}
                    <span class="text-gray">{{ dateProcess(item.date).weekShort }}</span></td>
                <td class="amount number">
                    <span v-if="item.sumIncome === 0" class="text-invalid">~</span>
                    <span v-else-if="item.sumIncome > 0" class="text-income">+{{ item.sumIncome.toFixed(storeProject.moneyAccuracy) || '-' }}</span>
                    <span v-else>{{ item.sumIncome.toFixed(storeProject.moneyAccuracy) || '-' }}</span>
                </td>
                <td class="amount number">
                    <span v-if="item.sumOutput === 0" class="text-invalid">~</span>
                    <span v-else-if="item.sumOutput > 0" class="text-income">+{{ item.sumOutput.toFixed(storeProject.moneyAccuracy) || '-' }}</span>
                    <span v-else>{{ item.sumOutput.toFixed(storeProject.moneyAccuracy) || '-' }}</span>
                </td>
                <td class="label center"
                    v-tooltip="{
                            content: tooltipContent(item.items),
                            html: true,
                            theme: 'tooltip-bill'
                        }">
                    {{ tooltipContentWithoutReturn(item.items) }}
                </td>
            </tr>
        </table>
    </div>
</template>


<script setup lang="ts">
import {EntityBillDay, EntityBillItem, EntityBillMonth, MonthNameMap} from "@/page/bill/Bill.js";
import {useProjectStore} from "@/pinia";
import {dateProcess} from "@/utility.js";
import BillMonthSummary from "@/page/bill/BillMonthSummary.vue";
import BillTop5 from "@/page/bill/BillTop5.vue";
import BillFoodSummary from "@/page/bill/BillFoodSummary.vue";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import BillFoodSummaryHorizontal from "@/page/bill/horizontal/BillFoodSummaryHorizontal.vue";

const router = useRouter()
const storeProject = useProjectStore();

interface Props {
    billMonthData: EntityBillMonth,
}
const props = defineProps<Props>()

const monthBillArray = ref<Array<Array<EntityBillDay>>>([])
onMounted(()=>{
    for (let i=0;i<2;i++){
        monthBillArray.value.push(props.billMonthData.days.slice(i*16, (i+1)*16))
    }
})

function goToDiaryDetail(diaryId: number){
    console.log(diaryId)
    router.push({
        name: 'Detail',
        params: {
            id: diaryId
        }
    })
}


// 获取每月账单最高的前5个消费项目
function getBillMonthTop5(billMonth: EntityBillMonth): {
    income: Array<EntityBillItem>,
    outcome: Array<EntityBillItem>
}{
    let monthBillItems: Array<EntityBillItem> = []
    billMonth.days.forEach(billDay => {
        billDay.items.forEach(billItem => {
            monthBillItems.push(billItem)
        })
    })
    monthBillItems.sort((a,b) => a.price > b.price ? 1: -1)

    let billItemsIncome = monthBillItems.filter(item => item.price > 0).sort((a,b) => a.price < b.price ? 1: -1)
    return {
        outcome: monthBillItems.splice(0,5),
        income: billItemsIncome.splice(0,5)
    }
}
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
function tooltipContent(billItemArray: Array<EntityBillItem>) {
    let listContent =  billItemArray.map(item => {
        return `<tr class="bill-detail-list-item"><td>${item.item}</td><td class="price">${item.price.toFixed(2)}</td><tr/>`
    }).join('')
    return `
                    <table class="bill-detail-list">
                    <tbody>
                    ${listContent}
                    </tbody>
                    </table>`
}


</script>



<style scoped lang="scss">
@import "../../../scss/plugin";

</style>
