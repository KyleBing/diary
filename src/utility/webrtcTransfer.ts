/** Auth download helper for file-manager (Diary-Token / Diary-Uid). */

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
