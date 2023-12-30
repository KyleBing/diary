import request  from '../request.ts'

export default {
    category(){ return request('get', null, null,'statistic/category')},
    year()   { return request('get', null, null,'statistic/year')}   ,
    users(params)   { return request('get', params, null,'statistic/users')}   ,
    weather(params)   { return request('get', params, null,'statistic/weather')}   ,
    daySum(params)   { return request('get', params, null,'bill/day-sum')}   ,
    monthSum(params)   { return request('get', params, null,'bill/month-sum')}   ,
}
