// scripts/prerender.mjs
// Static-site prerender for the 6 marketing routes.
//
// Approach (Option C from task-17-brief):
//   1. SPA build produces dist/client/index.html + assets (vite build).
//   2. Boot `vite preview` against dist/client.
//   3. Use Chromium (via @playwright/test) to visit each route,
//      wait for the React app to mount, then snapshot the rendered HTML.
//   4. Inject per-route <title>, <html lang>, and key <meta> tags into the
//      snapshot (the CSR-only TanStack Router setup does not emit them
//      statically), then write the file to dist/client/{locale}/{route}/index.html.
//
// Usage: node scripts/prerender.mjs [port]

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = join(ROOT, 'dist', 'client');
const PORT = Number(process.argv[2] ?? process.env.PRERENDER_PORT ?? 4173);
const BASE = `http://127.0.0.1:${PORT}`;

const SITE = 'https://novaview.app';

/**
 * @typedef {{ title: string; description: string; ogType: 'website' | 'article' }} Meta
 */

/** @type {Record<string, Record<string, Meta>>} */
const META = {
  index: {
    'zh-CN': {
      title: 'NovaView · 本地优先 极速阅读',
      description:
        '手机上阅读 AI 生成文档的最佳方式。Markdown / HTML / JSON / YAML / TXT / CSV 全部支持，开源透明。',
      ogType: 'website',
    },
    en: {
      title: 'NovaView · Local-first Lightning Fast',
      description:
        'The best way to read AI-generated documents on mobile. Markdown, HTML, JSON, YAML, TXT, CSV — all supported, fully open source.',
      ogType: 'website',
    },
  },
  landing: {
    'zh-CN': {
      title: 'NovaView · 手机上阅读 AI 文档的最佳方式',
      description:
        '本地优先、轻量、秒级打开。Markdown、HTML、JSON、YAML、TXT、CSV 一气呵成 — 文件不离开设备，开源透明。',
      ogType: 'website',
    },
    en: {
      title: 'NovaView · The best way to read AI docs on phone',
      description:
        'Local-first, lightweight, instant open. Markdown, HTML, JSON, YAML, TXT, CSV — files never leave your device, open source.',
      ogType: 'website',
    },
  },
  privacy: {
    'zh-CN': {
      title: 'NovaView · 隐私政策',
      description:
        'NovaView 的完整数据处理规则：本地优先、不上传文件、不保存文档原文、零第三方 SDK 集成。',
      ogType: 'article',
    },
    en: {
      title: 'NovaView · Privacy Policy',
      description:
        'Complete data handling rules for NovaView: local-first, no file upload, no document content stored, zero third-party SDKs.',
      ogType: 'article',
    },
  },
};

/**
 * @typedef {{ path: string; page: keyof typeof META; locale: 'zh-CN' | 'en'; htmlLang: string; ogLocale: string }} RouteSpec
 */

/** @type {RouteSpec[]} */
const ROUTE_SPECS = [
  { path: '/zh/', page: 'index', locale: 'zh-CN', htmlLang: 'zh-CN', ogLocale: 'zh_CN' },
  { path: '/zh/landing', page: 'landing', locale: 'zh-CN', htmlLang: 'zh-CN', ogLocale: 'zh_CN' },
  { path: '/zh/privacy', page: 'privacy', locale: 'zh-CN', htmlLang: 'zh-CN', ogLocale: 'zh_CN' },
  { path: '/en/', page: 'index', locale: 'en', htmlLang: 'en', ogLocale: 'en_US' },
  { path: '/en/landing', page: 'landing', locale: 'en', htmlLang: 'en', ogLocale: 'en_US' },
  { path: '/en/privacy', page: 'privacy', locale: 'en', htmlLang: 'en', ogLocale: 'en_US' },
];

const DEFAULT_ROUTES = ROUTE_SPECS.map((r) => r.path);
const ROUTES = (process.env.PRERENDER_ROUTES ?? DEFAULT_ROUTES.join(','))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

/** @returns {RouteSpec | null} */
function specFor(route) {
  const norm = route.replace(/\/+$/, '') || '/';
  return ROUTE_SPECS.find((r) => r.path === route || r.path.replace(/\/+$/, '') === norm) ?? null;
}

function outputPathFor(route) {
  const cleaned = route.replace(/\/+$/, '') || '/';
  if (cleaned === '/') return join(DIST, 'index.html');
  return join(DIST, cleaned, 'index.html');
}

function injectMeta(html, spec) {
  const meta = META[spec.page][spec.locale];
  const url = `${SITE}/${spec.locale}${spec.page === 'index' ? '' : '/' + spec.page}`;
  const ogImage = `${SITE}/brand/og-${spec.locale}.png`;

  const headInject = `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}">
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.description}">
    <meta property="og:type" content="${meta.ogType}">
    <meta property="og:url" content="${url}">
    <meta property="og:locale" content="${spec.ogLocale}">
    <meta property="og:image" content="${ogImage}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="${url}">
  `;

  let out = html;
  // Replace the <html lang="..."> attribute
  out = out.replace(/<html\s+lang="[^"]*"/, `<html lang="${spec.htmlLang}"`);
  // Insert injected tags right after <head>
  out = out.replace(/<head>/, `<head>${headInject}`);
  return out;
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`preview server did not become ready within ${timeoutMs}ms`);
}

async function main() {
  console.log(`[prerender] dist=${DIST}`);
  console.log(`[prerender] routes=${ROUTES.length}`);
  for (const r of ROUTES) console.log(`  - ${r}`);

  mkdirSync(DIST, { recursive: true });

  console.log(`[prerender] starting vite preview on port ${PORT}...`);
  const preview = spawn(
    'pnpm',
    ['exec', 'vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
    {
      cwd: ROOT,
      stdio: ['ignore', 'inherit', 'inherit'],
      env: { ...process.env },
    },
  );

  let exitCode = 0;
  try {
    await waitForServer(BASE);
    console.log(`[prerender] preview ready at ${BASE}`);

    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });

    try {
      for (const route of ROUTES) {
        const spec = specFor(route);
        if (!spec) {
          console.warn(`[prerender] no spec for ${route}, skipping`);
          continue;
        }
        const url = `${BASE}${route}`;
        console.log(`[prerender] visiting ${url}`);
        const page = await context.newPage();
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        if (!response || !response.ok()) {
          throw new Error(`route ${route} responded ${response?.status() ?? 'no response'}`);
        }
        await page.waitForSelector('main', { timeout: 15000 });
        await page.waitForTimeout(300);

        const rawHtml = await page.content();
        const out = injectMeta(rawHtml, spec);
        const target = outputPathFor(route);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, out, 'utf8');
        console.log(`[prerender] wrote ${target} (${out.length} bytes)`);
        await page.close();
      }
    } finally {
      await context.close();
      await browser.close();
    }
  } catch (err) {
    console.error('[prerender] failed:', err);
    exitCode = 1;
  } finally {
    preview.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 500));
  }

  process.exit(exitCode);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
