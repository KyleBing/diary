<template>
    <div class="summary">
        <div class="title">{{title}}</div>
        <div class="bill-list">
            <div :class="['bill-list-item', {filtered: item.isFiltered}]"
                 v-for="(item, index) in modelTop5" :key="index" @click="changeCurrentState(item)">
                <div
                    class="name link"
                    v-tooltip="top5ItemTooltip(item, monthData)"
                    @click.stop="openEdit(item)"
                >{{item.item}}</div>
                <div class="price">{{item.price.toFixed(projectStore.moneyAccuracy)}}</div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import {EntityBillMonth, EntityBillTop5Item} from "@/view/Bill/Bill.ts";
import {openBillItemEdit, top5ItemTooltip} from "@/view/Bill/billNavigation.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {useRouter} from "vue-router";

const projectStore = useProjectStore();
const router = useRouter()

const modelTop5 = defineModel<Array<EntityBillTop5Item>>()

const props = defineProps<{
    title: string
    monthData?: EntityBillMonth
}>()

function changeCurrentState(billItem: EntityBillTop5Item){
    billItem.isFiltered = !billItem.isFiltered
}

function openEdit(item: EntityBillTop5Item) {
    openBillItemEdit(router, item, props.monthData)
}

</script>



<style scoped lang="scss">
@use "../../scss/plugin" as *;
.summary{
    padding: 15px 25px;
    color: $text-content;
}
.title{
    font-size: $fz-small;
    margin-bottom: 5px;
    font-weight: bold;
}
.bill-list{
    .bill-list-item{
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
            &.link{
                cursor: pointer;
                &:hover{
                    color: $color-main;
                    text-decoration: underline;
                }
            }
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
        .bill-list-item{
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
