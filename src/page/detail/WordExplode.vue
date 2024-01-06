<template>
    <div class="word-explode">
        <div class="operation-list">
            <ButtonNormal @click="selectNone">取消选择</ButtonNormal>
            <ButtonNormal @click="selectAll">全选</ButtonNormal>
            <ButtonNormal type="confirm" @click="copySelectedWords">复制</ButtonNormal>
        </div>
        <div class="word-list" ref="refWordList">
            <template  v-for="(item, index) in wordArray"
                       :key="index">
                <div @click="toggleCurrentWord(index)"
                     :data-index="index"
                    :class="['word', {active: item.active}, {space: item.value === ' '}]"
                >
                    <span v-if="item.value === '\n'">↙</span>
                    <span v-else-if="item.value === ' '">　</span>
                    <span v-else>{{item.value}}</span>
                </div>
                <br v-if="item.value === '\n'"/>
            </template>

        </div>
    </div>
</template>

<script lang="ts" setup>
import ButtonNormal from "../../components/ButtonNormal.vue";
import {nextTick, onBeforeUnmount, onMounted, Ref, ref, watch} from "vue";
import {popMessage} from "../../utility.ts";

const props = defineProps({
    content: {
        type: String,
        default: ''
    }
})

interface WordExplodeEntity {
    value: string,
    active: boolean
}

const refWordList = ref()
const wordArray: Ref<WordExplodeEntity[]> = ref([])
const indexMin = ref(0)
const indexMax = ref(0)

onMounted(()=>{
    wordArray.value = splitSentence(props.content)
    nextTick( () => {
        let childNodes: HTMLDivElement[] = refWordList.value.children
        for (let i=0;i<childNodes.length;i++){
            childNodes[i].addEventListener('mouseenter', event => {
                event.preventDefault()
                let index = Number((event.target as HTMLDivElement).getAttribute('data-index') || -1)
                if (index > indexMax.value) indexMax.value = index
                if (index < indexMax.value) indexMin.value = index
                switch (event.buttons){
                    case 1:
                        if (index !== -1){
                            wordArray.value[index].active = true
                        }
                        break
                    case 2:
                        if (index !== -1){
                            wordArray.value[index].active = false
                        }
                        break
                    case 0:
                    default:
                }
            })
        }
    })
})

onBeforeUnmount(()=>{
    let childNodes: HTMLDivElement[] = refWordList.value.children
    if (childNodes && childNodes.length > 0){
        for (let i=0;i<childNodes.length;i++){
            childNodes[i].removeEventListener('mouseenter', _=>{})
        }
    }
})

watch(() => props.content, newValue =>{
    wordArray.value = splitSentence(newValue)
})
watch(indexMin, () => {
    for (let i = 0; i < wordArray.value.length; i++) {
        wordArray.value
    }
})

function selectAll(){
    wordArray.value.forEach(item => item.active = true)
}
function selectNone(){
    wordArray.value.forEach(item => item.active = false)
}
function copySelectedWords(){
    let finalString = wordArray.value
        .filter(item => item.active)
        .map(item => item.value)
        .join('')

    if (finalString.length === 0){
        popMessage('warning', '未复制，没有选择任何内容哟', ()=>{}, 1.5)
    } else {
        navigator
            .clipboard
            .writeText(finalString)
            .then(() => {
                popMessage('success', '已复制到 剪贴板', ()=>{}, 1)
                console.log('✓ copied')
            })
    }
}
function toggleCurrentWord(index: number){
    wordArray.value[index].active = !wordArray.value[index].active
}
function splitSentence(sentence: string): WordExplodeEntity[] {
    if (sentence && sentence.length === 0) {
        return []
    } else {
        let parts: string[] = []

        let lastChar = '' // 最后一个字符
        let tempPhrase = '' // 临时词组

        for (let i = 0; i < sentence.length; i++) {
            let currentChar = sentence[i]

            // 是同一个类别时
            if (isCombination(currentChar, lastChar)) {
                tempPhrase = tempPhrase.concat(currentChar)
                lastChar = currentChar
            }
            // 不是同一个类别时
            else {
                if (tempPhrase.length === 0) {
                    tempPhrase = currentChar
                } else {
                    parts.push(tempPhrase)
                    tempPhrase = currentChar
                }
                lastChar = currentChar
            }
        }

        // 补充最后一个临时词组
        if (tempPhrase.length > 0) {
            parts.push(tempPhrase)
        }

        return parts.map(item => {
            return {active: false, value: item}
        })
    }
}

/**
 * 判断前后两个字符是否为一个组合
 * @param newChar 新字符
 * @param oldChar 旧字符
 * @returns {boolean}
 */
function isCombination(newChar: string, oldChar: string): boolean {
    const arraySymbol = `'"，。“”‘’`.split('')
    // 如果是标点，必为 false
    if (arraySymbol.includes(newChar) || arraySymbol.includes(oldChar)) {
        return false
    } else {
        return /[0-9.]/.test(newChar) && /[0-9.]/.test(oldChar)  // 数字
            || /[￥$0-9.]/.test(newChar) && /[￥$0-9.]/.test(oldChar)  // 数字
            || /[0-9a-zA-Z\-@_]/.test(newChar) && /[0-9a-zA-Z\-@_]/.test(oldChar) // 普通数字英文词组
            || /[\u4E00-\u9FA5]/.test(newChar) && /[\u4E00-\u9FA5]/.test(oldChar) // 汉字
    }
}


</script>

<style lang="scss">
@import "../../../src/scss/plugin";

.word-explode{

}

.operation-list{
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
}

.word-list{
    @extend .unselectable;
    .word{
        display: inline-block;
        cursor: pointer;
        margin-right: 2px;
        margin-bottom: 2px;
        font-size: $fz-main;
        padding: 2px 4px;
        border: 1px solid $color-border;
        @include border-radius(3px);
        &.active{
            background-color: $color-main;
            border-color: $bg-menu;
            color: black;
        }
        &.space{
            padding-left: 0;
            padding-right: 0;
        }
    }
}

@media (max-width: $grid-separate-width-md) {
    .word-list {
        .word {
            padding: 2px 5px;
            font-size: $fz-title;
        }
    }
}

@media (prefers-color-scheme: dark) {
    .word-list {
        .word {
            border-color: $dark-border;
            &.active{
            }
        }
    }
}
</style>
