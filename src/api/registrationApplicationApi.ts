import request from '../request.ts'

export type PayPlatform = 'alipay' | 'wechat'

export default {
    // 提交付费注册申请（无需登录）
    submit(data: { email: string; paidAccount: string; payPlatform: PayPlatform }) {
        return request('post', {}, data, 'registration-application/submit')
    },
}
