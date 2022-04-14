import request  from '../request.js'

export default {
    list(requestData)  { return request('get'   , requestData, '/api/diary/list')}  ,
    search(requestData){ return request('get'   , requestData, '/api/diary/search')},
    add(requestData)   { return request('post'  , requestData, '/api/diary/add')}   ,
    modify(requestData){ return request('put'   , requestData, '/api/diary/modify')},
    delete(requestData){ return request('delete', requestData, '/api/diary/delete')},
}
