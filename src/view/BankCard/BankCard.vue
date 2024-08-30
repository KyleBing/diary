<template>
    <div :class="['bankcard', getBankInfo(props.card.cardName)!.bgColorClass, {active: props.index === props.chosenCardIndex}]">
        <div class="bankcard-index">{{index + 1}}</div>
        <div class="bankcard-upper">
            <div class="bankcard-logo">
                <img :src="getBankInfo(props.card.cardName)!.icon" alt="BankCard Icon">
            </div>
            <div class="bankcard-main-info">
                <div class="bankcard-title">
                    <div class="bankcard-name">{{ props.card.cardName }}</div>
<!--                    <div class="bankcard-type">{{ props.card.cardType }}</div>-->
                </div>
                <div class="bankcard-no" :data-clipboard="props.card.cardNo.replace(/ /g, '')">{{ props.card.cardNo }}</div>

                <div class="bankcard-note">{{props.card.note}}</div>
            </div>
        </div>
        <div class="bankcard-detail-list">
            <div class="bankcard-detail-list-item" v-if="props.card['开户行']">
                <div class="label">开户行</div>
                <div class="value">{{props.card.开户行}}</div>
            </div>
            <div class="bankcard-detail-list-item"
                 v-for="(infoItem, index) in props.card.extraInfos" :key="index"
            >
                <div class="label">{{ infoItem.key }}</div>
                <div class="value">{{ infoItem.value }}</div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import {BankCardEntity} from "./BankCard.ts"

const props = defineProps<{
    index: number
    chosenCardIndex: number,
    card: BankCardEntity
}>()

interface BankCardFace {
    icon: any,
    bgColorClass: string
}

import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";
const bankMap: Map<string, BankCardFace> = new Map([
    ['中信银行', {icon: SVG_ICONS.bank_icons['中信银行'], bgColorClass: 'bank-bg-white'}],
    ['农业银行', {icon: SVG_ICONS.bank_icons['农业银行'], bgColorClass: 'bank-bg-green'}],
    ['工商银行', {icon: SVG_ICONS.bank_icons['工商银行'], bgColorClass: 'bank-bg-red'}],
    ['中国银行', {icon: SVG_ICONS.bank_icons['中国银行'], bgColorClass: 'bank-bg-white'}],
    ['建设银行', {icon: SVG_ICONS.bank_icons['建设银行'], bgColorClass: 'bank-bg-blue'}],
    ['招商银行', {icon: SVG_ICONS.bank_icons['招商银行'], bgColorClass: 'bank-bg-zhaoshang'}],
    ['民生银行', {icon: SVG_ICONS.bank_icons['民生银行'], bgColorClass: 'bank-bg-white'}],
    ['浦发银行', {icon: SVG_ICONS.bank_icons['浦发银行'], bgColorClass: 'bank-bg-white'}],
    ['广发银行', {icon: SVG_ICONS.bank_icons['广发银行'], bgColorClass: 'bank-bg-white'}],
    ['北京银行', {icon: SVG_ICONS.bank_icons['北京银行'], bgColorClass: 'bank-bg-white'}],
    ['交通银行', {icon: SVG_ICONS.bank_icons['交通银行'], bgColorClass: 'bank-bg-jiaotong'}],
    ['银行',    {icon: SVG_ICONS.bank_icons['银行'], bgColorClass: 'bank-bg-white'}]
])
function  getBankInfo(cardName: string){
    if (/招商/g.test(cardName)){
        return bankMap.get('招商银行')
    } else if (/农行|农业/g.test(cardName)) {
        return bankMap.get('农业银行')
    } else if (/中信/g.test(cardName)) {
        return bankMap.get('中信银行')
    } else if (/工商/g.test(cardName)) {
        return bankMap.get('工商银行')
    } else if (/建行|建设银行/g.test(cardName)) {
        return bankMap.get('建设银行')
    } else if (/中行|中国银行/g.test(cardName)) {
        return bankMap.get('中国银行')
    } else if (/招行|招商银行/g.test(cardName)) {
        return bankMap.get('招商银行')
    } else if (/民生|民生银行/g.test(cardName)) {
        return bankMap.get('民生银行')
    } else if (/浦发|浦发银行/g.test(cardName)) {
        return bankMap.get('浦发银行')
    } else if (/广发|广发银行/g.test(cardName)) {
        return bankMap.get('广发银行')
    } else if (/北京|北京银行/g.test(cardName)) {
        return bankMap.get('北京银行')
    } else if (/交通|交通银行/g.test(cardName)) {
        return bankMap.get('交通银行')
    } else {
        return bankMap.get('银行')
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
@import "bank-card.scss";
</style>
