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
                            <div class="number income">+{{ month.sumIncome.toFixed(0) }}</div>
                            <div class="number output">{{ month.sumOutput.toFixed(0) }}</div>
                            <div class="number sum">{{ month.sum.toFixed(0) }}</div>
                        </div>
                    </div>
                    <table>
                        <tr>
                            <th>日期</th>
                            <th>收入</th>
                            <th>支出</th>
<!--                            <th>合计</th>-->
                            <th class="label">具体</th>
                        </tr>
                        <tr v-for="item in month.days" :key="item.date">
<!--                            <td class="number">{{// $utility.dateFormatter(new Date(item.date), 'MM/dd')}}</td>-->
                            <td class="number">{{$utility.dateProcess(item.date).dateShort}} {{$utility.dateProcess(item.date).weekday}}</td>
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
                            <td class="label">
                                {{ item.items.map(item => item.item).join('、') }}
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
    computed: {...mapState(['insets'])},
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
        }
    }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/plugin";

.bill-content{
    overflow: auto;
    padding: 30px;
    background-color: $bg-light;
}

.bill-card-container{
    display: flex;
    justify-content: flex-start;
    flex-flow: row nowrap;
    align-items: flex-start;
}
.bill-card{
    overflow: hidden;
    background-color: white;
    margin-right: 20px;
    padding-bottom: 15px;
    @include border-radius($radius-pc);
    border: 1px solid $color-border;
    .bill-card-header{
        display: flex;
        justify-content: space-between;
        flex-flow: row nowrap;
        padding: 20px 20px;
        .title{
            line-height: 1.3;
            letter-spacing: 1px;
            font-size: $fz-huge;
            font-weight: bold;
        }
        .bill-brief{
            font-size: $fz-big;
            letter-spacing: 1px;
            align-items: flex-end;
            flex-flow: column nowrap;
            display: flex;
            justify-content: space-between;
        }
    }

    table{
        font-size: $fz-note;
        tr{
            th{
                border-bottom: 2px solid $color-border;
                text-align: right;
                font-weight: bold;
                padding: 10px 15px 10px;
            }
            td{
                min-width: 90px;
                border-bottom: 1px solid $color-border-light;
                text-align: right;
                padding: 3px 15px;
            }
            th.label{
                text-align: center;
            }
            td.label{
                color: $text-label;
                white-space: nowrap;
                max-width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: $fz-note;
                text-align: left
            }
            &:last-child{
                td,th{
                    border-bottom: 0;
                }
            }
            &:hover{
                td{
                    background-color: $bg-light;
                    border-bottom-color: $bg-light;
                }
            }
        }
    }
    @include transition(all 0.5s);

    &:hover{
        @include transition(all 0.5s);
        //@include box-shadow(2px 2px 5px transparentize(black, 0.8))
    }
}

.mark{
    margin-top: 10px;
    height: 5px;
    width: 100%;
    &.purple{background: $gradient-purple;}
    &.red{background: $gradient-red;}
    &.green{background: $gradient-green;}
    &.blue{background: $gradient-blue;}
}
.bold{
    font-weight: bold;
}
.number{
    font-family: 'Droid Sans Mono';
}
.income{
    color: $blue;
}
.output{
    color: $red;
}
.sum{
    color: $text-title;
}

@media (max-width: $grid-separate-width-sm) {
    .bill-content{
        padding: 10px;
    }
    .bill-card-container{
        flex-flow: column nowrap;
    }
    .bill-card{
        margin-bottom: 20px;
        width: 100%;
        table {
            width: 100%;
            tr{
                td{
                    width: auto;
                }
                td.label{
                    display: none;
                }
                th.label{
                    display: none;
                }
            }
        }
    }
}

</style>
