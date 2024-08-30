interface BankCardEntity{
    cardNo: string,
    cardName: string,
    cardType: string,
    extraInfos: any[],
    '开户行'?: string,
    note?: string
}

export {
    BankCardEntity
}
