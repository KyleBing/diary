import request  from '../request.js'

export default {
    getBankCard(params)  { return request('get'   , params, null,'bank-card')}  ,
}
