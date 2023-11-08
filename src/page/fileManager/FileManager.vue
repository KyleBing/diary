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
            />
        </div>
    </div>
    <Modal v-if="modalUpload">
        <form method="post" id="regForm" @submit.prevent="uploadFile">
            <div class="input-group">
                <label for="name" >文件名称</label>
                <input v-model.lazy="formUpload.name" type="text" name="name" id="name">
            </div>
            <div class="input-group">
                <label for="file">文件</label>
                <input onchange="handleFileInput" name="password" type="file" id="file">
                <FilePreview
                    file-data=""
                    file-type=""/>
            </div>
            <button class="btn mt-8 btn-active" type="submit">上传</button>
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
import diaryApi from "../../api/diaryApi"
import fileManagerApi from "../../api/fileManagerApi";
import FileListItem from "./FileListItem.vue";
import Modal from "../../components/Modal.vue";
import FilePreview from "../../components/FilePreview.vue";

export default {
    name: "FileManager",
    components: {FilePreview, Modal, FileListItem, PageHeader, TabIcon, Loading},
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

            modalUpload: false, // modal

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
        handleFileInput(event){
            if (event.target.files.length > 0){
                this.currentFile = event.target.files[0]
                /*                if (!/image\/.*!/.test(this.currentFile.type)){
                                    event.target.value = '' // 清空 Input 内容
                                    this.$message.warning('非图片文件')
                                    this.currentFile = null
                                    return
                                }*/
                /*                if (this.currentFile.size > 1024 * 1024 * 10){
                                    event.target.value = '' // 清空 Input 内容
                                    this.$message.warning('文件大小应小于10m')
                                    this.currentFile = null
                                    return
                                }*/
            }
        },

        showModalUpload(){
            this.modalUpload = true
        },
        // 新增
        uploadFile() {
            let requestData = new FormData()
            requestData.append('file', this.currentFile)
            requestData.append('note', this.fileDescription)
            fileManagerApi
                .upload(requestData)
                .then(res => {
                    this.$notify({
                        title: res.message,
                        position: 'top-right',
                        type: 'success',
                        onClose() {
                        }
                    })
                    this.currentFile = null
                    this.fileDescription = ''
                    this.getFileList()
                })
                .catch(err => {

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
    padding: 30px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-flow: row wrap;
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
