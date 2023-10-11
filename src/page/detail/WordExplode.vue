<template>
    <div class="word-explode">
        <div class="operation-list">
            <ButtonNormal @click="selectNone">取消选择</ButtonNormal>
            <ButtonNormal @click="selectAll">全选</ButtonNormal>
            <ButtonNormal type="confirm" @click="copySelectedWords">复制</ButtonNormal>
        </div>
        <div class="word-list" ref="wordList">
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

<script>
import ClipboardJS from "clipboard"
import utility from "../../utility"
import {mapGetters, mapMutations, mapState} from "vuex"
import ButtonSmall from "@/components/ButtonSmall";
import ButtonNormal from "@/components/ButtonNormal";

export default {
    name: 'WordExplode',
    components: {ButtonNormal, ButtonSmall},
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            wordArray: [],
            clipboard: null,
            indexMin: 0,
            indexMax: 0,
            timeoutHandle: null,
        }
    },
    mounted() {
        this.wordArray = this.splitSentence(this.content)
        this.$nextTick( _=> {
            let childNodes = this.$refs.wordList.children
            for (let i=0;i<childNodes.length;i++){
                childNodes[i].addEventListener('mouseenter', event => {
                    event.preventDefault()
                    let index = Number(event.target.getAttribute('data-index') || -1)
                    if (index > this.indexMax) this.indexMax = index
                    if (index < this.indexMax) this.indexMin = index
                    switch (event.buttons){
                        case 1:
                            if (index !== -1){
                                this.wordArray[index].active = true
                            }
                            break
                        case 2:
                            if (index !== -1){
                                this.wordArray[index].active = false
                            }
                            break
                        case 0:
                        default:
                    }
                })
            }
        })
    },
    beforeUnmount() {
        this.clipboard && this.clipboard.destroy()
        let childNodes = this.$refs.wordList.children
        if (childNodes && childNodes.length > 0){
            for (let i=0;i<childNodes.length;i++){
                childNodes[i].removeEventListener('mouseenter', _=>{})
            }
        }
    },
    computed: {},
    watch: {
        content(newValue){
            this.wordArray = this.splitSentence(newValue)
        },
        indexMin(newValue){
            for (let i=0;i<this.wordArray.length;i++){
                this.wordArray
            }
        },
        indexMax(newValue){

        }
    },
    methods: {
        selectAll(){
            this.wordArray.forEach(item => item.active = true)
        },
        selectNone(){
            this.wordArray.forEach(item => item.active = false)
        },
        copySelectedWords(){
            let finalString = this.wordArray
                .filter(item => item.active)
                .map(item => item.value)
                .join('')

            if (finalString.length === 0){
                utility.popMessage('warning', '未复制，没有选择任何内容哟', null, 1.5)
            } else {
                navigator
                    .clipboard
                    .writeText(finalString)
                    .then(_ => {
                        utility.popMessage('success', '已复制到 剪贴板', null, 1)
                        console.log('✓ copied')
                    })
            }

        },
        toggleCurrentWord(index){
            this.wordArray[index].active = !this.wordArray[index].active
        },
        splitSentence(setence) {
            if (setence && setence.length === 0) {
                return []
            } else {
                let parts = []

                let lastChar = '' // 最后一个字符
                let tempPhrase = '' // 临时词组

                for (let i = 0; i < setence.length; i++) {
                    let currentChar = setence[i]

                    // 是同一个类别时
                    if (this.isCombination(currentChar, lastChar)) {
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
                    return {selected: false, value: item}
                })
            }
        },

        /**
         * 判断前后两个字符是否为一个组合
         * @param newChar 新字符
         * @param oldChar 旧字符
         * @returns {boolean}
         */
        isCombination(newChar, oldChar) {
            const arraySymbol = `'"，。“”‘’`.split('')
            // 如果是标点，必为 false
            if (arraySymbol.includes(newChar) || arraySymbol.includes(oldChar)) {
                return false
            } else {
                return /[0-9\.]/.test(newChar) && /[0-9\.]/.test(oldChar)  // 数字
                    || /[￥\$0-9\.]/.test(newChar) && /[￥\$0-9\.]/.test(oldChar)  // 数字
                    || /[0-9a-zA-Z\-@_]/.test(newChar) && /[0-9a-zA-Z\-@_]/.test(oldChar) // 普通数字英文词组
                    || /[\u4E00-\u9FA5]/.test(newChar) && /[\u4E00-\u9FA5]/.test(oldChar) // 汉字
            }
        }
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
