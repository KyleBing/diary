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
import ClipboardJS from "clipboard"
import utility from "@/utility"
import svgIcons from "@/assets/img/SvgIcons"

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
        // 绑定剪贴板操作方法
        this.clipboard = new ClipboardJS('.bankcard-no', {
            text: trigger => {
                return trigger.getAttribute('data-clipboard')
            },
        })
        this.clipboard.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
            utility.popMessage('success', '卡号已复制到剪贴板', null)
        })
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
@import "@/page/bankCard/bank-card.scss";
</style>
