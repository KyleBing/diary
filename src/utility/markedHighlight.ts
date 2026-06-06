import {marked, setOptions} from "marked"
import hljs from "highlight.js/lib/core"

import bash from "highlight.js/lib/languages/bash"
import c from "highlight.js/lib/languages/c"
import cpp from "highlight.js/lib/languages/cpp"
import csharp from "highlight.js/lib/languages/csharp"
import css from "highlight.js/lib/languages/css"
import go from "highlight.js/lib/languages/go"
import java from "highlight.js/lib/languages/java"
import javascript from "highlight.js/lib/languages/javascript"
import json from "highlight.js/lib/languages/json"
import kotlin from "highlight.js/lib/languages/kotlin"
import markdown from "highlight.js/lib/languages/markdown"
import php from "highlight.js/lib/languages/php"
import python from "highlight.js/lib/languages/python"
import rust from "highlight.js/lib/languages/rust"
import sql from "highlight.js/lib/languages/sql"
import swift from "highlight.js/lib/languages/swift"
import typescript from "highlight.js/lib/languages/typescript"
import xml from "highlight.js/lib/languages/xml"
import yaml from "highlight.js/lib/languages/yaml"

hljs.registerLanguage("bash", bash)
hljs.registerLanguage("c", c)
hljs.registerLanguage("cpp", cpp)
hljs.registerLanguage("csharp", csharp)
hljs.registerLanguage("css", css)
hljs.registerLanguage("go", go)
hljs.registerLanguage("html", xml)
hljs.registerLanguage("java", java)
hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("json", json)
hljs.registerLanguage("kotlin", kotlin)
hljs.registerLanguage("markdown", markdown)
hljs.registerLanguage("php", php)
hljs.registerLanguage("python", python)
hljs.registerLanguage("rust", rust)
hljs.registerLanguage("sql", sql)
hljs.registerLanguage("swift", swift)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("xml", xml)
hljs.registerLanguage("yaml", yaml)

const LANG_ALIASES: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    sh: "bash",
    shell: "bash",
    yml: "yaml",
    cs: "csharp",
    "c++": "cpp",
    htm: "html",
}

const LANG_COMMENT_PATTERN = /^\s*(?:\/\/|#|--)\s*lang\s*:\s*(\S+)\s*$/i

const EXT_TO_LANG: Record<string, string> = {
    bash: "bash",
    c: "c",
    cc: "cpp",
    cpp: "cpp",
    cs: "csharp",
    css: "css",
    cts: "typescript",
    cxx: "cpp",
    go: "go",
    h: "c",
    hh: "cpp",
    hpp: "cpp",
    htm: "html",
    html: "html",
    java: "java",
    js: "javascript",
    json: "json",
    jsx: "javascript",
    kt: "kotlin",
    kts: "kotlin",
    less: "css",
    md: "markdown",
    mjs: "javascript",
    mts: "typescript",
    php: "php",
    py: "python",
    rs: "rust",
    scss: "css",
    sh: "bash",
    sql: "sql",
    svg: "xml",
    swift: "swift",
    ts: "typescript",
    tsx: "typescript",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    zsh: "bash",
}

function normalizeLang(lang: string): string {
    const normalized = lang.trim().toLowerCase()
    return LANG_ALIASES[normalized] ?? normalized
}

export function extractLangFromTitle(title: string | undefined | null): string | null {
    const trimmed = title?.trim() ?? ""
    if (!trimmed) {
        return null
    }
    const lastDot = trimmed.lastIndexOf(".")
    if (lastDot <= 0 || lastDot === trimmed.length - 1) {
        return null
    }
    const ext = trimmed.slice(lastDot + 1).toLowerCase()
    if (!/^[a-z0-9+]+$/.test(ext)) {
        return null
    }
    const lang = EXT_TO_LANG[ext] ?? normalizeLang(ext)
    return hljs.getLanguage(lang) ? lang : null
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}

function highlightCode(code: string, lang: string): string {
    const language = lang?.trim()
    if (language && hljs.getLanguage(language)) {
        try {
            return hljs.highlight(code, {language}).value
        } catch {
            // fall through to auto-detect
        }
    }
    return hljs.highlightAuto(code).value
}

function highlightCodeExplicit(code: string, lang: string): string | null {
    const language = lang?.trim()
    if (!language || !hljs.getLanguage(language)) {
        return null
    }
    try {
        return hljs.highlight(code, {language}).value
    } catch {
        return null
    }
}

function extractCodeLangCommentAndBody(content: string): { lang: string | null, body: string } {
    const lines = content.split("\n")
    const firstLine = lines[0] ?? ""
    const match = firstLine.match(LANG_COMMENT_PATTERN)
    if (!match) {
        return {lang: null, body: content}
    }
    return {
        lang: normalizeLang(match[1]),
        body: lines.slice(1).join("\n"),
    }
}

export function resolveCodeLang(content: string, title?: string | null): { lang: string | null, body: string } {
    const fromComment = extractCodeLangCommentAndBody(content)
    if (fromComment.lang) {
        return fromComment
    }
    const fromTitle = extractLangFromTitle(title)
    if (fromTitle) {
        return {lang: fromTitle, body: content}
    }
    return {lang: null, body: content}
}

function toSafeLangClass(lang: string | null): string {
    if (!lang) {
        return "hljs"
    }
    const safeLang = lang.replace(/[^a-z0-9_-]/gi, "")
    return safeLang ? `hljs language-${safeLang}` : "hljs"
}

export function renderCodeCategoryHtml(content: string, hideContent = false, title = ""): string {
    const {lang, body} = resolveCodeLang(content, title)
    const displayBody = hideContent ? body.replace(/[^，。 \n]/g, "*") : body
    if (!lang) {
        return `<pre class="code">${escapeHtml(displayBody)}</pre>`
    }
    const highlighted = highlightCodeExplicit(displayBody, lang)
    if (!highlighted) {
        return `<pre class="code">${escapeHtml(displayBody)}</pre>`
    }
    return `<pre class="code"><code class="${toSafeLangClass(lang)}">${highlighted}</code></pre>`
}

export function buildDiaryListContentHtml(content: string, category: string, title = ""): string {
    if (category === "code") {
        return renderCodeCategoryHtml(content, false, title)
    }
    return content.replace(/\n/g, "<br/>")
}

export function buildDiaryContentHtml(content: string, category: string, hideContent = false, title = ""): string {
    if (category === "code") {
        return renderCodeCategoryHtml(content, hideContent, title)
    }
    const isInCodeMode = /\[ ?code ?]/i.test(content)
    if (isInCodeMode) {
        return `<pre class="code">${hideContent ? content.replace(/[^，。 \n]/g, "*") : content}</pre>`
    }
    return content
        .split("\n")
        .map(item => (item === "" ? "<br/>" : `${hideContent ? item.replace(/[^，。 \n]/g, "*") : item}<br/>`))
        .join("")
}

setOptions({
    highlight: highlightCode,
    langPrefix: "hljs language-",
})

export function parseMarkdown(content: string | undefined | null): string {
    if (!content) {
        return ""
    }
    return marked.parse(content)
}
