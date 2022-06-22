import request  from '../request.js'

export default {
    sorted(params)  { return request('get'   , params, null, 'bill/sorted')}  ,
    allInOne(params)  { return request('get'   , params, null, 'bill')}  ,
}
