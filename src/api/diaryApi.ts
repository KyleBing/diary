import request  from '../request.ts'
import {
    EntityDiaryFromServer,
    EntityDiaryFromServerCategoryOnly,
    EntityDiaryFromServerTitleOnly,
    DiarySearchParams,
    DiarySearchParamsForCalendar,
    DiarySubmitEntity,
    ResponseDiaryAdd
} from "@/view/DiaryList/Diary.ts";
import {CategoryEntity} from "../entity/Category.ts";

export default {
    // 所有类别列表，不需要登录就能访问
    getCategoryAll(): Promise<{
        success: boolean,
        data: Array<CategoryEntity>,
        message: string
    }> {

        return request('get',    null, null,'diary-category/list')},

    list(params: DiarySearchParams, signal?: AbortSignal): Promise<{
        success: boolean,
        data: Array<EntityDiaryFromServer>,
        message: string
    }>  {
        return request('get'   , params, null, 'diary/list', undefined, signal)}  ,


    add(requestData: DiarySubmitEntity): Promise<ResponseDiaryAdd>   {
        return request('post'  , {}, requestData, 'diary/add')}   ,
    modify(requestData: DiarySubmitEntity){
        return request('put'   , {}, requestData, 'diary/modify')},
    delete(requestData: {diaryId: number}){
        return request('delete', {}, requestData, 'diary/delete')},
    detail(params: {diaryId: number}): Promise<{
        success: boolean,
        data: EntityDiaryFromServer,
        message: string
    }>{
        return request('get',    params,null, 'diary/detail')},
    getDiaryWithTitleKeyword(
        params: { keyword: string }): Promise<{
        success: boolean,
        data: EntityDiaryFromServer,
        message: string
    }> {
        return request('get', params, null, 'diary/get-diary-content-with-keyword')
    },
    share(params: {diaryId: number}): Promise<{
        success: boolean,
        data: EntityDiaryFromServer,
        message: string
    }> {
        return request('get',    params, null,'diary/share')},

    // 导出用户所有日记
    export()  {
        return request('get'   , null, null, 'diary/export', 120000)}  ,
    clear()  {
        return request('post'   , null, null, 'diary/clear')}  ,


    // 获取日记列表，列表中只包含标题
    listTitleOnly(params: DiarySearchParams): Promise<{
        success: boolean,
        data: Array<EntityDiaryFromServerTitleOnly>,
        message: string
    }>  {
        return request('get'   , params, null, 'diary/list-title-only')}  ,

    // 获取日记列表，列表中只包含类别
    lietCategoryOnly(params: DiarySearchParamsForCalendar): Promise<{
        success: boolean,
        data: Array<EntityDiaryFromServerCategoryOnly>,
        message: string
    }>  {
        return request('get'   , params, null, 'diary/list-category-only')}  ,

    // 获取日记列表，包含所有字段
    listAll(params: DiarySearchParams): Promise<{
        success: boolean,
        data: Array<EntityDiaryFromServer>,
        message: string
    }>  {
        return request('get'   , params, null, 'diary/list-all')}  ,
}
