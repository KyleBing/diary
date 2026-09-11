import axios from "axios";
import {getAuthorization, updateAuthorizationToken} from "./utility";
import {ResponseEntity} from "./entity/Response";

const RENEWED_TOKEN_HEADER = 'x-access-token'

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
    if (url !== 'user/login' && url !== 'user/register' && !url.startsWith('setup/')){ // 注册、登录、安装引导时不添加 Token
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
                        // popMessage('danger', res.data.message, null, 5)
                        reject(res.data)
                    }
                } else {
                    reject(res.data)
                    console.log('request err: ', res.data.message) // 输出错误信息
                }
            })
            .catch(err => {
                if (err.response) {
                    console.log('response: ', err.response)
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
