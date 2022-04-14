import request  from '../request.js'

export default {
    login(requestData)         { return request('post', requestData, '/api/user/login')}          ,
    register(requestData)      { return request('post', requestData, '/api/user/register')}       ,
    changePassword(requestData){ return request('put' , requestData, '/api/user/change-password')}
}
