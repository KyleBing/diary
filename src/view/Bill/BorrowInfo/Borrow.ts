interface EntityBorrow{
    dateLoan: string,  // 借还日期
    lender: string,    // 贷款人
    usage: string,     // 用途
    dateDue: string,   // 还款日期
    total: number      // 总额
    type: '借入'|'借出'
}

export {
    type EntityBorrow
}
