import request  from '../request.ts'
import {
    DiaryEntityDatabase,
    DiarySearchParams,
    DiarySubmitEntity,
    ResponseDiaryAdd
} from "@/view/DiaryList/Diary.ts";
import {CategoryEntity} from "../entity/Category.ts";

export default {
    // 所有类别列表，不需要登录就能访问
    getCategoryAll(): Promise<{success: boolean, data: Array<CategoryEntity>, message: string}> { return request('get',    null, null,'diary-category/list')},

    list(params: DiarySearchParams): Promise<{success: boolean, data: Array<DiaryEntityDatabase>, message: string}>  { return request('get'   , params, null, 'diary/list')}  ,
    add(requestData: DiarySubmitEntity): Promise<ResponseDiaryAdd>   { return request('post'  , {}, requestData, 'diary/add')}   ,
    modify(requestData: DiarySubmitEntity){ return request('put'   , {}, requestData, 'diary/modify')},
    delete(requestData: {diaryId: number}){ return request('delete', {}, requestData, 'diary/delete')},
    detail(params: {diaryId: number}): Promise<{success: boolean, data: DiaryEntityDatabase, message: string}>{ return request('get',    params,null, 'diary/detail')},
    share(params: {diaryId: number}): Promise<{success: boolean, data: DiaryEntityDatabase, message: string}> { return request('get',    params, null,'diary/share')},

    // 导出用户所有日记
    export()  { return request('get'   , null, null, 'diary/export', 120000)}  ,
    clear()  { return request('post'   , null, null, 'diary/clear')}  ,
}
