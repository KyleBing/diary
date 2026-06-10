<template>
    <div class="top5-display">
        <div class="top5-display-title">{{ title }}</div>
        <div v-if="items.length === 0" class="top5-empty">无数据</div>
        <ul v-else class="top5-list">
            <li v-for="(item, index) in items" :key="index" class="top5-item">
                <span
                    class="name link"
                    v-tooltip="top5ItemTooltip(item, monthData)"
                    @click="openEdit(item)"
                >{{ item.item }}</span>
                <span class="price number" :class="priceClass">{{ formatPrice(item.price) }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {EntityBillMonth, EntityBillTop5Item} from "@/view/Bill/Bill.ts";
import {openBillItemEdit, top5ItemTooltip} from "@/view/Bill/billNavigation.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {useRouter} from "vue-router";

const props = defineProps<{
    title: string
    items: Array<EntityBillTop5Item>
    type: 'income' | 'outcome'
    monthData?: EntityBillMonth
}>()

const projectStore = useProjectStore()
const router = useRouter()

const priceClass = computed(() => props.type === 'income' ? 'text-income' : 'text-expense')

function formatPrice(price: number): string {
    const value = price.toFixed(projectStore.moneyAccuracy)
    if (props.type === 'income' && price > 0) {
        return `+${value}`
    }
    return value
}

function openEdit(item: EntityBillTop5Item) {
    openBillItemEdit(router, item, props.monthData)
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
    gap: 8px;
    font-size: $fz-small;
    padding: 3px 0;
    border-bottom: 1px dashed $color-border-light;
    &:last-child{
        border-bottom: none;
    }
    .name{
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
        border-bottom-color: $dark-border;
        .name{
            color: $dark-text-title;
        }
    }
}
</style>
