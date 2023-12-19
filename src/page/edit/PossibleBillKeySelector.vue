<template>
    <div class="possible-bill-key-list" v-if="possibleBillItems.length > 0">
        <div class="possible-bill-key-list-item"
             v-for="(item, index) in possibleBillItems" :key="index"
             @click="$emit('selectKey', item.item)"
        >
            <div class="index">{{index + 1}}</div>
            <div class="value">{{item.item}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PossibleBillKeySelector",

    emits: ['selectKey'],
    props: {
        possibleBillItems: {
            type: Array,
            default: []
        },
    },
    mounted() {

    },
    data(){
        return {
        }
    },
    methods: {

    },
    watch:{

    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
.possible-bill-key-list{
  z-index: 999;
  max-height: 600px;
  overflow-y: auto;
  padding: 5px 0;
  background-color: white;
  border: 1px solid $color-border;
  @include border-radius($radius-pc);
  position: absolute;
  top: 20px;
  left: 250px;
  .possible-bill-key-list-item{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    border-bottom: 1px solid $color-border;
    padding: 3px 30px 3px 15px;
    &:last-child{
      border: none;
    }
    &:hover{
      color: black;
      background-color: $color-main;
      border-bottom-color: $color-main;
    }
    .index{
      text-align: center;
      width: 20px;
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
