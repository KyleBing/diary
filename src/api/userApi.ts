import request  from '../request.ts'

export default {
    login(requestData)         { return request('post', {}, requestData, 'user/login')}          ,
    register(requestData)      { return request('post', {}, requestData, 'user/register')}       ,
    changePassword(requestData){ return request('put' , {}, requestData, 'user/change-password')},
    setProfile(requestData)    { return request('put' , {}, requestData, 'user/set-profile')},
    // 注销账户
    destroyAccount()    { return request('delete' , {}, null, 'user/destroy-account')},

    // 获取头像
    getAvatar(params)         { return request('get', params, null, 'user/avatar')}          ,

}
