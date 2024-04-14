<template>
    <div class="statistic-container">
        <PageHeader title="账单"/>
        <div class="bill-content" :style="`height:${storeProject.insets.heightPanel}px`">
            <div class="bill-container" >

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
                        <BillYearSelector v-model="yearNumberArray"/>
                    </div>

                    <div class="btn btn-active mb-2" @click="getBillData">筛选</div>
                    <div class="btn btn-active" @click="getBillKeys">获取最新账单类目</div>
                </div>
            </div>
            <div>
                <BillItemHorizontal
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
import {EntityBillMonth} from "@/page/bill/Bill.ts";

import {popMessage, setBillKeys} from "@/utility.ts";
import {useProjectStore} from "@/pinia";
const storeProject = useProjectStore();
import {onMounted, Ref, ref} from "vue";
import {useRouter} from "vue-router";
import BillYearSelector from "@/page/bill/BillYearSelector.vue";
import BillItem from "@/page/bill/BillItem.vue";
import BillItemHorizontal from "@/page/bill/horizontal/BillItemHorizontal.vue";
const router = useRouter()

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
