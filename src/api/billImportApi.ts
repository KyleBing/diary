import request from '../request.ts'

export interface BillImportSlot {
    name: string
    start: number
    end: number
}

export interface BillImportRule {
    match: string[]
    name?: string
    meal_place?: string
    when_product?: string[]
    slot_names?: Record<string, string>
    meal_order?: string
    guess?: boolean
    confirm?: boolean
    ref_when?: string
    ref_amount?: number | null
    ref_who?: string
    ref_product?: string
}

export interface BillImportAliasConfig {
    slots: BillImportSlot[]
    rules: BillImportRule[]
}

export interface BillImportItem {
    when: string
    date: string
    who: string
    product: string
    io: string
    status: string
    order_id: string
    amount: number
    name: string
    bucket: string
    reason?: string
}

export interface BillImportDayLine {
    date: string
    name: string
    amount: number
    when: string
    order_ids: string[]
    bucket: string
}

export interface BillImportCounts {
    row: number
    ready: number
    guess: number
    confirm: number
    imported: number
    unmapped: number
    skip: number
}

export interface BillImportPreview {
    ready: BillImportDayLine[] | null
    guess: BillImportDayLine[] | null
    confirm: BillImportDayLine[] | null
    imported: BillImportDayLine[] | null
    unmapped: BillImportItem[] | null
    skip: BillImportItem[] | null
    counts: BillImportCounts
}

export interface BillImportBatch {
    id: number
    filename: string
    period_start?: string
    period_end?: string
    row_count: number
    ready_count: number
    guess_count: number
    confirm_count: number
    unmapped_count: number
    skip_count: number
    applied_count: number
    status: string
    date_init?: string
}

export default {
    aliases() {
        return request('get', null, null, 'bill-import/aliases')
    },
    saveAliases(config: BillImportAliasConfig) {
        return request('put', null, config, 'bill-import/aliases')
    },
    upload(form: FormData) {
        return request('post', null, form, 'bill-import/upload', 120000)
    },
    preview(batchId: number) {
        return request('get', {batchId}, null, 'bill-import/preview')
    },
    apply(body: {batchId: number, includeGuess: boolean, includeConfirm: boolean, includeZero: boolean}) {
        return request('post', null, body, 'bill-import/apply', 120000)
    },
    seed(batchId: number) {
        return request('post', null, {batchId}, 'bill-import/aliases/seed', 120000)
    },
    batches(pageNo = 1, pageSize = 50) {
        return request('get', {pageNo, pageSize}, null, 'bill-import/batches')
    },
    orders(batchId: number) {
        return request('get', {batchId}, null, 'bill-import/orders')
    },
}
