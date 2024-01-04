import request  from '../request.ts'

export default {
    sorted(params: {years: string, keyword: string})  { return request('get'   , params, null, 'bill/sorted')}  ,
    keys()  { return request('get'   , null, null, 'bill/keys')}  ,
    // allInOne(params)  { return request('get'   , params, null, 'bill')}  ,
}
