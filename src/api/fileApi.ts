import request from "../request.js";

export default {
    getUploadToken(params) {return request('get', params, null,  '/image-qiniu/')},
}
