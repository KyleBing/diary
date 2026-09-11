/** Auth download helper for file-manager (Bearer JWT). */
import { updateAuthorizationToken } from '@/utility'

export async function downloadWithAuth(url: string, token: string, filename: string) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  })
  const renewed = res.headers.get('X-Access-Token')
  if (renewed) {
    updateAuthorizationToken(renewed)
  }
  if (!res.ok) throw new Error('下载失败')
  const blob = await res.blob()
  const a = document.createElement('a')
  const href = URL.createObjectURL(blob)
  a.href = href
  a.download = filename
  a.click()
  URL.revokeObjectURL(href)
}
