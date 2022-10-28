<template>
    <div :class="['bankcard', getCardBgName(card.cardName)]">
        <div class="bankcard-index">{{index + 1}}</div>


        <div class="bankcard-upper">

            <div class="bankcard-logo">
                <img :src="getBankcardIcon(card.cardName)" alt="BankCard Icon">
            </div>
            <div class="bankcard-main-info">
                <div class="bankcard-no" :data-clipboard="card.cardNo.replaceAll(' ', '')">{{ card.cardNo }}</div>
                <div class="bankcard-title">
                    <div class="bankcard-name">{{ card.cardName }}</div>
                    <div class="bankcard-type">{{ card.cardType }}</div>
                </div>
                <div class="bankcard-note">{{card.note}}</div>
            </div>
        </div>
        <div class="bankcard-detail-list">
            <div class="bankcard-detail-list-item" v-if="card.cardInitBank">
                <div class="label">开户行</div>
                <div class="value">{{card.cardInitBank}}</div>
            </div>
            <div class="bankcard-detail-list-item" v-if="card.credit && card.cardType.indexOf('信用卡') > -1">
                <div class="label">额度</div>
                <div class="value">{{card.credit}}</div>
            </div>
            <div class="bankcard-detail-list-item" v-if="card.countUsage && card.cardType.indexOf('信用卡') > -1">
                <div class="label">已刷次数</div>
                <div class="value">{{card.countUsage}}</div>
            </div>
            <div class="bankcard-detail-list-item" v-if="card.date">
                <div class="label">日期</div>
                <div class="value">{{card.date}}</div>
            </div>
            <div class="bankcard-detail-list-item" v-if="card.verifyCode">
                <div class="label">识别码</div>
                <div class="value">{{card.verifyCode}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import ClipboardJS from "clipboard";
import utility from "@/utility";
import SvgIcons from "@/assets/img/SvgIcons";
import svgIcons from "@/assets/img/SvgIcons";

export default {
    name: "BankCard",
    props: {
        card: {},
        index: 0
    },
    computed: {
        mapCardBg(){
            let tempMap = new Map()
            tempMap.set('招商', 'bank-bg-white')
            tempMap.set('农行', 'bank-bg-green')
            tempMap.set('工商', 'bank-bg-red')
            tempMap.set('建行', 'bank-bg-blue')
            return tempMap
        },
        mapBankIcon(){
            let tempMap = new Map()
            tempMap.set('中信银行', svgIcons.bank.中信银行)
            tempMap.set('农业银行', svgIcons.bank.农业银行)
            tempMap.set('工商银行', svgIcons.bank.工商银行)
            tempMap.set('中国银行', svgIcons.bank.中国银行)
            tempMap.set('建设银行', svgIcons.bank.建设银行)
            tempMap.set('招商银行', svgIcons.bank.招商银行)
            tempMap.set('民生银行', svgIcons.bank.民生银行)
            tempMap.set('浦发银行', svgIcons.bank.浦发银行)
            return tempMap
        },

    },
    methods: {
        getBankcardIcon(cardName){
            if (/招商/g.test(cardName)){
                return this.mapBankIcon.get('招商银行')
            } else if (/农行|农业/g.test(cardName)) {
                return this.mapBankIcon.get('农业银行')
            } else if (/中信/g.test(cardName)) {
                return this.mapBankIcon.get('中信银行')
            } else if (/工商/g.test(cardName)) {
                return this.mapBankIcon.get('工商银行')
            } else if (/建行|建设银行/g.test(cardName)) {
                return this.mapBankIcon.get('建设银行')
            } else if (/中行|中国银行/g.test(cardName)) {
                return this.mapBankIcon.get('中国银行')
            } else if (/招行|招商银行/g.test(cardName)) {
                return this.mapBankIcon.get('招商银行')
            } else if (/民生|民生银行/g.test(cardName)) {
                return this.mapBankIcon.get('民生银行')
            } else if (/浦发|浦发银行/g.test(cardName)) {
                return this.mapBankIcon.get('浦发银行')
            } else {
                return ''
            }
        },
        getCardBgName(cardName){
            if (/招商/g.test(cardName)){
                return this.mapCardBg.get('招商')
            } else if (/农行|农业/g.test(cardName)) {
                return this.mapCardBg.get('农行')
            } else if (/工商/g.test(cardName)) {
                return this.mapCardBg.get('工商')
            } else if (/建行|建设银行/g.test(cardName)) {
                return this.mapCardBg.get('建行')
            } else {
                return 'bank-bg-white'
            }
        },
    },

    mounted() {

    }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/plugin";
@import "bank-card";
</style>
