import request from "../request.ts";

export default {
    getUploadToken(params: {bucket: string}) {return request('get', params, null,  '/image-qiniu/')},
}
