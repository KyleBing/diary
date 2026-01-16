<template>
    <BillPanel :width="props.width" title="借还记录" v-if="borrowInfoList && borrowInfoList.length > 0">

        <!-- 编辑借还记录 -->
        <template #action>
            <div class="action-container">
                <div @click="toggleHideContent()">
                    <TabIcon size="small" :icon="isBorrowListHidden ? '黑色-内容隐藏' : '黑色-内容显示'"/>
                </div>
                <div @click="editBorrowInfo()">
                    <TabIcon size="small" icon="黑色-编辑"/>
                </div>
            </div>
        </template>

        <!-- 借还记录列表 -->
        <div class="borrow-list">
            <div class="borrow-list-item" v-for="(item, index) in borrowInfoList" :key="index">
                <div class="total">{{hideContent(item.total?.toString() || '')}}</div>
                <div class="lender">{{hideContent(item.lender || '')}}</div>
                <div class="section-note">
                    <div class="usage">{{hideContent(item.usage || '')}} - {{hideContent(item.type || '')}}</div>
                    <div class="date-loan">{{hideContent(item.dateLoan || '')}}</div>
                </div>
            </div>
            <div class="borrow-list-item">
                <div class="total">{{hideContent(borrowSum.toString())}}</div>
                <div class="lender">总计</div>
            </div>

            <div class="borrow-list-item" v-for="(key) in borrowPersonMap.keys()" :key="key">
                <div class="total">{{hideContent(borrowPersonMap.get(key)?.toString() || '')}}</div>
                <div class="lender">{{hideContent(key)}}</div>
                <div class="section-note"></div>
            </div>
        </div>
    </BillPanel>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import billApi from "@/api/billApi.ts";
import {EntityBorrow} from "@/view/Bill/BorrowInfo/Borrow.ts";
import BillPanel from "@/view/Bill/BillPanel.vue";
import TabIcon from "@/components/TabIcon.vue";
import { useProjectStore } from "@/pinia/useProjectStore.ts";
import { useStatisticStore } from "@/pinia/useStatisticStore.ts";
import diaryApi from "@/api/diaryApi.ts";
import { useRouter } from "vue-router";

const props = withDefaults(defineProps<{
    width: number
}>(), {
    width: 350
})

const projectStore = useProjectStore()
const router = useRouter()

const isBorrowListHidden = ref(false)

onMounted(()=>{
    getBorrowInfo()
})

/**
 * 借还记录
 */
const borrowInfoList = ref<Array<EntityBorrow>>([])
const borrowSum = ref(0)
const borrowPersonMap = new Map<string, number>()   // 人员贷款统计 map
function getBorrowInfo(){
    billApi
        .getBorrowList()
        .then(res => {
            if (res.data){
                borrowInfoList.value = processBorrowInfo(res.data)
                borrowInfoList.value.forEach(item => {
                    if (borrowPersonMap.has(item.lender)){
                        let sum = borrowPersonMap.get(item.lender)
                        borrowPersonMap.set(item.lender, sum + item.total)
                    } else {
                        borrowPersonMap.set(item.lender, item.total)
                    }

                    borrowSum.value = borrowSum.value + item.total
                })
            }
        })
}

function processBorrowInfo(borrowInfoString: string): Array<EntityBorrow>{
    // card list
    let tempStrArray = borrowInfoString.split('\n\n').filter(item => item.length > 0)

    // temp borrowInfo array
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
                    tempBorrowInfo.total = Number(value);
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



/**
 * 编辑借还记录
 */
 function editBorrowInfo(){
    const keyword = '借还记录'
    projectStore.SET_KEYWORD([keyword])  // 将 keyword 设置为关键词，为了筛选日记列表，只显示这一条内容
    let params = {
        categories: JSON.stringify(useStatisticStore().getCategoryAllFromLocalStorage().map(item => item.name_en)),
        keywords: JSON.stringify([keyword]),
        pageSize: 100,
        pageNo: 1
    }
    diaryApi
        .list(params)
        .then(res => {
            if (res.data.length === 1){
                router.push({
                    name: 'Edit',
                    params: {id: res.data[0].id}
                })
            }
        })
}

/**
 * 切换显示/隐藏列表内容
 */
function toggleHideContent() {
    isBorrowListHidden.value = !isBorrowListHidden.value
}

/**
 * 隐藏内容处理，与详情中的处理方式相同
 */
function hideContent(content: string): string {
    if (isBorrowListHidden.value) {
        return content.replace(/[^，。 \n]/g, '*')
    }
    return content
}


</script>

<style scoped lang="scss">
@import "../../../scss/plugin";
.borrow-list{
    padding-top: 10px;
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
        border-bottom: none;
    }
    .total{
        font-weight: bold;
        font-family: "JetBrainsMonoDiary", sans-serif;
        min-width: 70px;
        text-align: right;
        flex-shrink: 0;
        font-size: $fz-main;
    }
    .lender{
        min-width: 80px;
        flex-shrink: 0;
        text-align: center;
    }
    .section-note{
        flex-grow: 1;
        width: 100px;
        font-size: $fz-tiny;
        color: $text-content;
        .usage{
            text-wrap: wrap;

        }
        .date-loan{

        }
    }
}

.action-container{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

// mobile
@media (max-width: $grid-separate-width-sm) {
    .borrow-list-item{

        &:hover{
        }
        &:last-child{
        }
        .total{
            width: 50px;
            font-weight: normal;
        }
        .lender{
            width: 50px;
            font-weight: bold;
            font-size: $fz-small;
        }
        .section-note{
            width: auto;
            .usage{
                text-wrap: auto;

            }
            .date-loan{

            }
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
