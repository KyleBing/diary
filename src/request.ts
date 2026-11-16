import axios from "axios";
import {deleteAuthorization, getAuthorization, popMessage, updateAuthorizationToken} from "./utility";
import {ResponseEntity} from "./entity/Response";

const RENEWED_TOKEN_HEADER = 'x-access-token'

let handlingAuthExpired = false

// 读取服务端续签下发的新 JWT
function applyRenewedToken(headers: Record<string, unknown> | undefined) {
    if (!headers) {
        return
    }
    const raw = headers[RENEWED_TOKEN_HEADER] ?? headers['X-Access-Token']
    const token = Array.isArray(raw) ? raw[0] : raw
    if (typeof token === 'string' && token) {
        updateAuthorizationToken(token)
    }
}

function isUnauthorizedPayload(data: unknown): boolean {
    if (!data || typeof data !== 'object') {
        return false
    }
    const body = data as { code?: string; message?: string }
    if (body.code === 'unauthorized') {
        return true
    }
    const message = body.message || ''
    return message.includes('token') || message.includes('身份验证失败') || message === '无 token'
}

function handleAuthExpired(message?: string) {
    if (handlingAuthExpired) {
        return
    }
    handlingAuthExpired = true
    deleteAuthorization()
    const tip = message || '登录已失效，请重新登录'
    // 先提示，再跳登录，避免立刻切页把 toast 冲掉
    popMessage('danger', tip, () => {
        const onLogin = typeof window !== 'undefined' && window.location.hash.includes('/login')
        if (!onLogin && typeof window !== 'undefined') {
            window.location.hash = '#/login'
        }
        handlingAuthExpired = false
    }, 1.6)
}

function request(
    method: 'post'|'get'|'patch'|'put'|'delete',
    params: {}|null,
    requestData: {}|null,
    url: string,
    timeout = 30000,
    signal?: AbortSignal
) : Promise<ResponseEntity> {

    const BASE_URL = import.meta.env.MODE === 'development' ? '/dev/': '../portal/'

    let headers = {}
    /**
    * 所有 requestData 都会自动添加  authorization 信息
    * 给 requestData 添加 authorization 内部的数据： username email uid 等等
    **/
    if (url !== 'user/login' && url !== 'user/register'
        && url !== 'user/forgot' && url !== 'user/resend-verify' && url !== 'user/reset'
        && url !== 'registration-application/submit'
        && url !== 'registration-application/check-email'
        && !url.startsWith('setup/')){ // 注册、登录、找回密码、申请注册、安装引导时不添加 Token
        const token = getAuthorization()?.token
        if (token) {
            Object.assign(headers, {
                Authorization: `Bearer ${token}`,
            })
        }
    }

    return new Promise((resolve, reject) => {
        axios({
            url: BASE_URL + url,
            method,
            params,
            data: requestData,
            headers,
            timeout,
            withCredentials: true,
            signal
        })
            .then(res => {
                applyRenewedToken(res.headers)
                if (res.status === 200) {
                    if (res.data.success){
                        resolve(res.data)
                    } else {
                        console.log('request err: ', res.data) // 输出错误信息
                        if (isUnauthorizedPayload(res.data)) {
                            handleAuthExpired(res.data.message)
                        } else {
                            popMessage('danger', res.data.message || '请求失败', () => {}, 5)
                        }
                        reject(res.data)
                    }
                } else if (res.status === 401 || isUnauthorizedPayload(res.data)) {
                    handleAuthExpired(res.data?.message)
                    reject(res.data)
                } else {
                    reject(res.data)
                    console.log('request err: ', res.data.message) // 输出错误信息
                }
            })
            .catch(err => {
                const status = err.response?.status
                const data = err.response?.data
                if (status === 401 || isUnauthorizedPayload(data)) {
                    handleAuthExpired(data?.message)
                    reject(data || err)
                    return
                }
                if (err.response) {
                    console.log('response: ', err.response)
                    const message = data?.message || err.message || '请求失败'
                    popMessage('danger', message, () => {}, 5)
                } else if (err.request) {
                    console.log('request: ', err.request)
                } else if (err.message) {
                    console.log('message: ', err.message)
                }
                reject(err)
            })
    })
}

export default request
