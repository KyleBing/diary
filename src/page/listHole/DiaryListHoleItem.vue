<template>
    <router-link ref="listItem"
                 :class="['diary-list-item', {active: props.isActive}]"
                 :to="`/detail/${props.diary.id}`"
                 :style="backgroundColor"
    >
        <div class="diary-list-hole-item">
            <div class="title">{{props.diary.title}}</div>
            <div class="content markdown small" v-if="props.diary.is_markdown === 1" v-html="contentMarkDownHtml"></div>
            <div class="content" v-else v-html="props.diary.contentHtml"></div>
            <div class="meta" :style="backgroundColor">
                <div class="date">{{props.diary.dateString}}</div>
                <div class="week">{{props.diary.weekday}}</div>
                <div class="category">{{props.diary.categoryString}}</div>
            </div>
            <div :style="backgroundColor" class="marker left"></div>
            <div :style="backgroundColor" class="marker right"></div>
            <div :style="backgroundColor" class="marker bottom"></div>
        </div>
    </router-link>
</template>

<script lang="ts" setup>
import {marked} from "marked";
import {computed, ComputedRef} from "vue";
import {useProjectStore} from "../../pinia";
const storeProject = useProjectStore()

const props = defineProps({
    isActive: {
        type: Boolean,
        default: false
    },
    diary: Object
})

const backgroundColor: ComputedRef<string> = computed(() => {
    return `background-color: ${storeProject.categoryObjectMap.get(props.diary.category).color}`
})
const textColor: ComputedRef<string> = computed(() => {
    return `color: ${storeProject.categoryObjectMap.get(props.diary.category).color}`
})
const contentMarkDownHtml: ComputedRef<string> = computed(() => {
    return marked.parse(props.diary.content)
})

</script>

<style lang="scss" scoped>
@import "../../scss/plugin";

$animate-width: 5px;

.diary-list-hole-item{
    position: relative;
    margin-right: 1px;
    margin-bottom: 1px;
    color: $text-content;
    padding: 5px 10px;
    font-size: $fz-list-content;
    background-color: $bg-light;

    .title{
        padding: 2px;
        font-weight: bold;
        //color: $text-title;
    }
    .content{
        max-height: 300px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .marker{
        background-color: $green;
        position: absolute;
        z-index: 999;
        opacity: 0;
        @include transition(all 0.3s);
        &.left  { @include border-radius($radius-pc 0 0 $radius-pc ); left: 0  ; top:0 ; bottom: 0; width: $animate-width}
        &.right { @include border-radius(0 $radius-pc $radius-pc 0 ); right: 0 ; top:0 ; bottom: 0; width: $animate-width}
        &.bottom{ @include border-radius(0 0 $radius-pc $radius-pc ); bottom: 0; left:0; right:0  ; height: $animate-width}
    }
    .meta{
        z-index: 999;
        @include border-radius($radius-pc $radius-pc 0 0 );
        padding: 5px;
        background-color: $green;
        color: white;
        @include transition(all 0.3s);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 30px;
        opacity: 0;
        display: flex;
        justify-content: flex-start;
        line-height: 20px;
        > *{
            margin-right: 5px;
        }
    }
    outline: 0 solid transparentize(black, 0.6);
    &:hover{
        background-color: white;
        .meta{
            opacity: 1;
            top: -30px;
            @include transition(all 0.1s);
        }
        .marker{
            @include transition(all  0.1s);
            opacity: 1;
            &.left{left: -$animate-width}
            &.right{right: -$animate-width}
            &.bottom{bottom: -$animate-width}
        }
        .title{
            background-color: transparent !important;
            color: black;
        }
        .content{
            color: black;
        }
    }
}
</style>

