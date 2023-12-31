import request  from '../request.ts'

export default {
    list(params)  { return request('get'   , params, null, 'diary/list')}  ,
    add(requestData)   { return request('post'  , {}, requestData, 'diary/add')}   ,
    modify(requestData){ return request('put'   , {}, requestData, 'diary/modify')},
    delete(requestData){ return request('delete', {}, requestData, 'diary/delete')},
    detail(params){ return request('get',    params,null, 'diary/detail')},
    share(params) { return request('get',    params, null,'diary/share')},
    categoryAllGet() { return request('get',    null, null,'diary-category/list')},
    // 导出用户所有日记
    export()  { return request('get'   , null, null, 'diary/export', 120000)}  ,
    clear()  { return request('post'   , null, null, 'diary/clear')}  ,
}
