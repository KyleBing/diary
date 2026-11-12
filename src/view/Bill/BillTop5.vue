<template>
    <div class="summary">
        <div class="title">{{title}}</div>
        <div class="bill-list">
            <div :class="['bill-list-item', {filtered: item.isFiltered}]"
                 v-for="(item, index) in modelTop5" :key="index" @click="changeCurrentState(item)">
                <div
                    class="name link"
                    @click.stop="openPopup(item)"
                >{{item.item}}</div>
                <div class="price">{{item.price.toFixed(projectStore.moneyAccuracy)}}</div>
            </div>
        </div>
        <BillDayPopup
            v-if="popupDay"
            :day="popupDay"
            :focus-item="popupFocus"
            open-mode="edit"
            @close="closePopup"
        />
    </div>
</template>


<script setup lang="ts">
import {ref} from "vue";
import {EntityBillDay, EntityBillMonth, EntityBillTop5Item} from "@/view/Bill/Bill.ts";
import {findDiaryDayForTop5Item} from "@/view/Bill/billNavigation.ts";
import {popMessage} from "@/utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import BillDayPopup from "@/view/Bill/BillDayPopup.vue";

const projectStore = useProjectStore();

const modelTop5 = defineModel<Array<EntityBillTop5Item>>()

const props = defineProps<{
    title: string
    monthData?: EntityBillMonth
}>()

const popupDay = ref<EntityBillDay | null>(null)
const popupFocus = ref<EntityBillTop5Item | null>(null)

function changeCurrentState(billItem: EntityBillTop5Item){
    billItem.isFiltered = !billItem.isFiltered
}

function openPopup(item: EntityBillTop5Item) {
    if (!props.monthData) {
        popMessage('warning', '未找到对应账单日记')
        return
    }
    const day = findDiaryDayForTop5Item(props.monthData, item)
    if (!day) {
        popMessage('warning', '未找到对应账单日记')
        return
    }
    popupFocus.value = item
    popupDay.value = day
}

function closePopup() {
    popupDay.value = null
    popupFocus.value = null
}

</script>



<style scoped lang="scss">
@use "../../scss/plugin" as *;
.summary{
    padding: 10px 15px;
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
        margin-bottom: 3px;
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
        }
    }
}

</style>
