/** 站点 SEO：统一 title / description / OG，供路由与页面调用 */

export const SITE_ORIGIN = 'https://kylebing.cn'
export const SITE_BASE = `${SITE_ORIGIN}/diary/`
export const SITE_NAME = '标题日记'
export const SITE_NAME_SHORT = '日记'
export const DEFAULT_DESCRIPTION =
    '标题日记：用一句话概括你的一天。纯文本 Web 日记，支持日历、账单、统计与公开分享，免费使用。'
export const DEFAULT_KEYWORDS =
    '标题日记,日记,日记应用,web日记,纯文本日记,人生日志,headline diary,diary,账单日记'
export const DEFAULT_OG_IMAGE = `${SITE_BASE}appicon-apple.png`

export type SeoPayload = {
    title?: string
    description?: string
    keywords?: string
    /** 相对站点路径，如 login、privacy；空则站点根 */
    path?: string
    image?: string
    /** 是否允许索引，默认 true；登录后业务页建议 false */
    index?: boolean
    type?: 'website' | 'article'
}

function ensureMeta(attr: 'name' | 'property', key: string, content: string) {
    const selector = `meta[${attr}="${key}"]`
    let el = document.head.querySelector(selector) as HTMLMetaElement | null
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
    }
    el.setAttribute('content', content)
}

function ensureLink(rel: string, href: string) {
    let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
    if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
    }
    el.setAttribute('href', href)
}

function pageUrl(path?: string): string {
    if (!path || path === '/' || path === '') {
        return SITE_BASE
    }
    const clean = path.replace(/^\//, '')
    return `${SITE_BASE}#/${clean}`
}

/** 应用 SEO 元信息到 document */
export function applySeo(payload: SeoPayload = {}) {
    const title = payload.title
        ? (payload.title.includes(SITE_NAME_SHORT) || payload.title.includes(SITE_NAME)
            ? payload.title
            : `${SITE_NAME_SHORT} - ${payload.title}`)
        : `${SITE_NAME} - 一句话概括你的一天`
    const description = payload.description || DEFAULT_DESCRIPTION
    const keywords = payload.keywords || DEFAULT_KEYWORDS
    const image = payload.image || DEFAULT_OG_IMAGE
    const url = pageUrl(payload.path)
    const index = payload.index !== false
    const type = payload.type || 'website'

    document.title = title

    ensureMeta('name', 'description', description)
    ensureMeta('name', 'keywords', keywords)
    ensureMeta('name', 'robots', index ? 'index,follow' : 'noindex,nofollow')
    ensureMeta('name', 'author', 'KyleBing')

    ensureMeta('property', 'og:site_name', SITE_NAME)
    ensureMeta('property', 'og:locale', 'zh_CN')
    ensureMeta('property', 'og:type', type)
    ensureMeta('property', 'og:title', title)
    ensureMeta('property', 'og:description', description)
    ensureMeta('property', 'og:url', url)
    ensureMeta('property', 'og:image', image)

    ensureMeta('name', 'twitter:card', 'summary')
    ensureMeta('name', 'twitter:title', title)
    ensureMeta('name', 'twitter:description', description)
    ensureMeta('name', 'twitter:image', image)

    ensureLink('canonical', url)
}

export type RouteSeoMeta = {
    title?: string
    description?: string
    path?: string
    index?: boolean
}
