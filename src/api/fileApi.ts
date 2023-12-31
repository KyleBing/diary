import request from "../request.ts";

export default {
    getUploadToken(params) {return request('get', params, null,  '/image-qiniu/')},
}
