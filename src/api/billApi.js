import request  from '../request.js'

export default {
    sorted(params)  { return request('get'   , params, null, 'bill/sorted')}  ,
    keys(params)  { return request('get'   , params, null, 'bill/keys')}  ,
    allInOne(params)  { return request('get'   , params, null, 'bill')}  ,
}
