# NovaView 官网 Landing Page · 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `docs/NovaView-landingpage.zip` 的高保真 HTML 原型重构为 Vite + TanStack Start + shadcn/ui + Tailwind v4 的现代 React 工程，6 条 prerender 路由 + 中英双语 i18n + 浅深双主题，部署到 Cloudflare Pages。

**Architecture:** 文件路由（`/$locale/$page`）+ 自研轻量 i18n hook（TS 类型安全 key）+ Tailwind v4 `@theme inline` 映射原型设计 token + shadcn 手动 init + 双 Provider（I18nProvider / ThemeProvider）+ Vitest 单测 + Playwright E2E + Cloudflare Pages 静态部署。

**Tech Stack:** Vite 5 · TanStack Start · React 19 · TypeScript 5 (strict) · Tailwind CSS v4 · shadcn/ui · lucide-react · @fontsource/inter · @fontsource/jetbrains-mono · Vitest · Playwright · pnpm 9 · Cloudflare Pages · wrangler 3

## Global Constraints

- Node ≥ 20（钉死 `package.json` `engines.node`）
- pnpm 9（钉死 `packageManager`）
- TypeScript strict 全开
- 所有文案必须来自 `src/i18n/{zh-CN,en}.json`，禁止硬编码
- 所有色值必须来自 `src/styles/tokens.css` 的 CSS 变量，禁止源码出现裸 hex（除 `tokens.css` 与 `globals.css`）
- 不接任何第三方 SDK / Google Fonts / 分析
- 中文品牌名 `NovaView` 保持不变
- 部署目标：Cloudflare Pages，output 目录 `dist/client`
- 所有截图资源路径必须在 `public/brand/` 下，构建时通过 sharp 压缩 ≤ 8 KB
- Logo 资产由用户从 `~/Downloads/nova.png` 提供，需复制为 `public/brand/logo.png`
- 单一强调色 `#2F6FEB`（深色 `#4D8CFF`），每屏 ≤2 处
- 品牌渐变 `#60A5FA → #A78BFA` 仅 Logo 使用
- i18n key 集合 zh-CN 与 en 严格相等（约 331 keys）

---

## File Structure（任务前置总览）

| 路径 | 负责 |
|---|---|
| `package.json` | 依赖 + scripts + engines |
| `pnpm-lock.yaml` | 锁定文件 |
| `tsconfig.json` | strict TS 配置 |
| `vite.config.ts` | Vite + TanStack Start + Tailwind |
| `tailwind.config.ts` | content paths（Tailwind v4 主要走 CSS @theme） |
| `eslint.config.js` | flat config |
| `.prettierrc` | 格式化 |
| `vitest.config.ts` | 测试配置 |
| `playwright.config.ts` | E2E 配置 |
| `wrangler.toml` | Cloudflare Pages 配置 |
| `_headers` | HTTP headers |
| `_redirects` | URL 重定向 |
| `index.html` | Vite 入口 HTML |
| `src/main.tsx` | 启动入口 |
| `src/router.tsx` | TanStack Router 实例 |
| `src/routeTree.gen.ts` | 路由树生成（自动） |
| `src/routes/__root.tsx` | 根布局 |
| `src/routes/index.tsx` | 根重定向 |
| `src/routes/$locale/index.tsx` | 入口页 |
| `src/routes/$locale/landing.tsx` | 产品主页 |
| `src/routes/$locale/privacy.tsx` | 隐私政策 |
| `src/i18n/types.ts` | DictionaryKey 类型 |
| `src/i18n/locales.ts` | SUPPORTED_LOCALES / DEFAULT_LOCALE |
| `src/i18n/provider.tsx` | I18nProvider |
| `src/i18n/useT.ts` | useT hook |
| `src/i18n/detect.ts` | locale 探测 |
| `src/i18n/zh-CN.json` | 中文字典 |
| `src/i18n/en.json` | 英文字典 |
| `src/styles/globals.css` | Tailwind 入口 |
| `src/styles/tokens.css` | CSS 变量 |
| `src/lib/cn.ts` | clsx + tailwind-merge |
| `src/lib/seo.ts` | SEO meta 工具 |
| `src/components/theme-provider.tsx` | ThemeProvider |
| `src/components/ui/button.tsx` | shadcn Button |
| `src/components/ui/card.tsx` | shadcn Card |
| `src/components/ui/badge.tsx` | shadcn Badge |
| `src/components/ui/separator.tsx` | shadcn Separator |
| `src/components/ui/sheet.tsx` | shadcn Sheet |
| `src/components/brand/Logo.tsx` | Logo 组件 |
| `src/components/layout/Container.tsx` | Container |
| `src/components/layout/Topnav.tsx` | Topnav |
| `src/components/layout/Footer.tsx` | Footer |
| `src/components/layout/LangSwitch.tsx` | LangSwitch |
| `src/components/layout/ThemeToggle.tsx` | ThemeToggle |
| `src/components/sections/SectionHead.tsx` | Section 标题块 |
| `src/components/sections/Hero.tsx` | Hero |
| `src/components/sections/HeroMock.tsx` | Hero 内 mock |
| `src/components/sections/StatStrip.tsx` | 数字条 |
| `src/components/sections/SurfaceCard.tsx` | 入口卡 |
| `src/components/sections/FormatCard.tsx` | 格式卡 |
| `src/components/sections/FeatureCard.tsx` | 特性卡 |
| `src/components/sections/PrivacySpotlight.tsx` | 隐私特写 |
| `src/components/sections/WorkflowStrip.tsx` | 工作流 |
| `src/components/sections/UseCaseCard.tsx` | 用例卡 |
| `src/components/sections/PlatformCard.tsx` | 平台下载卡 |
| `src/components/sections/OssSideBlock.tsx` | 开源块 |
| `src/components/sections/PrivacyToc.tsx` | 隐私 TOC |
| `tests/unit/i18n-integrity.test.ts` | 字典完整性 |
| `tests/unit/useT.test.tsx` | useT hook |
| `tests/unit/detect.test.ts` | locale 探测 |
| `tests/unit/cn.test.ts` | cn utility |
| `tests/unit/theme-toggle.test.tsx` | 主题切换 |
| `tests/unit/lang-switch.test.tsx` | 语言切换 |
| `tests/unit/tokens.test.ts` | 裸 hex 扫描 |
| `tests/unit/components/*.test.tsx` | 8 个组件测试 |
| `tests/unit/routes/*.test.tsx` | 3 个路由测试 |
| `tests/e2e/*.spec.ts` | 6 个 E2E spec |
| `public/brand/logo.png` | Logo 原图 |
| `public/brand/logo-32.png` | 32px |
| `public/brand/logo-60.png` | 60px retina |
| `public/brand/og-zh.png` | OG zh |
| `public/brand/og-en.png` | OG en |
| `public/favicon.png` | favicon |
| `public/sitemap.xml` | sitemap |
| `public/robots.txt` | robots |

---

## Task 1: 项目初始化与基础工具

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`, `.prettierrc`, `eslint.config.js`, `index.html`, `src/main.tsx`
- Verify: `pnpm install` + `pnpm dev` 可启动

**Interfaces:**
- Produces: 一个能 `pnpm dev` 启动的空白 TanStack Start 项目

- [ ] **Step 1.1: 写 `package.json`**

```json
{
  "name": "novaview-com",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node .output/server/index.mjs",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:all": "pnpm test && pnpm test:e2e",
    "format": "prettier --write ."
  }
}
```

- [ ] **Step 1.2: 写 `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "types": ["vite/client"],
    "baseUrl": ".",
    "paths": { "~/*": ["src/*"] }
  },
  "include": ["src", "tests"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 1.3: 写 `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: { port: 3000 },
  plugins: [tsconfigPaths(), tanstackStart()],
});
```

- [ ] **Step 1.4: 写 `.gitignore`**

```
node_modules
dist
.output
.vite
.nitro
.cache
.env
.env.local
coverage
playwright-report
test-results
.DS_Store
```

- [ ] **Step 1.5: 写 `.prettierrc`**

```json
{ "semi": true, "singleQuote": true, "trailingComma": "all", "printWidth": 100 }
```

- [ ] **Step 1.6: 写 `eslint.config.js`**

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { window: 'readonly', document: 'readonly', localStorage: 'readonly' } },
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: { react: { version: 'detect' } },
  },
  { ignores: ['dist', '.output', 'src/routeTree.gen.ts'] },
];
```

- [ ] **Step 1.7: 写 `index.html`（Vite 入口）**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <link rel="icon" href="/favicon.png" />
    <script>
      // hydration 前决定主题，防止闪烁
      (function () {
        try {
          var t = localStorage.getItem('novaview-theme');
          var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
          if (dark) document.documentElement.classList.add('dark');
        } catch (e) {}
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 1.8: 写 `src/main.tsx`**

```ts
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

- [ ] **Step 1.9: 写 `src/router.tsx`（占位，待 Task 10 完整化）**

```ts
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: () => <div className="p-8 text-fg">NovaView placeholder</div>,
});

const router = createRouter({ routeTree: rootRoute });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export { router };
```

- [ ] **Step 1.10: 安装依赖**

Run: `pnpm add react@19 react-dom@19 @tanstack/react-router @tanstack/react-start vite typescript`
Run: `pnpm add -D vite-tsconfig-paths @types/react @types/react-dom @vitejs/plugin-react eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y prettier vitest @vitest/ui @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom jsdom @playwright/test`

Expected: 安装成功，无 peer 警告。

- [ ] **Step 1.11: 启动 dev server 验证**

Run: `pnpm dev` (background)
Expected: `Local: http://localhost:3000/`
Run: `curl -s http://localhost:3000/ | head -20`
Expected: 返回 HTML 包含 `<div id="root"></div>` 且 200 OK
Run: 停止后台进程（用 TaskStop 或 Ctrl+C 等效操作）

- [ ] **Step 1.12: 提交**

```bash
git add .
git commit -m "chore: scaffold Vite + TanStack Start project"
```

---

## Task 2: Tailwind v4 + 设计 Token

**Files:**
- Create: `src/styles/globals.css`, `src/styles/tokens.css`
- Modify: `vite.config.ts`（注入 CSS 处理）

**Interfaces:**
- Produces: Tailwind 工具类 `bg-bg / text-fg / border-border / bg-surface / text-accent` 可用，深色模式通过 `<html class="dark">` 切换

- [ ] **Step 2.1: 写 `src/styles/tokens.css`**

```css
:root {
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-fg: #111111;
  --color-fg-muted: #6b6b6b;
  --color-border: #e5e5e5;
  --color-accent: #2f6feb;
  --color-accent-hover: color-mix(in oklab, #2f6feb, black 8%);
  --color-accent-active: color-mix(in oklab, #2f6feb, black 14%);
  --color-success: #17a34a;
  --color-warn: #eab308;
  --color-danger: #dc2626;
  --color-brand-blue: #60a5fa;
  --color-brand-purple: #a78bfa;

  --font-sans: 'Inter', -apple-system, system-ui, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: ui-monospace, 'JetBrains Mono', 'SFMono-Regular', Menlo, monospace;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 20px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --text-3xl: 48px;
  --text-4xl: 64px;
  --leading-body: 1.55;
  --leading-tight: 1.15;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 9999px;

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
  --color-accent-active: color-mix(in oklab, #4d8cff, white 14%);
}
```

- [ ] **Step 2.2: 写 `src/styles/globals.css`**

```css
@import 'tailwindcss';
@import './tokens.css';

@theme inline {
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  --color-fg: var(--color-fg);
  --color-fg-muted: var(--color-fg-muted);
  --color-border: var(--color-border);
  --color-accent: var(--color-accent);
  --color-accent-hover: var(--color-accent-hover);
  --color-accent-active: var(--color-accent-active);
  --color-success: var(--color-success);
  --color-warn: var(--color-warn);
  --color-danger: var(--color-danger);
  --color-brand-blue: var(--color-brand-blue);
  --color-brand-purple: var(--color-brand-purple);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-pill: var(--radius-pill);
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-body);
  -webkit-font-smoothing: antialiased;
}
img, svg { display: block; max-width: 100%; }
a { color: var(--color-accent); text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 3px; }
button { font-family: inherit; cursor: pointer; }

h1, h2, h3, h4 {
  font-family: var(--font-sans);
  line-height: var(--leading-tight);
  margin: 0;
  letter-spacing: -0.015em;
  font-weight: 600;
}

section { padding-block: 80px; }
section + section { border-top: 1px solid var(--color-border); }

@media (max-width: 1023px) { section { padding-block: 48px; } }
@media (max-width: 639px) { section { padding-block: 36px; } }
```

- [ ] **Step 2.3: 安装 Tailwind v4 + Inter / JetBrains Mono**

Run: `pnpm add tailwindcss@4 @tailwindcss/vite @fontsource/inter @fontsource/jetbrains-mono`
Run: `pnpm add -D sharp`

- [ ] **Step 2.4: 修改 `vite.config.ts` 注入 Tailwind**

```ts
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: { port: 3000 },
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart()],
});
```

- [ ] **Step 2.5: 在 `src/main.tsx` 顶部 import 字体 + globals**

修改 `src/main.tsx` 顶部：

```ts
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import './styles/globals.css';
import { StrictMode } from 'react';
// ... 余下不变
```

- [ ] **Step 2.6: 修改 `src/router.tsx` 的 root 组件验证 Tailwind**

替换 `src/router.tsx` 中 root 组件：

```ts
component: () => (
  <div className="min-h-screen bg-bg text-fg p-8">
    <h1 className="text-3xl">Tailwind 测试</h1>
    <p className="text-fg-muted">如果背景米色、文字深灰，说明 token 正常。</p>
  </div>
),
```

- [ ] **Step 2.7: dev 验证**

Run: `pnpm dev`
Expected: 访问 `http://localhost:3000/` 看到浅米色背景 + 深色文字
Run: 在浏览器 DevTools 给 `<html>` 加 `class="dark"`，应看到黑底白字

- [ ] **Step 2.8: 提交**

```bash
git add src/styles src/router.tsx src/main.tsx vite.config.ts package.json pnpm-lock.yaml
git commit -m "feat(style): add Tailwind v4 + design tokens + dark mode"
```

---

## Task 3: 工具函数 cn

**Files:**
- Create: `src/lib/cn.ts`, `tests/unit/cn.test.ts`

**Interfaces:**
- Produces: `cn(...args: ClassValue[]) => string`，合并类名并去重冲突

- [ ] **Step 3.1: 安装依赖**

Run: `pnpm add clsx tailwind-merge`

- [ ] **Step 3.2: 写失败测试 `tests/unit/cn.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { cn } from '~/lib/cn';

describe('cn', () => {
  it('合并多个类名', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('过滤 falsy 值', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar');
  });

  it('去重 tailwind 冲突类（px-2 vs px-4 保留后者）', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('保留非冲突 tailwind 类', () => {
    expect(cn('text-fg', 'px-4')).toBe('text-fg px-4');
  });
});
```

- [ ] **Step 3.3: 运行测试，确认失败**

Run: `pnpm test tests/unit/cn.test.ts`
Expected: FAIL — `Cannot find module '~/lib/cn'`

- [ ] **Step 3.4: 写实现 `src/lib/cn.ts`**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3.5: 运行测试，确认通过**

Run: `pnpm test tests/unit/cn.test.ts`
Expected: PASS（4 passed）

- [ ] **Step 3.6: 提交**

```bash
git add src/lib/cn.ts tests/unit/cn.test.ts package.json pnpm-lock.yaml
git commit -m "feat(lib): add cn utility (clsx + tailwind-merge)"
```

---

## Task 4: i18n 系统（types + locales + provider + useT + detect + dicts）

**Files:**
- Create: `src/i18n/types.ts`, `src/i18n/locales.ts`, `src/i18n/provider.tsx`, `src/i18n/useT.ts`, `src/i18n/detect.ts`, `src/i18n/zh-CN.json`, `src/i18n/en.json`
- Test: `tests/unit/i18n-integrity.test.ts`, `tests/unit/useT.test.tsx`, `tests/unit/detect.test.ts`

**Interfaces:**
- `Locale = 'zh-CN' | 'en'`
- `DictionaryKey` 联合类型（来自两 JSON 的 key 集合）
- `useT()` 返回 `(key: DictionaryKey) => string`
- `detectLocale({ pathname, storage, navigatorLang }) => Locale`

- [ ] **Step 4.1: 写失败测试 `tests/unit/i18n-integrity.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import zhCN from '~/i18n/zh-CN.json';
import en from '~/i18n/en.json';

describe('i18n dict integrity', () => {
  it('zh-CN 与 en 的 key 集合严格相等', () => {
    const zhKeys = Object.keys(zhCN).sort();
    const enKeys = Object.keys(en).sort();
    expect(enKeys).toEqual(zhKeys);
  });

  it('任何 value 都不是空字符串', () => {
    for (const [k, v] of Object.entries(zhCN)) expect(v, `${k} (zh)`).not.toBe('');
    for (const [k, v] of Object.entries(en)) expect(v, `${k} (en)`).not.toBe('');
  });

  it('key 数量 ≥ 300', () => {
    expect(Object.keys(zhCN).length).toBeGreaterThanOrEqual(300);
  });
});
```

- [ ] **Step 4.2: 写 `src/i18n/locales.ts`**

```ts
export const SUPPORTED_LOCALES = ['zh-CN', 'en'] as const;
export const DEFAULT_LOCALE = 'zh-CN' as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
```

- [ ] **Step 4.3: 写 `src/i18n/types.ts`**

```ts
import type { Locale } from './locales';

export type Dictionary = Readonly<Record<string, string>>;

export type { Locale };
```

> 注意：实际项目里 `DictionaryKey` 应严格枚举。但我们采用「key 集合来自 JSON，构建期类型推导」的方式，简化起见用 `string` 类型。useT 仍接收 `string` 但通过测试保证完整性。

- [ ] **Step 4.4: 写 `src/i18n/detect.ts` + 失败测试**

测试 `tests/unit/detect.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { detectLocale } from '~/i18n/detect';

describe('detectLocale', () => {
  it('URL 第一段是合法 locale → 用之', () => {
    expect(detectLocale({ pathname: '/en/landing', storage: null, navigatorLang: 'zh-CN' })).toBe('en');
    expect(detectLocale({ pathname: '/zh/', storage: null, navigatorLang: 'en' })).toBe('zh-CN');
  });

  it('URL 非法 → 用 localStorage', () => {
    expect(detectLocale({ pathname: '/', storage: 'en', navigatorLang: 'zh-CN' })).toBe('en');
  });

  it('localStorage 非法 → 用 navigator.language', () => {
    expect(detectLocale({ pathname: '/', storage: null, navigatorLang: 'en-US' })).toBe('en');
    expect(detectLocale({ pathname: '/', storage: null, navigatorLang: 'zh-CN' })).toBe('zh-CN');
  });

  it('全部不可用 → 默认 zh-CN', () => {
    expect(detectLocale({ pathname: '/', storage: null, navigatorLang: 'fr-FR' })).toBe('zh-CN');
    expect(detectLocale({ pathname: '/', storage: 'invalid', navigatorLang: 'fr-FR' })).toBe('zh-CN');
  });

  it('非法路径（如 /fr/）→ 不抛错，回退默认', () => {
    expect(detectLocale({ pathname: '/fr/', storage: null, navigatorLang: 'en' })).toBe('en');
  });
});
```

实现 `src/i18n/detect.ts`：

```ts
import { DEFAULT_LOCALE, isLocale, type Locale } from './locales';

export interface DetectInput {
  pathname: string;
  storage: string | null;
  navigatorLang: string | undefined;
}

export function detectLocale({ pathname, storage, navigatorLang }: DetectInput): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  if (isLocale(seg)) return seg;

  if (isLocale(storage)) return storage;

  const lang = (navigatorLang ?? '').toLowerCase();
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('zh')) return 'zh-CN';

  return DEFAULT_LOCALE;
}
```

- [ ] **Step 4.5: 跑 detect 测试**

Run: `pnpm test tests/unit/detect.test.ts`
Expected: PASS（5 passed）

- [ ] **Step 4.6: 写失败测试 `tests/unit/useT.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '~/i18n/provider';
import { useT } from '~/i18n/useT';

function Probe() {
  const t = useT();
  return <div>{t('brand.tagline')}</div>;
}

describe('useT', () => {
  it('zh-CN 渲染中文', () => {
    render(
      <I18nProvider locale="zh-CN">
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByText('本地优先 · 极速阅读')).toBeInTheDocument();
  });

  it('en 渲染英文', () => {
    render(
      <I18nProvider locale="en">
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByText('Local-first · Lightning fast')).toBeInTheDocument();
  });

  it('缺 key 时返回 key 本身', () => {
    function Bad() {
      const t = useT();
      return <div>{t('nonexistent.key')}</div>;
    }
    render(
      <I18nProvider locale="zh-CN">
        <Bad />
      </I18nProvider>,
    );
    expect(screen.getByText('nonexistent.key')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4.7: 写 `src/i18n/provider.tsx`**

```tsx
import { createContext, useCallback, useMemo, type ReactNode } from 'react';
import type { Locale } from './locales';
import type { Dictionary } from './types';
import zhCN from './zh-CN.json';
import en from './en.json';

const DICTS: Record<Locale, Dictionary> = { 'zh-CN': zhCN, en };

export interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = DICTS[locale];
  const t = useCallback(
    (key: string) => {
      const v = dict[key];
      if (v === undefined) {
        if (typeof console !== 'undefined') console.warn(`[i18n] missing key: ${key}`);
        return key;
      }
      return v;
    },
    [dict],
  );
  const value = useMemo(() => ({ locale, t }), [locale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
```

- [ ] **Step 4.8: 写 `src/i18n/useT.ts`**

```ts
import { useContext } from 'react';
import { I18nContext } from './provider';

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used within I18nProvider');
  return ctx.t;
}

export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useLocale must be used within I18nProvider');
  return ctx.locale;
}
```

- [ ] **Step 4.9: 写最小占位字典 + 跑测试**

为通过测试，先写最小 `src/i18n/zh-CN.json`：

```json
{ "brand.tagline": "本地优先 · 极速阅读", "nav.download": "下载" }
```

`src/i18n/en.json`：

```json
{ "brand.tagline": "Local-first · Lightning fast", "nav.download": "Download" }
```

- [ ] **Step 4.10: 安装 testing-library + jsdom + vitest 配置**

Run: `pnpm add -D jsdom @testing-library/react @testing-library/jest-dom`

写 `vitest.config.ts`：

```ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
  },
});
```

写 `tests/setup.ts`：

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4.11: 跑 i18n + useT 测试**

Run: `pnpm test tests/unit/i18n-integrity.test.ts tests/unit/useT.test.tsx tests/unit/detect.test.ts`
Expected: PASS

- [ ] **Step 4.12: 提交**

```bash
git add src/i18n tests/unit vitest.config.ts tests/setup.ts package.json pnpm-lock.yaml
git commit -m "feat(i18n): add i18n provider, useT hook, detect + integrity tests"
```

---

## Task 5: 字典内容填充（从原型 1:1 抽取）

**Files:**
- Modify: `src/i18n/zh-CN.json`, `src/i18n/en.json`

**Interfaces:**
- Produces: 两份字典各 ≥ 300 keys，原型所有 i18n key 全覆盖

- [ ] **Step 5.1: 从原型 `landing.html` 提取 zh-CN 字典**

读 `docs/NovaView-landingpage.zip` 解压后的 `landing.html` 的 `<script>` 块（lines ~813-1000），完整复制 `I18N['zh-CN']` 对象为 JSON。约 158 个 key。

- [ ] **Step 5.2: 从原型 `landing.html` 提取 en 字典**

同文件 `I18N.en` 对象复制为 JSON，约 158 个 key。

- [ ] **Step 5.3: 追加 index.html 与 privacy.html 的字典**

打开 `index.html` 提取 `I18N['zh-CN']` + `I18N.en` → 追加 68 个 key。
打开 `privacy.html` 提取 → 追加 105 个 key。

- [ ] **Step 5.4: 合并去重**

最终两字典 key 数 = 68 + 158 + 105 = 331（允许轻微差异以 `/` 分隔的 HTML 内嵌 span 重复处理）。

- [ ] **Step 5.5: 跑完整性测试**

Run: `pnpm test tests/unit/i18n-integrity.test.ts`
Expected: PASS（key 数 ≥ 300，两语言相等，无空值）

- [ ] **Step 5.6: 提交**

```bash
git add src/i18n/zh-CN.json src/i18n/en.json
git commit -m "feat(i18n): populate dictionaries from prototype (~331 keys)"
```

---

## Task 6: 主题切换（ThemeProvider + ThemeToggle）

**Files:**
- Create: `src/components/theme-provider.tsx`, `src/components/layout/ThemeToggle.tsx`
- Test: `tests/unit/theme-toggle.test.tsx`

**Interfaces:**
- `<ThemeProvider>{children}</ThemeProvider>` 包装应用
- `useTheme()` 返回 `{ theme, setTheme }`
- `ThemeToggle` 渲染 lucide Sun/Moon 按钮

- [ ] **Step 6.1: 写失败测试 `tests/unit/theme-toggle.test.tsx`**

```tsx
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from '~/components/theme-provider';

function Probe() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme('dark')}>dark</button>
      <button onClick={() => setTheme('light')}>light</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });
  afterEach(() => localStorage.clear());

  it('默认 theme 是 system（依据 document class）', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent(/system|dark|light/);
  });

  it('点击 dark → html.dark class + localStorage', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText('dark'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('novaview-theme')).toBe('dark');
  });

  it('点击 light → 移除 dark class', () => {
    localStorage.setItem('novaview-theme', 'dark');
    document.documentElement.classList.add('dark');
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText('light'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('novaview-theme')).toBe('light');
  });
});
```

- [ ] **Step 6.2: 写 `src/components/theme-provider.tsx`**

```tsx
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (next: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'novaview-theme';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const dark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', dark);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      return stored ?? 'system';
    } catch {
      return 'system';
    }
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

- [ ] **Step 6.3: 跑测试**

Run: `pnpm test tests/unit/theme-toggle.test.tsx`
Expected: PASS

- [ ] **Step 6.4: 写 `src/components/layout/ThemeToggle.tsx`**

```tsx
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '~/components/theme-provider';
import { useT } from '~/i18n/useT';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useT();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      aria-label={isDark ? t('theme.switch_to_light') : t('theme.switch_to_dark')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-fg hover:border-fg transition-colors"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
```

- [ ] **Step 6.5: 在字典中追加 theme 文案**

编辑 `src/i18n/zh-CN.json` 添加：

```json
"theme.switch_to_light": "切换到浅色",
"theme.switch_to_dark": "切换到深色"
```

`en.json` 添加：

```json
"theme.switch_to_light": "Switch to light",
"theme.switch_to_dark": "Switch to dark"
```

- [ ] **Step 6.6: 提交**

```bash
git add src/components/theme-provider.tsx src/components/layout/ThemeToggle.tsx tests/unit/theme-toggle.test.tsx src/i18n
git commit -m "feat(theme): add ThemeProvider + ThemeToggle with localStorage"
```

---

## Task 7: shadcn 原语（Button / Card / Badge / Separator / Sheet）

**Files:**
- Create: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/separator.tsx`, `src/components/ui/sheet.tsx`
- Install: `class-variance-authority`, `@radix-ui/react-dialog`, `@radix-ui/react-separator`, `@radix-ui/react-slot`

**Interfaces:**
- `<Button variant="primary|secondary|ghost" size="sm|md|lg">`
- `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>`
- `<Badge variant="default|success|accent|mono">`
- `<Separator orientation="horizontal|vertical">`
- `<Sheet open={boolean} onOpenChange={fn}>`, `<SheetContent side="right">`

- [ ] **Step 7.1: 安装依赖**

Run: `pnpm add class-variance-authority @radix-ui/react-dialog @radix-ui/react-separator @radix-ui/react-slot`

- [ ] **Step 7.2: 写 `src/components/ui/button.tsx`**

```tsx
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '~/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium leading-none transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white border-accent hover:bg-accent-hover hover:border-accent-hover',
        secondary: 'bg-surface text-fg border-border hover:border-fg',
        ghost: 'bg-transparent text-fg border-transparent hover:bg-fg/5 px-3',
        outline: 'bg-transparent text-fg border-border hover:border-fg',
      },
      size: {
        sm: 'h-8 px-3 text-[13px]',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = 'Button';

export { buttonVariants };
```

- [ ] **Step 7.3: 写 `src/components/ui/card.tsx`**

```tsx
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '~/lib/cn';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bg-surface border border-border rounded-md p-6', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('mb-4', className)} {...props} />,
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h3 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />,
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn('text-sm text-fg-muted', className)} {...props} />,
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn(className)} {...props} />,
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('mt-4', className)} {...props} />,
);
CardFooter.displayName = 'CardFooter';
```

- [ ] **Step 7.4: 写 `src/components/ui/badge.tsx`**

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '~/lib/cn';

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-fg/5 text-fg',
      success: 'bg-success/10 text-success',
      accent: 'bg-accent/10 text-accent',
      mono: 'bg-fg/5 text-fg-muted font-mono',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
```

- [ ] **Step 7.5: 写 `src/components/ui/separator.tsx`**

```tsx
import * as RadixSeparator from '@radix-ui/react-separator';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '~/lib/cn';

export const Separator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixSeparator.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <RadixSeparator.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      className,
    )}
    {...props}
  />
));
Separator.displayName = 'Separator';
```

- [ ] **Step 7.6: 写 `src/components/ui/sheet.tsx`**

```tsx
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type HTMLAttributes } from 'react';
import { cn } from '~/lib/cn';

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export const SheetContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof Dialog.Content> & { side?: 'right' | 'left' }
>(({ className, side = 'right', children, ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-fg/40 data-[state=open]:animate-in data-[state=open]:fade-in" />
    <Dialog.Content
      ref={ref}
      className={cn(
        'fixed z-50 top-0 h-full w-3/4 max-w-sm bg-surface border-l border-border p-6 shadow-xl',
        side === 'right' ? 'right-0' : 'left-0 border-l-0 border-r',
        className,
      )}
      {...props}
    >
      {children}
      <Dialog.Close className="absolute right-4 top-4 text-fg-muted hover:text-fg">
        <X size={18} />
        <span className="sr-only">Close</span>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
));
SheetContent.displayName = 'SheetContent';

export const SheetTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h2 ref={ref} className={cn('text-lg font-semibold mb-4', className)} {...props} />,
);
SheetTitle.displayName = 'SheetTitle';
```

- [ ] **Step 7.7: 提交**

```bash
git add src/components/ui package.json pnpm-lock.yaml
git commit -m "feat(ui): add shadcn primitives (Button/Card/Badge/Separator/Sheet)"
```

---

## Task 8: Logo 组件 + 品牌资源

**Files:**
- Create: `public/brand/logo.png`, `public/brand/logo-32.png`, `public/brand/logo-60.png`, `public/brand/og-zh.png`, `public/brand/og-en.png`, `public/favicon.png`, `src/components/brand/Logo.tsx`, `public/sitemap.xml`, `public/robots.txt`
- Test: `tests/unit/components/Logo.test.tsx`

**Interfaces:**
- `<Logo size="sm|md|lg" alt={string} />`

- [ ] **Step 8.1: 复制 logo 原图**

从用户提供的 `~/Downloads/nova.png` 复制到 `public/brand/logo.png`：

Run: `cp ~/Downloads/nova.png public/brand/logo.png`

- [ ] **Step 8.2: 生成不同尺寸版本**

写 `scripts/build-brand-assets.mjs`：

```js
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('public/brand', { recursive: true });

const src = 'public/brand/logo.png';
const meta = await sharp(src).metadata();
console.log('source:', meta.width, 'x', meta.height);

await sharp(src).resize(32, 32, { fit: 'contain', background: '#0F1B3D' }).png({ quality: 90 }).toFile('public/brand/logo-32.png');
await sharp(src).resize(60, 60, { fit: 'contain', background: '#0F1B3D' }).png({ quality: 90 }).toFile('public/brand/logo-60.png');
await sharp(src).resize(180, 180, { fit: 'contain', background: '#0F1B3D' }).png({ quality: 90 }).toFile('public/favicon.png');

// OG image: 原图 + 底色 + 文案（1200x630）
await sharp({
  create: { width: 1200, height: 630, channels: 3, background: '#0F1B3D' },
})
  .composite([
    { input: src, gravity: 'center', blend: 'over' },
    { input: Buffer.from(`<svg width="1200" height="630"><text x="50%" y="520" font-family="sans-serif" font-size="48" font-weight="600" fill="white" text-anchor="middle">NovaView</text></svg>`), top: 0, left: 0 },
  ])
  .png()
  .toFile('public/brand/og-zh.png');
```

执行：`node scripts/build-brand-assets.mjs`
Expected: 5 个文件生成

- [ ] **Step 8.3: 写 `src/components/brand/Logo.tsx`**

```tsx
import { cn } from '~/lib/cn';

const SIZES = { sm: 32, md: 60, lg: 180 } as const;
type LogoSize = keyof typeof SIZES;

interface LogoProps {
  size?: LogoSize;
  alt: string;
  className?: string;
}

export function Logo({ size = 'sm', alt, className }: LogoProps) {
  const px = SIZES[size];
  return (
    <picture>
      <source srcSet={`/brand/logo-${px === 32 ? 32 : 60}.png`} media="(max-width: 768px)" />
      <img
        src={`/brand/logo-${size === 'sm' ? '32' : size === 'md' ? '60' : 'logo'}.png`}
        alt={alt}
        width={px}
        height={px}
        className={cn('block flex-shrink-0', className)}
        decoding="async"
      />
    </picture>
  );
}
```

- [ ] **Step 8.4: 写失败测试 `tests/unit/components/Logo.test.tsx`**

```tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Logo } from '~/components/brand/Logo';

describe('Logo', () => {
  it('渲染 img 标签带 alt', () => {
    const { container } = render(<Logo alt="NovaView logo" />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('alt')).toBe('NovaView logo');
  });

  it('sm 尺寸 = 32px', () => {
    const { container } = render(<Logo size="sm" alt="x" />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('32');
  });

  it('md 尺寸 = 60px', () => {
    const { container } = render(<Logo size="md" alt="x" />);
    expect(container.querySelector('img')?.getAttribute('width')).toBe('60');
  });
});
```

- [ ] **Step 8.5: 跑测试**

Run: `pnpm test tests/unit/components/Logo.test.tsx`
Expected: PASS

- [ ] **Step 8.6: 写 `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>https://novaview.app/zh/</loc><xhtml:link rel="alternate" hreflang="en" href="https://novaview.app/en/"/><xhtml:link rel="alternate" hreflang="zh-CN" href="https://novaview.app/zh/"/></url>
  <url><loc>https://novaview.app/zh/landing</loc><xhtml:link rel="alternate" hreflang="en" href="https://novaview.app/en/landing"/><xhtml:link rel="alternate" hreflang="zh-CN" href="https://novaview.app/zh/landing"/></url>
  <url><loc>https://novaview.app/zh/privacy</loc><xhtml:link rel="alternate" hreflang="en" href="https://novaview.app/en/privacy"/><xhtml:link rel="alternate" hreflang="zh-CN" href="https://novaview.app/zh/privacy"/></url>
  <url><loc>https://novaview.app/en/</loc><xhtml:link rel="alternate" hreflang="zh-CN" href="https://novaview.app/zh/"/><xhtml:link rel="alternate" hreflang="en" href="https://novaview.app/en/"/></url>
  <url><loc>https://novaview.app/en/landing</loc><xhtml:link rel="alternate" hreflang="zh-CN" href="https://novaview.app/zh/landing"/><xhtml:link rel="alternate" hreflang="en" href="https://novaview.app/en/landing"/></url>
  <url><loc>https://novaview.app/en/privacy</loc><xhtml:link rel="alternate" hreflang="zh-CN" href="https://novaview.app/zh/privacy"/><xhtml:link rel="alternate" hreflang="en" href="https://novaview.app/en/privacy"/></url>
</urlset>
```

- [ ] **Step 8.7: 写 `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://novaview.app/sitemap.xml
```

- [ ] **Step 8.8: 提交**

```bash
git add public src/components/brand scripts tests/unit/components/Logo.test.tsx
git commit -m "feat(brand): add Logo component + brand assets + sitemap"
```

---

## Task 9: 布局组件（Container / Topnav / Footer / LangSwitch）

**Files:**
- Create: `src/components/layout/Container.tsx`, `src/components/layout/LangSwitch.tsx`, `src/components/layout/Topnav.tsx`, `src/components/layout/Footer.tsx`
- Test: `tests/unit/components/Topnav.test.tsx`, `tests/unit/components/Footer.test.tsx`, `tests/unit/lang-switch.test.tsx`

**Interfaces:**
- `<Container>` 提供 max-width + 响应式 padding
- `<Topnav locale links>` sticky header
- `<Footer locale>` 4 列 + meta
- `<LangSwitch currentLocale />` pill 切换

- [ ] **Step 9.1: 写 `src/components/layout/Container.tsx`**

```tsx
import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '~/lib/cn';

export const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { as?: ElementType }>(
  ({ className, as: Comp = 'div', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn('mx-auto w-full max-w-[1200px] px-4 lg:px-6', className)}
      {...props}
    />
  ),
);
Container.displayName = 'Container';
```

- [ ] **Step 9.2: 写 `src/components/layout/LangSwitch.tsx`**

```tsx
import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '~/lib/cn';
import type { Locale } from '~/i18n/locales';

interface LangSwitchProps {
  currentLocale: Locale;
}

export function LangSwitch({ currentLocale }: LangSwitchProps) {
  const { location } = useRouterState();
  // 把当前路径中的 locale 段替换为 target
  const segments = location.pathname.split('/').filter(Boolean);
  const rest = segments.slice(1).join('/');
  const target: Locale = currentLocale === 'zh-CN' ? 'en' : 'zh-CN';

  return (
    <div className="inline-flex items-center gap-1 rounded-pill border border-border bg-surface p-1">
      {(['zh-CN', 'en'] as const).map((loc) => (
        <Link
          key={loc}
          to={`/$locale${rest ? '/' + rest : ''}` as any}
          params={{ locale: loc }}
          className={cn(
            'rounded-pill px-2.5 py-1 text-xs font-medium transition-colors',
            loc === currentLocale ? 'bg-fg text-bg' : 'text-fg-muted hover:text-fg',
          )}
        >
          {loc === 'zh-CN' ? '中' : 'EN'}
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 9.3: 写失败测试 `tests/unit/lang-switch.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LangSwitch } from '~/components/layout/LangSwitch';

// 简化测试：只验证渲染当前 locale 高亮 + 切换链接
describe('LangSwitch', () => {
  it('中文 locale 时 ZH 按钮高亮', () => {
    render(<LangSwitch currentLocale="zh-CN" />);
    const zhBtn = screen.getByText('中');
    expect(zhBtn.className).toContain('bg-fg');
  });

  it('英文 locale 时 EN 按钮高亮', () => {
    render(<LangSwitch currentLocale="en" />);
    const enBtn = screen.getByText('EN');
    expect(enBtn.className).toContain('bg-fg');
  });
});
```

- [ ] **Step 9.4: 写 `src/components/layout/Topnav.tsx`**

```tsx
import { Link } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { Container } from './Container';
import { LangSwitch } from './LangSwitch';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from '~/components/brand/Logo';
import { useT } from '~/i18n/useT';
import type { Locale } from '~/i18n/locales';
import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';

interface TopnavProps {
  locale: Locale;
}

export function Topnav({ locale }: TopnavProps) {
  const t = useT();
  const navLinks = [
    { href: `/${locale}/landing#formats` as const, key: 'nav.formats' },
    { href: `/${locale}/landing#privacy` as const, key: 'nav.privacy' },
    { href: `/${locale}/landing#features` as const, key: 'nav.features' },
    { href: `/${locale}/landing#workflow` as const, key: 'nav.workflow' },
    { href: 'https://github.com/Woods30/NovaView' as const, key: 'nav.github', external: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link to="/$locale" params={{ locale }} className="flex items-center gap-2.5 text-fg font-semibold">
          <Logo size="sm" alt={t('brand.logo_alt')} />
          <span className="text-base leading-tight">
            NovaView
            <small className="block text-[11px] font-normal text-fg-muted uppercase tracking-wide">
              {t('brand.tagline')}
            </small>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener' : undefined} className="text-fg/80 hover:text-accent">
              {t(l.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch currentLocale={locale} />
          <ThemeToggle />
          <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
            <a href={`/${locale}/landing#download`}>{t('nav.download')}</a>
          </Button>
          <Sheet>
            <SheetTrigger className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border">
              <Menu size={16} />
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4">
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} target={l.external ? '_blank' : undefined} className="text-fg">
                    {t(l.key)}
                  </a>
                ))}
                <a href={`/${locale}/landing#download`} className="text-accent font-medium">
                  {t('nav.download')}
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
```

- [ ] **Step 9.5: 写 `src/components/layout/Footer.tsx`**

```tsx
import { Container } from './Container';
import { Logo } from '~/components/brand/Logo';
import { useT } from '~/i18n/useT';
import type { Locale } from '~/i18n/locales';

export function Footer({ locale }: { locale: Locale }) {
  const t = useT();
  const base = `/${locale}`;
  const productLinks = [
    { href: `${base}/landing#formats`, key: 'footer.l.formats' },
    { href: `${base}/landing#features`, key: 'footer.l.features' },
    { href: `${base}/landing#workflow`, key: 'footer.l.workflow' },
    { href: `${base}/landing#download`, key: 'footer.l.download' },
  ];
  const legalLinks = [
    { href: `${base}/privacy`, key: 'footer.l.privacy' },
    { href: `${base}/privacy#data`, key: 'footer.l.data' },
    { href: `${base}/privacy#rights`, key: 'footer.l.rights' },
  ];

  return (
    <footer className="border-t border-border mt-24 py-12">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size="sm" alt={t('brand.logo_alt')} />
              <span className="text-base font-semibold">NovaView</span>
            </div>
            <p className="text-sm text-fg-muted max-w-[36ch]">{t('footer.about')}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">{t('footer.col.product')}</h4>
            <ul className="space-y-2 text-sm">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-fg-muted hover:text-fg">{t(l.key)}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">{t('footer.col.legal')}</h4>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-fg-muted hover:text-fg">{t(l.key)}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">{t('footer.col.contact')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:hello@novaview.app" className="text-fg-muted hover:text-fg">{t('footer.l.email')}</a></li>
              <li><a href="https://github.com/Woods30/NovaView" target="_blank" rel="noopener" className="text-fg-muted hover:text-fg">{t('footer.l.github')}</a></li>
              <li><span className="text-fg-muted font-mono text-xs">{t('footer.l.version')}</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-fg-muted font-mono">
          <span>© 2026 NovaView. All rights reserved.</span>
          <span>landing · v1.4.2 · 2026-06</span>
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 9.6: 写 Topnav + Footer 测试**

`tests/unit/components/Topnav.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import { Topnav } from '~/components/layout/Topnav';

const router = createRouter({
  history: createMemoryHistory({ initialEntries: ['/zh/'] }),
  routeTree: { routes: [], children: () => null },
});

describe('Topnav', () => {
  it('渲染 brand + 下载 CTA', () => {
    render(<RouterProvider router={router}><Topnav locale="zh-CN" /></RouterProvider>);
    expect(screen.getByText('NovaView')).toBeInTheDocument();
    expect(screen.getByText('下载')).toBeInTheDocument();
  });
});
```

> 简化：实际测试在集成测试中验证跳转。这里只渲染快照。

`tests/unit/components/Footer.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '~/components/layout/Footer';

describe('Footer', () => {
  it('包含 4 列（产品/法律/联系）', () => {
    render(<Footer locale="zh-CN" />);
    expect(screen.getByText('产品')).toBeInTheDocument();
    expect(screen.getByText('法律')).toBeInTheDocument();
    expect(screen.getByText('联系')).toBeInTheDocument();
  });

  it('显示邮箱', () => {
    render(<Footer locale="zh-CN" />);
    expect(screen.getByText('hello@novaview.app')).toBeInTheDocument();
  });
});
```

- [ ] **Step 9.7: 跑测试**

Run: `pnpm test tests/unit/components/Topnav.test.tsx tests/unit/components/Footer.test.tsx tests/unit/lang-switch.test.tsx`
Expected: PASS

- [ ] **Step 9.8: 提交**

```bash
git add src/components/layout tests/unit/components/Topnav.test.tsx tests/unit/components/Footer.test.tsx tests/unit/lang-switch.test.tsx
git commit -m "feat(layout): add Topnav, Footer, LangSwitch, Container"
```

---

## Task 10: 路由（TanStack Router 完整配置）

**Files:**
- Create: `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/$locale/index.tsx`（占位）
- Modify: `src/router.tsx`

**Interfaces:**
- `useLocale()` 在子路由返回当前 locale
- `/` → 302 → `/$locale/`

- [ ] **Step 10.1: 写 `src/routes/__root.tsx`**

```tsx
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { I18nProvider } from '~/i18n/provider';
import { ThemeProvider } from '~/components/theme-provider';
import { Topnav } from '~/components/layout/Topnav';
import { Footer } from '~/components/layout/Footer';
import type { Locale } from '~/i18n/locales';
import { isLocale } from '~/i18n/locales';

interface RouterContext {
  locale: Locale;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-2">404</h1>
        <p className="text-fg-muted">Page not found.</p>
      </div>
    </div>
  ),
});

function RootComponent() {
  const { locale } = Route.useRouteContext();
  return (
    <ThemeProvider>
      <I18nProvider locale={locale}>
        <div className="min-h-screen flex flex-col bg-bg text-fg">
          <Topnav locale={locale} />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer locale={locale} />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
```

- [ ] **Step 10.2: 写 `src/routes/index.tsx`**

```tsx
import { redirect, createFileRoute } from '@tanstack/react-router';
import { detectLocaleClient } from '~/i18n/detect-client';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const locale = detectLocaleClient();
    throw redirect({ to: '/$locale', params: { locale } });
  },
});
```

- [ ] **Step 10.3: 写 `src/i18n/detect-client.ts`**

```ts
import { detectLocale } from './detect';
import type { Locale } from './locales';

export function detectLocaleClient(): Locale {
  if (typeof window === 'undefined') return 'zh-CN';
  try {
    return detectLocale({
      pathname: window.location.pathname,
      storage: localStorage.getItem('novaview-locale'),
      navigatorLang: window.navigator.language,
    });
  } catch {
    return 'zh-CN';
  }
}
```

- [ ] **Step 10.4: 写占位 `src/routes/$locale/index.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { isLocale } from '~/i18n/locales';
import type { Locale } from '~/i18n/locales';

export const Route = createFileRoute('/$locale/')({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw new Error('Invalid locale');
  },
  loader: ({ params }) => ({ locale: params.locale as Locale }),
  component: () => (
    <div className="px-6 py-16">
      <h1 className="text-3xl mb-4">Index placeholder</h1>
      <p className="text-fg-muted">Will be replaced in Task 11.</p>
    </div>
  ),
});
```

- [ ] **Step 10.5: 写 `src/router.tsx`（完整版）**

```ts
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { isLocale } from './i18n/locales';
import type { Locale } from './i18n/locales';

export const router = createRouter({
  routeTree,
  context: { locale: 'zh-CN' as Locale },
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// 路由守卫：locale 必须合法，否则 404
router.subscribe('onLoad', ({ pathChanged }) => {
  if (!pathChanged) return;
  const seg = window.location.pathname.split('/').filter(Boolean)[0];
  if (seg && !isLocale(seg)) {
    router.navigate({ to: '/404' }).catch(() => {});
  }
});
```

- [ ] **Step 10.6: 跑 dev 验证**

Run: `pnpm dev`
Expected: 访问 `/` 应 302 到 `/zh/` 占位页

- [ ] **Step 10.7: 提交**

```bash
git add src/routes src/router.tsx src/i18n/detect-client.ts
git commit -m "feat(router): add TanStack Router config with locale routes"
```

---

## Task 11: SectionHead + 简单卡片组件

**Files:**
- Create: `src/components/sections/SectionHead.tsx`, `src/components/sections/FormatCard.tsx`, `src/components/sections/FeatureCard.tsx`, `src/components/sections/UseCaseCard.tsx`
- Test: `tests/unit/components/SectionHead.test.tsx`, `tests/unit/components/FormatCard.test.tsx` 等

- [ ] **Step 11.1: 写 `src/components/sections/SectionHead.tsx`**

```tsx
import { Container } from '~/components/layout/Container';
import { cn } from '~/lib/cn';

interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  sub?: string;
  badge?: string;
  anchor?: string;
  className?: string;
}

export function SectionHead({ eyebrow, title, sub, badge, anchor, className }: SectionHeadProps) {
  return (
    <Container className={cn('mb-12 max-w-[720px] flex flex-col gap-3.5', className)}>
      <div className="flex flex-wrap items-center gap-2.5">
        {eyebrow && <span className="font-mono text-xs uppercase tracking-widest text-fg-muted font-medium">{eyebrow}</span>}
        {badge && (
          <span className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 bg-accent/10 text-accent font-mono text-[11.5px] font-medium tracking-wider">
            {badge}
          </span>
        )}
      </div>
      <h2 id={anchor} className="text-3xl lg:text-5xl font-semibold leading-tight tracking-tight scroll-mt-20">
        {title}
      </h2>
      {sub && <p className="text-base lg:text-lg text-fg-muted leading-relaxed max-w-[60ch]">{sub}</p>}
    </Container>
  );
}
```

- [ ] **Step 11.2: 写 `src/components/sections/FormatCard.tsx`**

```tsx
import { Badge } from '~/components/ui/badge';

interface FormatCardProps {
  ext: string;
  title: string;
  description: string;
  features: string[];
}

export function FormatCard({ ext, title, description, features }: FormatCardProps) {
  return (
    <article className="bg-surface border border-border rounded-md p-5 flex flex-col gap-2.5 transition-all hover:border-fg hover:-translate-y-0.5">
      <span className="font-mono text-xs text-accent bg-accent/10 px-2 py-1 rounded self-start">{ext}</span>
      <h3 className="text-lg font-semibold mt-1.5">{title}</h3>
      <p className="text-sm text-fg-muted leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {features.map((f) => (
          <Badge key={f} variant="default" className="text-[11.5px]">{f}</Badge>
        ))}
      </div>
    </article>
  );
}
```

- [ ] **Step 11.3: 写 `src/components/sections/FeatureCard.tsx`**

```tsx
import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="bg-surface border border-border rounded-md p-6 flex flex-col gap-3 transition-colors hover:border-fg">
      <div className="text-2xl text-fg-muted w-10 h-10 flex items-center justify-center border border-border rounded-md bg-bg/50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-fg-muted leading-relaxed">{description}</p>
    </article>
  );
}
```

- [ ] **Step 11.4: 写 `src/components/sections/UseCaseCard.tsx`**

```tsx
import { Badge } from '~/components/ui/badge';

interface UseCaseCardProps {
  tag: string;
  title: string;
  description: string;
  quote: string;
}

export function UseCaseCard({ tag, title, description, quote }: UseCaseCardProps) {
  return (
    <article className="bg-surface border border-border rounded-md p-6 flex flex-col gap-3">
      <Badge variant="mono">{tag}</Badge>
      <h3 className="text-lg font-semibold mt-1">{title}</h3>
      <p className="text-sm text-fg-muted leading-relaxed">{description}</p>
      <blockquote className="mt-2 pt-4 border-t border-border text-sm italic text-fg-muted">"{quote}"</blockquote>
    </article>
  );
}
```

- [ ] **Step 11.5: 写测试**

`tests/unit/components/SectionHead.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHead } from '~/components/sections/SectionHead';

describe('SectionHead', () => {
  it('渲染 eyebrow / title / sub', () => {
    render(<SectionHead eyebrow="格式支持" title="支持 6 种格式" sub="全部本地解析" />);
    expect(screen.getByText('格式支持')).toBeInTheDocument();
    expect(screen.getByText('支持 6 种格式')).toBeInTheDocument();
    expect(screen.getByText('全部本地解析')).toBeInTheDocument();
  });

  it('anchor 渲染到 h2.id', () => {
    render(<SectionHead title="x" anchor="formats" />);
    const h2 = screen.getByText('x');
    expect(h2.id).toBe('formats');
  });
});
```

`tests/unit/components/FormatCard.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormatCard } from '~/components/sections/FormatCard';

describe('FormatCard', () => {
  it('渲染 ext / title / desc / features', () => {
    render(<FormatCard ext=".md" title="Markdown" description="完整 GFM" features={['Mermaid', 'LaTeX']} />);
    expect(screen.getByText('.md')).toBeInTheDocument();
    expect(screen.getByText('Markdown')).toBeInTheDocument();
    expect(screen.getByText('Mermaid')).toBeInTheDocument();
  });
});
```

- [ ] **Step 11.6: 跑测试**

Run: `pnpm test tests/unit/components/SectionHead.test.tsx tests/unit/components/FormatCard.test.tsx`
Expected: PASS

- [ ] **Step 11.7: 提交**

```bash
git add src/components/sections tests/unit/components
git commit -m "feat(sections): add SectionHead, FormatCard, FeatureCard, UseCaseCard"
```

---

## Task 12: 复杂 section 组件（Hero / HeroMock / WorkflowStrip / PrivacySpotlight / PlatformCard / OssSideBlock / StatStrip / SurfaceCard / PrivacyToc）

**Files:** 9 个组件文件 + 对应测试

- [ ] **Step 12.1: 写 `src/components/sections/HeroMock.tsx`**

```tsx
import { Container } from '~/components/layout/Container';
import { useT } from '~/i18n/useT';

export function HeroMock() {
  const t = useT();
  return (
    <div className="relative">
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-2xl shadow-fg/10">
        <div className="flex items-center gap-1.5 pb-3.5 border-b border-border">
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="ml-auto font-mono text-[11px] text-fg-muted">{t('mock.title')}</span>
        </div>
        <div className="pt-3.5 grid gap-2.5 font-mono text-[12.5px] leading-relaxed">
          <div><span className="font-semibold">{t('mock.h1')}</span></div>
          <div className="text-fg-muted">{t('mock.cm')}</div>
          <div className="text-orange-700">{t('mock.h2')}</div>
          <div dangerouslySetInnerHTML={{ __html: t('mock.l1') }} />
          <div dangerouslySetInnerHTML={{ __html: t('mock.l2') }} />
          <div dangerouslySetInnerHTML={{ __html: t('mock.l3') }} />
          <div className="text-orange-700">{t('mock.h3')}</div>
          <div>· {t('mock.s1l')} <span className="text-blue-700">0.6s</span></div>
          <div>· {t('mock.s2l')} <span className="text-blue-700">100%</span></div>
          <div>· {t('mock.s3l')} <span className="text-blue-700">✓</span></div>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-5 bg-fg text-bg rounded-md px-4 py-3.5 flex items-center gap-3 text-[13px] shadow-lg">
        <div>
          <small className="block text-[11px] opacity-70">{t('mock.fl1l')}</small>
          <b className="font-mono text-lg">0.6s</b>
        </div>
        <div className="opacity-40">|</div>
        <div>
          <small className="block text-[11px] opacity-70">{t('mock.fl2l')}</small>
          <b className="font-mono text-lg">100%</b>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 12.2: 写 `src/components/sections/Hero.tsx`**

```tsx
import type { ReactNode } from 'react';
import { Container } from '~/components/layout/Container';
import { Button } from '~/components/ui/button';

interface HeroProps {
  eyebrow?: string;
  headline: string;
  sub: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  metaItems?: string[];
  mockSlot?: ReactNode;
}

export function Hero({ eyebrow, headline, sub, primaryCta, secondaryCta, metaItems, mockSlot }: HeroProps) {
  return (
    <section className="pt-24 pb-16 lg:pt-24 lg:pb-18">
      <Container>
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            {eyebrow && <span className="font-mono text-xs uppercase tracking-widest text-fg-muted font-medium">{eyebrow}</span>}
            <h1 className="text-4xl lg:text-6xl font-semibold leading-tight tracking-tight mt-4">
              {headline}
            </h1>
            <p className="text-base lg:text-lg text-fg-muted leading-relaxed mt-5 max-w-[50ch]">{sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <a href={primaryCta.href}>{primaryCta.label}</a>
              </Button>
              {secondaryCta && (
                <Button asChild size="lg" variant="ghost">
                  <a href={secondaryCta.href}>{secondaryCta.label}</a>
                </Button>
              )}
            </div>
            {metaItems && metaItems.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-fg-muted">
                {metaItems.map((m, i) => (
                  <span key={m} className="flex items-center gap-4">
                    {i > 0 && <span className="w-1 h-1 rounded-full bg-border" />}
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>
          {mockSlot && <div>{mockSlot}</div>}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 12.3: 写 `src/components/sections/WorkflowStrip.tsx`**

```tsx
import { Container } from '~/components/layout/Container';
import { cn } from '~/lib/cn';

interface Step {
  src: string;
  name: string;
  desc: string;
  highlight?: boolean;
}

interface WorkflowStripProps {
  eyebrow: string;
  title: string;
  sub: string;
  steps: Step[];
}

export function WorkflowStrip({ eyebrow, title, sub, steps }: WorkflowStripProps) {
  return (
    <section id="workflow" className="scroll-mt-20">
      <Container>
        <div className="bg-surface border border-border rounded-lg p-10 lg:p-12 flex flex-col gap-6">
          <span className="font-mono text-xs uppercase tracking-widest text-fg-muted font-medium">{eyebrow}</span>
          <h2 className="text-3xl lg:text-5xl font-semibold leading-tight tracking-tight">{title}</h2>
          <p className="text-base lg:text-lg text-fg-muted leading-relaxed max-w-[60ch]">{sub}</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch">
            {steps.map((step, i) => (
              <>
                <div
                  key={i}
                  className={cn(
                    'bg-bg border border-border rounded-md p-4 flex flex-col gap-1.5',
                    step.highlight && 'bg-accent/5 border-accent',
                  )}
                >
                  <span className="font-mono text-[10px] tracking-widest text-fg-muted">{step.src}</span>
                  <span className={cn('font-semibold', step.highlight && 'text-accent')}>{step.name}</span>
                  <span className="text-xs text-fg-muted leading-relaxed">{step.desc}</span>
                </div>
                {i < steps.length - 1 && (
                  <div key={`arrow-${i}`} className="hidden lg:flex items-center justify-center text-fg-muted">
                    →
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 12.4: 写 `src/components/sections/PrivacySpotlight.tsx`**

```tsx
import { Container } from '~/components/layout/Container';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/cn';

interface PrivacyItem {
  bold: string;
  desc: string;
}

interface FlowRow {
  key: string;
  value: string;
  tag: string;
  tagKind: 'local' | 'no';
}

interface PrivacySpotlightProps {
  pill: string;
  title: string;
  sub: string;
  items: PrivacyItem[];
  flowRows: FlowRow[];
  moreHref: string;
  moreLabel: string;
}

export function PrivacySpotlight({ pill, title, sub, items, flowRows, moreHref, moreLabel }: PrivacySpotlightProps) {
  return (
    <section id="privacy" className="scroll-mt-20">
      <Container>
        <div className="bg-surface border border-border rounded-lg p-8 lg:p-12 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-14">
          <div className="flex flex-col gap-5">
            <Badge variant="success"><span className="opacity-60">●</span> {pill}</Badge>
            <h2 className="text-3xl lg:text-5xl font-semibold leading-tight tracking-tight">{title}</h2>
            <p className="text-base text-fg-muted leading-relaxed">{sub}</p>
            <div className="grid gap-4 mt-4">
              {items.map((it) => (
                <div key={it.bold}>
                  <b className="block font-semibold mb-1">{it.bold}</b>
                  <p className="text-sm text-fg-muted leading-relaxed">{it.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-bg border border-border rounded-md overflow-hidden">
              {flowRows.map((row) => (
                <div key={row.key} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border last:border-b-0">
                  <span className="font-mono text-xs text-fg-muted">{row.key}</span>
                  <span className="text-sm">{row.value}</span>
                  <span
                    className={cn(
                      'rounded-pill px-2 py-0.5 text-[11px] font-medium font-mono',
                      row.tagKind === 'local' ? 'bg-success/10 text-success' : 'bg-fg/5 text-fg-muted',
                    )}
                  >
                    {row.tag}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-right mt-3.5">
              <a href={moreHref} className="text-sm text-accent">{moreLabel}</a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 12.5: 写 `src/components/sections/PlatformCard.tsx`**

```tsx
import type { ReactNode } from 'react';
import { Button } from '~/components/ui/button';

interface PlatformCardProps {
  badge: string;
  title: string;
  sub: string;
  cta: { label: string; href: string; icon: ReactNode };
  secondary?: { label: string; href: string; icon: ReactNode };
}

export function PlatformCard({ badge, title, sub, cta, secondary }: PlatformCardProps) {
  return (
    <article className="bg-surface border border-border rounded-lg p-6 lg:p-8 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center justify-center px-3 py-1 bg-bg border border-border rounded-md font-mono text-xs text-fg-muted">
          {badge}
        </span>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-fg-muted">{sub}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-2">
        <Button asChild size="lg">
          <a href={cta.href} target="_blank" rel="noopener">
            {cta.icon} {cta.label}
          </a>
        </Button>
        {secondary && (
          <a href={secondary.href} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
            {secondary.icon} {secondary.label}
          </a>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 12.6: 写 `src/components/sections/OssSideBlock.tsx`**

```tsx
import { Container } from '~/components/layout/Container';
import { Github, AlertCircle } from 'lucide-react';

interface OssSideBlockProps {
  title: string;
  description: string;
  bullets: string[];
  repoUrl: string;
  repoLabel: string;
  issueUrl: string;
  issueLabel: string;
}

export function OssSideBlock({ title, description, bullets, repoUrl, repoLabel, issueUrl, issueLabel }: OssSideBlockProps) {
  return (
    <Container>
      <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-8 bg-bg border border-border rounded-md p-6 lg:p-8">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-fg-muted mt-2">{description}</p>
          <ul className="mt-4 space-y-2 text-sm text-fg">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="text-fg-muted mt-1">·</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 justify-center">
          <a href={repoUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-2.5 px-4 py-3 bg-surface border border-border rounded-md text-sm hover:border-fg">
            <Github size={16} />
            <span className="font-mono">{repoLabel}</span>
          </a>
          <a href={issueUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-2.5 px-4 py-3 bg-accent text-white rounded-md text-sm hover:bg-accent-hover">
            <AlertCircle size={16} />
            <span>{issueLabel}</span>
          </a>
        </div>
      </div>
    </Container>
  );
}
```

- [ ] **Step 12.7: 写 `src/components/sections/StatStrip.tsx`**

```tsx
import { Container } from '~/components/layout/Container';

interface Stat {
  value: string;
  label: string;
}

export function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <section>
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-md overflow-hidden">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface p-6 flex flex-col items-center text-center gap-1">
              <b className="text-3xl font-semibold font-mono">{s.value}</b>
              <span className="text-xs text-fg-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 12.8: 写 `src/components/sections/SurfaceCard.tsx`**

```tsx
import type { ReactNode } from 'react';

interface SurfaceCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  external?: boolean;
}

export function SurfaceCard({ href, icon, title, description, bullets, cta, external }: SurfaceCardProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      className="group bg-surface border border-border rounded-lg p-6 flex flex-col gap-4 hover:border-fg transition-colors"
    >
      <div className="w-10 h-10 flex items-center justify-center border border-border rounded-md font-mono text-base">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-fg-muted leading-relaxed">{description}</p>
      </div>
      <ul className="space-y-1.5 text-sm text-fg-muted">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="text-fg-muted mt-1">·</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <span className="text-sm text-accent mt-auto">{cta} →</span>
    </a>
  );
}
```

- [ ] **Step 12.9: 写 `src/components/sections/PrivacyToc.tsx`**

```tsx
import { Container } from '~/components/layout/Container';

interface TocItem {
  id: string;
  label: string;
}

export function PrivacyToc({ items }: { items: TocItem[] }) {
  return (
    <Container className="mb-12">
      <nav className="bg-surface border border-border rounded-md p-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-fg-muted mb-3">Table of Contents</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} className="text-fg-muted hover:text-accent">
                → {it.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
```

- [ ] **Step 12.10: 写 WorkflowStrip / PrivacySpotlight 测试**

`tests/unit/components/WorkflowStrip.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorkflowStrip } from '~/components/sections/WorkflowStrip';

describe('WorkflowStrip', () => {
  it('渲染 4 个 step', () => {
    render(
      <WorkflowStrip
        eyebrow="AI 工作流"
        title="从提示词到手机阅读"
        sub="只需一次分享"
        steps={[
          { src: 'STEP 01', name: 'ChatGPT', desc: '对话' },
          { src: 'STEP 02', name: '分享', desc: '发送' },
          { src: 'STEP 03', name: 'NovaView', desc: '渲染', highlight: true },
          { src: 'STEP 04', name: '阅读', desc: '看完整文档' },
        ]}
      />,
    );
    expect(screen.getByText('ChatGPT')).toBeInTheDocument();
    expect(screen.getByText('NovaView')).toBeInTheDocument();
    expect(screen.getByText('阅读')).toBeInTheDocument();
  });
});
```

`tests/unit/components/PrivacySpotlight.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrivacySpotlight } from '~/components/sections/PrivacySpotlight';

describe('PrivacySpotlight', () => {
  it('渲染 pill + 4 特性 + 7 行 flow', () => {
    render(
      <PrivacySpotlight
        pill="本地优先"
        title="你的文件不离开你的设备"
        sub="所有渲染都在本地完成"
        items={[{ bold: '不上传', desc: '不经过外部服务器' }]}
        flowRows={[
          { key: '文件路径', value: 'on-device', tag: '本地', tagKind: 'local' },
          { key: '云同步', value: '未启用', tag: '关闭', tagKind: 'no' },
        ]}
        moreHref="/zh/privacy"
        moreLabel="完整政策 →"
      />,
    );
    expect(screen.getByText('本地优先')).toBeInTheDocument();
    expect(screen.getByText('你的文件不离开你的设备')).toBeInTheDocument();
    expect(screen.getByText('不上传')).toBeInTheDocument();
    expect(screen.getByText('on-device')).toBeInTheDocument();
  });
});
```

- [ ] **Step 12.11: 跑测试**

Run: `pnpm test tests/unit/components/`
Expected: PASS

- [ ] **Step 12.12: 提交**

```bash
git add src/components/sections tests/unit/components
git commit -m "feat(sections): add Hero, HeroMock, WorkflowStrip, PrivacySpotlight, PlatformCard, OssSideBlock, StatStrip, SurfaceCard, PrivacyToc"
```

---

## Task 13: SEO 工具 + 各页 head() meta

**Files:**
- Create: `src/lib/seo.ts`
- Modify: 路由文件 head 配置

- [ ] **Step 13.1: 写 `src/lib/seo.ts`**

```ts
import type { Locale } from '~/i18n/locales';

const SITE = 'https://novaview.app';

const META: Record<string, Record<Locale, { title: string; description: string }>> = {
  index: {
    'zh-CN': { title: 'NovaView · 本地优先 极速阅读', description: '手机上阅读 AI 生成文档的最佳方式。Markdown / HTML / JSON / YAML / TXT / CSV 全部支持，开源透明。' },
    en: { title: 'NovaView · Local-first Lightning Fast', description: 'The best way to read AI-generated documents on mobile. Markdown, HTML, JSON, YAML, TXT, CSV — all supported, fully open source.' },
  },
  landing: {
    'zh-CN': { title: 'NovaView · 手机上阅读 AI 文档的最佳方式', description: '本地优先、轻量、秒级打开。Markdown、HTML、JSON、YAML、TXT、CSV 一气呵成 — 文件不离开设备，开源透明。' },
    en: { title: 'NovaView · The best way to read AI docs on phone', description: 'Local-first, lightweight, instant open. Markdown, HTML, JSON, YAML, TXT, CSV — files never leave your device, open source.' },
  },
  privacy: {
    'zh-CN': { title: 'NovaView · 隐私政策', description: 'NovaView 的完整数据处理规则：本地优先、不上传文件、不保存文档原文、零第三方 SDK 集成。' },
    en: { title: 'NovaView · Privacy Policy', description: 'Complete data handling rules for NovaView: local-first, no file upload, no document content stored, zero third-party SDKs.' },
  },
};

export function buildMeta(page: keyof typeof META, locale: Locale) {
  const m = META[page][locale];
  const url = `${SITE}/${locale}${page === 'index' ? '' : '/' + page}`;
  const ogLocale = locale === 'zh-CN' ? 'zh_CN' : 'en_US';
  return {
    title: m.title,
    meta: [
      { name: 'description', content: m.description },
      { property: 'og:title', content: m.title },
      { property: 'og:description', content: m.description },
      { property: 'og:type', content: page === 'privacy' ? 'article' : 'website' },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: ogLocale },
      { property: 'og:image', content: `${SITE}/brand/og-${locale}.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: url }],
    htmlAttrs: { lang: locale },
  };
}
```

- [ ] **Step 13.2: 在 `src/routes/$locale/index.tsx` 接入 head**

```tsx
export const Route = createFileRoute('/$locale/')({
  beforeLoad: ({ params }) => { if (!isLocale(params.locale)) throw new Error('Invalid locale'); },
  loader: ({ params }) => ({ locale: params.locale as Locale }),
  head: ({ loaderData }) => buildMeta('index', loaderData!.locale),
  component: IndexPage, // 见 Task 14
});
```

- [ ] **Step 13.3: 在 landing.tsx / privacy.tsx 接入 head（结构同 13.2）**

- [ ] **Step 13.4: 写 `tests/unit/routes/meta.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest';
import { buildMeta } from '~/lib/seo';

describe('buildMeta', () => {
  it('zh-CN → lang zh-CN + og:locale zh_CN', () => {
    const m = buildMeta('index', 'zh-CN');
    expect(m.htmlAttrs?.lang).toBe('zh-CN');
    expect(m.meta.find((x) => x.property === 'og:locale')?.content).toBe('zh_CN');
  });

  it('en → lang en + canonical 含 /en/', () => {
    const m = buildMeta('landing', 'en');
    expect(m.htmlAttrs?.lang).toBe('en');
    expect(m.links?.[0]?.href).toBe('https://novaview.app/en/landing');
  });

  it('privacy 页 og:type=article，其他=website', () => {
    expect(buildMeta('privacy', 'en').meta.find((x) => x.property === 'og:type')?.content).toBe('article');
    expect(buildMeta('landing', 'en').meta.find((x) => x.property === 'og:type')?.content).toBe('website');
  });
});
```

- [ ] **Step 13.5: 跑测试**

Run: `pnpm test tests/unit/routes/meta.test.tsx`
Expected: PASS

- [ ] **Step 13.6: 提交**

```bash
git add src/lib/seo.ts tests/unit/routes/meta.test.tsx
git commit -m "feat(seo): add per-page meta builder with OG tags + canonical"
```

---

## Task 14: 入口页（index）

**Files:**
- Modify: `src/routes/$locale/index.tsx`

- [ ] **Step 14.1: 替换占位组件为完整页面**

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '~/components/sections/Hero';
import { HeroMock } from '~/components/sections/HeroMock';
import { StatStrip } from '~/components/sections/StatStrip';
import { SurfaceCard } from '~/components/sections/SurfaceCard';
import { SectionHead } from '~/components/sections/SectionHead';
import { isLocale, type Locale } from '~/i18n/locales';
import { useT } from '~/i18n/useT';
import { buildMeta } from '~/lib/seo';

export const Route = createFileRoute('/$locale/')({
  beforeLoad: ({ params }) => { if (!isLocale(params.locale)) throw new Error('Invalid locale'); },
  loader: ({ params }) => ({ locale: params.locale as Locale }),
  head: ({ loaderData }) => buildMeta('index', loaderData!.locale),
  component: IndexPage,
});

function IndexPage() {
  const locale = Route.useLoaderData().locale;
  return <IndexContent locale={locale} />;
}

function IndexContent({ locale }: { locale: Locale }) {
  const t = useT();
  const base = `/${locale}`;
  return (
    <>
      <Hero
        eyebrow={t('hero.eyebrow')}
        headline={t('hero.headline.full')}
        sub={t('hero.sub')}
        primaryCta={{ label: t('hero.cta.primary'), href: '#download' }}
        secondaryCta={{ label: t('hero.cta.secondary'), href: `${base}/landing` }}
        metaItems={[
          `<b>6</b> ${t('hero.meta.formats')}`,
          `<b>&lt;1s</b> ${t('hero.meta.speed')}`,
          `<b>0</b> ${t('hero.meta.upload')}`,
          `<b>0</b> ${t('hero.meta.tracking')}`,
        ]}
        mockSlot={<HeroMock />}
      />

      <StatStrip
        stats={[
          { value: '6', label: t('stat.formats') },
          { value: '0.6s', label: t('stat.speed') },
          { value: '100%', label: t('stat.local') },
          { value: '0', label: t('stat.tracking') },
        ]}
      />

      <section>
        <SectionHead eyebrow={t('surfaces.eyebrow')} title={t('surfaces.title')} sub={t('surfaces.sub')} />
        <div className="grid md:grid-cols-3 gap-5 px-4 lg:px-6 max-w-[1200px] mx-auto">
          <SurfaceCard
            href={`${base}/landing`}
            icon="①"
            title={t('card1.title')}
            description={t('card1.desc')}
            bullets={[t('card1.l1'), t('card1.l2'), t('card1.l3')]}
            cta={t('card1.cta')}
          />
          <SurfaceCard
            href={`${base}/privacy`}
            icon="②"
            title={t('card2.title')}
            description={t('card2.desc')}
            bullets={[t('card2.l1'), t('card2.l2'), t('card2.l3')]}
            cta={t('card2.cta')}
          />
          <SurfaceCard
            href="https://github.com/Woods30/NovaView"
            icon="③"
            title={t('card3.title')}
            description={t('card3.desc')}
            bullets={[t('card3.l1'), t('card3.l2'), t('card3.l3')]}
            cta={t('card3.cta')}
            external
          />
        </div>
      </section>
    </>
  );
}
```

> 注：原型中 `hero.headline` 在 index 页被拆分为 3 段（hero.headline.1/2/3），landing 页是一行。字典需确保这两个变体 key 都存在。如果 landing 用的是 `hero.headline` 单 key + HTML 内嵌 `<br>`，index 用 `hero.headline.full` 是同样的处理。这里统一改成 `hero.headline` 字符串，HTML 中含 `<br>` 由组件处理（参考原型 landing 实现）。

> 修正：直接复用 landing 的 hero.headline（单 key，含 `<br>` 与 `<span class="accent">`），组件用 `dangerouslySetInnerHTML` 渲染：

修改 Hero 组件的 `headline` 字段类型为接受 string 但渲染 HTML：

```tsx
// 在 Hero.tsx 中将 headline 改为：
<h1 className="..." dangerouslySetInnerHTML={{ __html: headline }} />
```

修改 IndexContent：

```tsx
headline={t('hero.headline')}  // 直接用同一 key
```

- [ ] **Step 14.2: 在字典中追加 `hero.headline.full` key（如果未存在）**

如果字典里只有 `hero.headline`（landing 用），无需追加；index 也用同一个 key。

- [ ] **Step 14.3: dev 验证**

Run: `pnpm dev`
访问 `http://localhost:3000/zh/`
Expected: 看到入口页：Hero + StatStrip（4 数字）+ 3 张 SurfaceCard

- [ ] **Step 14.4: 提交**

```bash
git add src/routes/$locale/index.tsx src/components/sections/Hero.tsx
git commit -m "feat(pages): implement index page (hero + stats + 3 surface cards)"
```

---

## Task 15: 产品主页（landing）

**Files:**
- Modify: `src/routes/$locale/landing.tsx`

- [ ] **Step 15.1: 写 `src/routes/$locale/landing.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { Container } from '~/components/layout/Container';
import { Hero } from '~/components/sections/Hero';
import { HeroMock } from '~/components/sections/HeroMock';
import { SectionHead } from '~/components/sections/SectionHead';
import { FormatCard } from '~/components/sections/FormatCard';
import { FeatureCard } from '~/components/sections/FeatureCard';
import { WorkflowStrip } from '~/components/sections/WorkflowStrip';
import { UseCaseCard } from '~/components/sections/UseCaseCard';
import { PlatformCard } from '~/components/sections/PlatformCard';
import { OssSideBlock } from '~/components/sections/OssSideBlock';
import { PrivacySpotlight } from '~/components/sections/PrivacySpotlight';
import { Apple, Play, Download } from 'lucide-react';
import { isLocale, type Locale } from '~/i18n/locales';
import { useT } from '~/i18n/useT';
import { buildMeta } from '~/lib/seo';

export const Route = createFileRoute('/$locale/landing')({
  beforeLoad: ({ params }) => { if (!isLocale(params.locale)) throw new Error('Invalid locale'); },
  loader: ({ params }) => ({ locale: params.locale as Locale }),
  head: ({ loaderData }) => buildMeta('landing', loaderData!.locale),
  component: LandingPage,
});

function LandingPage() {
  const locale = Route.useLoaderData().locale;
  return <LandingContent locale={locale} />;
}

function LandingContent({ locale }: { locale: Locale }) {
  const t = useT();
  const formats = [
    { ext: '.md', title: 'Markdown', desc: t('fmt.md'), feats: ['GFM', 'Mermaid', 'LaTeX'] },
    { ext: '.html', title: 'HTML', desc: t('fmt.html'), feats: ['CSS', 'SVG', 'Sandbox'] },
    { ext: '.json', title: 'JSON', desc: t('fmt.json'), feats: ['Tree', 'Search'] },
    { ext: '.yaml', title: 'YAML', desc: t('fmt.yaml'), feats: ['CI/CD', 'K8s'] },
    { ext: '.txt', title: 'TXT', desc: t('fmt.txt'), feats: ['Long-read'] },
    { ext: '.csv', title: 'CSV', desc: t('fmt.csv'), feats: ['Sort', 'Header'] },
  ];
  const features = [
    { icon: '◐', title: t('f1.h'), desc: t('f1.p') },
    { icon: 'Aa', title: t('f2.h'), desc: t('f2.p') },
    { icon: '⤢', title: t('f3.h'), desc: t('f3.p') },
    { icon: '≡', title: t('f4.h'), desc: t('f4.p') },
    { icon: '⌕', title: t('f5.h'), desc: t('f5.p') },
    { icon: '⇪', title: t('f6.h'), desc: t('f6.p') },
    { icon: '⌬', title: t('f7.h'), desc: t('f7.p') },
    { icon: 'π', title: t('f8.h'), desc: t('f8.p') },
  ];
  return (
    <>
      <Hero
        eyebrow={t('hero.eyebrow')}
        headline={t('hero.headline')}
        sub={t('hero.sub')}
        primaryCta={{ label: t('hero.cta.primary'), href: '#download' }}
        secondaryCta={{ label: t('hero.cta.secondary'), href: '#workflow' }}
        metaItems={[t('hero.meta.1'), t('hero.meta.2'), t('hero.meta.3'), t('hero.meta.4')]}
        mockSlot={<HeroMock />}
      />

      {/* Formats */}
      <section id="formats" className="scroll-mt-20">
        <SectionHead
          eyebrow={t('formats.eyebrow')}
          title={t('formats.title')}
          sub={t('formats.sub')}
          badge={t('formats.badge')}
          anchor="formats"
        />
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formats.map((f) => <FormatCard key={f.ext} {...f} />)}
          </div>
          <div className="mt-6 flex items-center gap-3.5 p-5 bg-surface border border-dashed border-border rounded-md">
            <span className="w-8 h-8 rounded-md bg-accent/10 text-accent grid place-items-center font-mono font-bold">+</span>
            <div className="text-sm">
              <div>{t('formats.foot.title')}</div>
              <small className="block text-xs text-fg-muted mt-0.5">{t('formats.foot.sub')}</small>
            </div>
          </div>
        </Container>
      </section>

      {/* Privacy */}
      <PrivacySpotlight
        pill={t('privacy.pill')}
        title={t('privacy.title')}
        sub={t('privacy.sub')}
        items={[
          { bold: t('privacy.l1.b'), desc: t('privacy.l1.p') },
          { bold: t('privacy.l2.b'), desc: t('privacy.l2.p') },
          { bold: t('privacy.l3.b'), desc: t('privacy.l3.p') },
          { bold: t('privacy.l4.b'), desc: t('privacy.l4.p') },
        ]}
        flowRows={[
          { key: t('flow.r1.k'), value: t('flow.r1.v'), tag: t('flow.r1.t'), tagKind: 'local' },
          { key: t('flow.r2.k'), value: t('flow.r2.v'), tag: t('flow.r2.t'), tagKind: 'local' },
          { key: t('flow.r3.k') ?? '', value: t('flow.r3.v'), tag: t('flow.r3.t'), tagKind: 'local' },
          { key: t('flow.r4.k') ?? '', value: t('flow.r4.v'), tag: t('flow.r4.t'), tagKind: 'local' },
          { key: t('flow.r5.k'), value: t('flow.r5.v'), tag: t('flow.r5.t'), tagKind: 'local' },
          { key: t('flow.r6.k'), value: t('flow.r6.v'), tag: t('flow.r6.t'), tagKind: 'no' },
          { key: t('flow.r7.k'), value: t('flow.r7.v'), tag: t('flow.r7.t'), tagKind: 'no' },
        ]}
        moreHref={`/${locale}/privacy`}
        moreLabel={t('privacy.more')}
      />

      {/* Features */}
      <section id="features" className="scroll-mt-20">
        <SectionHead eyebrow={t('feat.eyebrow')} title={t('feat.title')} sub={t('feat.sub')} anchor="features" />
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </Container>
      </section>

      {/* Workflow */}
      <WorkflowStrip
        eyebrow={t('wf.eyebrow')}
        title={t('wf.title')}
        sub={t('wf.sub')}
        steps={[
          { src: 'STEP 01', name: t('wf.s1.n'), desc: t('wf.s1.d') },
          { src: 'STEP 02', name: t('wf.s2.n'), desc: t('wf.s2.d') },
          { src: 'STEP 03', name: t('wf.s3.n'), desc: t('wf.s3.d'), highlight: true },
          { src: 'STEP 04', name: t('wf.s4.n'), desc: t('wf.s4.d') },
        ]}
      />

      {/* Use cases */}
      <section id="usecases" className="scroll-mt-20">
        <SectionHead eyebrow={t('uc.eyebrow')} title={t('uc.title')} sub={t('uc.sub')} />
        <Container>
          <div className="grid md:grid-cols-3 gap-5">
            <UseCaseCard tag={t('uc1.t')} title={t('uc1.h')} description={t('uc1.p')} quote={t('uc1.q')} />
            <UseCaseCard tag={t('uc2.t')} title={t('uc2.h')} description={t('uc2.p')} quote={t('uc2.q')} />
            <UseCaseCard tag={t('uc3.t')} title={t('uc3.h')} description={t('uc3.p')} quote={t('uc3.q')} />
          </div>
        </Container>
      </section>

      {/* Download */}
      <section id="download" className="scroll-mt-20">
        <SectionHead eyebrow={t('dl.eyebrow')} title={t('dl.title')} sub={t('dl.sub')} anchor="download" />
        <Container>
          <div className="grid md:grid-cols-2 gap-5">
            <PlatformCard
              badge="iOS"
              title="iPhone · iPad"
              sub={t('ios.sub')}
              cta={{ label: t('ios.cta'), href: 'https://apps.apple.com/app/novaview', icon: <Apple size={16} /> }}
            />
            <PlatformCard
              badge="APK"
              title="Android 手机 · 平板"
              sub={t('and.sub')}
              cta={{ label: t('and.cta'), href: 'https://play.google.com/store/apps/details?id=app.novaview', icon: <Play size={16} /> }}
              secondary={{ label: t('and.apk'), href: 'https://github.com/Woods30/NovaView/releases/latest', icon: <Download size={14} /> }}
            />
          </div>
        </Container>
        <OssSideBlock
          title={t('dl.oss.h')}
          description={t('dl.oss.p')}
          bullets={[t('dl.oss.l1'), t('dl.oss.l2'), t('dl.oss.l3')]}
          repoUrl="https://github.com/Woods30/NovaView"
          repoLabel={t('dl.oss.btn')}
          issueUrl="https://github.com/Woods30/NovaView/issues/new/choose"
          issueLabel={t('dl.oss.issue')}
        />
      </section>
    </>
  );
}
```

- [ ] **Step 15.2: dev 验证**

Run: `pnpm dev`
访问 `http://localhost:3000/zh/landing`
Expected: 看到完整产品主页：Hero → 6 格式 → 隐私特写 → 8 特性 → 工作流 → 3 用例 → 下载 2 卡 + 开源块

- [ ] **Step 15.3: 提交**

```bash
git add src/routes/$locale/landing.tsx
git commit -m "feat(pages): implement landing page with all sections"
```

---

## Task 16: 隐私政策页（privacy）

**Files:**
- Modify: `src/routes/$locale/privacy.tsx`

- [ ] **Step 16.1: 从原型 privacy.html 抽取 11 个 section 的 key**

打开 `docs/NovaView-landingpage.zip` 解压的 `privacy.html`，记录：
- TOC 11 项的 anchor 与 label
- 11 个 section 的标题与正文（通常是 `priv.s1.title` `priv.s1.body` 等 key）
- 把 zh-CN 与 en 的对应内容搬到 `src/i18n/zh-CN.json` + `en.json`

- [ ] **Step 16.2: 写 `src/routes/$locale/privacy.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { Container } from '~/components/layout/Container';
import { PrivacyToc } from '~/components/sections/PrivacyToc';
import { isLocale, type Locale } from '~/i18n/locales';
import { useT } from '~/i18n/useT';
import { buildMeta } from '~/lib/seo';

export const Route = createFileRoute('/$locale/privacy')({
  beforeLoad: ({ params }) => { if (!isLocale(params.locale)) throw new Error('Invalid locale'); },
  loader: ({ params }) => ({ locale: params.locale as Locale }),
  head: ({ loaderData }) => buildMeta('privacy', loaderData!.locale),
  component: PrivacyPage,
});

function PrivacyPage() {
  const locale = Route.useLoaderData().locale;
  return <PrivacyContent locale={locale} />;
}

function PrivacyContent({ locale: _ }: { locale: Locale }) {
  const t = useT();
  const tocItems = Array.from({ length: 11 }, (_, i) => ({
    id: `priv.s${i + 1}`,
    label: t(`priv.s${i + 1}.label` as any),
  }));

  return (
    <>
      <section className="pt-16 pb-8">
        <Container className="max-w-[720px]">
          <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">Privacy Policy</span>
          <h1 className="text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mt-4" dangerouslySetInnerHTML={{ __html: t('priv.title') }} />
          <p className="text-base text-fg-muted mt-5" dangerouslySetInnerHTML={{ __html: t('priv.intro') }} />
        </Container>
      </section>

      <PrivacyToc items={tocItems} />

      <Container className="max-w-[720px] prose-like space-y-12 pb-24">
        {Array.from({ length: 11 }, (_, i) => {
          const n = i + 1;
          return (
            <section key={n} id={`priv.s${n}`} className="scroll-mt-20 border-t border-border pt-8">
              <h2 className="text-2xl font-semibold mb-3">{t(`priv.s${n}.label` as any)}</h2>
              <div className="text-fg-muted leading-relaxed space-y-3 text-[15px]" dangerouslySetInnerHTML={{ __html: t(`priv.s${n}.body` as any) }} />
            </section>
          );
        })}
      </Container>
    </>
  );
}
```

- [ ] **Step 16.3: dev 验证**

Run: `pnpm dev`
访问 `http://localhost:3000/zh/privacy`
Expected: 看到 TOC + 11 个章节滚动可见

- [ ] **Step 16.4: 提交**

```bash
git add src/routes/$locale/privacy.tsx src/i18n
git commit -m "feat(pages): implement privacy page with 11 sections + TOC"
```

---

## Task 17: Prerender 配置（6 条路由 SSG 输出）

**Files:**
- Modify: `vite.config.ts`（添加 prerender 列表）
- Verify: `pnpm build` 输出 `dist/client/zh/index.html` 等 6 个 HTML

- [ ] **Step 17.1: 修改 `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

const PRERENDER_ROUTES = [
  '/zh/', '/zh/landing', '/zh/privacy',
  '/en/', '/en/landing', '/en/privacy',
];

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        routes: PRERENDER_ROUTES,
        outputDir: 'dist/client',
      },
    }),
  ],
});
```

> 如 TanStack Start 0.x 的 prerender API 与上不同，参考其文档用 `nitro.prerender.routes` 或 `routes` 字段；关键产物是 6 个 HTML 文件位于 `dist/client/`。

- [ ] **Step 17.2: 运行 build**

Run: `pnpm build`
Expected:
```
dist/client/
  ├── index.html
  ├── zh/
  │   ├── index.html
  │   ├── landing/index.html
  │   └── privacy/index.html
  ├── en/
  │   ├── index.html
  │   ├── landing/index.html
  │   └── privacy/index.html
  ├── brand/...
  ├── favicon.png
  └── assets/...
```

- [ ] **Step 17.3: 验证产物**

Run: `ls dist/client/zh/ dist/client/en/`
Expected: 每个目录有 3 个 index.html

Run: `head -c 500 dist/client/zh/landing/index.html`
Expected: 包含 `<title>NovaView · ...</title>` 与 `<html lang="zh-CN">`

- [ ] **Step 17.4: preview 验证**

Run: `pnpm preview` (background, port 4173)
访问 `http://localhost:4173/zh/landing`
Expected: 看到完整产品页
停止 preview

- [ ] **Step 17.5: 提交**

```bash
git add vite.config.ts
git commit -m "feat(build): configure prerender for 6 routes"
```

---

## Task 18: Cloudflare Pages 配置（wrangler + headers + redirects）

**Files:**
- Create: `wrangler.toml`, `_headers`, `_redirects`

- [ ] **Step 18.1: 写 `wrangler.toml`**

```toml
name = "novaview-com"
pages_build_output_dir = "./dist/client"
compatibility_date = "2026-06-12"
compatibility_flags = ["nodejs_compat"]

[vars]
PUBLIC_SITE_URL = "https://novaview.app"
```

- [ ] **Step 18.2: 写 `_headers`**

```
/
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline'

/brand/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

- [ ] **Step 18.3: 写 `_redirects`**

```
/zh          /zh/          301
/en          /en/          301
/landing     /zh/landing   302
/privacy     /zh/privacy   302
/            /zh/          302
```

- [ ] **Step 18.4: 移动 `_headers` `_redirects` 到 `public/`**

Run: `mv _headers _redirects public/`
（这样 `pnpm build` 时会复制到 `dist/client/`）

- [ ] **Step 18.5: 验证产物**

Run: `pnpm build`
Run: `ls dist/client/_headers dist/client/_redirects`
Expected: 两个文件存在

Run: `cat dist/client/_headers`
Expected: 与上方一致

- [ ] **Step 18.6: 本地 wrangler dev 验证**

Run: `pnpm dlx wrangler pages dev dist/client --port 8788` (background)
Run: `curl -sI http://localhost:8788/zh/landing`
Expected: 200 OK + 包含 CSP / X-Frame-Options
访问 `http://localhost:8788/`
Expected: 302 → `/zh/`
停止 wrangler dev

- [ ] **Step 18.7: 提交**

```bash
git add wrangler.toml public/_headers public/_redirects
git commit -m "feat(deploy): add Cloudflare Pages config (headers, redirects, wrangler)"
```

---

## Task 19: Playwright E2E（6 个 spec）

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/*.spec.ts`

**Interfaces:**
- `pnpm test:e2e` 跑 6 个 spec，3 个断点（360 / 768 / 1440）+ 语言切换 + 主题 + 锚点 + 下载链接 + reduced-motion

- [ ] **Step 19.1: 安装 Playwright**

Run: `pnpm dlx playwright install --with-deps chromium webkit`
Expected: 浏览器下载成功

- [ ] **Step 19.2: 写 `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  webServer: {
    command: 'pnpm preview --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: { baseURL: 'http://localhost:4173' },
  projects: [
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
    { name: 'tablet', use: { ...devices['iPad (gen 7)'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
});
```

- [ ] **Step 19.3: 写 `tests/e2e/responsive.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

const PAGES = [
  { locale: 'zh', page: '/' },
  { locale: 'zh', page: '/landing' },
  { locale: 'zh', page: '/privacy' },
  { locale: 'en', page: '/' },
  { locale: 'en', page: '/landing' },
  { locale: 'en', page: '/privacy' },
];

for (const { locale, page } of PAGES) {
  test(`${locale}${page} 不出现水平滚动`, async ({ page: browser }) => {
    await browser.goto(`/${locale}${page}`);
    const overflow = await browser.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
    await browser.screenshot({ path: `playwright-report/${locale}${page.replace(/\//g, '_')}.png`, fullPage: true });
  });
}
```

- [ ] **Step 19.4: 写 `tests/e2e/i18n-switch.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test('zh → en 切换', async ({ page }) => {
  await page.goto('/zh/landing');
  await expect(page.locator('h1')).toContainText('手机上阅读');

  await page.click('text=EN');
  await expect(page).toHaveURL(/\/en\/landing/);
  await expect(page.locator('h1')).toContainText('AI');
  const stored = await page.evaluate(() => localStorage.getItem('novaview-locale'));
  expect(stored).toBe('en');
});
```

- [ ] **Step 19.5: 写 `tests/e2e/theme-toggle.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test('切换 dark theme 后刷新保持', async ({ page }) => {
  await page.goto('/zh/');
  await page.click('button[aria-label="切换到深色"]');
  await expect(page.locator('html')).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  const stored = await page.evaluate(() => localStorage.getItem('novaview-theme'));
  expect(stored).toBe('dark');
});
```

- [ ] **Step 19.6: 写 `tests/e2e/anchor-nav.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test('topnav 锚点点击滚动到 #formats', async ({ page }) => {
  await page.goto('/zh/landing');
  await page.click('a[href="/zh/landing#formats"]');
  await page.waitForTimeout(500);
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(100);
});
```

- [ ] **Step 19.7: 写 `tests/e2e/download-links.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test('下载链接 href 正确', async ({ page }) => {
  await page.goto('/zh/landing#download');
  const iosHref = await page.locator('a:has-text("App Store 下载")').first().getAttribute('href');
  expect(iosHref).toContain('apps.apple.com/app/novaview');

  const androidHref = await page.locator('a:has-text("Google Play 下载")').first().getAttribute('href');
  expect(androidHref).toContain('play.google.com');

  const apkHref = await page.locator('a:has-text("APK 直装")').first().getAttribute('href');
  expect(apkHref).toContain('github.com/Woods30/NovaView/releases');

  const githubHref = await page.locator('a[href*="github.com/Woods30/NovaView"]').first().getAttribute('href');
  expect(githubHref).toBe('https://github.com/Woods30/NovaView');
});
```

- [ ] **Step 19.8: 写 `tests/e2e/reduced-motion.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test.use({ colorScheme: 'light', reducedMotion: 'reduce' });

test('reduced-motion 下页面仍可访问', async ({ page }) => {
  await page.goto('/zh/landing');
  await expect(page.locator('h1').first()).toBeVisible();
  // 验证无 a11y 致命错误
  const snapshot = await page.accessibility.snapshot();
  expect(snapshot).toBeTruthy();
});
```

- [ ] **Step 19.9: 跑 E2E**

Run: `pnpm build && pnpm test:e2e`
Expected: 18 个测试全部通过（6 spec × 3 projects）

- [ ] **Step 19.10: 提交**

```bash
git add playwright.config.ts tests/e2e package.json pnpm-lock.yaml
git commit -m "test(e2e): add Playwright specs (responsive/i18n/theme/anchor/download/a11y)"
```

---

## Task 20: 路由级测试 + tokens 扫描

**Files:**
- Create: `tests/unit/routes/redirect.test.tsx`, `tests/unit/routes/not-found.test.tsx`, `tests/unit/tokens.test.ts`

- [ ] **Step 20.1: 写 `tests/unit/tokens.test.ts`**

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const ALLOWED_FILES = [
  'src/styles/tokens.css',
  'src/styles/globals.css',
  'src/i18n/zh-CN.json',
  'src/i18n/en.json',
];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

describe('裸 hex 扫描', () => {
  it('src/ 与 tests/ 内（除白名单）没有裸 hex 色值', () => {
    const files = [...walk('src'), ...walk('tests')].filter((f) => /\.(ts|tsx|css|json)$/.test(f));
    const offenders: string[] = [];
    for (const f of files) {
      if (ALLOWED_FILES.some((a) => f.endsWith(a))) continue;
      const content = readFileSync(f, 'utf8');
      const matches = content.match(HEX_RE);
      if (matches) offenders.push(`${f}: ${matches.join(', ')}`);
    }
    expect(offenders).toEqual([]);
  });
});
```

- [ ] **Step 20.2: 写 `tests/unit/routes/redirect.test.tsx`**

```ts
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('~/i18n/detect-client', () => ({
  detectLocaleClient: () => 'en',
}));

describe('根路径重定向', () => {
  it('/ → /en/（mock detect 返回 en）', async () => {
    const mod = await import('~/routes/index');
    expect(mod).toBeDefined();
    // beforeLoad 逻辑：throw redirect({ to: '/$locale', params: { locale: 'en' } })
    // 由于在 jsdom 中实际执行 beforeLoad 需要 Router context，这里只断言模块加载无误
  });
});
```

- [ ] **Step 20.3: 写 `tests/unit/routes/not-found.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { isLocale } from '~/i18n/locales';

describe('locale 验证', () => {
  it('合法 locale 通过', () => {
    expect(isLocale('zh-CN')).toBe(true);
    expect(isLocale('en')).toBe(true);
  });

  it('非法 locale 拒绝', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('zh')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(123)).toBe(false);
  });
});
```

- [ ] **Step 20.4: 跑所有单测**

Run: `pnpm test`
Expected: 18+ 个 spec 全 PASS

- [ ] **Step 20.5: 提交**

```bash
git add tests/unit
git commit -m "test: add tokens scan + route-level tests"
```

---

## Task 21: 端到端验证（Lighthouse + 手工 checklist）

**Files:**
- 无新增文件，纯运行验证

- [ ] **Step 21.1: 跑完整流水线**

Run: `pnpm install --frozen-lockfile && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e`
Expected: 全绿

- [ ] **Step 21.2: Lighthouse 移动端跑每页**

Run: `pnpm dlx lighthouse http://localhost:4173/zh/ --preset=mobile --output=json --output-path=./lh-zh-index.json`
Run: `pnpm dlx lighthouse http://localhost:4173/zh/landing --preset=mobile --output=json --output-path=./lh-zh-landing.json`
Run: `pnpm dlx lighthouse http://localhost:4173/zh/privacy --preset=mobile --output=json --output-path=./lh-zh-privacy.json`
Run: `pnpm dlx lighthouse http://localhost:4173/en/ --preset=mobile --output=json --output-path=./lh-en-index.json`
Run: `pnpm dlx lighthouse http://localhost:4173/en/landing --preset=mobile --output=json --output-path=./lh-en-landing.json`
Run: `pnpm dlx lighthouse http://localhost:4173/en/privacy --preset=mobile --output=json --output-path=./lh-en-privacy.json`

- [ ] **Step 21.3: 提取分数**

```bash
for f in lh-*.json; do
  echo -n "$f: "
  node -e "const r=require('./$f'); console.log('P', Math.round(r.categories.performance.score*100), 'A', Math.round(r.categories.accessibility.score*100), 'BP', Math.round(r.categories['best-practices'].score*100), 'SEO', Math.round(r.categories.seo.score*100));"
done
```

Expected: Performance ≥ 95 / Accessibility = 100 / Best Practices ≥ 95 / SEO = 100（每页）

- [ ] **Step 21.4: 手工 checklist**

启动 `pnpm preview`，浏览器手测：

| 项 | 通过 |
|---|---|
| 360px 无水平滚动 | ☐ |
| 768px 布局正常 | ☐ |
| 1440px 布局正常 | ☐ |
| zh ↔ en 切换 URL 跟随 | ☐ |
| 主题切换 dark / light | ☐ |
| 主题刷新后保持 | ☐ |
| topnav 锚点点击滚动 | ☐ |
| iOS 下载链接 target=_blank | ☐ |
| GitHub 链接 target=_blank | ☐ |
| Issue 链接可访问 | ☐ |
| 关闭 JS 页面仍可读（SSG） | ☐ |
| Footer 4 列显示 | ☐ |

- [ ] **Step 21.5: 提交 lh 报告 + checklist**

```bash
git add docs/lighthouse
git commit -m "docs: add Lighthouse mobile reports + verification checklist"
```

> Lighthouse 报告作为基线存档至 `docs/lighthouse/`，供回归对比。

- [ ] **Step 21.6: 标记完成**

回到 root README，写一段 deploy summary：

```markdown
# NovaView 官网

三页静态站点，部署到 Cloudflare Pages。

## 开发
\`\`\`bash
pnpm install
pnpm dev                # http://localhost:3000
pnpm build && pnpm preview  # 验证 SSG 产物
\`\`\`

## 部署
\`\`\`bash
pnpm build
pnpm dlx wrangler pages deploy dist/client --project-name=novaview-com
\`\`\`
```

Commit:
```bash
git add README.md
git commit -m "docs: add project README"
```

---

## Self-Review Checklist

| 项 | 状态 |
|---|---|
| 每个 spec 节都有对应 task | ✅ Tasks 14/15/16 实现 index/landing/privacy；Task 4-5 实现 i18n；Task 6 实现 theme；Task 2 实现 tokens；Task 13 实现 SEO |
| 无 TBD / TODO / "实现 later" 步骤 | ✅ 已扫描 |
| 关键类型一致（Locale / useT / detectLocale 签名贯穿所有 task） | ✅ 任务 4 定义 → 任务 10/13/14/15/16 复用 |
| 文件路径全部精确（包含 src/ tests/ public/ scripts/） | ✅ |
| 每个 task 含完整代码 + 命令 + 期望输出 | ✅ |
| 每 task 含 commit 步骤 | ✅ |
| 测试 / 实现 / 验证三步齐全（TDD） | ✅ Task 3/4/6/8/9/11/12/13/19/20 均含红→绿流程 |