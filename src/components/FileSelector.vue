<template>
    <div>
        <input ref="input" type="file" id="uploader" accept="*/*" @change="handleFiles">
        <label for="uploader" class="file-content" v-if="currentFile">{{currentFile.name}}</label>
        <label v-else class="avatar-btn-add" for="uploader"></label>
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['fileChange'])

import {ref} from "vue";
import {popMessage} from "../utility.ts";

const avatarData = ref('')
const isLoadingAvatar = ref(false) // 正在载入头像数据
const currentFile = ref(null)

function handleFiles(event: Event) {
    // 从 input 元素中获取 files: FileList
    let files = event.target!.files
    console.log(files)
    if (files.length > 0) {
        let file = files[0]
        if (file.size > 20 * 1024 * 1024){
            popMessage('warning', '请选择小于200k的图片文件')
        } else {
            currentFile.value = file
            emit('fileChange', file)
        }
    }
}


</script>

<style lang="scss" scoped>
@import "../scss/plugin";

$btn-frame-height: 150px;
$btn-frame-width: 200px;

$symbol-width: 5px;
$btn-border-width: 2px;
$cross-width: 60px;


.avatar-wrapper{
    width: $btn-frame-width;
    //height: $btn-frame-height;
    @include border-radius($radius-pc);
    border: $btn-border-width solid $color-main;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    img{
        display: block;
        width: 100%;
        height: 100%;
    }
    &:hover{
        background-color: white;
    }
    .operations{
        position: absolute;
        left: 0;
        top: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .operation-btn{
            margin-left: 3px;
            padding: 2px 5px;
            background-color: rgba(255,255,255,0.3);
            border: 1px solid #ccc;
            color: white;
            @extend .btn-like;
            &:hover{
                color: black;
                border-color: black;
                background-color: white;
            }
        }
    }
}


.file-content{
    color: $text-menu-second;
    cursor: pointer;
    //width: $btn-frame-width;
    padding: 20px;
    width: 100%;
    height: $btn-frame-height;
    @include border-radius($radius-pc);
    border: $btn-border-width dashed $green;
    background-color: transparentize($green, 0.9);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar-btn-add{
    display: block;
    cursor: pointer;
    //width: $btn-frame-width;
    width: 100%;
    height: $btn-frame-height;
    @include border-radius($radius-pc);
    border: $btn-border-width dashed $color-border;
    position: relative;

    &::after{
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        height: $symbol-width;
        width: $cross-width;
        background-color: $color-main;
        transform: translateY(-50%) translateX(-50%);
    }
    &::before{
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        background-color: $color-main;
        width: $symbol-width;
        height: $cross-width;
        transform: translateY(-50%) translateX(-50%);
    }
    &:hover{
    }
    @extend .btn-like;
}


input{
    display: none;
}
</style>
