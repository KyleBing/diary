<template>
    <page-header title="银行卡列表"/>
    <div class="bank-card-container"
         v-if="cardList.length > 0"
         :style="'height:' + insets.heightPanel + 'px'"
    >
        <div class="bank-card-list">
            <card
                :index="index"
                :card="card"
                v-for="(card, index) in cardList"
                :key="index"/>
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
                <div class="bank-card-list">
                    <card
                        :index="index"
                        :card="card"
                        v-for="(card, index) in cardListExample"
                        :key="index"/>
                </div>

            </div>
        </template>

    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import bankCardApi from "@/api/bankCardApi";
import Loading from "@/components/Loading";
import utility from "@/utility";
import Card from "@/page/card/Card";
import ClipboardJS from "clipboard";
import TabIcon from "@/components/TabIcon";
import PageHeader from "@/framework/PageHeader";

export default {
    name: "CardList",
    components: {PageHeader, TabIcon, Card, Loading},
    data() {
        return {
            isLoading: false,
            cardListExample: [
                {
                    cardName: '建设银行',
                    cardNo: '6226 2216 3456 0955',
                    cardType: '储蓄卡',
                    cardInitBank: '山东济南'
                },
                {
                    cardName: '中国银行',
                    cardNo: '4567 2216 3456 0955',
                    cardType: '储蓄卡',
                    cardInitBank: '山东济南'
                },
            ],

            cardList: [
                /*                {
                                    cardName: '民生银行',
                                    cardNo: '6226 2216 1178 0955',
                                    cardType: '储蓄卡',
                                    cardInitBank: '山东济南办卡'
                                }*/
            ],
            clipboard: null, // clipboard obj
            example: `银行：民生银行
卡号：6226 2216 1178 4567
类别：储蓄卡
开户行：山东济南办卡
刷卡次数：5

银行：民生银行
卡号：6226 2216 1178 4567
类别：储蓄卡
开户行：山东济南办卡
`
        }
    },
    mounted() {
        this.getBankCards()

        // 绑定剪贴板操作方法
        this.clipboard = new ClipboardJS('.card-no', {
            text: trigger => {
                console.log(trigger.getAttribute('data-clipboard'))
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
            years: 'statisticsYear',
        }),
        ...mapState(['insets'])
    },
    methods: {


        getBankCards(){
            this.isLoading = true // 请求的时候显示loading
            bankCardApi.getBankCard()
                .then(res => {
                    this.isLoading = false
                    if (res.data) {
                        this.processCardInfo(res.data)

                    } else {
                        // 没有设置任何银行卡信息
                    }
                })
                .catch(err => {
                    this.isLoading = false
                })
        },
        processCardInfo(allCardString){
            // card list
            let tempStrArray = allCardString.split('\n\n')

            // card item
            tempStrArray.forEach(cardStr => {
                let cardMap = new Map(
                    cardStr
                        .split('\n')
                        .map(cardItem => cardItem.split('：'))
                )
                this.cardList.push({
                    cardNo: cardMap.get('卡号'),
                    cardName: cardMap.get('银行'),
                    cardType: cardMap.get('类别'),
                    cardInitBank: cardMap.get('开户行'),
                    countUsage: cardMap.get('已刷次数'),
                    verifyCode: cardMap.get('验证码'),
                    date: cardMap.get('到期日')
                })
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/plugin";

</style>
