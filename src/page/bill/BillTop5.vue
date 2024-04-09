<template>
    <div class="summary">
        <div class="title">{{props.title}}</div>
        <div class="bill-list">
            <div class="bill-item" v-for="(item, index) in props.billTop5" :key="index">
                <div class="name">{{item.item}}</div>
                <div class="price">{{item.price.toFixed(storeProject.moneyAccuracy)}}</div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import {EntityBillItem} from "@/page/bill/Bill.ts";
import {useProjectStore} from "@/pinia";

const storeProject = useProjectStore();

interface Props {
    billTop5: Array<EntityBillItem>,
    title: string
}
const props = defineProps<Props>()

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
        margin-bottom: 2px;
        font-size: $fz-small;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
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
