<template>
    <div :class="['bank-card', getCardBgName(card.cardName)]">
        <div class="card-no" :data-clipboard="card.cardNo.replaceAll(' ', '')">{{ card.cardNo }}</div>
        <div class="card-index">{{index + 1}}</div>
        <div class="card-main-info">
            <div class="card-name">{{ card.cardName }}</div>
            <div class="card-type">{{ card.cardType }}</div>
        </div>

        <div class="card-note">{{card.note}}</div>
        <div class="card-detail-list">
            <div class="card-detail-list-item" v-if="card.cardInitBank">
                <div class="label">开户行</div>
                <div class="value">{{card.cardInitBank}}</div>
            </div>
            <div class="card-detail-list-item" v-if="card.credit && card.cardType.indexOf('信用卡') > -1">
                <div class="label">额度</div>
                <div class="value">{{card.credit}}</div>
            </div>
            <div class="card-detail-list-item" v-if="card.countUsage && card.cardType.indexOf('信用卡') > -1">
                <div class="label">已刷次数</div>
                <div class="value">{{card.countUsage}}</div>
            </div>
            <div class="card-detail-list-item" v-if="card.date">
                <div class="label">日期</div>
                <div class="value">{{card.date}}</div>
            </div>
            <div class="card-detail-list-item" v-if="card.verifyCode">
                <div class="label">识别码</div>
                <div class="value">{{card.verifyCode}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import ClipboardJS from "clipboard";
import utility from "@/utility";

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
    },
    methods: {
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
