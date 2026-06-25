# NovaView 官网 Landing Page · 设计文档

| 字段 | 值 |
|---|---|
| 日期 | 2026-06-25 |
| 项目 | getnovaview.com |
| 范围 | 三页静态官网（index 入口 / landing 主产品页 / privacy 政策） |
| 栈 | Vite 5 · TanStack Start · React 19 · TypeScript · Tailwind v4 · shadcn/ui · lucide-react |
| 包管理 | pnpm 9 |
| 渲染 | SSG（prerender 6 条路由） |
| 部署 | Cloudflare Pages |
| 仓库 | github.com/Woods30/NovaView |
| 主域 | novaview.app |

---

## 1. 背景与目标

NovaView 是一个本地优先的 iOS / Android App，用于在手机上阅读 AI 生成文档（Markdown / HTML / JSON / YAML / TXT / CSV）。当前已有 `docs/NovaView-landingpage.zip` 高保真 HTML 原型（index.html · landing.html · privacy.html），设计语言稳定、PRD 文案已迭代至 v1.4.2。

**目标**：把原型 1:1 重构为可维护、可扩展、可国际化、可主题化的现代 React 工程，保持原型的视觉纪律与文案一致性。

**非目标**：
- 不实现后端 / API
- 不接入任何第三方分析或广告
- 不改造 App 客户端代码
- 不实现博客 / 文档站 / 用户系统

---

## 2. 范围

| 页面 | 路径（zh） | 路径（en） | 来源 |
|---|---|---|---|
| 入口导览 | `/zh/` | `/en/` | 原型 `index.html`（597 行） |
| 产品主页 | `/zh/landing` | `/en/landing` | 原型 `landing.html`（1063 行） |
| 隐私政策 | `/zh/privacy` | `/en/privacy` | 原型 `privacy.html`（564 行） |

共 **6 条 prerender 路由**，全部 SSG 输出。根路径 `/` → `/zh/` 302 重定向。

---

## 3. 技术栈

| 层 | 选型 | 理由 |
|---|---|---|
| 打包器 | Vite 5 | 与 TanStack Start 原生集成 |
| 框架 | TanStack Start | 文件路由 + SSG prerender + TS 类型安全路由参数 |
| UI 库 | React 19 + TypeScript strict | 生态成熟，类型严格 |
| 样式 | Tailwind CSS v4 | `@theme inline` 映射原型 token，shadcn 原生 |
| 组件 | shadcn/ui（手动 init） | 可控、CSS 变量与 Tailwind 桥接 |
| Icon | lucide-react + 品牌 inline SVG | 通用 icon 走库；品牌 SVG 手写 |
| 字体 | `@fontsource/inter` + `@fontsource/jetbrains-mono` 自托管 | 不接 Google Fonts |
| 测试 | Vitest + Playwright | 单测 / 组件 / E2E |
| 部署 | Cloudflare Pages | 边缘静态、隐私友好、与品牌定位一致 |

**包管理**：pnpm 9，`engines.node>=20`，`packageManager` 字段钉死。

---

## 4. 项目结构

```
getnovaview.com/
├── docs/
│   ├── NovaView-landingpage.zip           # 原型（保留）
│   └── superpowers/specs/                 # 本文档
├── public/
│   ├── brand/
│   │   ├── logo.png                       # 原图（高保真）
│   │   ├── logo-32.png                    # 32px 版本
│   │   ├── logo-60.png                    # 60px retina 版本
│   │   └── og-{zh,en}.png                 # OG share card
│   ├── favicon.png                        # 简化版 favicon
│   ├── sitemap.xml                        # 手工维护
│   └── robots.txt
├── src/
│   ├── main.tsx
│   ├── router.tsx                         # TanStack Router 实例
│   ├── routes/
│   │   ├── __root.tsx                     # 全局 layout + I18nProvider + ThemeProvider
│   │   ├── index.tsx                      # / → /zh/ 重定向
│   │   └── $locale/
│   │       ├── index.tsx                  # 入口导览
│   │       ├── landing.tsx                # 产品主页
│   │       └── privacy.tsx                # 隐私政策
│   ├── components/
│   │   ├── ui/                            # shadcn 组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── separator.tsx
│   │   │   └── sheet.tsx
│   │   ├── layout/
│   │   │   ├── Topnav.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LangSwitch.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── Container.tsx
│   │   ├── brand/
│   │   │   └── Logo.tsx
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── HeroMock.tsx
│   │       ├── StatStrip.tsx
│   │       ├── SurfaceCard.tsx
│   │       ├── SectionHead.tsx
│   │       ├── FormatCard.tsx
│   │       ├── PrivacySpotlight.tsx
│   │       ├── FeatureCard.tsx
│   │       ├── WorkflowStrip.tsx
│   │       ├── UseCaseCard.tsx
│   │       ├── PlatformCard.tsx
│   │       ├── OssSideBlock.tsx
│   │       └── PrivacyToc.tsx
│   ├── i18n/
│   │   ├── types.ts                       # DictionaryKey + Dictionary
│   │   ├── locales.ts                     # SUPPORTED_LOCALES + DEFAULT_LOCALE
│   │   ├── provider.tsx                   # I18nProvider
│   │   ├── useT.ts                        # useT() hook
│   │   ├── detect.ts                      # locale 探测
│   │   ├── zh-CN.json                     # 316 keys
│   │   └── en.json                        # 316 keys（与 zh 严格相等）
│   ├── styles/
│   │   ├── globals.css                    # Tailwind v4 + @theme inline
│   │   └── tokens.css                     # :root + .dark CSS 变量
│   └── lib/
│       ├── cn.ts                          # clsx + tailwind-merge
│       └── seo.ts                         # meta / OG 工具
├── tests/
│   ├── unit/                              # Vitest
│   │   ├── i18n-integrity.test.ts
│   │   ├── useT.test.tsx
│   │   ├── detect.test.ts
│   │   ├── cn.test.ts
│   │   ├── theme-toggle.test.tsx
│   │   ├── lang-switch.test.tsx
│   │   ├── tokens.test.ts
│   │   ├── components/
│   │   │   ├── Hero.test.tsx
│   │   │   ├── FormatCard.test.tsx
│   │   │   ├── WorkflowStrip.test.tsx
│   │   │   ├── PrivacySpotlight.test.tsx
│   │   │   ├── Topnav.test.tsx
│   │   │   ├── Footer.test.tsx
│   │   │   ├── Logo.test.tsx
│   │   │   └── SectionHead.test.tsx
│   │   └── routes/
│   │       ├── redirect.test.tsx
│   │       ├── not-found.test.tsx
│   │       └── meta.test.tsx
│   └── e2e/                               # Playwright
│       ├── responsive.spec.ts
│       ├── i18n-switch.spec.ts
│       ├── theme-toggle.spec.ts
│       ├── anchor-nav.spec.ts
│       ├── download-links.spec.ts
│       └── reduced-motion.spec.ts
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── playwright.config.ts
├── vitest.config.ts
├── wrangler.toml
├── _headers                               # Cloudflare Pages headers
├── _redirects                             # Cloudflare Pages redirects
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 5. 设计 Token 与主题

### 5.1 调色（沿用原型）

| Token | 浅色 | 深色 | 用途 |
|---|---|---|---|
| `--color-bg` | `#fafafa` | `#0a0a0a` | 页面背景 |
| `--color-surface` | `#ffffff` | `#141414` | 卡片 / 表面 |
| `--color-fg` | `#111111` | `#f5f5f5` | 正文 |
| `--color-fg-muted` | `#6b6b6b` | `#a3a3a3` | 次要文本 |
| `--color-border` | `#e5e5e5` | `#262626` | 1px 边线 |
| `--color-accent` | `#2f6feb` | `#4d8cff` | 单一强调（cobalt） |
| `--color-accent-hover` | mix black 8% | mix white 8% | hover 态 |
| `--color-success` | `#17a34a` | — | 本地标签 |
| `--color-warn` | `#eab308` | — | — |
| `--color-danger` | `#dc2626` | — | — |
| `--color-brand-blue` | `#60a5fa` | — | Logo 渐变起点 |
| `--color-brand-purple` | `#a78bfa` | — | Logo 渐变终点 |

**纪律**：每屏钴蓝 ≤2 处出现；品牌渐变仅 Logo 使用；正文无渐变背景。

### 5.2 Tailwind v4 集成

`src/styles/globals.css`：

```css
@import "tailwindcss";

@theme inline {
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-fg: #111111;
  /* ...其余见 5.1 */
  --font-sans: "Inter", -apple-system, system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-mono: ui-monospace, "JetBrains Mono", "SFMono-Regular", Menlo, monospace;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 9999px;
  --container-prose: 720px;
  --container-max: 1200px;
}

.dark {
  --color-bg: #0a0a0a;
  --color-surface: #141414;
  --color-fg: #f5f5f5;
  --color-fg-muted: #a3a3a3;
  --color-border: #262626;
  --color-accent: #4d8cff;
  --color-accent-hover: color-mix(in oklab, #4d8cff, white 8%);
}
```

使用方式：`bg-bg text-fg border-border bg-surface text-accent`。

### 5.3 shadcn 集成

- shadcn 组件接受 `className` prop，通过 `cn()` 与 Tailwind 工具类合并
- Button variants 用 cva 显式指定：`primary: 'bg-accent text-white hover:bg-accent-hover'`
- 不使用 shadcn 默认的 `--background / --foreground` HSL 通道变量（避免两套 token 并存）

### 5.4 响应式断点

- ≥1024px：`px-6`（24px gutter），12 列网格
- 640–1023px：`px-4`（16px），8 列网格
- <640px：`px-4`（16px），4 列网格，单列堆叠

### 5.5 深色模式

- `<html class="dark">` 启用
- `ThemeProvider`：localStorage `novaview-theme` 优先 → 否则 `prefers-color-scheme`
- 切换：`document.documentElement.classList.toggle('dark')`
- 防止 FOUC：`<head>` 内联极小 script，hydration 前根据 localStorage 决定 `.dark`

### 5.6 字体

- Inter 400/600，JetBrains Mono 400，通过 `@fontsource` 自托管
- 拉丁字符用 Inter，CJK 走系统字体 PingFang SC / Microsoft YaHei

---

## 6. Logo 资产

| 用途 | 文件 |
|---|---|
| Topnav 32px | `public/brand/logo-32.png` |
| Topnav 60px retina | `public/brand/logo-60.png` |
| OG image / 大尺寸展示 | `public/brand/logo.png`（原图） |
| OG share card（1200×630） | `public/brand/og-{zh,en}.png`（合成） |
| Favicon | `public/favicon.png`（简化版 / 缩图） |

`<Logo>` 组件：
- `<picture><source srcSet=... /><img src=... /></picture>`
- `size: 'sm' | 'md' | 'lg'` 决定渲染尺寸
- `alt` 文本由 `useT('brand.logo_alt')` 提供

Logo 资源由用户在 2026-06-25 提供（`~/Downloads/nova.png`），深蓝背景下蓝紫渐变立体 N + 文档 + 紫星。

---

## 7. 组件清单

### 7.1 shadcn 原语（5 个）

`Button` / `Card` / `Badge` / `Separator` / `Sheet`

### 7.2 布局组件（5 个）

`Topnav` / `Footer` / `LangSwitch` / `ThemeToggle` / `Container`

### 7.3 品牌组件（1 个）

`Logo`

### 7.4 Section 组件（13 个）

`Hero` / `HeroMock` / `StatStrip` / `SurfaceCard` / `SectionHead` / `FormatCard` / `PrivacySpotlight` / `FeatureCard` / `WorkflowStrip` / `UseCaseCard` / `PlatformCard` / `OssSideBlock` / `PrivacyToc`

### 7.5 页面组合

| 路由 | 组合 |
|---|---|
| `/$locale/index.tsx` | Hero + StatStrip + 3 SurfaceCard |
| `/$locale/landing.tsx` | Hero + Formats(6) + PrivacySpotlight + Features(8) + WorkflowStrip + UseCases(3) + Download(PlatformCard ×2 + OssBlock) |
| `/$locale/privacy.tsx` | Hero(simplified) + PrivacyToc + 11 个 Section |

每个 section 组件接受 i18n props，**不**直接读 `useT()`。

---

## 8. i18n 实现

### 8.1 字典合并

三页所有 key 合并到 `zh-CN.json` + `en.json` 两份，约 **331 keys × 2 语言**（index 68 + landing 158 + privacy 105，原型基线）。

### 8.2 类型安全

```ts
// src/i18n/types.ts
export type DictionaryKey =
  | 'brand.tagline'
  | 'brand.logo_alt'
  | 'nav.formats'
  // ... 全部静态列举
  ;

export type Locale = 'zh-CN' | 'en';
export type Dictionary = Readonly<Record<DictionaryKey, string>>;
```

`useT()` 签名：`(key: DictionaryKey) => string`。任何 typo / 缺失在编译期被拦截。

### 8.3 Provider

`<I18nProvider locale={locale} dict={dict}>` 通过 React Context 暴露 `{ locale, t, setLocale: undefined }`。`setLocale` 不实现（URL 是真相源，切换走 `useNavigate`）。

### 8.4 语言切换流程

```
用户点击 LangSwitch
  ↓
useNavigate({ to: '/$locale/$page', params: { locale: target } })
  ↓
TanStack Router beforeLoad 解析新 locale
  ↓
I18nProvider 重 mount，所有 useT() 读取新字典
  ↓
localStorage.setItem('novaview-locale', target)
```

### 8.5 首次访问探测（`detect.ts`）

1. URL 第一个段是合法 locale → 用之
2. localStorage `novaview-locale` 是合法 locale → 302
3. `navigator.language` 匹配 → 302
4. 默认 `zh-CN` → 302

`/` 路由的 `index.tsx` 直接 `redirect({ to: '/$locale', params: { locale: detectLocale() } })`。

### 8.6 隐私

仅写两个 localStorage key：`novaview-locale` / `novaview-theme`。SSR 阶段无 `window`，所有 localStorage 访问必须在 `useEffect` 或事件回调内。

---

## 9. SEO / Meta

每页由 `head()` 函数返回 meta：

| 字段 | 值 |
|---|---|
| `<title>` | 按页 + locale 派生 |
| `description` | 按页 + locale 派生 |
| `og:title` / `og:description` / `og:type` / `og:image` / `og:locale` / `og:url` | 同上 |
| `twitter:card` | `summary_large_image` |
| `canonical` | `https://novaview.app/{zh,en}/...` |
| `<html lang>` | `zh-CN` / `en` |

`public/sitemap.xml` 列出 6 条 URL + 双向 `hreflang` 关联。
`public/robots.txt`：`Allow: /`、`Sitemap: https://novaview.app/sitemap.xml`。

---

## 10. 错误处理

| 场景 | 行为 |
|---|---|
| 非法 locale（如 `/fr/`） | `notFoundComponent` 渲染 404 + 语言切换链接 |
| 非法子路径 | 同上 404 |
| 字典 key 缺失 | `t(key)` 返回 key 本身，console.warn；CI 通过 `i18n-integrity.test.ts` 拦截 |
| localStorage 不可用（隐私模式） | `detect.ts` 静默 fallback，UI 不报错 |
| 切换 theme 时 SSR 不可用 | inline script 在 hydration 前决定 `.dark` |

---

## 11. 性能预算

| 指标 | 目标 |
|---|---|
| 单页 HTML（gzip） | < 30 KB |
| 单页 JS（gzip，hydration 后） | < 80 KB |
| 首屏字体 | Inter 400/600（subset 拉丁） |
| Logo PNG | ≤ 8 KB（build step 用 sharp 压缩） |
| LCP | < 1.5s |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | = 100 |
| Lighthouse SEO | = 100 |

---

## 12. 性能 / 隐私

- 不引入任何第三方 SDK（无 GA / Plausible / Sentry）
- 不连 Google Fonts（@fontsource 自托管）
- 不写 `<script async src=外部>` 依赖
- `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; ...">` 在 root 输出
- 不写 cookie；唯一客户端存储是 localStorage 两 key

---

## 13. 测试策略

### 13.1 Vitest 单元（18 个 spec）

工具 / 状态：
- `i18n-integrity.test.ts` — zh 与 en 严格 key 相等
- `useT.test.tsx` — Provider / 缺 key warn
- `detect.test.ts` — 4 级 fallback
- `cn.test.ts` — tailwind-merge 去重
- `theme-toggle.test.tsx` — dark class + localStorage
- `lang-switch.test.tsx` — 导航 + URL 变
- `tokens.test.ts` — grep 源码无裸 hex

组件（8 个）：
- `Hero.test.tsx` / `FormatCard.test.tsx` / `WorkflowStrip.test.tsx` / `PrivacySpotlight.test.tsx` / `Topnav.test.tsx` / `Footer.test.tsx` / `Logo.test.tsx` / `SectionHead.test.tsx`

路由（3 个）：
- `redirect.test.tsx` / `not-found.test.tsx` / `meta.test.tsx`

### 13.2 Playwright E2E（6 个 spec）

- `responsive.spec.ts` — 6 页 × 3 断点（360 / 768 / 1440）截图，断言无水平滚动
- `i18n-switch.spec.ts` — 点击切换 → URL 变 → 文案变 → localStorage 写入
- `theme-toggle.spec.ts` — html.dark 翻转 + 刷新保持
- `anchor-nav.spec.ts` — topnav 锚点 + sticky offset
- `download-links.spec.ts` — iOS / Android / APK / GitHub href 正确
- `reduced-motion.spec.ts` — prefers-reduced-motion 下动画停止

### 13.3 命令

```bash
pnpm test           # vitest run
pnpm test:watch
pnpm test:e2e       # playwright test
pnpm test:all       # vitest + playwright
pnpm test:coverage  # target 70% lines
```

---

## 14. 部署

### 14.1 Cloudflare Pages

| 配置 | 值 |
|---|---|
| Build command | `pnpm build` |
| Output | `dist/client` |
| Node | 20 |

### 14.2 wrangler.toml

```toml
name = "novaview-com"
pages_build_output_dir = "./dist/client"
compatibility_date = "2026-06-12"

[vars]
PUBLIC_SITE_URL = "https://novaview.app"
```

### 14.3 Headers（`_headers`）

```
/
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline'

/brand/*  Cache-Control: public, max-age=31536000, immutable
/assets/* Cache-Control: public, max-age=31536000, immutable
```

### 14.4 Redirects（`_redirects`）

```
/zh          /zh/          301
/en          /en/          301
/landing     /zh/landing   302
/privacy     /zh/privacy   302
/            /zh/          302
```

### 14.5 DNS / 域名

- 主域 `novaview.app`，Cloudflare Pages 自定义域
- `www.novaview.app` 301 → apex
- HTTPS 自动 + HSTS preload（可选提交）

### 14.6 回滚

Cloudflare Pages 一键回滚到任意历史部署（30 天保留）。

---

## 15. 数据流（全部静态）

| 数据 | 来源 | 加载时机 |
|---|---|---|
| i18n 字典 | `src/i18n/{zh,en}.json` | 构建期 import，无网络请求 |
| Logo | `public/brand/*.png` | 构建期拷贝，浏览器直读 |
| 字体 | `@fontsource/*` | 打包进 bundle |
| favicon | `public/favicon.png` | 浏览器直读 |

**无任何 API 调用、无 fetch、无外部网络依赖。**

---

## 16. SSG / Prerender 流程

```
vite build
  ↓
TanStack Start 编译 → dist/client/
  ↓
prerender 枚举 6 条路由：
  /zh/, /zh/landing, /zh/privacy
  /en/, /en/landing, /en/privacy
  ↓
每条路由 renderer 输出 HTML 文件
  ↓
dist/client/
  ├── index.html (内含 redirect meta)
  ├── zh/{index,landing,privacy}/index.html
  ├── en/{index,landing,privacy}/index.html
  ├── brand/...
  └── assets/...
```

---

## 17. 本地开发

```bash
pnpm install
pnpm dev                          # http://localhost:3000
pnpm dev --host                   # 局域网真机预览
pnpm build && pnpm preview        # 验证 SSG 产物
```

dev server 支持：TanStack Router HMR / Tailwind v4 HMR / 实时 locale 切换。

---

## 18. 风险与未决项

| 项 | 状态 | 备注 |
|---|---|---|
| OG image 合成 | 未做 | 当前规划 `public/brand/og-{zh,en}.png` 静态合成，可在 build 前用 sharp 生成 |
| CSP `unsafe-inline` | 临时 | 仅放行 inline theme script；未来可加 nonce |
| Lighthouse CI | 未集成 | 当前人工 spot check；可后续 PR 加 `.github/workflows/lhci.yml` |
| Analytics | 不做 | 符合品牌「无追踪」硬约束 |
| HSTS preload 提交 | 可选 | Cloudflare Pages 自带 HSTS |

---

## 19. 验收标准

1. `pnpm build` 成功，`dist/client/` 含 6 条 prerender HTML
2. `pnpm test && pnpm test:e2e` 全绿
3. `pnpm preview` 后手动验证：
   - 6 页均可访问，文本与原型 1:1
   - zh ↔ en 切换，URL 跟随变化
   - dark / light 切换无白屏闪烁，刷新保持
   - 360px / 768px / 1440px 断点无水平滚动
   - 下载链接、GitHub、issues 链接 href 正确
4. Lighthouse mobile 跑每页：Performance ≥ 95 / Accessibility = 100 / Best Practices ≥ 95 / SEO = 100
5. Cloudflare Pages 部署后，`https://novaview.app/` 302 → `/zh/`，6 个 URL 可访问

---

## 20. 后续（YAGNI 暂不做）

- 博客 / 文档站
- RSS feed
- 暗色 OG image
- i18n 第三语言（ja / ko）
- 国际化 ICU MessageFormat（仅当文案需要复数 / 插值时启用）
- 评论系统 / 反馈表单
- Lighthouse CI 自动拦截