<template>
    <div class="statistic-container">
        <page-header title="账单"/>
        <div class="bill-content" :style="`height:${insets.heightPanel}px`">
            <div class="bill-container" v-if="!isLoading">
                <div class="bill" v-for="month in billYearData" :key="month.id">
                    <div class="bill-header">
                        <div class="title">{{ monthMap.get(month.month) }}</div>
                    </div>
                    <div class="bill-brief">
                        <div class="brief-food">
                            <div class="number text-orange breakfast">
                                {{ month.food.breakfast.toFixed(2) }} <span class="text-gray">早</span>
                            </div>
                            <div class="number text-orange launch">
                                {{ month.food.launch.toFixed(2) }} <span class="text-gray">中</span>
                            </div>
                            <div class="number text-orange dinner">
                                {{ month.food.dinner.toFixed(2) }} <span class="text-gray">晚</span>
                            </div>
                            <div class="number sum">
                                {{ month.food.sum.toFixed(2) }} <span class="text-gray">合</span>
                            </div>
                        </div>
                        <div class="brief-amount">
                            <div class="number text-green">
                                +{{ month.sumIncome.toFixed(0) }} <span class="text-gray">收</span>
                            </div>
                            <div class="number text-orange">
                                {{ month.sumOutput.toFixed(0) }} <span class="text-gray">支</span>
                            </div>
                            <div class="number sum text-black">
                                {{ month.sum.toFixed(0) }} <span class="text-gray">合</span>
                            </div>
                        </div>

                    </div>

                    <table>
                        <tr>
                            <th class="center">日期</th>
                            <th>收入</th>
                            <th>支出</th>
                            <!--                            <th>合计</th>-->
                            <th class="label center">具体</th>
                        </tr>
                        <tr v-for="item in month.days" :key="item.date">
                            <!-- <td class="number">{{// dateFormatter(new Date(item.date), 'MM/dd')}}</td> -->
                            <td class="center number">{{ dateProcess(item.date).dateShort }}
                                <span class="text-gray">{{ dateProcess(item.date).weekShort }}</span></td>
                            <td class="number">
                                <span v-if="item.sumIncome > 0">+{{ item.sumIncome.toFixed(0) || '-' }}</span>
                                <span v-else>{{ -item.sumIncome.toFixed(0) || '-' }}</span>
                            </td>
                            <td class="number">
                                <span v-if="item.sumOutput > 0">+{{ item.sumOutput.toFixed(0) || '-' }}</span>
                                <span v-else>{{ -item.sumOutput.toFixed(0) || '-' }}</span>
                            </td>
                            <!--                            <td class="number">
                                                            <span v-if="item.sum > 0">+{{item.sum.toFixed(0) || 0}}</span>
                                                            <span v-else>{{-item.sum.toFixed(0) || 0}}</span>
                                                        </td>-->
                            <td class="label center" v-tooltip.right="{content: tooltipContent(item.items), html: true}">
                                {{ tooltipContentWithoutReturn(item.items) }}
                            </td>
                        </tr>
                    </table>
                    <!--                    <div :class="[
                                            'mark',
                                            {'blue': month.sum > 0},
                                            {'purple': month.sum < 0},
                                            ]"/>-->
                </div>
            </div>
            <loading v-else :loading="isLoading"/>
        </div>
    </div>
</template>

<script>
import billApi from "@/api/billApi";
import Loading from "@/components/Loading";
import {mapState} from "vuex";
import TabIcon from "@/components/TabIcon";
import utility from "@/utility";
import PageHeader from "@/framework/PageHeader";

export default {
    name: "Bill",
    components: {PageHeader, TabIcon, Loading},
    data() {
        return {
            billYearData: [],
            isLoading: false,
            monthMap: new Map()
        }
    },
    computed: {
        ...mapState(['insets']),
    },
    mounted() {
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
            billApi.sorted({
                year: new Date().getFullYear()
            })
                .then(res => {
                    this.isLoading = false
                    this.billYearData = res.data
                })
                .catch(err => {
                    this.isLoading = false
                })
        },
        dateProcess: utility.dateProcess
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/plugin";

</style>