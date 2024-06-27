<template>
    <div class="summary">
        <div class="title">{{props.title}}</div>
        <div class="bill-list">
            <div :class="['bill-item', {filtered: item.isFiltered}]"
                 v-for="(item, index) in modelTop5" :key="index" @click="changeCurrentState(item)">
                <div class="name">{{item.item}}</div>
                <div class="price">{{item.price.toFixed(storeProject.moneyAccuracy)}}</div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import {EntityBillTop5Item} from "@/view/Bill/Bill.ts";
import {useProjectStore} from "@/pinia";

const storeProject = useProjectStore();

const modelTop5 = defineModel<Array<EntityBillTop5Item>>()

interface Props {
    title: string
}
const props = defineProps<Props>()

function changeCurrentState(billItem: EntityBillTop5Item){
    billItem.isFiltered = !billItem.isFiltered
}

</script>



<style scoped lang="scss">
@import "../../scss/plugin";
.summary{
    padding: 20px 25px;
    color: $text-content;
}
.title{
    font-size: $fz-small;
    margin-bottom: 5px;
    font-weight: bold;
}
.bill-list{
    .bill-item{
        cursor: pointer;
        @extend .btn-like;
        margin-bottom: 2px;
        font-size: $fz-small;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        &.filtered{
            text-decoration: line-through;
        }
        &:after{
            position: absolute;
            content: '';
            height: 1px;
            width: 100%;
            border-bottom: 1px dashed $color-border;
        }
        > * {
            z-index: 10;
            background-color: white;
        }
        .name{
            padding-right: 15px;
        }
        .price{
            font-family: "JetBrainsMonoDiary";
            padding-left: 15px;
        }
    }
}

@media (prefers-color-scheme: dark) {
    .summary{
        color: $dark-text;
    }
    .title{
        color: $dark-text;
    }
    .bill-list{
        .bill-item{
            &:after{
                border-bottom: 1px dashed $dark-border;
            }
            > * {
                background-color: $dark-bg-dark;
            }
            .name{}
            .price{}
        }
    }
}

</style>
