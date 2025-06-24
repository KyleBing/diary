<template>
    <div class="brief-food">
           <div class="food-item number breakfast">
               <div class="bill-sum-label">早饭</div>
               <div class="price">{{ billFood.breakfast.toFixed(projectStore.moneyAccuracy) }}</div>
           </div>
           <div class="food-item number launch">
               <div class="bill-sum-label">中饭</div>
               <div class="price">{{ billFood.launch.toFixed(projectStore.moneyAccuracy) }}</div>
           </div>
           <div class="food-item number dinner">
               <div class="bill-sum-label">晚饭</div>
               <div class="price">{{ billFood.dinner.toFixed(projectStore.moneyAccuracy) }}</div>
           </div>
            <div class="food-item number supermarket">
                <div class="bill-sum-label">超市</div>
                <div class="price">{{ billFood.supermarket.toFixed(projectStore.moneyAccuracy) }}</div>
            </div>
            <div class="food-item number fruit">
                <div class="bill-sum-label">水果</div>
                <div class="price">{{ billFood.fruit.toFixed(projectStore.moneyAccuracy) }}</div>
            </div>
            <div class="food-item number sum">
                <div class="bill-sum-label">合计</div>
                <div class="price">{{ billFood.sum.toFixed(projectStore.moneyAccuracy) }}</div>
            </div>
    </div>
</template>


<script setup lang="ts">

import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {EntityBillFood} from "@/view/Bill/Bill.ts";
const projectStore = useProjectStore();

defineProps<{
    billFood: EntityBillFood
}>()

</script>

<style scoped lang="scss">
@import "../../scss/plugin";

.brief-food{
    border-top: 1px solid $color-border;
    border-bottom: 1px solid $color-border;
    padding: 5px 20px;
    font-size: $fz-tiny;
    background-color: $bg-bill-brief;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    text-align: right;
    .food-item {
        margin-right: 3px;
        text-align: right;
        color: $text-content;
        .bill-sum-label{
        }
        .price{
        }
    }
}


@media (prefers-color-scheme: dark) {
    .brief-food{
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
