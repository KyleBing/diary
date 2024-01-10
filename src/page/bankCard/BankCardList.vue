<template>
    <PageHeader title="银行卡列表" subtitle="点击复制卡号">
        <TabIcon @click="editCardInfo" alt="编辑"/>
    </PageHeader>
    <div v-if="isLoading" class="pt-8 pb-8">
        <Loading :loading="isLoading"/>
    </div>
    <div v-else>
        <div class="bank-card-container"
             v-if="cardListAll.length > 0"
             :style="`height:  ${storeProject.insets.heightPanel}px`"
        >
            <h1 class="bank-card-list-header">存储卡</h1>
            <div class="bank-card-list">
                <bank-card
                    :index="index"
                    :card="card"
                    v-for="(card, index) in cardListStore"
                    :key="index"/>
            </div>

            <h1 class="bank-card-list-header">信用卡</h1>
            <div class="bank-card-list">
                <bank-card
                    :index="index"
                    :card="card"
                    v-for="(card, index) in cardListCredit"
                    :key="index"/>
            </div>
        </div>
        <div v-else class="bank-tip">
            <Loading v-if="isLoading" :loading="isLoading"/>
            <template v-else>
                <p>您目前没有添加任何银行卡</p>
                <p>------------------------</p>
                <p>请新建名为 "我的银行卡列表" 的日记</p>
                <p>日记内容格式如下，</p>
                <p>之后，将会在此显示银行卡列表</p>
                <p>------------------------</p>
                <div class="bank-card-example">
                    <pre>{{ example }}</pre>
                </div>

                <div class="year-tip">添加后，效果如下，点击卡号即可复制卡号</div>

                <div class="bank-card-list p-0">
                    <bank-card
                        :index="index"
                        :card="card"
                        v-for="(card, index) in cardListExample"
                        :key="index"/>
                </div>
            </template>

        </div>
    </div>
</template>

<script lang="ts" setup>
import Loading from "../../components/Loading.vue"
import BankCard from "../../page/bankCard/BankCard.vue"
import TabIcon from "../../components/TabIcon.vue"
import PageHeader from "../../framework/pageHeader/PageHeader.vue"

import ClipboardJS from "clipboard"
import bankCardApi from "../../api/bankCardApi.ts"

import diaryApi from "../../api/diaryApi.ts"
import {getCategoryAll, popMessage} from "../../utility.ts";
import {useProjectStore} from "../../pinia";
const storeProject = useProjectStore()
import {onBeforeUnmount, onMounted, Ref, ref} from "vue";
import {useRouter} from "vue-router";

const cardListExample = [
    {
        cardName: '建设银行',
        cardNo: '6226 2216 3456 0955',
        cardType: '信用卡',
        extraInfos: [
            {key: '地址', value: '山东济南'},
            {key: '开户行', value: '山东济南财富广场分行'},
        ]
    },
    {
        cardName: '中国银行',
        cardNo: '4567 2216 3456 0955',
        cardType: '储蓄卡',
        extraInfos: [
            {key: '地址', value: '山东济南'},
            {key: '开户行', value: '山东济南财富广场分行'}
        ]
    },
]
const example = `银行：民生银行
卡号：6226 2216 1178 4567
类别：储蓄卡
开户行：山东济南办卡
刷卡次数：5

银行：民生银行
卡号：6226 2216 1178 4567
类别：信用卡
开户行：山东济南办卡
额度：20000
验证码：123/4
到期日：2029-08-10
`

const isLoading = ref(false)
const cardListAll: Ref<BankCardEntity[]> = ref([])
const cardListStore = ref([])
const cardListCredit = ref([])
const clipboard = ref(null) // clipboard obj
const router = useRouter()

onMounted(()=>{
    getBankCards()
})
onBeforeUnmount(()=>{
    clipboard.value && clipboard.value.destroy()
})

// 编辑银行卡信息
function editCardInfo(){
    let params = {
        categories: JSON.stringify(getCategoryAll().map(item => item.name_en)),
        keywords: JSON.stringify(['我的银行卡列表']),
        pageSize: 100,
        pageNo: 1
    }
    diaryApi
        .list(params)
        .then(res => {
            if (res.data.length === 1){
                router.push({
                    name: 'Edit',
                    params: {
                        id: res.data[0].id
                    }
                })
            } else {
                popMessage('warning', '未找到名为 “我的银行卡列表” 的日记内容')
            }
        })
}

function getBankCards(){
    isLoading.value = true // 请求的时候显示loading
    bankCardApi
        .getBankCard()
        .then(res => {
            isLoading.value = false
            if (res.data) {
                processCardInfo(res.data.trim())
            } else {
                // 没有设置任何银行卡信息
            }
        })
        .catch(() => {
            isLoading.value = false
        })
}
function processCardInfo(allCardString: string){
    // card list
    let tempStrArray = allCardString.split('\n\n').filter(item => item.length > 0)
    // card item
    tempStrArray.forEach(cardStr => {
        let cardMap = new Map(
            cardStr.split('\n').map(cardItem => cardItem.split('：'))
        )
        let cardInfo: BankCardEntity = {}
        let extraInfos = []
        cardMap.forEach((value: string, key: string) => {
            switch (key){
                case '卡号': cardInfo.cardNo = value; break;
                case '银行': cardInfo.cardName = value; break;
                case '类别': cardInfo.cardType = value; break;
                default:
                    extraInfos.push({key, value})
                    break
            }
        })
        cardInfo['extraInfos'] = extraInfos
        cardListAll.value.push(cardInfo)
        cardListStore.value = cardListAll.value.filter(item => item.cardType.indexOf('储蓄卡') > -1)
        cardListCredit.value = cardListAll.value.filter(item => item.cardType.indexOf('信用卡') > -1)
    })

    // 绑定剪贴板操作方法
    clipboard.value = new ClipboardJS('.bankcard-no', {
        text: trigger => {
            return trigger.getAttribute('data-clipboard')
        },
    })
    clipboard.value.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
        popMessage('success', '卡号已复制到剪贴板', null)
    })
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
$bank-card-list-padding: 30px;

.bank-tip{
    background-color: $bg-menu;
    padding: 30px;
    color: $color-main;
}
.bank-card-example{
    padding: 20px 0;
    text-align: left;
    pre{
        font-family: "JetBrainsMonoDiary";
    }
}


.bank-card-container{
    overflow-y: auto;
    background-color: $bg-menu;
}

.bank-card-list-header{
    padding: 20px $bank-card-list-padding 0;
    font-size: $fz-big;
    font-weight: bold;
    color: white;
}
.bank-card-list{
    display: flex;
    justify-content: flex-start;
    flex-flow: row wrap;
    padding: $bank-card-list-padding;
}

// MOBILE
@media (max-width: $grid-separate-width-sm) {
    .bank-card-list{
        padding: 10px;
        flex-flow: column nowrap;
    }
}

// DARK
@media (prefers-color-scheme: dark) {
    .bank-card-container{
        background-color: $dark-bg;
    }
}

</style>
