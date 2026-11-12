# SEO 原理说明（结合「标题日记」）

本文解释搜索引擎优化（SEO）在做什么、怎么工作，以及它和 diary-vue（hash 路由 SPA）的关系。读完应能判断：哪些改动能被搜索引擎用上，哪些只对用户/浏览器有用。

---

## 1. SEO 到底优化什么？

SEO（Search Engine Optimization）的目标是：让目标用户在搜索引擎里搜相关词时，**更容易发现、点击、进入你的页面**。

它不是「骗算法」，而是帮搜索引擎回答三个问题：

| 问题 | 含义 | 典型手段 |
|------|------|----------|
| 发现 | 这个 URL 存在吗？ | sitemap、外链、站内链接 |
| 理解 | 页面讲什么？给谁看？ | title、description、正文、结构化数据 |
| 排序 | 相对同类结果值不值得排前面？ | 内容质量、相关性、体验、权威度 |

SEO 通常分成三层：

1. **技术 SEO**：爬虫能否抓到、渲染、索引（HTML 是否可读、状态码、sitemap、robots、速度、移动适配）
2. **内容 SEO**：标题/正文/关键词与用户意图是否匹配
3. **权威与信任**：外链、品牌提及、站点历史、隐私/联系方式是否清晰

对「标题日记」这种偏工具型产品，现实目标往往是：

- 搜「标题日记」「日记 web」「kylebing 日记」能找到官网
- 登录/隐私/分享等公开页有正确摘要
- 微信/社交媒体分享时有像样的标题和封面（偏 OG，不完全等于搜索 SEO）

---

## 2. 搜索引擎怎么工作？（核心流水线）

可以把搜索引擎想成流水线，而不是魔法：

```
发现 URL → 抓取 HTML →（可能）渲染 JS → 解析与理解 → 建索引 → 排序 → 展示摘要
```

### 2.1 发现（Discovery）

引擎如何知道有这个页面？

- 别人网站链到你（外链）
- 你站内互相链接
- `sitemap.xml` 主动申报
- 用户提交到 Search Console / 站长平台
- 历史已收录 URL 的再访问

没有被发现，后面都谈不上。

### 2.2 抓取（Crawling）

爬虫请求 URL，拿回响应：

- 理想：`200` + 可读 HTML
- 常见坑：`404`/`500`、无限重定向、要登录才看得到、纯空壳 SPA

`robots.txt` 可以告诉爬虫「别抓哪些路径」。注意：

- 爬虫默认找的是**域名根**的 `/robots.txt`（例如 `https://kylebing.cn/robots.txt`）
- 子路径里的 `/diary/robots.txt` 有帮助，但不如根目录那份权威
- `Disallow` 是礼貌约定，不是安全机制；敏感内容要用鉴权，不能靠 robots

### 2.3 渲染（Rendering）

传统爬虫主要看**首屏返回的 HTML**。  
现代 Google 会执行一部分 JavaScript（像简化版浏览器），但：

- 有预算、有延迟、不稳定
- 百度等对复杂 SPA 的 JS 渲染 historically 更弱
- 微信、钉钉、部分社交爬虫**几乎不跑 JS**，只读原始 HTML 里的 meta

所以：

> **写在 `index.html` 里的 title / description / OG，比路由切换后再用 JS 改 meta，对爬虫更可靠。**

diary-vue 里我们做了两套：

- 静态：`index.html` 默认 meta + JSON-LD（给首访爬虫/分享器）
- 动态：`applySeo()` 按路由改 title/OG（给已执行 JS 的环境、浏览器标签页）

### 2.4 索引（Indexing）

引擎决定「要不要把这页放进可被搜索的库」：

- 内容是否重复、过薄、纯模板
- 是否 `noindex`
- 是否软 404（页面说「不存在」但 HTTP 仍是 200）
- 是否值得占索引配额

公开页（登录、隐私、注册）适合索引；登录后的列表/编辑/账单应 `noindex`，避免把私人壳页面推进搜索结果。

### 2.5 排序（Ranking）

用户搜一个词时，从索引里挑相关页并排序。常见信号（简化）：

- **相关性**：标题、正文、锚文本是否对得上查询意图
- **质量**：是否解决用户问题，是否原创、完整
- **体验**：移动端可用、加载速度、HTTPS、稳定
- **权威**：外链、品牌搜索、站点持续运营

没有「填满 keywords 就排第一」这种事。keywords meta 对 Google 基本无效，对部分国内引擎可能仍有弱参考；真正重要的是**可见正文 + title + 外链与品牌**。

### 2.6 展示（SERP snippet）

搜索结果上那一行标题和灰色描述，大致来自：

1. `<title>`
2. `<meta name="description">`（常被采用，但不保证）
3. 正文中匹配查询的片段（引擎可能自己截）

OG / Twitter Card 主要用于**社交分享卡片**，不是搜索结果的主来源，但和「被看到的样子」强相关。

---

## 3. 关键网页元素各自干什么？

### 3.1 `<title>`

- 标签页标题，也是搜索结果主标题候选
- 建议：品牌 + 页面主题，别堆砌
- 例：`标题日记 - 一句话概括你的一天`、`日记 - 隐私说明`

### 3.2 `meta description`

- 给摘要用的「广告语」
- 应是完整句子，说明产品是什么、对谁有用
- 差例子：把一串关键词用逗号拼起来当 description（旧版 diary 曾接近这种）

### 3.3 `meta keywords`

- 现代 SEO 权重极低
- 可留少量真实主题词，不必维护成核心策略

### 3.4 `canonical`

- 声明「这页的权威地址是哪一个」
- 用于减少重复 URL（带参数、带尾斜杠、多入口）导致的权重分散
- diary 站点规范地址示例：`https://kylebing.cn/diary/`

### 3.5 `robots` meta（`index` / `noindex`）

- `index,follow`：可收录，可跟踪链接
- `noindex,nofollow`：请勿收录（适合登录后业务页）

这比在 hash 路径上写 `Disallow` 更靠谱。

### 3.6 Open Graph / Twitter Card

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://绝对地址/...">
<meta property="og:url" content="https://...">
```

用于微信、微博、Slack、iMessage 等生成预览卡。  
**图片必须是绝对 URL**，相对路径经常失效。

### 3.7 结构化数据（JSON-LD）

用 schema.org 词汇告诉引擎「这是一个 Web 应用 / 文章 / 组织」：

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "标题日记",
  "url": "https://kylebing.cn/diary/"
}
```

它不保证出富媒体结果，但有助于理解实体类型。错误或垃圾标记可能被忽略。

### 3.8 语义 HTML 与正文

爬虫更信任用户能看见的内容：

- 合理的 `h1` / `h2`
- 真实段落，而不是只有按钮和输入框
- 有意义的 `alt`、内链文案

纯登录表单页「能被索引」但排名能力弱，因为几乎没有可匹配的正文。隐私页、介绍页更适合承载内容型 SEO。

### 3.9 `sitemap.xml`

给引擎一份「请优先考虑这些 URL」的清单。  
sitemap **不保证收录**，只是发现与优先级提示。

### 3.10 `robots.txt`

控制抓取许可，**不是**排序开关。  
常见误区：以为写了 `Disallow` 页面就不会出现在搜索里——若别处已有外链，仍可能以 URL 形式出现；要排除展示用 `noindex`。

---

## 4. SPA / hash 路由为什么是 SEO 难点？

diary-vue 使用：

```ts
createWebHashHistory()
```

真实地址形态类似：

```text
https://kylebing.cn/diary/
https://kylebing.cn/diary/#/login
https://kylebing.cn/diary/#/privacy
https://kylebing.cn/diary/#/share/123
```

### 4.1 Hash 的特殊性

`#` 后面的部分叫 fragment：

- **浏览器不会把 fragment 发给服务器**  
  请求 `https://kylebing.cn/diary/#/privacy` 时，服务器只看到 `/diary/` 或 `/diary/index.html`
- 服务器永远返回同一份 `index.html`
- 路由切换全靠前端 JS 读 `location.hash`

对 SEO 的后果：

1. 服务端无法按路径返回不同 HTML/title（除非另做预渲染服务）
2. 很多爬虫/分享器只看首包 HTML → 所有 hash 页共享同一套默认 meta
3. Google 对 hash 路由有一定处理能力，但远不如干净的 path 路由（`/diary/privacy`）
4. `robots.txt` 里对 `#/edit` 的 Disallow **基本无效**（fragment 通常不参与 robots 匹配）

### 4.2 三种常见前端架构对比

| 架构 | 首包 HTML 是否含正文 | SEO 友好度 | diary-vue 现状 |
|------|----------------------|------------|----------------|
| 多页/SSR（Nuxt 等） | 是 | 高 | 否 |
| 预渲染（prerender 公开页） | 公开页是 | 中高 | 否 |
| CSR SPA + hash | 基本否（空壳 + JS） | 低～中 | **是** |
| CSR SPA + history | 仍依赖 JS，但 URL 干净 | 中（可再加预渲染） | 否 |

### 4.3 我们已做的、在现有架构下「真正有效」的部分

| 手段 | 对谁有效 | 说明 |
|------|----------|------|
| 强化 `index.html` meta / OG / JSON-LD | 爬虫、分享器、首屏 | 最重要的一刀 |
| `sitemap.xml` | 发现公开入口 | 需在站长平台提交更稳 |
| 路由级 `applySeo()` | 浏览器标题、执行了 JS 的环境 | 对微信预览帮助有限 |
| 分享页动态 title/description | 用户打开后的标签与部分爬虫 | 社交爬虫仍可能只用首页 OG |
| 业务页 `noindex` | 减少无意义索引 | 比 hash Disallow 靠谱 |
| 登录页隐藏 `h1` + 简介 | 轻微增强可解析文本 | 不是银弹 |
| noscript 文案 | 无 JS / 部分降级场景 | 有总比没有强 |

### 4.4 若以后要「认真做 SEO」，升级路径

按收益排序：

1. **History 模式**（`createWebHistory`）+ Nginx `try_files` 回退到 `index.html`  
   - URL 变为 `/diary/login`、`/diary/privacy`  
   - 便于统计、外链、sitemap、分享  
2. **公开页预渲染或 SSR**  
   - 至少让 `/`、`/privacy`、`/login` 的 HTML 里带真实标题和介绍正文  
3. **分享页服务端渲染 OG**  
   - 例如 `/share/:id` 由后端根据日记生成带 og:title 的 HTML  
   - 这对微信分享预览往往比前端改 meta 更关键  
4. **独立落地页**（甚至静态介绍站）  
   - 工具产品常见做法：SEO 走介绍页，App 本身仍是 SPA

---

## 5. 「社交 SEO」和「搜索 SEO」不是一回事

容易混淆的两件事：

### 搜索 SEO

- 玩家：Google、Bing、百度…
- 关心：发现、索引、相关性、权威
- 结果：搜索结果列表

### 社交分享预览（有时被叫成 SEO）

- 玩家：微信、微博、Slack、Twitter…
- 关心：`og:*` / Twitter Card，且常常**不执行 JS**
- 结果：聊天里的小卡片

因此：分享一篇日记时，若链接是：

```text
https://kylebing.cn/diary/#/share/6766
```

多数分享器只会拉取 `/diary/` 的 HTML，看到的是站点默认 OG（「标题日记 - 一句话概括你的一天」），而不是该篇日记标题——除非你做服务端按 ID 输出 OG，或改用无 hash 的可服务端识别路径。

前端 `Share.vue` 里 `applySeo()` 仍然值得做：用户点开后标题正确，且对会执行 JS 的环境有益。

---

## 6. 和 diary-vue 代码的对应关系

```text
index.html                 → 静态首包 SEO / OG / JSON-LD / noscript
public/robots.txt          → 部署后位于 /diary/robots.txt
public/sitemap.xml         → 公开入口清单
src/utility/seo.ts         → applySeo()：统一改 title/meta/canonical
src/router.ts              → meta.seo + afterEach 按路由应用
src/view/Share/Share.vue   → 日记加载后写入文章向 SEO
登录/隐私等公开页          → index: true
列表/编辑/账单等业务页     → index: false
```

推荐上线后的人工动作：

1. 部署最新 `dist`
2. 在 Google Search Console / 百度站长平台添加资源（至少到 `kylebing.cn`）
3. 提交 sitemap：`https://kylebing.cn/diary/sitemap.xml`
4. 若根目录已有 `https://kylebing.cn/robots.txt`，追加一行：
   ```text
   Sitemap: https://kylebing.cn/diary/sitemap.xml
   ```
5. 用「分享调试」类工具检查 OG（注意 hash 限制）
6. 搜索 `site:kylebing.cn/diary` 观察已收录情况（有延迟）

---

## 7. 常见误区

1. **堆 keywords 就能排名** — 不行，还可能显得垃圾。
2. **SPA 改了 document.title 就等于做好 SEO** — 只对已渲染环境可靠。
3. **有 sitemap 就一定会收录** — 只是邀请函。
4. **robots Disallow = 搜索里消失** — 不保证；要用 `noindex` + 鉴权。
5. **所有页面都该被收录** — 后台、编辑器、空壳列表收录了反而稀释站点质量。
6. **SEO 是一次性施工** — 引擎会回访；内容、外链、产品名提及会持续影响。
7. **和统计（百度统计）搞混** — 统计看访问，SEO 看发现与排序；相关但不是同一套。

---

## 8. 一张心智图（记住这个就够）

```text
用户搜索「标题日记」
        │
        ▼
   引擎索引里有没有可理解的页面？
        │
        ├─ 没有 → 没被发现 / 抓不到 / 空壳 SPA / noindex
        │
        └─ 有 → 标题、描述、正文、外链是否表明「这就是标题日记官网」？
                    │
                    ├─ 弱 → 排后面或只在 brand 词出现
                    └─ 强 → 更靠前，摘要也可读 → 点击 → 留存（体验又会反馈品牌搜索）
```

对个人/小众产品，最务实的策略往往是：

1. 保证官网能被找到（品牌词、GitHub、个人主页外链）
2. 首页 HTML 信息完整、正确
3. 隐私/介绍等公开长文页做好
4. 私人功能页不要进索引
5. 真要冲品类词（「日记 app」），再考虑落地页或 SSR——那是内容与产品叙事问题，不只是 meta 标签问题

---

## 9. 延伸阅读

- [Google 搜索中心文档](https://developers.google.com/search/docs)
- [Google：JavaScript SEO 基础](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [schema.org](https://schema.org/)
- [Open Graph 协议](https://ogp.me/)
- 项目内实现：`src/utility/seo.ts`、`index.html`、`public/sitemap.xml`

---

*文档面向标题日记（diary-vue）当前架构编写，便于对照代码阅读。*
