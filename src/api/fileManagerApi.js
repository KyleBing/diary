import request from "../request";

export default {
    list(params) {return request('get', params, null,  '/file-manager/list')},
    upload(requestData) {return request('post', null, requestData,  '/file-manager/upload')},
    delete(requestData) {return request('delete', null, requestData, '/file-manager/delete')},
}
