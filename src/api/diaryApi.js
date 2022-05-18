import request  from '../request.js'

export default {
    list(params)  { return request('get'   , params, null, 'diary/list')}  ,
    add(requestData)   { return request('post'  , {}, requestData, 'diary/add')}   ,
    modify(requestData){ return request('put'   , {}, requestData, 'diary/modify')},
    delete(requestData){ return request('delete', {}, requestData, 'diary/delete')},
    detail(params){ return request('get',    params,null, 'diary/detail')},
    share(params) { return request('get',    params, null,'diary/share')},
}
