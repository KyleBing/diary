import request  from '../request.ts'

export default {
    getBankCard()  { return request('get'   , null, null,'bank-card')}  ,
}
