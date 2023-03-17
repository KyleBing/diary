<template>
    <div class="statistic-container">
        <page-header title="账单"/>
        <div class="bill-content" :style="`height:${insets.heightPanel}px`">
            <div class="bill-container" v-if="!isLoading">

                <div class="bill-filter-panel">
                    <div class="input-group white">
                        <label for="invitation" >关键字</label>
                        <textarea rows="3"
                                  v-model.trim="formSearch.keyword"
                                  type="text"
                                  name="invitation"
                                  id="invitation"/>
                    </div>
                    <div class="input-group white">
                        <label for="invitation" >年份</label>
                        <div class="year-selector">
                            <div :class="['year-selector-item', {checked: year.checked}]" v-for="year in avilableYears">
                                <label :for="year.value">{{year.value}}</label>
                                <input v-model="year.checked"
                                       type="checkbox"
                                       name="year"
                                       :id="year.value"/>
                            </div>
                        </div>
                    </div>

                    <div class="btn btn-active" @click="getBillData">筛选</div>
                </div>

                <div class="bill" v-for="month in billYearData" :key="month.id">
                    <div class="bill-header">
                        <div class="title">{{ monthMap.get(month.month) }}</div>
                        <div class="subtitle">{{month.month_id.substring(0,4)}}</div>
                    </div>
                    <div class="bill-brief">
                        <div class="brief-food">
                            <div class="number text-outcome breakfast">
                                {{ month.food.breakfast.toFixed(moneyAccuracy) }} <span class="text-gray">早</span>
                            </div>
                            <div class="number text-outcome launch">
                                {{ month.food.launch.toFixed(moneyAccuracy) }} <span class="text-gray">中</span>
                            </div>
                            <div class="number text-outcome dinner">
                                {{ month.food.dinner.toFixed(moneyAccuracy) }} <span class="text-gray">晚</span>
                            </div>
                            <div class="number sum">
                                {{ month.food.sum.toFixed(moneyAccuracy) }} <span class="text-gray">合</span>
                            </div>
                        </div>
                        <div class="brief-amount">
                            <div class="number text-income">
                                +{{ month.sumIncome.toFixed(moneyAccuracy) }} <span class="text-gray">收</span>
                            </div>
                            <div class="number text-outcome">
                                {{ month.sumOutput.toFixed(moneyAccuracy) }} <span class="text-gray">支</span>
                            </div>
                            <div class="number sum text-black">
                                {{ month.sum.toFixed(moneyAccuracy) }} <span class="text-gray">合</span>
                            </div>
                        </div>

                    </div>
                    <table>
                        <tr>
                            <th class="center">日期</th>
                            <th>收入</th>
                            <th>支出</th>
                            <th class="label center">具体</th>
                        </tr>
                        <tr v-for="item in month.days" :key="item.date">
                            <td class="center number">{{ dateProcess(item.date).dateShort }}
                                <span class="text-gray">{{ dateProcess(item.date).weekShort }}</span></td>
                            <td class="number">
                                <span v-if="item.sumIncome === 0" class="text-invalid">~</span>
                                <span v-else-if="item.sumIncome > 0" class="text-income">+{{ item.sumIncome.toFixed(moneyAccuracy) || '-' }}</span>
                                <span v-else>{{ item.sumIncome.toFixed(moneyAccuracy) || '-' }}</span>
                            </td>
                            <td class="number">
                                <span v-if="item.sumOutput === 0" class="text-invalid">~</span>
                                <span v-else-if="item.sumOutput > 0" class="text-income">+{{ item.sumOutput.toFixed(moneyAccuracy) || '-' }}</span>
                                <span v-else>{{ item.sumOutput.toFixed(moneyAccuracy) || '-' }}</span>
                            </td>
                            <td class="label center link" @click="goToDiaryDetail(item.id)"
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
            <loading v-else :loading="isLoading"/>
        </div>
    </div>
</template>

<script>
import billApi from "../../api/billApi"
import Loading from "../../components/Loading"
import {mapState} from "vuex"
import TabIcon from "../../components/TabIcon"
import utility from "../../utility"
import PageHeader from "../../framework/pageHeader/PageHeader"

export default {
    name: "Bill",
    components: {PageHeader, TabIcon, Loading},
    data() {
        return {
            billYearData: [],
            isLoading: false,
            monthMap: new Map(),

            formSearch: {
                year: new Date().getFullYear(),
                keyword: ''
            },
            avilableYears: [], // 账单可选年份
        }
    },
    computed: {
        ...mapState(['insets', 'moneyAccuracy']),
    },
    mounted() {
        // 可选的年份，从 2022 开始
        let yearNow = new Date().getFullYear()
        for (let i=0; i<=yearNow - 2022; i++){
            this.avilableYears.push({
                value: 2022 + i,
                checked: true
            })
        }
        this.monthMap = new Map([
            ['01', '一月'],
            ['02', '二月'],
            ['03', '三月'],
            ['04', '四月'],
            ['05', '五月'],
            ['06', '六月'],
            ['07', '七月'],
            ['08', '八月'],
            ['09', '九月'],
            ['10', '十月'],
            ['11', '十一月'],
            ['12', '十二月'],
        ])
        this.getBillData()
    },
    methods: {
        goToDiaryDetail(diaryId){
            console.log(diaryId)
            this.$router.push({
                name: 'Detail',
                params: {
                    id: diaryId
                }
            })
        },
        tooltipContentWithoutReturn(billItemArray) {
            return billItemArray
                .map(item => {
                    return `${item.item}`
                })
                .join('，')
        },
        tooltipContent(billItemArray) {
            let listContent =  billItemArray.map(item => {
                return `<tr class="bill-detail-list-item"><td>${item.item}</td><td class="price">${item.price.toFixed(2)}</td><tr/>`
            }).join('')
            return `
                    <table class="bill-detail-list">
                    <tbody>
                    ${listContent}
                    </tbody>
                    </table>`
        },
        getBillData() {
            this.isLoading = true
            billApi
                .sorted({
                    years: this.avilableYears
                        .filter(item => item.checked)
                        .map(item => item.value)
                        .join(','), // 2022, 2023
                    keyword: this.formSearch.keyword
                })
                .then(res => {
                    this.isLoading = false
                    this.billYearData = res.data
                })
                .catch(err => {
                    utility.popMessage('warning', err.message)
                    this.isLoading = false
                })
        },
        dateProcess: utility.dateProcess
    }
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
        @include border-radius($radius-mobile)
    }

    .v-popper__arrow-inner {
        border-color: $bg-main;
    }
}

@import "bill";

</style>
