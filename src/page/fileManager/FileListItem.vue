<template>
    <div class="file-list-item">
        <div class="id">{{props.fileInfo.id}}</div>

        <div class="file-meta">
            <TabIcon @click="openFileInNewTab" size="small" alt="黑色-内容显示" />
            <TabIcon @click="modalEditFileName = true" size="small" alt="黑色-编辑"/>
            <TabIcon @click="deleteFile" size="small" alt="黑色-删除"/>
            <TabIcon size="small" alt="黑色-分享" class="clipboard" :data-clipboard="filePath" />
        </div>

        <div class="file-info">
            <div class="name">{{props.fileInfo.description}}</div>
            <div class="size">{{(props.fileInfo.size/1024).toFixed(0)}} kb</div>
            <div class="description">{{props.fileInfo.name_original}}</div>
            <div class="date">{{props.fileInfo.date_time}}</div>
            <div :class="['file-type',
                {image: props.fileInfo.type.indexOf('image') > -1},
            ]">{{props.fileInfo.type}}</div>
        </div>

        <Modal v-if="modalEditFileName">
            <form class="modal-form-panel" method="post" id="formModifyFileName" @submit.prevent="modifyFileNameConfirm">
                <div class="input-group">
                    <label for="fileNameOld">旧文件名</label>
                    <input :value="props.fileInfo.description" type="text" name="fileNameOld" id="fileNameOld">
                </div>
                <div class="input-group">
                    <label for="fileName">新文件名</label>
                    <input v-model.lazy="newFileName" type="text" name="fileName" id="fileName">
                </div>
                <button class="btn mt-8 btn-active" type="submit">确定</button>
                <button class="btn mt-2" @click="modalEditFileName = false" type="submit">取消</button>
            </form>
        </Modal>
    </div>


</template>

<script lang="ts" setup>
import TabIcon from "../../components/TabIcon.vue";
import fileManagerApi from "../../api/fileManagerApi";
import Modal from "../../components/Modal.vue";

import {popMessage} from "@/utility.ts";
import {computed, ref} from "vue";

const props = defineProps({
    fileInfo: {
        type: Object,
        default:  {
            // "id": 19,
            // "name_original": "dog (1).gif",
            // "path": "upload/dog (1).gif",
            // "description": "表情-狗-跳舞",
            // "date_create": "2023-11-03T03:54:32.000Z",
            // "date_time": "2023-11-03 03:54:32",
            // "type": "image/gif",
            // "uid": 3,
            // "size": 1757080
        }
    },
})
const filePath = computed(()=>{
    return `http://kylebing.cn/${props.fileInfo.path}`
})

const emit = defineEmits(['refreshList'])

const modalEditFileName = ref(false) // 文件名修改
const newFileName = ref('') // 新文件名

function openFileInNewTab(){
    window.open(filePath.value, '_blank')
}
function deleteFile(){
    fileManagerApi
        .delete({
            fileId: props.fileInfo.id
        })
        .then(res => {
            console.log(res)
            popMessage('success', res.message)
            emit('refreshList')
        })
        .catch(err => {
            popMessage('danger', err.message)
        })
}
function modifyFileNameConfirm(){
    fileManagerApi
        .modifyFileName({
            fileId: props.fileInfo.id,
            description: newFileName.value
        })
        .then(res => {
            popMessage('success', res.message)
            emit('refreshList')
        })
        .catch(err => {
            popMessage('danger', err.message)
        })
}

</script>

<style scoped lang="scss">
@import "../../scss/plugin";
@import "./file-list-item";
</style>
