import request  from '../request.ts'
import {DiaryEntity} from "../page/list/Diary.ts";
import {CategoryEntity} from "../entity/Category.ts";

export default {
    // 所有类别列表，不需要登录就能访问
    getCategoryAll(): Promise<{success: boolean, data: Array<CategoryEntity>, message: string}> { return request('get',    null, null,'diary-category/list')},

    list(params): Promise<{success: boolean, data: Array<DiaryEntity>, message: string}>  { return request('get'   , params, null, 'diary/list')}  ,
    add(requestData)   { return request('post'  , {}, requestData, 'diary/add')}   ,
    modify(requestData){ return request('put'   , {}, requestData, 'diary/modify')},
    delete(requestData){ return request('delete', {}, requestData, 'diary/delete')},
    detail(params): Promise<{success: boolean, data: DiaryEntity, message: string}>{ return request('get',    params,null, 'diary/detail')},
    share(params): Promise<{success: boolean, data: DiaryEntity, message: string}> { return request('get',    params, null,'diary/share')},

    // 导出用户所有日记
    export()  { return request('get'   , null, null, 'diary/export', 120000)}  ,
    clear()  { return request('post'   , null, null, 'diary/clear')}  ,
}
