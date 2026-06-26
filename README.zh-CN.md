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

本仓库通过 `.github/workflows/deploy.yml` 部署到 Cloudflare Pages。Workflow 是**发布触发**的 —— 只有发布 GitHub Release 时才会推到生产，每次提交到 `main` 不会。

### 发布流程

```
feature 分支 → PR → main（仅自动部署到预览 URL）
                     │
                     └── 草拟 Release v1.4.3 → 发布
                                                │
                                                ▼
                            .github/workflows/deploy.yml
                                                │
                                                ▼
                            Build → Cloudflare Pages → novaview.app
                            + GitHub Release 附带 app 二进制包
```

为什么是发布触发而不是 push-to-main：

- 站点 + app 一起版本化 — 右侧栏的每个 Release 条目都包含对应的站点构建 + 其 assets 中的签名 app 二进制
- 直接 push 到 `main` 不会立即改生产；只有发布 Release 才改
- tag 提供干净的审计链路："v1.4.2 当时线上是什么？" → 切到 tag，build，看

### 一次性配置

#### 1. 保护 `main`（仅 PR，禁止直推）

GitHub → **Settings → Branches → Add rule**：

- **Branch name pattern:** `main`
- ☑ **Require a pull request before merging**
  - ☑ Require approvals: **1**
- ☑ **Require status checks to pass before merging**
  - 搜索并选择: **Build, ensure project, deploy**
- ☑ **Do not allow bypassing the above settings**

保存。从此以后，落地 main 的唯一途径是 PR。直接 push 会被拒绝。

PR workflow 会跑同样的 build + typecheck + unit tests，reviewer 能在合并前看到绿色 checks。

#### 2. 创建 Cloudflare Pages 项目

Cloudflare 控制台 → **Workers & Pages** → Create application → Pages → **Direct Upload** → 命名 `novaview-com`。

（Direct Upload 是 `cloudflare/pages-action` 的写入目标。无需在控制台连接 GitHub 仓库 — workflow 自己处理部署。）

#### 3. 创建 Cloudflare API token

1. 打开 <https://dash.cloudflare.com/profile/api-tokens> → 点击 **Create Token**
2. 使用 **Edit Cloudflare Pages** 模板（推荐），或自定义 token 时设 `Account → Cloudflare Pages → Edit` 权限，作用域限定到你的 account
3. 设置 TTL — 90 天或更短（安全最佳实践）
4. 点击 **Continue to summary** → **Create Token**
5. **立即复制 token** — Cloudflare 只显示一次。格式：40 位十六进制字符串，类似 `aBcD1234eFgH5678iJkL9012mNoP3456qRsT7890`
6. 关闭页面前保存到密码管理器

#### 4. 获取 Account ID

Cloudflare 控制台首页（<https://dash.cloudflare.com/>），右栏底部滚动到底部，复制 **Account ID**（32 位十六进制字符串）。

#### 5. 添加 GitHub secrets

GitHub 仓库 → **Settings → Secrets and variables → Actions → New repository secret**，添加两条：

| Name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | 第 3 步的 token |
| `CLOUDFLARE_ACCOUNT_ID` | 第 4 步的 account ID |

#### 6. （推荐）将 secrets 限定到 `production` 环境

GitHub → **Settings → Environments → New environment → `production`** → 在该环境自己的 secrets 面板下添加同样的两个 secrets。

原因：`workflow_dispatch` 用 `environment=preview` 跑时拿不到 production secrets。workflow 里的 `environment:` 块会让 GitHub 仅注入匹配的 secrets。

#### 7. 发布一个 Release

```bash
git checkout main && git pull           # 确保在最新
gh release create v1.4.3 \
    --title "v1.4.3" \
    --notes "What's new in this version..." \
    path/to/app.ipa path/to/app.apk      # 附带签名 app 二进制
```

`gh release create` 发布 Release → 触发 workflow → build + deploy。

如只需部署站点（不发 app），可以创建一个空 tag 的 Release：

```bash
git tag v1.4.3-site.1 && git push origin v1.4.3-site.1
gh release create v1.4.3-site.1 --generate-notes
```

#### 8. 手动部署（应急通道）

```bash
gh workflow run deploy.yml -f environment=production
```

或选特定 ref：

```bash
gh workflow run deploy.yml -f environment=preview -f ref=feature-branch-name
```

### 本地手动部署

如果需要绕过 GitHub Actions 直接部署：

```bash
pnpm build
pnpm dlx wrangler pages deploy dist/client --project-name=novaview-com
```

需要将 `CLOUDFLARE_API_TOKEN` 设为环境变量，并从控制台取 `CLOUDFLARE_ACCOUNT_ID`。

### 自定义域名

首次部署后，在 Cloudflare 控制台 → `novaview-com` Pages 项目 → **Custom domains**，添加 `novaview.app`。Cloudflare 自动处理 DNS 记录和 HTTPS。wrangler.toml 中的 `PUBLIC_SITE_URL` 变量（用于 OG 标签和 canonical URL）应与生产域名一致。

### 分支工作流

```
main（受保护）──── 发布 v1.4.x ────► 部署到 Cloudflare Pages
   ▲
   │ PR（squash merge）
   │
feature/something ──── 提交、推送、开 PR ────► CI 跑 build + tests
```

- `main` 是唯一的发布源。直接 push 被分支保护阻止。
- 所有改动走 feature 分支 → PR → squash merge。
- Release tag（`v*.*.*`）触发部署 workflow。
- PR workflow 跑相同的 `typecheck + test + build`，reviewer 在合并前能看到绿色 checks。

### 故障排查

| 症状 | 原因 | 修复 |
|---|---|---|
| `Authentication error [code: 10000]` | Token 错误或过期 | 重新生成 token，更新 GitHub secret |
| `Authentication error [code: 9109]` | Token 无 `Pages: Edit` 权限 | 重新创建 token，确认 `Account → Cloudflare Pages → Edit` 已设置 |
| `Project not found` | 项目名不匹配 | 确认 `wrangler.toml` 的 `pages_build_output_dir` 与 Cloudflare 项目名一致 |
| `Account ID invalid` | Account ID 复制错误 | 从 Cloudflare 控制台侧栏重新复制 |
| Workflow 成功但站点未更新 | Cloudflare Pages 边缘缓存 | 浏览器硬刷新（`Cmd-Shift-R`），或查 Deployments tab 核对 build hash |
| `Build artifact validation failed` | `dist/client` 缺 HTML | 本地跑 `pnpm build` 复现；检查 prerender 脚本是否报错 |

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
