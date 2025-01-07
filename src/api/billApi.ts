import request  from '../request.ts'

export default {
    sorted(params: {years: string, keyword: string})  { return request('get'   , params, null, 'bill/sorted')}  ,
    keys()  { return request('get'   , null, null, 'bill/keys')}  ,

    getBorrowList(): Promise<{success: boolean, data: string}> {
        return request('get',    null, null,'bill/borrow')},

    // allInOne(params)  { return request('get'   , params, null, 'bill')}  ,
}
