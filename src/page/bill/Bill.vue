<template>
    <div class="statistic-container">
        <PageHeader title="账单"/>
        <div class="bill-content" :style="`height:${storeProject.insets.heightPanel}px`">
            <div class="bill-container" v-if="!isLoading">
                <div class="bill-filter-panel">
                    <div class="input-group white">
                        <label for="invitation" >关键字</label>
                        <textarea rows="3"
                                  placeholder="多个关键字，空格间隔"
                                  v-model.trim="formSearch.keyword"
                                  name="invitation"
                                  id="invitation"/>
                    </div>
                    <div class="input-group white">
                        <label for="invitation" >年份</label>
                        <div class="year-selector">
                            <div :class="['year-selector-item', {checked: year.checked}]" v-for="year in availableYears">
                                <label :for="year.value">{{year.value}}</label>
                                <input v-model="year.checked"
                                       type="checkbox"
                                       name="year"
                                       :id="year.value"/>
                            </div>
                        </div>
                    </div>

                    <div class="btn btn-active mb-2" @click="getBillData">筛选</div>
                    <div class="btn btn-active" @click="getBillKeys">获取最新账单类目</div>
                </div>

                <div class="bill" v-for="month in billYearData" :key="month.id">
                    <div class="bill-header">
                        <div>
                            <div class="title">{{ monthMap.get(month.month) }}</div>
                            <div class="subtitle">{{month.month_id.substring(0,4)}}</div>
                        </div>
                        <BillMonthSummary :bill-month="month"/>
                    </div>

                    <!-- FOOD -->
                    <BillFoodSummary :bill-food="month.food"/>

                    <!--  TOP INCOME & OUTCOME   -->
                    <BillTop5 :bill-top5="getBillMonthTop5(month).outcome" title="支出单项 TOP 5"/>

                    <table>
                        <tr>
                            <th class="center">日期</th>
                            <th>收入</th>
                            <th>支出</th>
                            <th class="label center">具体</th>
                        </tr>
                        <tr v-for="item in month.days" :key="item.date">
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
            </div>
            <Loading v-else :loading="isLoading"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import billApi from "../../api/billApi.ts"
import Loading from "../../components/Loading.vue"
import PageHeader from "../../framework/pageHeader/PageHeader.vue"
import {EntityBillItem, EntityBillMonth, MonthArray} from "@/page/bill/Bill.ts";
import BillFoodSummary from "@/page/bill/BillFoodSummary.vue";
import BillMonthSummary from "@/page/bill/BillMonthSummary.vue";
import BillTop5 from "@/page/bill/BillTop5.vue";

import {popMessage, dateProcess, setBillKeys} from "@/utility.ts";
import {useProjectStore} from "@/pinia";
const storeProject = useProjectStore();
import {onMounted, Ref, ref} from "vue";
import {useRouter} from "vue-router";
const router = useRouter()

const billYearData = ref<Array<EntityBillMonth>>([])
const isLoading = ref(false)
let monthMap = ref(new Map())
const formSearch = ref({
    year: new Date().getFullYear(),
    keyword: ''
})

const availableYears: Ref<{value: Number, checked: boolean}[]> = ref([]) // 账单可选年份


onMounted(()=>{
    // 可选的年份，从 2022 开始
    let yearNow = new Date().getFullYear()
    for (let i=0; i<=yearNow - 2022; i++){
        availableYears.value.push({
            value: 2022 + i,
            checked: true
        })
    }
    monthMap.value = new Map(MonthArray)
    getBillData()
})

function getBillKeys(){
    billApi
        .keys()
        .then(res => {
            setBillKeys(res.data)
            popMessage('success', `更新成功 ${res.data.length} 个`, ()=>{}, 2)
        })
        .catch(err => {
            popMessage('warning', err.message)
        })
}
function goToDiaryDetail(diaryId: number){
    console.log(diaryId)
    router.push({
        name: 'Detail',
        params: {
            id: diaryId
        }
    })
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
function getBillData() {
    isLoading.value = true
    billApi
        .sorted({
            years: availableYears.value
                .filter(item => item.checked)
                .map(item => item.value)
                .join(','), // 2022, 2023
            keyword: formSearch.value.keyword
        })
        .then(res => {
            isLoading.value = false
            billYearData.value = res.data
        })
        .catch(err => {
            popMessage('warning', err.message)
            isLoading.value = false
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

</script>

<style lang="scss">
@import "../../scss/plugin";

// 对应 tooltip 的样式： theme 名， tooltip-bill
.v-popper--theme-tooltip-bill {
    .v-popper__inner {
        padding: 10px;
        color: white;
        background: $bg-main;
        border: 1px solid $dark-border-active;
        @include border-radius($radius-mobile)
    }

    .v-popper__arrow-inner {
        border-color: $bg-main;
    }
}

@import "bill";

</style>
