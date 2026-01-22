<template>
    <div class="year-selector">
        <div
            :class="['year-selector-item', {checked: year.checked}]"
            @click="toggleChecked(index)"
            v-for="(year, index) in availableYears" :key="index"
        >
            {{ year.value }}
        </div>
    </div>
</template>


<script setup lang="ts">
import {onMounted, ref} from "vue";
interface YearEntity {value: number, checked: boolean}
const availableYears = ref<Array<YearEntity>>([]) // 账单可选年份

const model = defineModel<Array<number>>()

onMounted(()=>{
    // 可选的年份，从 2022 开始
    let yearNow = new Date().getFullYear()
    for (let i=0; i <= yearNow - 2022; i++){
        availableYears.value.push({
            value: 2022 + i,
            checked: model.value!.includes(2022 + i)
        })
    }
})

function toggleChecked(index: number){
    availableYears.value[index].checked = !availableYears.value[index].checked
    model.value = availableYears.value
                    .filter(item => item.checked)
                    .map(item => item.value)
}

</script>

<style scoped lang="scss">
@import "../../scss/plugin";
.year-selector{
    display: flex;
    flex-flow: row wrap;
    .year-selector-item{
        border: 1px solid transparent;
        @extend .btn-like;
        background-color: $bg-light;
        color: $text-title;
        margin-right: 5px;
        margin-bottom: 3px;
        padding: 5px 8px;
        @include border-radius($radius-mobile);
        label{
            line-height: 1.5;
            cursor: pointer;
        }
        input{
            display: none;
        }
        &.checked{
            border-color: $orange;
            background-color: lighten($color-main, 20%);
        }
    }
}

@media (prefers-color-scheme: dark) {

}
</style>
