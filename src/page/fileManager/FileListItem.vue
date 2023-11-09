<template>
    <div class="file-list-item">
        <div class="id">{{fileInfo.id}}</div>

        <div class="file-meta">
            <tab-icon @click="openFileInNewTab" size="small" alt="黑色-内容显示" />
            <tab-icon @click="modalEditFileName = true" size="small" alt="黑色-编辑"/>
            <tab-icon @click="deleteFile" size="small" alt="黑色-删除"/>
            <tab-icon size="small" alt="黑色-分享" class="clipboard" :data-clipboard="filePath" />
        </div>

        <div class="file-info">
            <div class="name">{{fileInfo.description}}</div>
            <div class="size">{{(fileInfo.size/1024).toFixed(0)}} kb</div>
            <div class="description">{{fileInfo.name_original}}</div>
            <div class="date">{{fileInfo.date_time}}</div>
            <div :class="['file-type',
                {image: fileInfo.type.indexOf('image') > -1},
            ]">{{fileInfo.type}}</div>
        </div>
        <Modal v-if="modalEditFileName">
            <form method="post" id="formModifyFileName" @submit.prevent="modifyFileNameConfirm">
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

<script>
import svgIcons from "../../assets/img/SvgIcons"
import ClipboardJS from "clipboard";
import utility from "../../utility";
import TabIcon from "../../components/TabIcon.vue";
import fileManagerApi from "@/api/fileManagerApi";
import Modal from "../../components/Modal.vue";

export default {
    name: "FileListItem",
    components: {Modal, TabIcon},
    props: {
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
    },
    emits: ['refreshList'],
    computed: {
        filePath(){
            return `https://kylebing.cn/${this.fileInfo.path}`
        }
    },
    data(){
        return {
            modalEditFileName: false, // 文件名修改
            newFileName: '', // 新文件名
        }
    },
    methods: {
        openFileInNewTab(){
            window.open(this.filePath, '_blank')
        },
        deleteFile(){
            fileManagerApi
                .delete({
                    fileId: this.fileInfo.id
                })
                .then(res => {
                    console.log(res)
                    utility.popMessage('success', res.message)
                    this.$emit('refreshList')
                })
                .catch(err => {
                    utility.popMessage('danger', err.message)
                })
        },
        modifyFileNameConfirm(){
            fileManagerApi
                .modifyFileName({
                    fileId: this.fileInfo.id,
                    description: this.newFileName
                })
                .then(res => {
                    utility.popMessage('success', res.message)
                    this.$emit('refreshList')
                })
                .catch(err => {
                    utility.popMessage('danger', err.message)
                })
        },


    },

    mounted() {

    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
@import "./file-list-item";
</style>
