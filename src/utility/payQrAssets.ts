import type { PayPlatform } from '@/api/registrationApplicationApi'

import qrAlipay from '@/assets/qr_payment/qr_alipay.png'
import qrWepay from '@/assets/qr_payment/qr_wepay.png'

export interface RegistrationPayQrItem {
    id: number
    amount_yuan: number
    alipay_url: string
    alipay_note: string
    wechat_url: string
    wechat_note: string
}

export function isRegistrationPayAmount(value: number): boolean {
    return Number.isInteger(value) && value >= 0 && value <= 100000
}

export function parsePayQrList(raw: unknown): RegistrationPayQrItem[] {
    if (!Array.isArray(raw)) return []
    return raw
        .map((item) => {
            if (!item || typeof item !== 'object') return null
            const row = item as Record<string, unknown>
            const amount = Number(row.amount_yuan)
            if (!isRegistrationPayAmount(amount)) return null
            return {
                id: Number(row.id) || 0,
                amount_yuan: amount,
                alipay_url: String(row.alipay_url || '').trim(),
                alipay_note: String(row.alipay_note || '').trim(),
                wechat_url: String(row.wechat_url || '').trim(),
                wechat_note: String(row.wechat_note || '').trim(),
            }
        })
        .filter((item): item is RegistrationPayQrItem => !!item)
}

export function pickPayQrItem(list: RegistrationPayQrItem[], amountYuan: number): RegistrationPayQrItem | undefined {
    return list.find((item) => item.amount_yuan === amountYuan) || list[0]
}

function portalAssetUrl(path: string): string {
    const s = path.trim()
    if (!s) return ''
    if (/^https?:\/\//i.test(s) || s.startsWith('data:') || s.startsWith('blob:')) return s
    const base = import.meta.env.MODE === 'development' ? '/dev/' : '../portal/'
    if (s.startsWith('/portal/')) return base + s.replace(/^\/portal\//, '')
    if (s.startsWith('/')) return s
    return base + s.replace(/^\/+/, '')
}

export function resolvePayQrUrl(raw: string | undefined | null): string {
    return portalAssetUrl(String(raw || ''))
}

export function payQrImage(platform: PayPlatform, configuredUrl?: string | null): string {
    const resolved = resolvePayQrUrl(configuredUrl)
    if (resolved) return resolved
    return platform === 'wechat' ? qrWepay : qrAlipay
}
