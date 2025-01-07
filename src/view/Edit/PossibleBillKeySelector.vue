<template>
    <div class="possible-bill-key-list" v-if="props.possibleBillItems.length > 0"
         :style="`left: ${props.positionLeft}px; top: ${props.positionTop}px`"
    >
        <div class="possible-bill-key-list-item"
             v-for="(item, index) in props.possibleBillItems" :key="index"
             @click="emit('selectKey', item.key)"
        >
            <div class="index">{{index + 1}}</div>
            <div class="value">{{item.key}}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import {BillKey} from "@/view/Bill/Bill.ts";

const props = withDefaults(defineProps<{
    possibleBillItems: Array<BillKey>,
    positionLeft: number,
    positionTop: number,
}>(), {
    positionLeft: 150,
    positionTop: 20,
})

const emit = defineEmits(['selectKey'])
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
.possible-bill-key-list{
  z-index: 999;
  max-height: 600px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid $color-border;
  @include border-radius($radius-mobile);
  position: absolute;
  top: 20px;
  left: 250px;
  .possible-bill-key-list-item{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
      font-size: $fz-main;
    border-bottom: 1px solid $color-border;
    padding: 4px 15px 4px 10px;
      line-height: 1.2;
      &:first-child{
          padding-top: 6px;
      }
    &:last-child{
        padding-bottom: 6px;
      border: none;
    }
    &:hover{
      color: black;
      background-color: $color-main;
      border-bottom-color: $color-main;
    }
    .index{
      text-align: center;
      width: 10px;
      font-size: $fz-small;
      margin-right: 10px;
      color: $text-subtitle;
    }
    .value{}
  }
}


@media (prefers-color-scheme: dark) {
  .possible-bill-key-list{
    background-color: $dark-bg;
    border-color: $dark-border;
    .possible-bill-key-list-item{
      color: $dark-text;
      border-bottom: 1px solid $dark-border;
      &:last-child{
      }
      &:hover{
        color: black;
        background-color: $color-main;
        border-bottom-color: $color-main;
        .index{
          color: black;
        }
      }
      .index{
        color: $dark-text-subtitle;
      }
      .value{
      }
    }
  }
}

</style>
