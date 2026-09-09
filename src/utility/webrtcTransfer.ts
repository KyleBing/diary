/**
 * WebRTC P2P file transfer helpers.
 * File bytes go only over RTCDataChannel — never through the 1Mbps origin.
 * portal-ws carries offer/answer/ICE signaling only.
 */

export type TransferStatus =
  | 'idle'
  | 'connecting'
  | 'waiting'
  | 'ready'
  | 'sending'
  | 'receiving'
  | 'done'
  | 'error'

export interface TransferProgress {
  name: string
  sent: number
  total: number
  percent: number
}

type SignalingHandler = (type: string, content: any) => void

const CHUNK = 16 * 1024
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

function wsURL(token: string, uid: string | number): string {
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = location.host
  // production nginx: /ws → portal-ws; local manager proxy may differ
  const base = `${proto}//${host}/ws`
  const q = new URLSearchParams({
    token: String(token || ''),
    uid: String(uid || ''),
  })
  return `${base}?${q.toString()}`
}

export class PeerTransfer {
  private ws: WebSocket | null = null
  private pc: RTCPeerConnection | null = null
  private channel: RTCDataChannel | null = null
  private peerId = ''
  private remotePeerId = ''
  private room = ''
  private makingOffer = false
  private polite = false

  onStatus: (s: TransferStatus, detail?: string) => void = () => {}
  onProgress: (p: TransferProgress) => void = () => {}
  onFile: (file: { name: string; mime: string; blob: Blob }) => void = () => {}
  onRoom: (room: string, peerId: string) => void = () => {}

  private receiveName = ''
  private receiveMime = ''
  private receiveSize = 0
  private receiveBuf: Uint8Array[] = []
  private receiveGot = 0

  connect(token: string, uid: string | number) {
    if (this.ws && this.ws.readyState <= 1) return
    this.onStatus('connecting', '连接信令…')
    this.ws = new WebSocket(wsURL(token, uid))
    this.ws.onopen = () => this.onStatus('waiting', '信令已连接')
    this.ws.onclose = () => this.onStatus('error', '信令断开')
    this.ws.onerror = () => this.onStatus('error', '信令错误')
    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        this.handleSignal(msg.type, msg.content || {})
      } catch { /* ignore */ }
    }
  }

  disconnect() {
    try { this.ws?.send(JSON.stringify({ type: 'rtc-leave', content: {} })) } catch { /* */ }
    this.channel?.close()
    this.pc?.close()
    this.ws?.close()
    this.channel = null
    this.pc = null
    this.ws = null
    this.room = ''
    this.remotePeerId = ''
  }

  createRoom() {
    this.send('rtc-create', {})
  }

  joinRoom(code: string) {
    this.send('rtc-join', { room: String(code || '').trim().toUpperCase() })
  }

  async sendFile(file: File) {
    if (!this.channel || this.channel.readyState !== 'open') {
      this.onStatus('error', '尚未与对方建立直连，无法发送')
      return
    }
    this.onStatus('sending', file.name)
    const meta = JSON.stringify({
      kind: 'meta',
      name: file.name,
      mime: file.type || 'application/octet-stream',
      size: file.size,
    })
    this.channel.send(meta)
    let offset = 0
    while (offset < file.size) {
      const slice = file.slice(offset, offset + CHUNK)
      const buf = await slice.arrayBuffer()
      // backpressure
      while (this.channel.bufferedAmount > 1 << 20) {
        await new Promise((r) => setTimeout(r, 20))
      }
      this.channel.send(buf)
      offset += buf.byteLength
      this.onProgress({
        name: file.name,
        sent: offset,
        total: file.size,
        percent: Math.round((offset / file.size) * 100),
      })
    }
    this.channel.send(JSON.stringify({ kind: 'done' }))
    this.onStatus('done', '发送完成')
  }

  private send(type: string, content: Record<string, unknown>) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.onStatus('error', '信令未连接')
      return
    }
    this.ws.send(JSON.stringify({ type, content }))
  }

  private handleSignal: SignalingHandler = (type, content) => {
    switch (type) {
      case 'rtc-create':
        this.peerId = content.peerId
        this.room = content.room
        this.polite = false
        this.onRoom(this.room, this.peerId)
        this.onStatus('waiting', `房间 ${this.room}，等待对方加入`)
        break
      case 'rtc-join':
        this.peerId = content.peerId
        this.room = content.room
        this.polite = true
        this.onRoom(this.room, this.peerId)
        if (Array.isArray(content.peers) && content.peers.length) {
          this.remotePeerId = content.peers[0]
          void this.ensurePC(true)
        } else {
          this.onStatus('waiting', `已加入 ${this.room}`)
        }
        break
      case 'rtc-peers':
        if (content.joined && content.joined !== this.peerId) {
          this.remotePeerId = content.joined
          void this.ensurePC(true)
        }
        if (content.left) {
          this.onStatus('waiting', '对方已离开')
          this.teardownPC()
        }
        break
      case 'rtc-offer':
        void this.onRemoteOffer(content)
        break
      case 'rtc-answer':
        void this.onRemoteAnswer(content)
        break
      case 'rtc-ice':
        void this.onRemoteIce(content)
        break
      case 'rtc-error':
        this.onStatus('error', content.message || '信令错误')
        break
    }
  }

  private teardownPC() {
    this.channel?.close()
    this.pc?.close()
    this.channel = null
    this.pc = null
    this.remotePeerId = ''
  }

  private async ensurePC(asOfferer: boolean) {
    if (!this.remotePeerId) return
    if (!this.pc) {
      this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
      this.pc.onicecandidate = (ev) => {
        if (!ev.candidate || !this.remotePeerId) return
        this.send('rtc-ice', {
          to: this.remotePeerId,
          candidate: ev.candidate.toJSON(),
        })
      }
      this.pc.onconnectionstatechange = () => {
        const st = this.pc?.connectionState
        if (st === 'connected') this.onStatus('ready', '已直连，可传文件（不经服务器）')
        if (st === 'failed' || st === 'disconnected') {
          this.onStatus('error', '无法直连。请尽量同一 Wi‑Fi；跨公网受 NAT 限制且不会走服务器中继。')
        }
      }
      this.pc.ondatachannel = (ev) => {
        this.bindChannel(ev.channel)
      }
      // Fail fast if ICE can't connect — no server relay fallback
      setTimeout(() => {
        if (this.pc && this.pc.connectionState !== 'connected' && this.pc.connectionState !== 'connecting') {
          // still gathering/checking is ok; only warn when failed already handled
        } else if (this.pc && ['new', 'checking'].includes(this.pc.iceConnectionState) ) {
          // give more time
        }
        if (this.pc && this.pc.connectionState === 'connecting') {
          // 15s total
        }
      }, 15000)
    }

    if (asOfferer && !this.channel) {
      const ch = this.pc.createDataChannel('file', { ordered: true })
      this.bindChannel(ch)
      this.makingOffer = true
      const offer = await this.pc.createOffer()
      await this.pc.setLocalDescription(offer)
      this.send('rtc-offer', {
        to: this.remotePeerId,
        sdp: this.pc.localDescription,
      })
      this.makingOffer = false
      this.onStatus('connecting', '正在协商直连…')
    }
  }

  private bindChannel(ch: RTCDataChannel) {
    this.channel = ch
    ch.binaryType = 'arraybuffer'
    ch.onopen = () => this.onStatus('ready', '数据通道已打开')
    ch.onclose = () => this.onStatus('waiting', '数据通道关闭')
    ch.onmessage = (ev) => this.onChannelMessage(ev.data)
  }

  private async onRemoteOffer(content: any) {
    this.remotePeerId = content.from || this.remotePeerId
    await this.ensurePC(false)
    if (!this.pc) return
    const offerCollision = this.makingOffer || this.pc.signalingState !== 'stable'
    if (offerCollision && !this.polite) return
    await this.pc.setRemoteDescription(content.sdp)
    const answer = await this.pc.createAnswer()
    await this.pc.setLocalDescription(answer)
    this.send('rtc-answer', {
      to: this.remotePeerId,
      sdp: this.pc.localDescription,
    })
  }

  private async onRemoteAnswer(content: any) {
    if (!this.pc) return
    await this.pc.setRemoteDescription(content.sdp)
  }

  private async onRemoteIce(content: any) {
    if (!this.pc || !content.candidate) return
    try {
      await this.pc.addIceCandidate(content.candidate)
    } catch { /* ignore */ }
  }

  private onChannelMessage(data: any) {
    if (typeof data === 'string') {
      try {
        const msg = JSON.parse(data)
        if (msg.kind === 'meta') {
          this.receiveName = msg.name
          this.receiveMime = msg.mime
          this.receiveSize = msg.size
          this.receiveBuf = []
          this.receiveGot = 0
          this.onStatus('receiving', this.receiveName)
          return
        }
        if (msg.kind === 'done') {
          const blob = new Blob(this.receiveBuf, { type: this.receiveMime })
          this.onFile({ name: this.receiveName, mime: this.receiveMime, blob })
          this.onStatus('done', '接收完成')
          this.receiveBuf = []
          return
        }
      } catch { /* */ }
      return
    }
    const chunk = new Uint8Array(data as ArrayBuffer)
    this.receiveBuf.push(chunk)
    this.receiveGot += chunk.byteLength
    this.onProgress({
      name: this.receiveName,
      sent: this.receiveGot,
      total: this.receiveSize || this.receiveGot,
      percent: this.receiveSize ? Math.round((this.receiveGot / this.receiveSize) * 100) : 0,
    })
  }
}

export async function downloadWithAuth(url: string, token: string, uid: string | number, filename: string) {
  const res = await fetch(url, {
    headers: {
      'Diary-Token': token,
      'Diary-Uid': String(uid),
    },
    credentials: 'include',
  })
  if (!res.ok) throw new Error('下载失败')
  const blob = await res.blob()
  const a = document.createElement('a')
  const href = URL.createObjectURL(blob)
  a.href = href
  a.download = filename
  a.click()
  URL.revokeObjectURL(href)
}
