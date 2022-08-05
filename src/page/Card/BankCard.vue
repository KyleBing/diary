<template>
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
</template>

<script>
import ClipboardJS from "clipboard";
import utility from "@/utility";

export default {
    name: "BankCard",
    props: {
        card: {

        }
    },
    methods: {

    },
    beforeUnmount() {
        this.clipboard.destroy()
    },
    mounted() {
        // 绑定剪贴板操作方法
        this.clipboard = new ClipboardJS('.card-no', {
            text: trigger => {
                return trigger.getAttribute('data-clipboard')
            },
        })
        this.clipboard.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
            utility.popMessage('success', '卡号已复制到剪贴板', null, 2)
        })
    }
}
</script>

<style scoped>

</style>
