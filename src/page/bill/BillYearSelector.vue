<template>
    <div class="year-selector">
        <div
            :class="['year-selector-item', {checked: model?.includes(year.value)}]"
            @click="toggleChecked(index)"
            v-for="(year, index) in availableYears" :key="index">
            {{year.value}}
        </div>
    </div>
</template>


<script setup lang="ts">
import {onMounted, ref, Ref} from "vue";
interface YearEntity {value: number, checked: boolean}
const availableYears: Ref<Array<YearEntity>> = ref([]) // 账单可选年份

const model = defineModel<Array<number>>()

onMounted(()=>{
    // 可选的年份，从 2022 开始
    let yearNow = new Date().getFullYear()
    for (let i=0; i<=yearNow - 2022; i++){
        availableYears.value.push({
            value: 2022 + i,
            checked: true
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
.year-selector {
    .year-selector-item {
        color: $text-title;
        label{
            color: $text-title;
        }
    }
}

@media (prefers-color-scheme: dark) {

}
</style>
