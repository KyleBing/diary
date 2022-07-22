<template>
    <div class="statistic-container">
        <div class="statistic-header">
            <div class="statistic-back-btn" @click="$router.back()">
                <tab-icon alt="关闭"/>
            </div>
            <div class="statistic-title">账单</div>
        </div>
        <div class="bill-content" :style="`height:${insets.heightPanel}px`">
            <div class="bill-card-container" v-if="!isLoading">
                <div class="bill-card" v-for="month in billYearData" :key="month.id">
                    <div class="bill-card-header">
                        <div class="title">{{ monthMap.get(month.month) }}</div>
                        <div class="bill-brief">
                            <div class="number bold income">+{{ month.sumIncome.toFixed(0) }}</div>
                            <div class="number bold output">{{ month.sumOutput.toFixed(0) }}</div>
                            <div class="number bold sum">{{ month.sum.toFixed(0) }}</div>
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
<!--                            <td class="number">{{// dateFormatter(new Date(item.date), 'MM/dd')}}</td>-->
                            <td class="number">{{dateProcess(item.date).dateShort}} {{dateProcess(item.date).weekShort}}</td>
                            <td class="number">
                                <span v-if="item.sumIncome > 0">+{{item.sumIncome.toFixed(0) || '-'}}</span>
                                <span v-else>{{-item.sumIncome.toFixed(0) || '-'}}</span>
                            </td>
                            <td class="number">
                                <span v-if="item.sumOutput > 0">+{{item.sumOutput.toFixed(0) || '-'}}</span>
                                <span v-else>{{-item.sumOutput.toFixed(0) || '-'}}</span>
                            </td>
<!--                            <td class="number">
                                <span v-if="item.sum > 0">+{{item.sum.toFixed(0) || 0}}</span>
                                <span v-else>{{-item.sum.toFixed(0) || 0}}</span>
                            </td>-->
                            <td class="label" v-tooltip.right="tooltipContentWithoutReturn(item.items)">
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

export default {
    name: "Bill",
    components: {TabIcon, Loading},
    data(){
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
        tooltipContentWithoutReturn(billItemArray){
            return billItemArray.map(item => {
                return  `${item.item}`
            }).join(',')
        },
        tooltipContent(billItemArray){
            return billItemArray.map(item => {
                return  `${item.item}`
            }).join('\n')
        },
        getBillData(){
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
@import "../assets/scss/plugin";

</style>
