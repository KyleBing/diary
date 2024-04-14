<template>
    <div class="brief-food-horizontal">
           <div class="food-item number breakfast">
               <div class="bill-sum-label">早饭</div>
               <div class="price">{{ props.billFood.breakfast.toFixed(storeProject.moneyAccuracy) }}</div>
           </div>
           <div class="food-item number launch">
               <div class="bill-sum-label">中饭</div>
               <div class="price">{{ props.billFood.launch.toFixed(storeProject.moneyAccuracy) }}</div>
           </div>
           <div class="food-item number dinner">
               <div class="bill-sum-label">晚饭</div>
               <div class="price">{{ props.billFood.dinner.toFixed(storeProject.moneyAccuracy) }}</div>
           </div>
            <div class="food-item number supermarket">
                <div class="bill-sum-label">超市</div>
                <div class="price">{{ props.billFood.supermarket.toFixed(storeProject.moneyAccuracy) }}</div>
            </div>
            <div class="food-item number fruit">
                <div class="bill-sum-label">水果</div>
                <div class="price">{{ props.billFood.fruit.toFixed(storeProject.moneyAccuracy) }}</div>
            </div>
            <div class="food-item number sum">
                <div class="bill-sum-label">合计</div>
                <div class="price">{{ props.billFood.sum.toFixed(storeProject.moneyAccuracy) }}</div>
            </div>
    </div>
</template>


<script setup lang="ts">

import {useProjectStore} from "@/pinia";
import {EntityBillFood} from "@/page/bill/Bill.ts";
const storeProject = useProjectStore();

interface Props {
    billFood: EntityBillFood
}
const props = defineProps<Props>()

</script>

<style scoped lang="scss">
@import "../../../scss/plugin";

.brief-food-horizontal{
    padding: 5px 20px;
    font-size: $fz-tiny;
    background-color: $bg-bill-brief;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: stretch;
    text-align: right;
    .food-item {
        display: flex;
        justify-content: space-between;
        flex-flow: row nowrap;
        margin-right: 3px;
        text-align: right;
        color: $text-content;
        .bill-sum-label{
            white-space: nowrap;
        }
        .price{
        }
    }
}


@media (prefers-color-scheme: dark) {
    .brief-food-horizontal{
        background-color: $dark-bg-bill-brief;
        border-bottom: 1px solid $dark-border;
        border-top: 1px solid $dark-border;
        .food-item {
            color: $dark-text;
            .bill-sum-label{
            }
            .price{
            }
        }
    }
}
</style>
