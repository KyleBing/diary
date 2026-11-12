<template>
    <div class="top5-display">
        <div class="top5-display-title">{{ title }}</div>
        <ul class="top5-list">
            <li v-for="index in 5" :key="index" class="top5-item" :class="{placeholder: !items[index - 1]}">
                <template v-if="items[index - 1]">
                    <span
                        class="name link"
                        @click="openPopup(items[index - 1])"
                    >{{ items[index - 1].item }}</span>
                    <span class="price number" :class="priceClass">{{ formatPrice(items[index - 1].price) }}</span>
                </template>
                <span v-else-if="items.length === 0 && index === 1" class="top5-empty">无数据</span>
            </li>
        </ul>
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
import {computed, ref} from "vue";
import {EntityBillDay, EntityBillMonth, EntityBillTop5Item} from "@/view/Bill/Bill.ts";
import {findDiaryDayForTop5Item} from "@/view/Bill/billNavigation.ts";
import {popMessage} from "@/utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import BillDayPopup from "@/view/Bill/BillDayPopup.vue";

const props = defineProps<{
    title: string
    items: Array<EntityBillTop5Item>
    type: 'income' | 'outcome'
    monthData?: EntityBillMonth
}>()

const projectStore = useProjectStore()
const popupDay = ref<EntityBillDay | null>(null)
const popupFocus = ref<EntityBillTop5Item | null>(null)

const priceClass = computed(() => props.type === 'income' ? 'text-income' : 'text-expense')

function formatPrice(price: number): string {
    const value = price.toFixed(projectStore.moneyAccuracy)
    if (props.type === 'income' && price > 0) {
        return `+${value}`
    }
    return value
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

.top5-display{
    flex: 1;
    min-height: 0;
    &:not(:last-child){
        margin-bottom: 12px;
    }
}
.top5-display-title{
    font-size: $fz-small;
    font-weight: bold;
    margin-bottom: 6px;
    color: $text-content;
}
.top5-empty{
    font-size: $fz-small;
    color: $text-label;
    min-height: 1.4em;
}
.top5-list{
    list-style: none;
    margin: 0;
    padding: 0;
}
.top5-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    font-size: $fz-small;
    min-height: 1.6em;
    padding: 3px 0;
    &.placeholder:after{
        display: none;
    }
    &:after{
        position: absolute;
        content: '';
        left: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px dashed $color-border;
    }
    > * {
        position: relative;
        z-index: 1;
        background-color: white;
    }
    .name{
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 12px;
        color: $text-title;
        &.link{
            cursor: pointer;
            &:hover{
                color: $color-main;
                text-decoration: underline;
            }
        }
    }
    .price{
        flex-shrink: 0;
        padding-left: 12px;
        font-family: "JetBrainsMonoDiary", sans-serif;
    }
}

@media (prefers-color-scheme: dark) {
    .top5-display-title{
        color: $dark-text;
    }
    .top5-empty{
        color: $dark-text-subtitle;
    }
    .top5-item{
        &:after{
            border-bottom-color: $dark-border;
        }
        > * {
            background-color: $dark-bg-dark;
        }
        .name{
            color: $dark-text-title;
        }
    }
}
</style>
