<template>
    <Teleport to="body">
        <div class="bill-day-popup-mask" @click.self="emit('close')">
            <div class="bill-day-popup" role="dialog" aria-modal="true">
                <header class="bill-day-popup-head">
                    <div class="bill-day-popup-date">{{ dateLabel }}</div>
                    <button type="button" class="bill-day-popup-x" aria-label="关闭" @click="emit('close')">×</button>
                </header>

                <div class="bill-day-popup-sum">
                    <div class="sum-item">
                        <span class="sum-label">收入</span>
                        <span class="sum-value number" :class="day.sumIncome ? 'text-income' : 'text-invalid'">
                            {{ day.sumIncome ? `+${day.sumIncome.toFixed(moneyAccuracy)}` : '~' }}
                        </span>
                    </div>
                    <div class="sum-item">
                        <span class="sum-label">支出</span>
                        <span class="sum-value number" :class="day.sumOutput ? 'text-expense' : 'text-invalid'">
                            {{ day.sumOutput ? day.sumOutput.toFixed(moneyAccuracy) : '~' }}
                        </span>
                    </div>
                </div>

                <ul class="bill-day-popup-list">
                    <li
                        v-for="(item, index) in day.items"
                        :key="index"
                        :class="{ highlight: isHighlight(item) }"
                    >
                        <span class="name">{{ item.item }}</span>
                        <span class="price number" :class="item.price > 0 ? 'text-income' : 'text-expense'">
                            {{ item.price > 0 ? '+' : '' }}{{ item.price.toFixed(moneyAccuracy) }}
                        </span>
                    </li>
                    <li v-if="!day.items.length" class="empty">当日无明细</li>
                </ul>

                <footer class="bill-day-popup-actions">
                    <button type="button" class="btn-ghost" @click="emit('close')">关闭</button>
                    <button type="button" class="btn-primary" @click="openDiary">打开日记</button>
                </footer>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import {computed} from "vue"
import {useRouter} from "vue-router"
import {dateProcess} from "@/utility.ts"
import {useProjectStore} from "@/pinia/useProjectStore.ts"
import {EntityBillDay, EntityBillItem} from "@/view/Bill/Bill.ts"

const props = defineProps<{
    day: EntityBillDay
    /** 点进来的那条，弹窗里高亮 */
    focusItem?: EntityBillItem | null
    openMode?: 'detail' | 'edit'
}>()

const emit = defineEmits<{
    close: []
}>()

const router = useRouter()
const moneyAccuracy = useProjectStore().moneyAccuracy

const dateLabel = computed(() => {
    if (!props.day.date) return '账单明细'
    const {date, weekShort} = dateProcess(props.day.date)
    return `${date} ${weekShort}`
})

function isHighlight(item: EntityBillItem) {
    if (!props.focusItem) return false
    return item.item === props.focusItem.item
        && Math.abs(item.price - props.focusItem.price) < 1e-6
}

function openDiary() {
    const name = props.openMode === 'edit' ? 'Edit' : 'Detail'
    emit('close')
    router.push({name, params: {id: props.day.id}})
}
</script>

<style scoped lang="scss">
@use "sass:color" as color;
@use "../../scss/plugin" as *;

.bill-day-popup-mask{
    position: fixed;
    inset: 0;
    z-index: 1200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(20, 20, 20, 0.55);
    backdrop-filter: blur(4px);
}
.bill-day-popup{
    width: min(420px, 100%);
    max-height: min(78vh, 640px);
    display: flex;
    flex-flow: column nowrap;
    overflow: hidden;
    border-radius: $radius-pc;
    background: white;
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
    color: $text-title;
}
.bill-day-popup-head{
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px 12px;
}
.bill-day-popup-date{
    flex: 1;
    min-width: 0;
    font-size: $fz-title;
    font-weight: bold;
    letter-spacing: 0.2px;
}
.bill-day-popup-x{
    flex: 0 0 auto;
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 50%;
    background: $bg-light;
    color: $text-subtitle;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    &:hover{
        background: $color-border-light;
        color: $text-title;
    }
}
.bill-day-popup-sum{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 0 18px 12px;
    padding: 12px;
    border-radius: $radius-mobile;
    background: $bg-lighter;
}
.sum-item{
    display: flex;
    flex-flow: column nowrap;
    gap: 4px;
}
.sum-label{
    font-size: $fz-small;
    color: $text-subtitle;
}
.sum-value{
    font-size: $fz-main;
    font-weight: bold;
    font-family: "JetBrainsMonoDiary", sans-serif;
}
.bill-day-popup-list{
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    margin: 0;
    padding: 4px 10px 8px;
    list-style: none;
    li{
        display: flex;
        align-items: baseline;
        gap: 12px;
        padding: 9px 8px;
        border-radius: $radius-mobile - 2;
        font-size: $fz-main;
        &.highlight{
            background: color.adjust($color-main, $lightness: 28%);
        }
        .name{
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .price{
            flex-shrink: 0;
            font-family: "JetBrainsMonoDiary", sans-serif;
            font-size: $fz-small;
        }
        &.empty{
            justify-content: center;
            color: $text-label;
            font-size: $fz-small;
        }
    }
}
.bill-day-popup-actions{
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 12px 18px 16px;
    border-top: 1px solid $color-border-light;
    button{
        min-width: 88px;
        height: 36px;
        padding: 0 14px;
        border-radius: $radius-mobile;
        font-size: $fz-main;
        cursor: pointer;
    }
    .btn-ghost{
        border: 1px solid $color-border;
        background: white;
        color: $text-subtitle;
        &:hover{
            border-color: $text-label;
            color: $text-title;
        }
    }
    .btn-primary{
        border: 1px solid color.adjust($color-main, $lightness: -8%);
        background: $color-main;
        color: $text-title;
        font-weight: bold;
        &:hover{
            background: color.adjust($color-main, $lightness: -4%);
        }
    }
}

@media (prefers-color-scheme: dark) {
    .bill-day-popup{
        background: $dark-bg-dark;
        color: $dark-text-title;
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.55);
    }
    .bill-day-popup-x{
        background: $dark-bg;
        color: $dark-text;
        &:hover{
            background: $dark-border;
            color: $dark-text-title;
        }
    }
    .bill-day-popup-sum{
        background: $dark-bg;
    }
    .sum-label{
        color: $dark-text;
    }
    .bill-day-popup-list li.highlight{
        background: color.adjust($color-main, $lightness: -18%);
        color: $text-title;
    }
    .bill-day-popup-actions{
        border-top-color: $dark-border;
        .btn-ghost{
            background: $dark-bg;
            border-color: $dark-border;
            color: $dark-text;
            &:hover{
                color: $dark-text-title;
                border-color: $dark-border-active;
            }
        }
    }
}
</style>
