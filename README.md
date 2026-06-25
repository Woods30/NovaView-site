# NovaView 官网

三页静态站点，部署到 Cloudflare Pages。

## 开发

```bash
pnpm install
pnpm dev                # http://localhost:3000
pnpm build && pnpm preview  # 验证 SSG 产物
```

## 部署

```bash
pnpm build
pnpm dlx wrangler pages deploy dist/client --project-name=novaview-com
```

## 验证

```bash
pnpm typecheck     # tsc --noEmit
pnpm test          # vitest unit tests
pnpm test:e2e      # Playwright E2E
```

## Lighthouse 基线

`docs/lighthouse/` 目录下保存了 6 页（Lighthouse mobile）的 JSON 报告，作为基线存档。
重新生成：

```bash
pnpm preview &                     # serves prerendered HTML on :4173
for r in /zh/ /zh/landing/ /zh/privacy/ /en/ /en/landing/ /en/privacy/; do
  npx --yes lighthouse@latest "http://127.0.0.1:4173$r" \
    --form-factor=mobile --screenEmulation.mobile=true \
    --output=json --output-path="./docs/lighthouse/lh${r//\//-}.json" \
    --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" \
    --chrome-path="$HOME/Library/Caches/ms-playwright/chromium-1228/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
done
```

> **重要**：路径必须以 `/` 结尾，否则 Vite preview 会回退到 SPA 入口（`dist/client/index.html`），无法命中预渲染产物。
> Cloudflare Pages 同样需要 `/zh/landing/` 这种带尾斜杠的路径才能直接命中 `dist/client/zh/landing/index.html`。

## 路由

- `/zh/`、`/en/` — 入口页
- `/zh/landing`、`/en/landing` — 产品主页
- `/zh/privacy`、`/en/privacy` — 隐私政策
