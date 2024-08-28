<template>
    <BillPanel title="借还记录" v-if="borrowInfoList && borrowInfoList.length > 0">
        <div class="borrow-list">
            <div class="borrow-list-item" v-for="(item, index) in borrowInfoList" :key="index">
                <div class="total">{{item.total}}</div>
                <div class="lender">{{item.lender}}</div>
                <div class="section-note">
                    <div class="usage">{{item.usage}} - {{item.type}}</div>
                    <div class="date-loan">{{item.dateLoan}}</div>
                </div>
            </div>
        </div>
    </BillPanel>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import billApi from "@/api/billApi.ts";
import {EntityBorrow} from "@/view/Bill/BorrowInfo/Borrow.ts";
import BillPanel from "@/view/Bill/BillPanel.vue";

onMounted(()=>{
    getBorrowInfo()
})

/**
 * 借还记录
 */
const borrowInfoList = ref<Array<EntityBorrow>>([])
function getBorrowInfo(){
    billApi
        .getBorrowList()
        .then(res => {
            if (res.data){
                borrowInfoList.value = processBorrowInfo(res.data)
            }
        })
}

function processBorrowInfo(borrowInfoString: string): Array<EntityBorrow>{
    // card list
    let tempStrArray = borrowInfoString.split('\n\n').filter(item => item.length > 0)

    // temp borrowinfo array
    let tempBorrowArray:Array<EntityBorrow> = []

    // card item
    tempStrArray.forEach(borrowStr => {
        let borrowInfoMap = new Map(
            borrowStr
                .split('\n')
                .map(borrowItem => borrowItem.split('：'))
        )
        let tempBorrowInfo: EntityBorrow = {}
        let extraInfos = []
        borrowInfoMap.forEach((value, key) => {
            switch (key) {
                case '借出日期':
                    tempBorrowInfo.dateLoan = value;
                    break;
                case '还款日期':
                    tempBorrowInfo.dateDue = value;
                    break;
                case '借给':
                    tempBorrowInfo.lender = value;
                    break;
                case '用途':
                    tempBorrowInfo.usage = value;
                    break;
                case '总额':
                    tempBorrowInfo.total = value;
                    break;
                case '类型':
                    tempBorrowInfo.type = value;
                    break;
                default:
                    extraInfos.push({key, value})
                    break
            }
        })
        tempBorrowArray.push(tempBorrowInfo)
    })
    return tempBorrowArray
}

</script>

<style scoped lang="scss">
@import "../../../scss/plugin";
.borrow-list{

}
.borrow-list-item{
    border-bottom: 1px solid $color-border;
    padding: 5px 10px;
    white-space: nowrap;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $fz-list-content;

    &:hover{
        background-color: $bg-light;
    }
    &:last-child{
        //border-bottom: none;
    }
    .total{
        text-align: right;
        width: 80px;
        font-size: $fz-title;
    }
    .lender{
        width: 100px;
        text-align: center;
        flex-grow: 1;

    }
    .section-note{
        width: 100px;
        font-size: $fz-tiny;
        color: $text-content;
        .date-loan{

        }
    }
}

@media (prefers-color-scheme: dark) {
    .borrow-list-item{
        border-bottom-color: $dark-border;
        &:hover{
            background-color: black;
        }
        &:last-child{
        }
        .total{
        }
        .lender{
        }
        .section-note{
            color: $dark-text-subtitle;
            .date-loan{

            }
        }
    }
}

</style>
