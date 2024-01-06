import request  from '../request.ts'

export default {
    list()  { return request('get'   , null, null, 'invitation/list')}  ,
    generate()   { return request('post'  , null, null, 'invitation/generate')}   ,
    delete(params: {diaryId: number}){ return request('delete', params, null, 'invitation/delete')},
    markAsShared(requestData: {id: number}){ return request('post', null, requestData, 'invitation/mark-shared')},
}
