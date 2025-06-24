import request  from '../request.ts'
export default {
    category(){ return request('get', null, null,'statistic/category')},
    year()  { return request('get', null, null,'statistic/year')}   ,
    users()   { return request('get', null, null,'statistic/users')}   ,
    weather()   { return request('get', null, null,'statistic/weather')}   ,
    daySum()   { return request('get', null , null,'bill/day-sum')}   ,
    monthSum()   { return request('get', null, null,'bill/month-sum')}   ,
}
