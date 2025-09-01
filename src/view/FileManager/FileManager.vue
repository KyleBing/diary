<template>
    <PageHeader title="文件列表" subtitle="">
        <TabIcon @click="showModalUpload" icon="添加"/>
    </PageHeader>
    <MenuPanelContainer>
        <div v-if="isLoading" class="pt-8 pb-8">
            <Loading :loading="isLoading"/>
        </div>
        <div
            v-else
            class="file-list"
            v-if="fileListData.length > 0"
        >
            <FileListItem
                :fileInfo="file"
                v-for="file in fileListData"
                :key="file.id"
                @refresh-list="getFileList"
                @modifyFileName="showModalModifyFileName(fileId)"
            />
        </div>
    </MenuPanelContainer>

    <Modal v-if="modalUpload">
        <form class="modal-form-panel" method="post" id="formUpload" @submit.prevent="uploadFile">
            <div class="input-group">
                <label for="name" >文件名称</label>
                <input v-model.lazy="formUpload.name" type="text" name="name" id="name">
            </div>
            <div class="input-group">
                <label for="file">文件</label>
                <input onchange="handleFileInput" name="password" type="file" id="file">
                <FileSelector @fileChange="handleFileChange"/>
            </div>
            <button class="btn mt-8 btn-active" type="submit">上传</button>
            <button class="btn mt-2" @click="modalUpload = false" type="submit">取消</button>
        </form>
    </Modal>


</template>

<script lang="ts" setup>
import Loading from "@/components/Loading.vue"
import ClipboardJS from "clipboard"
import TabIcon from "@/components/TabIcon.vue"
import PageHeader from "@/framework/pageHeader/PageHeader.vue"
import fileManagerApi from "@/api/fileManagerApi.ts";
import FileListItem from "./FileListItem.vue";
import Modal from "@/components/Modal.vue";
import FileSelector from "@/components/FileSelector.vue";

import {popMessage, dateFormatter} from "@/utility.ts";
import {onMounted, onUnmounted, ref} from "vue";
import MenuPanelContainer from "@/framework/MenuPanelContainer.vue";

const isLoading = ref(false)
const fileListData = ref([])
const clipboard = ref(null) // clipboard obj
const pager = ref({
    pageSize: 300,
    pageNo: 1,
    total: 0
})

const modalUpload = ref(false) // 文件上传
const formUpload = ref({
    name: '',
    file: null
})

onMounted(() => {
    getFileList()
    // 绑定剪贴板操作方法
    clipboard.value = new ClipboardJS('.clipboard', {
        text: trigger => {
            return trigger.getAttribute('data-clipboard')
        },
    })
    clipboard.value.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
        popMessage('success', '文件地址已复制到剪贴板', null)
    })
})



onUnmounted(()=>{
    clipboard.value && clipboard.value.destroy()
})


function handleFileChange(file){
    console.log(file)
    formUpload.value.file = file
    if (!formUpload.value.name){
        formUpload.value.name = file.name
    }
}
function showModalUpload(){
    modalUpload.value = true
}
// 新增
function uploadFile() {
    if (!formUpload.value.name){
        popMessage('warning', '文件名未填写')
        return
    }
    if (!formUpload.value.file){
        popMessage('warning', '未选择任何文件')
        return
    }
    let requestData = new FormData()
    requestData.append('file', formUpload.value.file)
    requestData.append('note', formUpload.value.name)
    fileManagerApi
        .upload(requestData)
        .then(() => {
            popMessage('success', '上传成功')
            getFileList()
            formUpload.value = {
                file: null,
                name: ''
            }
            modalUpload.value = false
        })
        .catch(err => {
            popMessage('danger', err.message)
        })
}
function getFileList(){
    isLoading.value = true // 请求的时候显示loading
    let params = {
        pageNo: pager.value.pageNo,
        pageSize: pager.value.pageSize
    }
    fileManagerApi
        .list(params)
        .then(res => {
            fileListData.value = res.data.map(item => {
                item.date_time = dateFormatter(new Date(item.date_create))
                return item
            })
            isLoading.value = false
        })
        .catch(() => {
            isLoading.value = false
        })
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";

.file-list{
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-flow: row wrap;
    align-content: flex-start;
}

// MOBILE
@media (max-width: $grid-separate-width-sm) {
    .file-list{
        flex-flow: column nowrap;
    }
}

// DARK
@media (prefers-color-scheme: dark) {
    .file-list{
    }
}

</style>
