<template>
    <div class="statistic-container">
        <PageHeader title="账单条目管理"/>
        <div class="bill-content" :style="`height:${projectStore.insets.heightPanel}px`">
            <div class="bill-container">
                <BillPanel :width="0" title="账单条目管理" padding="15px">
                    <!-- 搜索过滤框 -->
                    <div class="input-group white">
                        <label for="filter-input">搜索过滤</label>
                        <input
                            id="filter-input"
                            type="text"
                            v-model.trim="filterKeyword"
                            placeholder="输入关键字过滤账单条目..."
                        />
                    </div>

                    <!-- 操作按钮 -->
                    <div class="action-buttons">
                        <ButtonSmall @click="loadBillKeys">从服务器获取最新</ButtonSmall>
                        <ButtonSmall @click="saveOrder">保存排序</ButtonSmall>
                    </div>

                    <!-- 账单条目列表 -->
                        <draggable
                            class="bill-keys-list"
                            v-model="billKeys"
                            item-key="key"
                            @end="onDragEnd"
                            handle=".drag-handle"
                        >
                            <template #item="{ element: item }">
                                <div class="bill-key-item" v-if="isItemVisible(item)">
                                    <div class="drag-handle">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <circle cx="6" cy="4" r="1.5"/>
                                            <circle cx="10" cy="4" r="1.5"/>
                                            <circle cx="6" cy="8" r="1.5"/>
                                            <circle cx="10" cy="8" r="1.5"/>
                                            <circle cx="6" cy="12" r="1.5"/>
                                            <circle cx="10" cy="12" r="1.5"/>
                                        </svg>
                                    </div>
                                    <div class="bill-key-content">
                                        <div class="bill-key-name">{{ item.key }}</div>
                                        <div class="bill-key-count">使用次数: {{ item.count }}</div>
                                    </div>
                                </div>
                            </template>
                        </draggable>

                        <div v-if="filteredBillKeys.length === 0 && filterKeyword" class="empty-state">
                            没有找到匹配的条目
                        </div>
                        <div v-if="billKeys.length === 0 && !filterKeyword" class="empty-state">
                            暂无账单条目，请先从服务器获取
                        </div>
                </BillPanel>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import billApi from "@/api/billApi.ts"
import PageHeader from "@/framework/pageHeader/PageHeader.vue"
import {BillKey} from "@/view/Bill/Bill.ts";
import {popMessage, setBillKeys, getBillKeys} from "@/utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {onMounted, ref, computed} from "vue";
import BillPanel from "@/view/Bill/BillPanel.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";
import draggable from 'vuedraggable';

const projectStore = useProjectStore();

const billKeys = ref<Array<BillKey>>([])
const filterKeyword = ref('')

// 过滤后的账单条目
const filteredBillKeys = computed(() => {
    if (!filterKeyword.value) {
        return billKeys.value
    }
    const keyword = filterKeyword.value.toLowerCase()
    return billKeys.value.filter(item =>
        item.key.toLowerCase().includes(keyword)
    )
})

// 判断条目是否可见（用于在拖拽时隐藏已过滤的项）
function isItemVisible(item: BillKey): boolean {
    if (!filterKeyword.value) {
        return true
    }
    const keyword = filterKeyword.value.toLowerCase()
    return item.key.toLowerCase().includes(keyword)
}

onMounted(() => {
    loadBillKeysFromLocal()
})

// 从 localStorage 加载账单条目
function loadBillKeysFromLocal() {
    const keys = getBillKeys()
    if (keys && keys.length > 0) {
        // 确保每个条目都有 sort 属性，如果没有则使用索引
        billKeys.value = keys.map((item, index) => ({
            ...item,
            sort: item.sort !== undefined ? item.sort : index
        })).sort((a, b) => (a.sort || 0) - (b.sort || 0))
    }
}

// 从服务器获取最新账单条目
function loadBillKeys() {
    billApi
        .keys()
        .then(res => {
            if (res.data && res.data.length > 0) {
                // 合并现有数据，保留排序信息
                const existingKeys = new Map(billKeys.value.map(item => [item.key, item]))
                const newKeys = res.data.map((item: BillKey, index: number) => {
                    const existing = existingKeys.get(item.key)
                    return {
                        ...item,
                        sort: existing?.sort !== undefined ? existing.sort : index
                    }
                })

                billKeys.value = newKeys.sort((a: BillKey, b: BillKey) => (a.sort || 0) - (b.sort || 0))
                setBillKeys(billKeys.value)
                popMessage('success', `更新成功 ${billKeys.value.length} 个`, ()=>{}, 2)
            } else {
                popMessage('warning', '服务器返回数据为空')
            }
        })
        .catch(err => {
            popMessage('warning', err.message)
        })
}

// 拖拽结束后的处理
function onDragEnd() {
    // 更新 sort 属性
    billKeys.value.forEach((item, index) => {
        item.sort = index
    })
}

// 保存排序
function saveOrder() {
    // 更新 sort 属性
    billKeys.value.forEach((item, index) => {
        item.sort = index
    })
    setBillKeys(billKeys.value)
    popMessage('success', '排序已保存', ()=>{}, 1.5)
}

</script>

<style lang="scss">
@import "../../scss/plugin";

.bill-container {
    display: flex;
    width: 100%;
    height: 100%;

    .bill-panel {
        width: 100% !important;
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-right: 0;

        .bill-panel-content {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
        }
    }
}

.action-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;

    ButtonSmall {
        flex: 1;
    }
}

.bill-keys-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 12px;
    margin-top: 10px;
    flex: 1;
    min-height: 0;
}

.bill-key-item {
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    background-color: $bg-light;
    border: 1px solid $color-border;
    border-radius: $radius-pc;
    cursor: move;
    transition: all 0.2s;
    min-height: 70px;
    position: relative;

    &:hover {
        background-color: lighten($bg-light, 2%);
        border-color: $color-border-highlight;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .drag-handle {
        position: absolute;
        top: 5px;
        right: 5px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
        height: 20px;
        margin-bottom: 8px;
        color: $text-label;
        cursor: grab;
        opacity: 0.5;
        transition: opacity 0.2s;

        &:hover {
            opacity: 1;
        }

        &:active {
            cursor: grabbing;
        }
    }

    .bill-key-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
    }

    .bill-key-name {
        font-size: $fz-label;
        font-weight: bold;
        color: $text-content;
        word-break: break-word;
    }

    .bill-key-count {
        font-size: $fz-small;
        color: $text-label;
    }
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: $text-label;
    font-size: $fz-note;
}

// 拖拽时的样式
.sortable-ghost {
    opacity: 0.4;
    background-color: $color-main;
}

.sortable-drag {
    opacity: 0.8;
}

// 平板适配
@media (min-width: $grid-separate-width-md) and (max-width: $grid-separate-width-big) {
    .bill-keys-list {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
}

// 移动端适配
@media (max-width: $grid-separate-width-md) {
    .bill-container {
        padding: 10px;
    }

    .bill-keys-list {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 10px;
    }

    .bill-key-item {
        padding: 12px;
        min-height: 70px;
    }
}

// 深色模式
@media (prefers-color-scheme: dark) {
    .bill-key-item {
        background-color: $dark-bg-dark;
        border-color: $dark-border;

        &:hover {
            background-color: lighten($dark-bg-dark, 3%);
            border-color: $dark-border-active;
        }

        .drag-handle {
            color: $dark-text;
        }

        .bill-key-name {
            color: $dark-text;
        }

        .bill-key-count {
            color: $dark-text;
        }
    }

    .empty-state {
        color: $dark-text;
    }
}

@import "bill";
</style>
