import request  from '../request.js'

export default {
    list(requestData)  { return request('get'   , requestData, 'diary/list')}  ,
    add(requestData)   { return request('post'  , requestData, 'diary/add')}   ,
    modify(requestData){ return request('put'   , requestData, 'diary/modify')},
    delete(requestData){ return request('delete', requestData, 'diary/delete')},
    detail(requestData){ return request('get',    requestData, 'diary/detail')},
    share(requestData) { return request('get',    requestData, 'diary/share')},
}
