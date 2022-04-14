import request  from '../request.js'

export default {
    category(requestData){ return request('post', requestData, '/api/statistic/category')},
    month(requestData)   { return request('post', requestData, '/api/statistic/month')}   ,
}
