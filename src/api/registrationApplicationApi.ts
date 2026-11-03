import request from '../request.ts'

export type PayPlatform = 'alipay' | 'wechat'

export default {
    // 提交付费注册申请（无需登录）
    submit(data: { email: string; paidAccount: string; payPlatform: PayPlatform }) {
        return request('post', {}, data, 'registration-application/submit')
    },
    // 填写完邮箱后查询是否已注册 / 是否已有待审申请
    checkEmail(email: string) {
        return request('get', { email }, {}, 'registration-application/check-email')
    },
}
