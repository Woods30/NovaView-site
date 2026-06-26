# NovaView

> **在手机上阅读 AI 生成的文档 — 本地优先、默认离线、零追踪。**
>
> iOS / Android 应用，用于阅读 ChatGPT、Claude、Codex 等生成的 Markdown、HTML、JSON、YAML、TXT、CSV 文件。

这是 NovaView 的开源项目仓库，包含：

- **官网源码**（本仓库的 [`src/`](./src) 目录）
- 适用于 iPhone、iPad、Android 手机/平板的**最新 app 安装包**，发布在 [**Releases**](../../releases)

官网部署在 **[novaview.app](https://novaview.app)**。本仓库的每个 Release 都附带已签名的 `.ipa`、`.apk` 和通用 APK，可直接安装到真机使用 — 无需经过 App Store 或 Google Play。

---

## 为什么本地优先

当你让 ChatGPT 生成一份 Markdown 报告、让 Claude 导出一个 HTML 仪表盘、或者让 Codex 输出一个 JSON diff 时，文件会落到你手机的分享菜单里。大多数阅读器会把文件上传到云端解析后再展示给你。NovaView 不这么做。文件在一个沙箱化的应用内 WebView 中解析，从不离开设备，在你关闭时自动从缓存中清除。无分析、无账号、除非文件格式本身需要，否则不发起任何网络请求。

---

## 本仓库包含什么

| 路径 | 内容 |
|---|---|
| [`src/`](./src) | 官网源码 — Vite + TanStack Start + React 19 + Tailwind v4 + shadcn/ui |
| [`public/`](./public) | 静态资源（LOGO 派生文件、OG 分享卡、`sitemap.xml`、`robots.txt`） |
| [`scripts/`](./scripts) | 品牌资源生成 + 预渲染驱动 |
| [`tests/`](./tests) | Vitest 单元测试 + Playwright E2E 测试 |
| [`docs/lighthouse/`](./docs/lighthouse) | 移动端 Lighthouse 基线报告（回归快照） |
| [**Releases**](../../releases) | 已签名的 iOS / Android / 通用 APK 构建，每个 app 版本一条 |

官网有意做得简单：3 个预渲染 HTML × 2 个语言（zh / en）= 6 个静态页面，无客户端数据获取，无分析，无第三方脚本。

---

## 快速开始

官网基于 Node 20+ 和 pnpm 9 运行。

```bash
pnpm install
pnpm dev                  # http://localhost:3000
```

支持路由、Tailwind、React 热更新。语言切换无需刷新页面 — 访问 `/zh/` 后点击顶栏的 `EN` 即可。

### 生产构建

```bash
pnpm build                # vite build + Playwright 驱动的预渲染
pnpm preview              # 在 http://localhost:4173 提供预渲染的 HTML
```

`pnpm build` 输出 4 个静态 HTML 到 `dist/client/{zh,en}/.../index.html`，加上共享的 `assets/` 和 `brand/` 目录。

### 安装 app

从 [**Releases**](../../releases) 获取最新构建：

- **iOS / iPadOS** — 下载 `.ipa`，通过 AltStore、Sideloadly 或 Xcode 安装
- **Android** — 下载 `.apk`（侧载）或通用 APK（手机、平板、模拟器通用）
- **Play Store / App Store** — 官网下载区有官方渠道链接

每个 Release 条目都已签名，并附带每个产物的 SHA-256 哈希。

---

## 技术栈

- **Vite 5** + **TanStack Start**（基于文件路由 + 静态预渲染）
- **React 19** + **TypeScript strict**
- **Tailwind CSS v4**（用 `@theme inline` 映射设计令牌）
- **shadcn/ui** 原语（Button、Card、Badge、Separator、Sheet）
- **lucide-react** 图标
- **Vitest** + **Playwright**（单元测试 + E2E）
- **pnpm 9**
- **Cloudflare Pages** 托管

深色模式是 `<html>` 上的静态 `.dark` 类切换。`index.html` 里的内联脚本读取用户保存的偏好，并在首次绘制时匹配用户操作系统选择，因此不会出现主题闪烁。

---

## 项目目录

```
NovaView-site/
├── public/
│   ├── brand/
│   │   ├── logo.png            # 单一透明 LOGO 源
│   │   └── og-{zh,en}.png      # 社交分享卡
│   ├── favicon.png
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── main.tsx
│   ├── router.tsx
│   ├── routes/
│   │   ├── __root.tsx          # 全局 layout（顶栏 + 页脚 + Providers）
│   │   ├── index.tsx           # / → 重定向到 /$locale/
│   │   └── $locale/
│   │       ├── index.tsx       # 产品主页
│   │       └── privacy.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn 原语
│   │   ├── layout/             # Topnav, Footer, LangSwitch, ThemeToggle, Container
│   │   ├── brand/              # Logo
│   │   └── sections/           # Hero, FormatCard, PrivacySpotlight, WorkflowStrip, …
│   ├── i18n/                   # zh-CN.json, en.json + provider/useT/detect
│   ├── styles/
│   │   ├── tokens.css          # 设计令牌（颜色、字体、圆角）
│   │   └── globals.css         # @theme inline + @layer base 重置
│   └── lib/                    # cn, seo
├── scripts/
│   ├── build-brand-assets.mjs  # 生成 logo.png + favicon.png + OG 卡
│   └── prerender.mjs           # Playwright 预渲染驱动
├── tests/
│   ├── unit/                   # Vitest 单元测试（54 个）
│   └── e2e/                    # Playwright E2E 测试（6 个）
└── docs/
    └── lighthouse/             # 移动端 Lighthouse 基线
```

---

## 部署

部署目标：Cloudflare Pages。从本仓库：

```bash
pnpm build
pnpm dlx wrangler pages deploy dist/client --project-name=novaview-com
```

Cloudflare Pages 项目配置：

- **Build command:** `pnpm build`
- **Build output directory:** `dist/client`
- **Node version:** 20
- **环境变量:** `PUBLIC_SITE_URL=https://novaview.app`

`public/` 中的 `_headers` 和 `_redirects` 会随构建自动发布（CSP、安全头、`/zh` → `/zh/` 尾斜杠归一化）。

---

## 验证

```bash
pnpm typecheck     # tsc --noEmit
pnpm test          # Vitest 单元测试（19 个文件，54 个用例）
pnpm test:e2e      # Playwright E2E（6 个 spec × 3 个视口）
```

`docs/lighthouse/` 存放最新一次移动端 Lighthouse JSON 报告作为回归基线。重新生成：

```bash
pnpm preview &                     # 在 :4173 提供预渲染 HTML
for r in /zh/ /zh/privacy/ /en/ /en/privacy/; do
  npx --yes lighthouse@latest "http://127.0.0.1:4173$r" \
    --form-factor=mobile --screenEmulation.mobile=true \
    --output=json --output-path="./docs/lighthouse/lh${r//\//-}.json" \
    --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage"
done
```

> **注意：** 路径必须以 `/` 结尾。不带尾斜杠时，Vite preview 会回退到 SPA 入口（`dist/client/index.html`），无法命中预渲染产物。

---

## 品牌资源

LOGO 的唯一源文件是 `public/brand/logo-source.png`。重新生成所有派生资源（透明 `logo.png`、`favicon.png`、`og-{zh,en}.png`）：

```bash
node scripts/build-brand-assets.mjs
```

脚本会从源文件中色键掉暖棕色背景（`#6F5939`，容差 50），所以每个派生文件都是真正透明的。如需更换 LOGO，替换 `public/brand/logo-source.png` 后重新运行即可。

---

## 贡献

欢迎提 issue：文案修改、设计调整、新增语言、可访问性修复、链接失效、下载按钮 bug、Release notes、签名密钥。

提交 PR 前：

1. `pnpm test` 与 `pnpm test:e2e` 全绿
2. `pnpm typecheck` 干净
3. 在 `/zh/` 与 `/en/` 跑 Lighthouse，确认 a11y ≥ 0.95
4. 如果新增了 i18n key，跑 `pnpm test tests/unit/i18n-integrity.test.ts` 验证 zh-CN ↔ en key 集合一致

欢迎任何语言的翻译 PR — 字典契约是严格的（两种语言必须定义完全一致的 key 集合），部分翻译会在达到完全一致前一直触发 integrity test 失败。

---

## 隐私

NovaView 隐私政策是唯一权威参考：**[`/zh/privacy`](https://novaview.app/zh/privacy)** · **[`/en/privacy`](https://novaview.app/en/privacy)**

官网本身不收集任何数据 — 没有分析 SDK，没有 cookie，没有第三方脚本。唯一的客户端存储是 `localStorage`，用于保存用户显式选择的语言和主题偏好。

---

## 协议

本仓库所有内容 — 官网源码、构建脚本、测试、设计资源 — 采用 **MIT License** 发布。详见 [`LICENSE`](./LICENSE)。
