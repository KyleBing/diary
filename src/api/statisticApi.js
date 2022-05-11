import request  from '../request.js'

export default {
    category(requestData){ return request('get', requestData, 'statistic/category')},
    year(requestData)   { return request('get', requestData, 'statistic/year')}   ,
    users(requestData)   { return request('get', requestData, 'statistic/users')}   ,
}
