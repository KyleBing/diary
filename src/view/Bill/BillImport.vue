<template>
    <div class="bill-imp">
        <div class="bill-imp-bar">
            <div class="bill-imp-tabs">
                <button type="button" :class="{checked: activeTab === 'preview'}" @click="activeTab = 'preview'">上传与预览</button>
                <button type="button" :class="{checked: activeTab === 'aliases'}" @click="activeTab = 'aliases'">别名管理</button>
                <button type="button" :class="{checked: activeTab === 'batches'}" @click="activeTab = 'batches'">导入记录</button>
            </div>
            <div class="bill-imp-actions">
                <template v-if="activeTab === 'preview'">
                    <input ref="fileInput" class="bill-imp-file" type="file" accept=".csv,text/csv" @change="onFileChange">
                    <ButtonSmall @click="pickFile">{{ currentFile ? currentFile.name : '选择 CSV' }}</ButtonSmall>
                    <ButtonSmall @click="uploadFile">{{ uploading ? '上传中…' : '上传并预览' }}</ButtonSmall>
                    <ButtonSmall v-if="batchId" @click="refreshPreview">{{ previewing ? '刷新中…' : '刷新预览' }}</ButtonSmall>
                    <ButtonSmall v-if="batchId" @click="seedFromUnmapped">{{ seeding ? '生成中…' : '从未识别生成草稿' }}</ButtonSmall>
                    <ButtonSmall v-if="batchId" @click="doApply">{{ applying ? '写入中…' : '写入日记账单' }}</ButtonSmall>
                </template>
                <template v-else-if="activeTab === 'aliases'">
                    <ButtonSmall @click="addRule">新增规则</ButtonSmall>
                    <ButtonSmall @click="loadAliases">重新加载</ButtonSmall>
                    <ButtonSmall @click="saveAliases">{{ aliasSaving ? '保存中…' : '保存别名' }}</ButtonSmall>
                </template>
                <template v-else>
                    <ButtonSmall @click="loadBatches">{{ batchLoading ? '刷新中…' : '刷新' }}</ButtonSmall>
                </template>
            </div>
        </div>

        <div v-if="activeTab === 'preview'" class="bill-imp-body">
            <div v-if="batchId" class="bill-imp-meta">
                批次 #{{ batchId }}
                <span v-if="batchMeta?.filename"> · {{ batchMeta.filename }}</span>
                <span v-if="counts"> · 共 {{ counts.row }} 笔（可写 {{ counts.ready }} / 已导入 {{ counts.imported || 0 }} / 待确认名 {{ counts.guess }} / 大额 {{ counts.confirm }} / 未识别 {{ counts.unmapped }} / 跳过 {{ counts.skip }}）</span>
            </div>
            <div v-if="batchId" class="bill-imp-checks">
                <label><input v-model="hideZeroAmount" type="checkbox"> 隐藏金额为 0</label>
                <label><input v-model="includeGuess" type="checkbox"> 含名称待确认</label>
                <label><input v-model="includeConfirm" type="checkbox"> 含大额待确认</label>
                <label><input v-model="includeZero" type="checkbox"> 写入含金额 0</label>
            </div>
            <div v-if="preview" class="bill-imp-previews">
                <section>
                    <h4>可写入</h4>
                    <pre>{{ filteredReadyDays }}</pre>
                </section>
                <section>
                    <h4>已导入</h4>
                    <pre class="imported">{{ filteredImportedDays }}</pre>
                </section>
                <section>
                    <h4>名称待确认</h4>
                    <pre>{{ filteredGuessDays }}</pre>
                </section>
                <section>
                    <h4>大额待确认</h4>
                    <pre>{{ filteredConfirmDays }}</pre>
                </section>
            </div>
            <div v-if="preview" class="bill-imp-tables">
                <section>
                    <h4>未识别</h4>
                    <div class="bill-imp-scroll">
                        <table>
                            <tr>
                                <th>日期</th><th>金额</th><th>对方</th><th>商品</th>
                            </tr>
                            <tr v-if="filteredUnmapped.length === 0"><td colspan="4">（无）</td></tr>
                            <tr v-for="(row, index) in filteredUnmapped" :key="'u' + index">
                                <td>{{ String(row.date).slice(0, 10) }}</td>
                                <td class="num">{{ formatAmt(row.amount) }}</td>
                                <td>{{ row.who }}</td>
                                <td>{{ row.product }}</td>
                            </tr>
                        </table>
                    </div>
                </section>
                <section>
                    <h4>已跳过</h4>
                    <div class="bill-imp-scroll">
                        <table>
                            <tr>
                                <th>日期</th><th>原因</th><th>金额</th><th>对方</th><th>商品</th>
                            </tr>
                            <tr v-if="filteredSkip.length === 0"><td colspan="5">（无）</td></tr>
                            <tr v-for="(row, index) in filteredSkip" :key="'s' + index">
                                <td>{{ String(row.date).slice(0, 10) }}</td>
                                <td>{{ row.reason }}</td>
                                <td class="num">{{ formatAmt(row.amount) }}</td>
                                <td>{{ row.who }}</td>
                                <td>{{ row.product }}</td>
                            </tr>
                        </table>
                    </div>
                </section>
            </div>
            <div v-if="!batchId" class="bill-imp-empty">选择支付宝交易明细 CSV，再点上传并预览。</div>
        </div>

        <div v-else-if="activeTab === 'aliases'" class="bill-imp-body">
            <div class="bill-imp-alias-hint">别名只属于当前账号，按你自己的短名称维护，不会共享给其他用户。</div>
            <div class="bill-imp-scroll bill-imp-alias">
                <table>
                    <tr>
                        <th>#</th>
                        <th>参考时间</th>
                        <th>参考金额</th>
                        <th>参考对方 / 商品</th>
                        <th>匹配词（逗号分隔）</th>
                        <th>短名称</th>
                        <th>餐次门店</th>
                        <th>商品限定</th>
                        <th>待确认</th>
                        <th>大额</th>
                        <th></th>
                    </tr>
                    <tr v-for="(row, index) in aliasRules" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td class="muted">{{ displayRef(row).when || '—' }}</td>
                        <td class="num muted">{{ displayRef(row).when ? formatAmt(displayRef(row).amount) : '—' }}</td>
                        <td class="muted" :title="ruleRefTip(row)">{{ ruleRefLabel(row) }}</td>
                        <td><input v-model="row.matchText" placeholder="商户名,分店名"></td>
                        <td><input v-model="row.name"></td>
                        <td><input v-model="row.meal_place" placeholder="店名"></td>
                        <td><input v-model="row.whenProductText" placeholder="可选，逗号分隔"></td>
                        <td class="center"><input v-model="row.guess" type="checkbox"></td>
                        <td class="center"><input v-model="row.confirm" type="checkbox"></td>
                        <td><button type="button" class="bill-imp-del" @click="aliasRules.splice(index, 1)">删除</button></td>
                    </tr>
                </table>
            </div>
        </div>

        <div v-else class="bill-imp-body">
            <div class="bill-imp-scroll">
                <table>
                    <tr>
                        <th>ID</th><th>文件名</th><th>区间</th><th>笔数</th><th>可写</th><th>未识别</th><th>已写</th><th>状态</th><th>上传时间</th><th></th>
                    </tr>
                    <tr v-if="batchList.length === 0"><td colspan="10">还没有导入记录</td></tr>
                    <tr v-for="row in batchList" :key="row.id">
                        <td>{{ row.id }}</td>
                        <td>{{ row.filename }}</td>
                        <td>{{ periodText(row) }}</td>
                        <td class="num">{{ row.row_count }}</td>
                        <td class="num">{{ row.ready_count }}</td>
                        <td class="num">{{ row.unmapped_count }}</td>
                        <td class="num">{{ row.applied_count }}</td>
                        <td>{{ statusLabel(row.status) }}</td>
                        <td>{{ row.date_init }}</td>
                        <td class="ops">
                            <button type="button" @click="openBatch(row.id)">预览</button>
                            <button type="button" @click="showOrders(row.id)">订单</button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div v-if="ordersVisible" class="bill-imp-mask" @click.self="ordersVisible = false">
            <div class="bill-imp-dialog">
                <div class="bill-imp-dialog-title">已写入订单</div>
                <div class="bill-imp-scroll">
                    <table>
                        <tr><th>订单号</th><th>日期</th><th>名称</th><th>金额</th></tr>
                        <tr v-if="orderList.length === 0"><td colspan="4">（无）</td></tr>
                        <tr v-for="row in orderList" :key="row.order_id">
                            <td>{{ row.order_id }}</td>
                            <td>{{ String(row.bill_date || '').slice(0, 10) }}</td>
                            <td>{{ row.name }}</td>
                            <td class="num">{{ row.amount }}</td>
                        </tr>
                    </table>
                </div>
                <ButtonSmall @click="ordersVisible = false">关闭</ButtonSmall>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import billImportApi, {BillImportAliasConfig, BillImportDayLine, BillImportItem, BillImportRule} from "@/api/billImportApi.ts"
import ButtonSmall from "@/components/ButtonSmall.vue"
import {popMessage} from "@/utility.ts"
import {computed, onMounted, ref, watch} from "vue"

interface EditableRule extends BillImportRule {
    matchText: string
    whenProductText: string
}

interface RuleRef {
    match_key: string
    when: string
    amount: number
    who: string
    product: string
    count: number
}

const activeTab = ref<'preview' | 'aliases' | 'batches'>('preview')
const fileInput = ref<HTMLInputElement>()
const currentFile = ref<File | null>(null)
const uploading = ref(false)
const previewing = ref(false)
const seeding = ref(false)
const applying = ref(false)
const includeGuess = ref(false)
const includeConfirm = ref(false)
const includeZero = ref(false)
const hideZeroAmount = ref(false)
const batchId = ref<number | null>(null)
const batchMeta = ref<Record<string, any> | null>(null)
const preview = ref<Record<string, any> | null>(null)
const counts = ref<Record<string, number> | null>(null)
const ruleRefs = ref<RuleRef[]>([])
const aliasSlots = ref<BillImportAliasConfig['slots']>([])
const aliasRules = ref<EditableRule[]>([])
const aliasSaving = ref(false)
const batchList = ref<any[]>([])
const batchLoading = ref(false)
const ordersVisible = ref(false)
const orderList = ref<any[]>([])

function isZeroAmount(n: number) {
    return Math.abs(Number(n) || 0) < 0.0001
}

function filterItems<T extends {amount: number}>(list: T[] | undefined) {
    const rows = list || []
    if (!hideZeroAmount.value) return rows
    return rows.filter(row => !isZeroAmount(row.amount))
}

function renderFilteredDays(lines: BillImportDayLine[] | undefined) {
    const rows = filterItems(lines)
    if (!rows.length) return '（无）'
    const byDate: Record<string, BillImportDayLine[]> = {}
    for (const line of rows) {
        ;(byDate[line.date] ||= []).push(line)
    }
    return Object.keys(byDate).sort().map(date => {
        const body = byDate[date].map(line => `${line.name} ${formatAmt(line.amount)}`).join('\n')
        return `${String(date).slice(0, 10)}\n${body}`
    }).join('\n\n')
}

const filteredReadyDays = computed(() => renderFilteredDays(preview.value?.ready))
const filteredImportedDays = computed(() => renderFilteredDays(preview.value?.imported))
const filteredGuessDays = computed(() => renderFilteredDays(preview.value?.guess))
const filteredConfirmDays = computed(() => renderFilteredDays(preview.value?.confirm))
const filteredUnmapped = computed(() => filterItems<BillImportItem>(preview.value?.unmapped))
const filteredSkip = computed(() => filterItems<BillImportItem>(preview.value?.skip))

function displayRef(row: EditableRule): RuleRef {
    const key = splitWords(row.matchText).join(',')
    const hit = ruleRefs.value.find(item => item.match_key === key && item.when)
    if (hit) return hit
    return {
        match_key: key,
        when: row.ref_when || '',
        amount: row.ref_amount == null ? 0 : Number(row.ref_amount),
        who: row.ref_who || '',
        product: row.ref_product || '',
        count: 0,
    }
}

function ruleRefLabel(row: EditableRule) {
    const ref = displayRef(row)
    if (!ref.when) return batchId.value ? '本批次无命中' : '—'
    const count = ref.count > 1 ? ` ×${ref.count}` : ''
    return `${ref.who || '—'}${count}`
}

function ruleRefTip(row: EditableRule) {
    const ref = displayRef(row)
    if (!ref.when) return ''
    return `${ref.when}  ${formatAmt(ref.amount)}  ${ref.who} / ${ref.product}`
}

function mergeRefsIntoAliasRules() {
    for (const row of aliasRules.value) {
        const key = splitWords(row.matchText).join(',')
        const hit = ruleRefs.value.find(item => item.match_key === key && item.when)
        if (!hit) continue
        row.ref_when = hit.when
        row.ref_amount = hit.amount
        row.ref_who = hit.who
        row.ref_product = hit.product
    }
}

function splitWords(text: string) {
    return (text || '').split(/[,，]/).map(item => item.trim()).filter(Boolean)
}

function formatAmt(n: number) {
    if (n == null || Number.isNaN(Number(n))) return ''
    const text = Math.abs(Number(n)).toFixed(2).replace(/\.?0+$/, '')
    if (Number(n) > 0) return `+${text}`
    if (Number(n) < 0) return `-${text}`
    return text
}

function pickFile() {
    fileInput.value?.click()
}

function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    currentFile.value = input.files?.[0] || null
}

function toEditable(rules: BillImportRule[]): EditableRule[] {
    return (rules || []).map(rule => ({
        ...rule,
        matchText: (rule.match || []).join(','),
        whenProductText: (rule.when_product || []).join(','),
    }))
}

function fromEditable(rules: EditableRule[]): BillImportRule[] {
    return rules.map(rule => {
        const out: BillImportRule = {
            match: splitWords(rule.matchText),
            guess: !!rule.guess,
            confirm: !!rule.confirm,
        }
        if (rule.name) out.name = rule.name
        if (rule.meal_place) out.meal_place = rule.meal_place
        const whenProduct = splitWords(rule.whenProductText)
        if (whenProduct.length) out.when_product = whenProduct
        if (rule.meal_order) out.meal_order = rule.meal_order
        if (rule.slot_names) out.slot_names = rule.slot_names
        if (rule.ref_when) {
            out.ref_when = rule.ref_when
            out.ref_who = rule.ref_who || ''
            out.ref_product = rule.ref_product || ''
            if (rule.ref_amount != null) out.ref_amount = Number(rule.ref_amount)
        }
        return out
    })
}

function setAliasEditor(config: BillImportAliasConfig) {
    aliasSlots.value = config.slots || []
    aliasRules.value = toEditable(config.rules || [])
}

function applyStoredRefs(config: BillImportAliasConfig) {
    const byKey = new Map<string, BillImportRule>()
    for (const rule of config.rules || []) {
        byKey.set((rule.match || []).join(','), rule)
    }
    for (const row of aliasRules.value) {
        const src = byKey.get(splitWords(row.matchText).join(','))
        if (!src?.ref_when) continue
        row.ref_when = src.ref_when
        row.ref_amount = src.ref_amount == null ? null : Number(src.ref_amount)
        row.ref_who = src.ref_who || ''
        row.ref_product = src.ref_product || ''
    }
}

function applyPreviewPayload(data: any, opts?: {replaceAliases?: boolean}) {
    batchId.value = data.batch_id
    preview.value = data.preview
    counts.value = data.preview?.counts || null
    batchMeta.value = data.batch || batchMeta.value
    if (data.preview?.rule_refs) {
        ruleRefs.value = data.preview.rule_refs
    }
    if (data.aliases) {
        if (opts?.replaceAliases || aliasRules.value.length === 0) {
            setAliasEditor(data.aliases)
        } else {
            applyStoredRefs(data.aliases)
            mergeRefsIntoAliasRules()
        }
    } else if (data.preview?.rule_refs) {
        mergeRefsIntoAliasRules()
    }
}

function uploadFile() {
    if (!currentFile.value) {
        popMessage('warning', '请先选择 CSV 文件')
        return
    }
    const form = new FormData()
    form.append('file', currentFile.value)
    uploading.value = true
    billImportApi
        .upload(form)
        .then(res => {
            applyPreviewPayload(res.data)
            popMessage('success', res.message || '上传成功', () => {}, 1)
        })
        .catch(err => popMessage('warning', err.message || '上传失败'))
        .finally(() => {
            uploading.value = false
        })
}

function refreshPreview() {
    if (!batchId.value) return
    previewing.value = true
    billImportApi
        .preview(batchId.value)
        .then(res => applyPreviewPayload(res.data))
        .catch(err => popMessage('warning', err.message || '预览失败'))
        .finally(() => {
            previewing.value = false
        })
}

function seedFromUnmapped() {
    if (!batchId.value) return
    seeding.value = true
    billImportApi
        .seed(batchId.value)
        .then(res => {
            applyPreviewPayload({
                batch_id: batchId.value,
                preview: res.data.preview,
                batch: batchMeta.value,
                aliases: res.data.aliases,
            }, {replaceAliases: true})
            popMessage('success', res.message || `已追加 ${res.data.added} 条`, () => {}, 2)
            activeTab.value = 'aliases'
        })
        .catch(err => popMessage('warning', err.message || '生成草稿失败'))
        .finally(() => {
            seeding.value = false
        })
}

function doApply() {
    if (!batchId.value) return
    const extra = `${includeGuess.value ? ' + 名称待确认' : ''}${includeConfirm.value ? ' + 大额待确认' : ''}`
    if (!window.confirm(`将写入「可写入」${extra}，确认？`)) return
    applying.value = true
    billImportApi
        .apply({
            batchId: batchId.value,
            includeGuess: includeGuess.value,
            includeConfirm: includeConfirm.value,
            includeZero: includeZero.value,
        })
        .then(res => {
            const diaryCount = res.data?.diary_count ?? 0
            const lineCount = res.data?.line_count ?? res.data?.applied ?? 0
            popMessage('success', diaryCount > 0 ? `已写入 ${diaryCount} 条日记账单（${lineCount} 笔明细）` : (res.message || '没有新的日记需要写入'), () => {}, 2)
            loadBatches()
            refreshPreview()
        })
        .catch(err => popMessage('warning', err.message || '写入失败'))
        .finally(() => {
            applying.value = false
        })
}

function loadAliases() {
    billImportApi
        .aliases()
        .then(res => setAliasEditor(res.data))
        .catch(err => popMessage('warning', err.message || '读取别名失败'))
}

function saveAliases() {
    aliasSaving.value = true
    mergeRefsIntoAliasRules()
    billImportApi
        .saveAliases({
            slots: aliasSlots.value,
            rules: fromEditable(aliasRules.value),
        })
        .then(res => {
            setAliasEditor(res.data)
            popMessage('success', '别名已保存', () => {}, 1)
            if (batchId.value) refreshPreview()
        })
        .catch(err => popMessage('warning', err.message || '保存失败'))
        .finally(() => {
            aliasSaving.value = false
        })
}

function addRule() {
    aliasRules.value.unshift({
        match: [],
        matchText: '',
        whenProductText: '',
        name: '待命名-',
        guess: true,
    })
}

function loadBatches() {
    batchLoading.value = true
    billImportApi
        .batches(1, 50)
        .then(res => {
            batchList.value = res.data?.list || []
        })
        .catch(err => popMessage('warning', err.message || '读取导入记录失败'))
        .finally(() => {
            batchLoading.value = false
        })
}

function openBatch(id: number) {
    batchId.value = id
    activeTab.value = 'preview'
    refreshPreview()
}

function showOrders(id: number) {
    billImportApi
        .orders(id)
        .then(res => {
            orderList.value = res.data || []
            ordersVisible.value = true
        })
        .catch(err => popMessage('warning', err.message || '读取订单失败'))
}

function periodText(row: any) {
    if (!row.period_start) return ''
    return `${String(row.period_start).slice(0, 10)} ~ ${String(row.period_end || '').slice(0, 10)}`
}

function statusLabel(status: string) {
    if (status === 'applied') return '已写入'
    if (status === 'partial') return '部分写入'
    if (status === 'uploaded') return '已上传'
    return status
}

watch(activeTab, tab => {
    if (tab === 'aliases' && aliasRules.value.length === 0) loadAliases()
    if (tab === 'aliases' && batchId.value && ruleRefs.value.length === 0) refreshPreview()
    if (tab === 'batches') loadBatches()
})

onMounted(() => {
    loadAliases()
})
</script>

<style scoped lang="scss">
@use "sass:color";
@use "../../scss/plugin" as *;

.bill-imp{
  height: 100%;
  min-height: 0;
  display: flex;
  flex-flow: column nowrap;
  background: $bg-light;
}
.bill-imp-bar{
  flex-shrink: 0;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  background: white;
  border-bottom: 1px solid $color-border-light;
}
.bill-imp-tabs, .bill-imp-actions{
  display: flex;
  flex-flow: row wrap;
  gap: 6px;
  align-items: center;
}
.bill-imp-tabs button{
  border: 1px solid transparent;
  background: $bg-light;
  border-radius: $radius-mobile;
  padding: 5px 10px;
  cursor: pointer;
  &.checked{
    border-color: $orange;
    background: color.adjust($color-main, $lightness: 20%);
    font-weight: bold;
  }
}
.bill-imp-file{ display: none; }
.bill-imp-body{
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px;
}
.bill-imp-meta, .bill-imp-empty{
  color: $text-subtitle;
  font-size: $fz-small;
  margin-bottom: 8px;
}
.bill-imp-checks{
  display: flex;
  flex-flow: row wrap;
  gap: 12px;
  margin-bottom: 10px;
  font-size: $fz-small;
}
.bill-imp-previews, .bill-imp-tables{
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
  h4{ margin: 0 0 6px; font-size: $fz-main; }
  pre{
    margin: 0;
    background: white;
    border: 1px solid $color-border-light;
    border-radius: 4px;
    padding: 8px;
    min-height: 80px;
    max-height: 220px;
    overflow: auto;
    font-size: 12px;
    line-height: 1.45;
    white-space: pre-wrap;
  }
  .imported{
    background: #f3faf6;
  }
}
.bill-imp-tables{
  grid-template-columns: 1fr 1fr;
}
.bill-imp-scroll{
  overflow: auto;
  max-height: 360px;
  background: white;
  border: 1px solid $color-border-light;
  border-radius: 4px;
}
.bill-imp-alias-hint{
  margin: 0 0 8px;
  font-size: $fz-small;
  color: $text-subtitle;
  line-height: 1.4;
}
.bill-imp-alias{
  max-height: none;
  height: 100%;
}
table{
  width: 100%;
  border-collapse: collapse;
  font-size: $fz-small;
  th, td{
    padding: 6px 8px;
    border-bottom: 1px solid $color-border-light;
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;
  }
  input[type="text"], input:not([type]){
    width: 140px;
    border: 1px solid $color-border;
    border-radius: 4px;
    padding: 4px 6px;
  }
  .num{ text-align: right; }
  .center{ text-align: center; }
  .muted{ color: $text-subtitle; }
}
.ops button, .bill-imp-del{
  border: 1px solid $color-border;
  background: white;
  border-radius: 4px;
  padding: 2px 6px;
  margin-right: 4px;
  cursor: pointer;
}
.bill-imp-del{ color: #c0392b; }
.bill-imp-mask{
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.bill-imp-dialog{
  width: min(720px, 100%);
  max-height: 80vh;
  overflow: auto;
  background: white;
  border-radius: $radius-pc;
  padding: 16px;
  .bill-imp-dialog-title{
    font-weight: bold;
    margin-bottom: 10px;
  }
  .bill-imp-scroll{ max-height: 420px; margin-bottom: 12px; }
}

@media (max-width: $grid-separate-width-sm) {
  .bill-imp-previews, .bill-imp-tables{
    grid-template-columns: 1fr;
  }
}

@media (prefers-color-scheme: dark) {
  .bill-imp, .bill-imp-bar, .bill-imp-scroll, .bill-imp-dialog, .bill-imp-previews pre{
    background: $dark-bg-dark;
    color: $dark-text-title;
    border-color: $dark-border;
  }
  .bill-imp-tabs button, .ops button, .bill-imp-del, table input{
    background: $dark-bg;
    color: $dark-text-title;
    border-color: $dark-border;
  }
  .bill-imp-previews .imported{
    background: #143028;
  }
}
</style>
