<template>
    <div class="bank-card-container" v-if="years.length > 0">
        <div class="bank-card-list">
            <div class="bank-card bank-bg-red"  v-for="(card, index) in cardList" :key="index">
                <div class="card-no">{{ card.cardNo }}</div>
                <div class="card-name">{{ card.cardName }}</div>
                <div class="card-note">{{ card.note }}</div>
<!--                <div class="copy-btn" @click="copyCardNo">
                    <img src="../../assets/img/clipboard.svg" alt="copy">
                </div>-->
                <div class="card-detail-list">
                    <div class="card-detail-list-item">
                        <div class="label"></div>
                        <div class="value"></div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <div v-else class="year-tip"> - 空 - </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import utility from "@/utility"

export default {
    name: "BankCard",
    data() {
        return {
            cardList: [
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '民生银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '招商银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '民生银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '招商银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '民生银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '招商银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '民生银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '招商银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '民生银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '招商银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '民生银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
                {
                    cardNo: '6226 2216 1178 0955',
                    cardName: '招商银行',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                },
            ]
        }
    },
    mounted() {

    },
    computed: {
        ...mapState({
            years: 'statisticsYear'
        }),
        mapCardBg(){
            let tempMap = new Map()
            tempMap.set('招商', 'white')
            tempMap.set('农行', 'green')
            tempMap.set('工商', 'red')
        }
    },
    methods: {
        ...mapMutations(['SET_DATE_FILTER']),
        monthClicked(id) {
            if (id === this.monthChosen) {
                this.monthChosen = ''
            } else {
                this.monthChosen = id
            }
        },
        copyCardNo(){

        }
    }
}
</script>
