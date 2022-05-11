import request  from '../request.js'

export default {
    getBankCard(requestData)  { return request('get'   , requestData, 'bank-card')}  ,
}
