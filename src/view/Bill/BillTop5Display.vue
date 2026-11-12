<template>
    <div class="top5-display">
        <div class="top5-display-title">{{ title }}</div>
        <div v-if="items.length === 0" class="top5-empty">无数据</div>
        <ul v-else class="top5-list">
            <li v-for="(item, index) in items" :key="index" class="top5-item">
                <span
                    class="name link"
                    @click="openPopup(item)"
                >{{ item.item }}</span>
                <span class="price number" :class="priceClass">{{ formatPrice(item.price) }}</span>
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
    padding: 3px 0;
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
