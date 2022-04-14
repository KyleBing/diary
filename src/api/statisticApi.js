import request  from '../request.js'

export default {
    category(requestData){ return request('get', requestData, '/api/statistic/category')},
    month(requestData)   { return request('get', requestData, '/api/statistic/month')}   ,
}
