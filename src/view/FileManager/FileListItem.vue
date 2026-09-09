<template>
    <div class="file-list-item">
        <div class="id">{{props.fileInfo.id}}</div>

        <div class="file-meta">
            <TabIcon @click="downloadFile" size="small" icon="黑色-内容显示" />
            <TabIcon @click="modalEditFileName = true" size="small" icon="黑色-编辑"/>
            <TabIcon @click="deleteFile" size="small" icon="黑色-删除"/>
            <TabIcon size="small" icon="黑色-分享" class="clipboard" :data-clipboard="shareHint" />
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
import TabIcon from "@/components/TabIcon.vue";
import fileManagerApi from "@/api/fileManagerApi";
import Modal from "@/components/Modal.vue";
import {popMessage, getAuthorization} from "@/utility.ts";
import {computed, ref} from "vue";
import {EntityFile} from "@/view/FileManager/File.ts";
import {downloadWithAuth} from "@/utility/webrtcTransfer.ts";

const props = defineProps<{
    fileInfo: EntityFile
}>()

const shareHint = computed(() => {
    return `文件：${props.fileInfo.name_original}（请在日记/管理端登录后下载）`
})

const emit = defineEmits(['refreshList'])
const modalEditFileName = ref(false)
const newFileName = ref('')

async function downloadFile() {
    const auth = getAuthorization()
    if (!auth?.token || !auth?.uid) {
        popMessage('danger', '未登录')
        return
    }
    const url = props.fileInfo.download_url
        || `/portal/file-manager/download?fileId=${props.fileInfo.id}`
    try {
        await downloadWithAuth(
            url,
            auth.token,
            auth.uid,
            props.fileInfo.name_original || 'file',
        )
    } catch {
        popMessage('danger', '下载失败')
    }
}

function deleteFile(){
    fileManagerApi
        .delete({ fileId: props.fileInfo.id })
        .then(res => {
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
            modalEditFileName.value = false
            emit('refreshList')
        })
        .catch(err => {
            popMessage('danger', err.message)
        })
}
</script>

<style scoped lang="scss">
@use "./file-list-item" as *;
</style>
