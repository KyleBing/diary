<template>
    <PageHeader title="端对端互传" subtitle="日记 ↔ Manager 互通，不经服务器流量">
        <TabIcon @click="goBack" icon="返回"/>
    </PageHeader>
    <MenuPanelContainer>
        <div class="xfer">
            <p class="tip">双方登录后，一方创建房间、另一方输入同一房间码即可（日记与 Manager 互通）。文件经 WebRTC 直连传输，不走本站带宽；跨公网可能因 NAT 失败，请尽量同一 Wi‑Fi。</p>

            <div class="panel">
                <div class="status">{{ statusDetail || status }}</div>
                <div class="actions">
                    <button class="btn btn-active" type="button" @click="createRoom">创建房间</button>
                    <input
                        class="code-input"
                        v-model="joinCode"
                        maxlength="6"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        placeholder="6 位数字"
                        @input="joinCode = String(joinCode || '').replace(/\D/g, '').slice(0, 6)"
                    />
                    <button class="btn" type="button" @click="joinRoom">加入</button>
                </div>
                <div v-if="room" class="room">
                    房间码 <strong>{{ room }}</strong>
                    <button class="btn btn-small" type="button" @click="copyRoom">复制</button>
                </div>
            </div>

            <div class="panel">
                <input type="file" @change="onPick"/>
                <button class="btn btn-active mt" type="button" :disabled="status !== 'ready' || !picked" @click="send">发送</button>
                <div v-if="progress" class="progress">{{ progress.name }} {{ progress.percent }}%</div>
            </div>

            <div class="panel" v-if="received.length">
                <div class="recv" v-for="(f,i) in received" :key="i">
                    <span>{{ f.name }}</span>
                    <button class="btn btn-small" type="button" @click="save(f)">保存</button>
                </div>
            </div>
        </div>
    </MenuPanelContainer>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/framework/pageHeader/PageHeader.vue'
import MenuPanelContainer from '@/framework/MenuPanelContainer.vue'
import TabIcon from '@/components/TabIcon.vue'
import { getAuthorization, popMessage } from '@/utility.ts'
import { PeerTransfer, type TransferProgress, type TransferStatus } from '@/utility/webrtcTransfer.ts'

const router = useRouter()
const auth = getAuthorization()
const transfer = new PeerTransfer()

const status = ref<TransferStatus>('idle')
const statusDetail = ref('')
const room = ref('')
const joinCode = ref('')
const picked = ref<File | null>(null)
const progress = ref<TransferProgress | null>(null)
const received = ref<{ name: string; mime: string; blob: Blob }[]>([])

function goBack() {
    router.push({ name: 'FileManager' })
}

function createRoom() {
    if (!auth?.token) return popMessage('danger', '未登录')
    transfer.connect(auth.token, auth.uid)
    transfer.createRoom()
}
function joinRoom() {
    if (!auth?.token) return popMessage('danger', '未登录')
    transfer.connect(auth.token, auth.uid)
    transfer.joinRoom(joinCode.value)
}
function onPick(e: Event) {
    picked.value = (e.target as HTMLInputElement).files?.[0] || null
}
function send() {
    if (picked.value) transfer.sendFile(picked.value)
}
function save(f: { name: string; blob: Blob }) {
    const a = document.createElement('a')
    const href = URL.createObjectURL(f.blob)
    a.href = href
    a.download = f.name
    a.click()
    URL.revokeObjectURL(href)
}
async function copyRoom() {
    try {
        await navigator.clipboard.writeText(room.value)
        popMessage('success', '已复制房间码')
    } catch {
        popMessage('danger', '复制失败')
    }
}

onMounted(() => {
    transfer.onStatus = (s, d) => {
        status.value = s
        statusDetail.value = d || ''
        if (s === 'error' && d) popMessage('warning', d)
    }
    transfer.onProgress = (p) => { progress.value = p }
    transfer.onRoom = (r) => { room.value = r }
    transfer.onFile = (f) => {
        received.value.unshift(f)
        popMessage('success', `收到 ${f.name}`)
    }
    if (auth?.token) transfer.connect(auth.token, auth.uid)
})
onBeforeUnmount(() => transfer.disconnect())
</script>

<style scoped lang="scss">
@use "../../scss/plugin" as *;
.xfer { padding: 12px; max-width: 640px; }
.tip { color: $text-subtitle; font-size: 13px; line-height: 1.5; margin-bottom: 12px; }
.panel {
    background: $bg-lighter;
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 12px;
}
.status { font-size: 13px; margin-bottom: 10px; color: $text-title; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.code-input {
    width: 120px;
    letter-spacing: 0.15em;
    padding: 6px 8px;
    font-variant-numeric: tabular-nums;
}
.room { margin-top: 10px; font-size: 15px; strong { letter-spacing: 0.12em; font-size: 20px; } }
.mt { margin-top: 10px; }
.progress { margin-top: 8px; font-size: 13px; }
.recv {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; border-bottom: 1px solid $color-border;
}
.btn-small { padding: 4px 10px; font-size: 12px; }
</style>
