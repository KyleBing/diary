import request  from '../request.ts'
import {UserProfileEntity, UserRegisterEntity} from "../entity/User.ts";

export default {
    login(requestData: {email: string, password: string})         { return request('post', {}, requestData, 'user/login')}          ,
    register(requestData: UserRegisterEntity)      { return request('post', {}, requestData, 'user/register')}       ,
    changePassword(requestData: {password: string}){ return request('put' , {}, requestData, 'user/change-password')},
    setProfile(requestData: UserProfileEntity)    { return request('put' , {}, requestData, 'user/set-profile')},
    // 注销账户
    destroyAccount()    { return request('delete' , {}, null, 'user/destroy-account')},

    // 获取头像
    getAvatar(params: {email: string})         { return request('get', params, null, 'user/avatar')}          ,

}
