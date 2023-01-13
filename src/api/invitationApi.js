import request  from '../request.js'

export default {
    list(params)  { return request('get'   , params, null, 'invitation/list')}  ,
    generate()   { return request('post'  , null, null, 'invitation/generate')}   ,
    delete(params){ return request('delete', params, null, 'invitation/delete')},
}
