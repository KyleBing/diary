import request from "../request.ts";

export default {
    list(params: {pageNo: number, pageSize: number}) {return request('get', params, null,  '/file-manager/list')},
    upload(requestData: FormData) {return request('post', null, requestData,  '/file-manager/upload')},
    modifyFileName(requestData: {fileId: number, description: string}) {return request('post', null, requestData,  '/file-manager/modify')},
    delete(requestData: {fileId: number}) {return request('delete', null, requestData, '/file-manager/delete')},
}
