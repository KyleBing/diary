import axios from "axios";
import utility from "@/utility";
const BASE_URL = process.env.NODE_ENV === 'development' ? '': '../portal/'


function request(method, params, requestData = {}, url) {

    params = params || {}
    /*
    * 所有 requestData 都会自动添加  authorization 信息
    * 给 requestData 添加 authorization 内部的数据： username email uid 等等
    * */
    if (url !== 'user/login' && url !== 'user/register'){ // 注册和登录时不添加 Token 数据
        Object.assign(params, utility.getAuthorization())
    }

    return new Promise((resolve, reject) => {
        axios({
            url: BASE_URL + url,
            method,
            data: requestData,
            params,
            withCredentials: true
        })
            .then(res => {
                if (res.status === 200) {
                    if (res.data.success){
                        resolve(res.data)
                    } else {
                        console.log('request err: ', res.data) // 输出错误信息
                        reject(res.data)
                    }
                } else {
                    console.log('request err: ', res.data) // 输出错误信息
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
