import request  from '../request.js'

export default {
    list(requestData)  { return request('get'   , requestData, '/api/diary/list')}  ,
    add(requestData)   { return request('post'  , requestData, '/api/diary/add')}   ,
    modify(requestData){ return request('put'   , requestData, '/api/diary/modify')},
    delete(requestData){ return request('delete', requestData, '/api/diary/delete')},
    detail(requestData){ return request('get',    requestData, '/api/diary/detail')},
    share(requestData) { return request('get',    requestData, '/api/diary/share')},
}
