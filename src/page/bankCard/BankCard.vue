<template>
    <div :class="['bankcard', getBankInfo(card.cardName).bgColorClass]">
        <div class="bankcard-index">{{index + 1}}</div>
        <div class="bankcard-upper">
            <div class="bankcard-logo">
                <img :src="getBankInfo(card.cardName).icon" alt="BankCard Icon">
            </div>
            <div class="bankcard-main-info">
                <div class="bankcard-title">
                    <div class="bankcard-name">{{ card.cardName }}</div>
<!--                    <div class="bankcard-type">{{ card.cardType }}</div>-->
                </div>
                <div class="bankcard-no" :data-clipboard="card.cardNo.replaceAll(' ', '')">{{ card.cardNo }}</div>

                <div class="bankcard-note">{{card.note}}</div>
            </div>
        </div>
        <div class="bankcard-detail-list">
            <div class="bankcard-detail-list-item" v-if="card.开户行">
                <div class="label">开户行</div>
                <div class="value">{{card.开户行}}</div>
            </div>
            <div class="bankcard-detail-list-item"
                 v-for="(infoItem, index) in card.extraInfos" :key="index"
            >
                <div class="label">{{ infoItem.key }}</div>
                <div class="value">{{ infoItem.value }}</div>
            </div>

        </div>
    </div>
</template>

<script>
import svgIcons from "../../assets/img/SvgIcons"

export default {
    name: "BankCard",
    props: {
        card: {},
        index: 0
    },
    computed: {
        mapBankInfo(){
            let tempMap = new Map()
            tempMap.set('中信银行', {icon: svgIcons.bank.中信银行, bgColorClass: 'bank-bg-white'})
            tempMap.set('农业银行', {icon: svgIcons.bank.农业银行, bgColorClass: 'bank-bg-green'})
            tempMap.set('工商银行', {icon: svgIcons.bank.工商银行, bgColorClass: 'bank-bg-red'})
            tempMap.set('中国银行', {icon: svgIcons.bank.中国银行, bgColorClass: 'bank-bg-white'})
            tempMap.set('建设银行', {icon: svgIcons.bank.建设银行, bgColorClass: 'bank-bg-blue'})
            tempMap.set('招商银行', {icon: svgIcons.bank.招商银行, bgColorClass: 'bank-bg-zhaoshang'})
            tempMap.set('民生银行', {icon: svgIcons.bank.民生银行, bgColorClass: 'bank-bg-white'})
            tempMap.set('浦发银行', {icon: svgIcons.bank.浦发银行, bgColorClass: 'bank-bg-white'})
            tempMap.set('广发银行', {icon: svgIcons.bank.广发银行, bgColorClass: 'bank-bg-white'})
            tempMap.set('北京银行', {icon: svgIcons.bank.北京银行, bgColorClass: 'bank-bg-white'})
            tempMap.set('交通银行', {icon: svgIcons.bank.交通银行, bgColorClass: 'bank-bg-jiaotong'})
            tempMap.set('银行',     {icon: svgIcons.bank.银行, bgColorClass: 'bank-bg-white'})
            return tempMap
        },

    },
    methods: {
        getBankInfo(cardName){
            if (/招商/g.test(cardName)){
                return this.mapBankInfo.get('招商银行')
            } else if (/农行|农业/g.test(cardName)) {
                return this.mapBankInfo.get('农业银行')
            } else if (/中信/g.test(cardName)) {
                return this.mapBankInfo.get('中信银行')
            } else if (/工商/g.test(cardName)) {
                return this.mapBankInfo.get('工商银行')
            } else if (/建行|建设银行/g.test(cardName)) {
                return this.mapBankInfo.get('建设银行')
            } else if (/中行|中国银行/g.test(cardName)) {
                return this.mapBankInfo.get('中国银行')
            } else if (/招行|招商银行/g.test(cardName)) {
                return this.mapBankInfo.get('招商银行')
            } else if (/民生|民生银行/g.test(cardName)) {
                return this.mapBankInfo.get('民生银行')
            } else if (/浦发|浦发银行/g.test(cardName)) {
                return this.mapBankInfo.get('浦发银行')
            } else if (/广发|广发银行/g.test(cardName)) {
                return this.mapBankInfo.get('广发银行')
            } else if (/北京|北京银行/g.test(cardName)) {
                return this.mapBankInfo.get('北京银行')
            } else if (/交通|交通银行/g.test(cardName)) {
                return this.mapBankInfo.get('交通银行')
            } else {
                return this.mapBankInfo.get('银行')
            }
        },
    },

    mounted() {

    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
@import "../../page/bankCard/bank-card.scss";
</style>
