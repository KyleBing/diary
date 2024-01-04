import axios from "axios";
import {getAuthorization} from "./utility";
import {ResponseEntity} from "./entity/Response.ts";

const BASE_URL = import.meta.env.MODE === 'development' ? '/dev/': '../portal/'

function request(
    method: 'post'|'get'|'patch'|'put'|'delete',
    params: {}|null,
    requestData: {}|null,
    url: string,
    timeout = 30000) : Promise<ResponseEntity>
{

    let headers = {}
    /**
    * 所有 requestData 都会自动添加  authorization 信息
    * 给 requestData 添加 authorization 内部的数据： username email uid 等等
    **/
    if (url !== 'user/login' && url !== 'user/register'){ // 注册和登录时不添加 Token 数据
        Object.assign(headers, {
            'Diary-Token':  getAuthorization() && getAuthorization().token,
            'Diary-Uid':  getAuthorization() && getAuthorization().uid
        })
    }

    return new Promise((resolve, reject) => {
        axios({
            url: BASE_URL + url,
            method,
            params,
            data: requestData,
            headers,
            timeout,
            withCredentials: true
        })
            .then(res => {
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
