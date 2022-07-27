<template>
    <div class="bank-card-container" v-if="cardList.length > 0">
        <div class="bank-card-list">
            <div :class="['bank-card', getCardBgName(card.cardName)]"  v-for="(card, index) in cardList" :key="index">
                <div class="card-no" :data-clipboard="card.cardNo.replaceAll(' ', '')">{{ card.cardNo }}</div>
                <div class="card-index">{{index + 1}}</div>
                <div class="card-main-info">
                    <div class="card-name">{{ card.cardName }}</div>
                    <div class="card-type">{{ card.cardType }}</div>
                </div>

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
    <div v-else class="bank-tip">
        <loading v-if="isLoading" :loading="isLoading"/>
        <template v-else>
            <p>您目前没有添加任何银行卡</p>
            <p>------------------------</p>
            <p>请新建名为"银行卡列表" 的日记</p>
            <p>日记内容格式如下，</p>
            <p>之后，将会在此显示银行卡列表</p>
            <p>------------------------</p>
            <div class="bank-card-example">
                <pre>{{ example }}</pre>
            </div>

            <div class="year-tip">添加后，效果如下，点击卡号即可复制卡号</div>


            <div class="bank-card-list">
                <div :class="['bank-card', getCardBgName(card.cardName)]"  v-for="(card, index) in cardListExample" :key="index">
                    <div class="card-no" :data-clipboard="card.cardNo.replaceAll(' ', '')">{{ card.cardNo }}</div>
                    <div class="card-index">{{index + 1}}</div>
                    <div class="card-main-info">
                        <div class="card-name">{{ card.cardName }}</div>
                        <div class="card-type">{{ card.cardType }}</div>
                    </div>

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
        </template>

    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import bankCardApi from "@/api/bankCardApi";
import ClipboardJS from "clipboard";
import Loading from "@/components/Loading";
import utility from "@/utility";

export default {
    name: "BankCard",
    components: {Loading},
    data() {
        return {
            isLoading: false,
            cardListExample: [
                {
                    cardName: '建设银行',
                    cardNo: '6226 2216 3456 0955',
                    cardType: '储蓄卡',
                    note: '山东济南'
                },
                {
                    cardName: '中国银行',
                    cardNo: '4567 2216 3456 0955',
                    cardType: '储蓄卡',
                    note: '山东济南'
                },
            ],

            cardList: [
/*                {
                    cardName: '民生银行',
                    cardNo: '6226 2216 1178 0955',
                    cardType: '储蓄卡',
                    note: '山东济南办卡'
                }*/
            ],
            clipboard: null, // clipboard obj
            example: `民生银行
6226 2216 1178 4567
储蓄卡
山东济南办卡

民生银行
6226 2216 1178 4567
储蓄卡
山东济南办卡

`

        }
    },
    mounted() {
        this.getBankCards()
        // 绑定剪贴板操作方法
        this.clipboard = new ClipboardJS('.card-no', {
            text: trigger => {
                return trigger.getAttribute('data-clipboard')
            },
        })
        this.clipboard.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
            utility.popMessage('success', '卡号已复制到剪贴板', null, 2)
        })
    },
    beforeUnmount() {
        this.clipboard.destroy()
    },
    computed: {
        ...mapState({
            years: 'statisticsYear'
        }),
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

        getBankCards(){
            this.isLoading = true // 请求的时候显示loading
            bankCardApi.getBankCard()
                .then(res => {
                    this.isLoading = false
                    if (res.data) {
                        let tempStrArray = res.data.split('\n\n')
                        tempStrArray.forEach(cardStr => {
                            let cardStrArray = cardStr.split('\n')
                            this.cardList.push({
                                cardNo: cardStrArray[1].trim(),
                                cardName: cardStrArray[0].trim(),
                                cardType: cardStrArray[2].trim(),
                                note: cardStrArray[3].trim()
                            })
                        })
                    } else {
                        // 没有设置任何银行卡信息
                    }
                })
                .catch(err => {
                    this.isLoading = false
                })
        },
    }
}
</script>
