<template>
    <div class="statistic-container">
        <PageHeader title="账单"/>
        <div class="bill-content" :style="`height:${projectStore.insets.heightPanel}px`">
            <div class="bill-container" >
                <div class="filter-panel">
                    <BillPanel :width="450" title="账单筛选" padding="20px">
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
                            <BillYearSelector v-model="yearNumberArray"/>
                        </div>

                        <Button class="mb-2" @click="getBillData">筛选</Button>
                        <ButtonSmall class="mb-2" @click="getBillKeys">获取最新账单类目</ButtonSmall>
                        <ButtonSmall class="mb-2"  @click="hideBigIncome" v-if="isShowSalaryButton">隐藏工资收入</ButtonSmall>
                    </BillPanel>

                    <BorrowInfo class="mt-2"/>
                </div>

                <BillSummary :monthDataOfBill="billYearData"/>

                <BillMonthItem
                    v-if="!isLoading"
                    :bill-month-data="month"
                    v-for="month in billYearData" :key="month.id"
                />
                <Loading v-else :loading="isLoading"/>

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import billApi from "../../api/billApi.ts"
import Loading from "../../components/Loading.vue"
import PageHeader from "../../framework/pageHeader/PageHeader.vue"
import {EntityBillItem, EntityBillMonth} from "@/view/Bill/Bill.ts";

import {popMessage, setBillKeys} from "@/utility.ts";
import {useProjectStore} from "@/pinia";
const projectStore = useProjectStore();
import {onMounted, ref} from "vue";
import BillYearSelector from "@/view/Bill/BillYearSelector.vue";
import BillMonthItem from "@/view/Bill/BillMonthItem.vue";
import BorrowInfo from "@/view/Bill/BorrowInfo/BorrowInfo.vue";
import BillPanel from "@/view/Bill/BillPanel.vue";
import Button from "@/components/Button.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";
import BillSummary from "@/view/Bill/BillSummary.vue";

const billYearData = ref<Array<EntityBillMonth>>([])
const isLoading = ref(false)
const formSearch = ref({
    year: new Date().getFullYear(),
    keyword: ''
})

const yearNumberArray = ref<Array<number>>([new Date().getFullYear()])

onMounted(()=>{
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


function getBillData() {
    if (yearNumberArray.value.length === 0){
        popMessage('warning', '未选择年份')
        return
    }
    isLoading.value = true
    billApi
        .sorted({
            years: yearNumberArray.value.join(','), // 2022, 2023
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


/**
 * 临时隐藏收入条目
 */
const isShowSalaryButton = ref(true)
function hideBigIncome(){
    billYearData.value.forEach(monthData => {
        let salaryAmountMonth = 0 // 工资收入总合
        monthData.days.forEach(dayItem => {
            // 带有工资的账单条目
            let salaryArray: Array<EntityBillItem> = dayItem.items.filter(item => item.item.indexOf('工资') > 1)
            // 获取工资收入条目总合：日
            let salaryAmountDay = salaryArray.reduce((sum,nextItem) => sum + nextItem.price, 0)
            // 过滤工资条目
            dayItem.items = dayItem.items.filter(item => item.item.indexOf('工资') < 0)
            // 日收入
            dayItem.sumIncome = dayItem.sumIncome - salaryAmountDay
            // 汇总到月收入总合上，供外层月份数据使用
            salaryAmountMonth = salaryAmountMonth + salaryAmountDay
        })
        // 月收入
        monthData.sumIncome = monthData.sumIncome - salaryAmountMonth
        monthData.sum = monthData.sumIncome - salaryAmountMonth
    })
    isShowSalaryButton.value = false
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
