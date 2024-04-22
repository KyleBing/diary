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
        <BillFoodSummary :bill-food="billMonthData.food"/>

        <!--  TOP INCOME & OUTCOME   -->
        <BillTop5 v-model="outcomeTop5"
                  title="支出单项 TOP 5"/>

        <table>
            <tr>
                <th class="center">日期</th>
                <th>收入</th>
                <th>支出</th>
                <th class="label center">具体</th>
            </tr>
            <tr v-for="item in billMonthData.days" :key="item.date">
                <td class="center number link"  @click="goToDiaryDetail(item.id)">
                    {{ dateProcess(item.date).dateShort }}
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
import {EntityBillItem, EntityBillMonth, EntityBillTop5Item, MonthNameMap} from "@/page/bill/Bill.ts";
import {useProjectStore} from "@/pinia";
import {dateProcess} from "@/utility.ts";
import BillMonthSummary from "@/page/bill/BillMonthSummary.vue";
import BillTop5 from "@/page/bill/BillTop5.vue";
import BillFoodSummary from "@/page/bill/BillFoodSummary.vue";
import {useRouter} from "vue-router";
import {onMounted, ref, watch} from "vue";

const router = useRouter()
const storeProject = useProjectStore();

interface Props {
    billMonthData: EntityBillMonth,
}
const props = defineProps<Props>()

function goToDiaryDetail(diaryId: number){
    console.log(diaryId)
    router.push({
        name: 'Detail',
        params: {
            id: diaryId
        }
    })
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
@import "../../scss/plugin";

</style>
