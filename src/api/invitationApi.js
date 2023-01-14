import request  from '../request.js'

export default {
    list(params)  { return request('get'   , params, null, 'invitation/list')}  ,
    generate()   { return request('post'  , null, null, 'invitation/generate')}   ,
    delete(params){ return request('delete', params, null, 'invitation/delete')},
    markAsShared(requestData){ return request('post', null, requestData, 'invitation/mark-shared')},
}
