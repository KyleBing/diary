import request  from '../request.js'

export default {
    login(requestData)         { return request('post', {}, requestData, 'user/login')}          ,
    register(requestData)      { return request('post', {}, requestData, 'user/register')}       ,
    changePassword(requestData){ return request('put' , {}, requestData, 'user/change-password')},
    setProfile(requestData)    { return request('put' , {}, requestData, 'user/set-profile')}
}
