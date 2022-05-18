import request  from '../request.js'

export default {
    category(params){ return request('get', params, null,'statistic/category')},
    year(params)   { return request('get', params, null,'statistic/year')}   ,
    users(params)   { return request('get', params, null,'statistic/users')}   ,
}
