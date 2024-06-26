import request  from '../request.ts'
import {CategoryEntity} from "@/entity/Category.ts";

export default {
    sorted(params: {years: string, keyword: string})  { return request('get'   , params, null, 'bill/sorted')}  ,
    keys()  { return request('get'   , null, null, 'bill/keys')}  ,

    getBorrowList() { return request('get',    null, null,'bill/borrow')},

    // allInOne(params)  { return request('get'   , params, null, 'bill')}  ,
}
