<template>
    <div class="statistic-container bill-page" :style="`height: ${projectStore.insets.windowsHeight}px`">
        <PageHeader :title="currentView.headerTitle" :subtitle="currentView.headerHint"/>
        <div class="bill-body">
            <!-- 左侧视图切换：选中条上下滑动，不带动右侧月份列表 -->
            <aside class="bill-nav">
                <div class="bill-nav-list">
                    <i class="bill-nav-thumb" :style="{ transform: `translateY(${viewIndex * 100}%)` }"/>
                    <button
                        type="button"
                        v-for="item in billViews"
                        :key="item.id"
                        :class="{checked: view === item.id}"
                        @click="setView(item.id)"
                    >{{ item.label }}</button>
                </div>
            </aside>
            <div class="bill-content" :class="`bill-view-${view}`">
                <!-- v-show 保留月份 DOM 和滚动位置 -->
                <div class="bill-months-layout" v-show="view === 'months'">
                    <div class="filter-panel">
                            <div class="bill-months-side">
                                <BillSummary :monthDataOfBill="billYearData"/>
                                <input
                                    class="bill-filter-keyword"
                                    type="search"
                                    placeholder="关键字，空格分隔"
                                    v-model.trim="formSearch.keyword"
                                />
                                <BillYearSelector v-model="yearNumberArray"/>
                                <div class="bill-filter-actions">
                                    <!-- 短文案，完整含义放 title -->
                                    <ButtonSmall title="获取最新账单类目" @click="getBillKeys">更新类目</ButtonSmall>
                                    <ButtonSmall title="结果隐藏工资收入" v-if="isShowSalaryButton" @click="hideBigIncome">隐藏工资</ButtonSmall>
                                </div>
                                <div class="bill-month-index" v-if="!isLoading && billYearData.length">
                                    <button
                                        type="button"
                                        class="bill-month-index-item"
                                        v-for="month in billYearData"
                                        :key="month.id"
                                        @click="scrollToMonth(month.id)"
                                    >
                                        <span class="name">{{ MonthNameMap.get(month.month) }}</span>
                                        <span class="year" v-if="yearNumberArray.length > 1">{{ month.month_id.substring(0, 4) }}</span>
                                        <span :class="['amount', 'number', month.sum >= 0 ? 'text-income' : 'text-expense']">
                                            {{ month.sum > 0 ? '+' : '' }}{{ month.sum.toFixed(0) }}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <BorrowInfo :width="280" class="mt-2"/>
                    </div>

                    <div class="bill-months-scroll">
                        <BillMonthItem
                            v-if="!isLoading"
                            :id="`bill-month-${month.id}`"
                            :bill-month-data="month"
                            v-for="month in billYearData" :key="month.id"
                        />
                        <Loading v-else :loading="isLoading"/>
                    </div>
                </div>
                <BillExpenseCalendar v-if="view === 'calendar'"/>
                <BillYearTop5 v-else-if="view === 'top5'" embedded :initial-year="yearNumberArray[0]"/>
                <BillImport v-else-if="view === 'import'"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import billApi from "@/api/billApi.ts"
import Loading from "@/components/Loading.vue"
import PageHeader from "@/framework/pageHeader/PageHeader.vue"
import {EntityBillItem, EntityBillMonth, MonthNameMap} from "@/view/Bill/Bill.ts";

import {popMessage, setBillKeys} from "@/utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
const projectStore = useProjectStore();
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import BillYearSelector from "@/view/Bill/BillYearSelector.vue";
import BillMonthItem from "@/view/Bill/BillMonthItem.vue";
import BorrowInfo from "@/view/Bill/BorrowInfo/BorrowInfo.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";
import BillSummary from "@/view/Bill/BillSummary.vue";
import BillExpenseCalendar from "@/view/Bill/BillExpenseCalendar.vue";
import BillYearTop5 from "@/view/Bill/BillYearTop5.vue";
import BillImport from "@/view/Bill/BillImport.vue";
import { useStatisticStore } from "@/pinia/useStatisticStore.ts";
import diaryApi from "@/api/diaryApi.ts";
import { useRoute, useRouter } from "vue-router";

type BillView = 'months' | 'calendar' | 'top5' | 'import'

const billViews: Array<{id: BillView, label: string, headerTitle: string, headerHint: string}> = [
    {id: 'months', label: '月份', headerTitle: '账单', headerHint: '按月流水，筛选关键字和年份'},
    {id: 'calendar', label: '日历', headerTitle: '支出日历', headerHint: '按日看支出，颜色越深花得越多'},
    {id: 'top5', label: 'TOP5', headerTitle: '年度 TOP5', headerHint: '各月最大的五笔支出和收入'},
    {id: 'import', label: '导入', headerTitle: '账单导入', headerHint: '支付宝 CSV 预览后写入日记账单'},
]

const billYearData = ref<Array<EntityBillMonth>>([])
const isLoading = ref(false)
const formSearch = ref({
    year: new Date().getFullYear(),
    keyword: ''
})
const route = useRoute()
const router = useRouter()
const yearNumberArray = ref<Array<number>>([new Date().getFullYear()])
const view = ref<BillView>('months')
const viewIndex = computed(() => {
    const index = billViews.findIndex(item => item.id === view.value)
    return index < 0 ? 0 : index
})
const currentView = computed(() => billViews[viewIndex.value])

function viewFromRoute(): BillView {
    const queryView = route.query.view
    if (queryView === 'calendar' || queryView === 'top5' || queryView === 'import') {
        return queryView
    }
    return 'months'
}

watch(() => route.query.view, () => {
    view.value = viewFromRoute()
}, {immediate: true})

function setView(next: BillView) {
    if (view.value === next) return
    router.replace({
        name: 'Bill',
        query: next === 'months' ? {} : {view: next},
    })
}

let searchTimer: ReturnType<typeof setTimeout> | undefined

function scheduleBillSearch() {
    if (searchTimer) {
        clearTimeout(searchTimer)
    }
    searchTimer = setTimeout(() => {
        getBillData()
    }, 300)
}

watch(
    [yearNumberArray, () => formSearch.value.keyword],
    scheduleBillSearch,
    { deep: true }
)

onMounted(()=>{
    getBillData()
})

onUnmounted(() => {
    if (searchTimer) {
        clearTimeout(searchTimer)
    }
})

// 横向月份列表跳到指定月
function scrollToMonth(id: number){
    const el = document.getElementById(`bill-month-${id}`)
    el?.scrollIntoView({behavior: 'smooth', inline: 'start', block: 'nearest'})
}

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

function goToBillCandidateList(){
    router.push({name: 'BillCandidateList'})
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
@use "../../scss/plugin" as *;
@use "bill" as *;
</style>
