<template>
    <page-header title="文件列表" subtitle="">
        <tab-icon @click="showModalUpload" alt="添加"/>
    </page-header>
    <div v-if="isLoading" class="pt-8 pb-8">
        <loading :loading="isLoading"/>
    </div>
    <div v-else>
        <div class="file-list"
             v-if="fileListData.length > 0"
             :style="'height:' + insets.heightPanel + 'px'"
        >
            <FileListItem
                :fileInfo="file"
                v-for="file in fileListData"
                :key="file.id"
                @refresh-list="getFileList"
                @modifyFileName="showModalModifyFileName(fileId)"
            />
        </div>
    </div>
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

<script>
import {mapState, mapMutations} from 'vuex'
import Loading from "../../components/Loading"
import utility from "../../utility"
import ClipboardJS from "clipboard"
import TabIcon from "../../components/TabIcon"
import PageHeader from "../../framework/pageHeader/PageHeader"
import fileManagerApi from "../../api/fileManagerApi";
import FileListItem from "./FileListItem.vue";
import Modal from "../../components/Modal.vue";
import FileSelector from "../../components/FileSelector.vue";

export default {
    name: "FileManager",
    components: {FileSelector, Modal, FileListItem, PageHeader, TabIcon, Loading},
    data() {
        return {
            isLoading: false,
            fileListData: [],
            clipboard: null, // clipboard obj

            pager: {
                pageSize: 300,
                pageNo: 1,
                total: 0
            },

            modalUpload: false, // 文件上传

            formUpload: {
                name: '',
                file: null
            }
        }
    },
    mounted() {
        this.getFileList()
        // 绑定剪贴板操作方法
        this.clipboard = new ClipboardJS('.clipboard', {
            text: trigger => {
                return trigger.getAttribute('data-clipboard')
            },
        })
        this.clipboard.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
            utility.popMessage('success', '文件地址已复制到剪贴板', null)
        })

    },
    beforeUnmount() {
        this.clipboard && this.clipboard.destroy()
    },

    computed: {
        ...mapState({
            years: 'statisticsYear',
        }),
        ...mapState(['insets', 'categoryAll'])
    },
    methods: {

        handleFileChange(file){
            console.log(file)
            this.formUpload.file = file
            if (!this.formUpload.name){
                this.formUpload.name = file.name
            }
        },
        showModalUpload(){
            this.modalUpload = true
        },
        // 新增
        uploadFile() {
            if (!this.formUpload.name){
                utility.popMessage('warning', '文件名未填写')
                return
            }
            if (!this.formUpload.file){
                utility.popMessage('warning', '未选择任何文件')
                return
            }
            let requestData = new FormData()
            requestData.append('file', this.formUpload.file)
            requestData.append('note', this.formUpload.name)
            fileManagerApi
                .upload(requestData)
                .then(res => {
                    utility.popMessage('success', '上传成功')
                    this.getFileList()
                    this.formUpload = {
                        file: null,
                        name: ''
                    }
                    this.modalUpload = false
                })
                .catch(err => {
                    utility.popMessage('danger', err.message)
                })
        },
        getFileList(){
            this.isLoading = true // 请求的时候显示loading
            let params = {
                pageNo: this.pager.pageNo,
                pageSize: this.pager.pageSize
            }
            fileManagerApi
                .list(params)
                .then(res => {
                    this.fileListData = res.data.map(item => {
                        item.date_time = utility.dateFormatter(new Date(item.date_create))
                        return item
                    })
                    this.isLoading = false
                })
                .catch(err => {
                    this.isLoading = false
                })
        },
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";

.file-list{
    width: 100%;
    padding: 30px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-flow: row wrap;
    align-content: flex-start;
    background-color: $bg-menu;
}

// MOBILE
@media (max-width: $grid-separate-width-sm) {
    .file-list{
        padding: 20px;
        flex-flow: column nowrap;
    }
}

// DARK
@media (prefers-color-scheme: dark) {
    .file-list{
        background-color: $dark-bg;
    }
}

</style>
