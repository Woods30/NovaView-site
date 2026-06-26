# NovaView

> **Read AI-generated documents on your phone — local-first, offline by default, zero tracking.**
>
> iOS / Android app for reading Markdown, HTML, JSON, YAML, TXT and CSV files that ChatGPT, Claude and Codex generate.

This is the open-source project repository for NovaView. It contains:

- the **marketing website** source (this repo, [`src/`](./src))
- the **latest app builds** for iPhone, iPad, Android phones and tablets, published under [**Releases**](../../releases)

The site is hosted at **[novaview.app](https://novaview.app)**. Every release on this repo ships signed `.ipa`, `.apk` and universal-APK builds ready to install on a real device — no App Store or Google Play round trip required.

---

## Why local-first

When you ask ChatGPT for a Markdown report, Claude for an HTML dashboard, or Codex for a JSON diff, the file lands in your phone's share sheet. Most reader apps upload it to a cloud parser before showing it to you. NovaView doesn't. The file is parsed in a sandboxed in-app WebView, never leaves the device, and is wiped from the cache when you close it. No analytics, no accounts, no network calls unless a file format genuinely requires them.

---

## What's in this repo

| Path | Contents |
|---|---|
| [`src/`](./src) | Marketing site source — Vite + TanStack Start + React 19 + Tailwind v4 + shadcn/ui |
| [`public/`](./public) | Static assets (LOGO derivatives, OG share cards, `sitemap.xml`, `robots.txt`) |
| [`scripts/`](./scripts) | Brand asset regeneration + prerender driver |
| [`tests/`](./tests) | Vitest unit specs + Playwright E2E specs |
| [`docs/lighthouse/`](./docs/lighthouse) | Mobile Lighthouse baselines as regression snapshot |
| [**Releases**](../../releases) | Signed iOS / Android / universal-APK builds, one entry per app version |

The site is intentionally boring: 3 prerendered HTML files × 2 locales (zh / en) = 6 static pages, no client-side data fetching, no analytics, no third-party scripts.

---

## Quickstart

The site runs on Node 20+ with pnpm 9.

```bash
pnpm install
pnpm dev                  # http://localhost:3000
```

Hot-reloads routing, Tailwind and React. Locale switching works without a reload — try visiting `/zh/` and clicking the `EN` pill in the topnav.

### Production build

```bash
pnpm build                # vite build + Playwright-driven prerender
pnpm preview              # serves prerendered HTML on http://localhost:4173
```

`pnpm build` writes 4 static HTML files to `dist/client/{zh,en}/.../index.html` plus shared `assets/` and `brand/` directories.

### Installing the app

Grab the latest build from [**Releases**](../../releases):

- **iOS / iPadOS** — download the `.ipa` and install via AltStore, Sideloadly, or Xcode
- **Android** — download the `.apk` (sideload) or the universal APK (works on phones, tablets and emulators)
- **Play Store / App Store** — official channels are linked from the download section on the site

Every release entry is signed and includes the SHA-256 hashes for each artifact.

---

## Tech stack

- **Vite 5** + **TanStack Start** with file-based routing + static prerender
- **React 19** + **TypeScript strict**
- **Tailwind CSS v4** with `@theme inline` mapping the design tokens
- **shadcn/ui** primitives (Button, Card, Badge, Separator, Sheet)
- **lucide-react** for icons
- **Vitest** + **Playwright** for unit + E2E
- **pnpm 9**
- **Cloudflare Pages** for hosting

Dark mode is a static `.dark` class swap on `<html>`. An inline script in `index.html` reads the saved preference and matches the user's OS choice on first paint, so there's no flash of the wrong theme.

---

## Project layout

```
NovaView-site/
├── public/
│   ├── brand/
│   │   ├── logo.png            # single transparent LOGO source
│   │   └── og-{zh,en}.png      # social share cards
│   ├── favicon.png
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── main.tsx
│   ├── router.tsx
│   ├── routes/
│   │   ├── __root.tsx          # global layout (Topnav + Footer + Providers)
│   │   ├── index.tsx           # / → redirect to /$locale/
│   │   └── $locale/
│   │       ├── index.tsx       # the marketing page
│   │       └── privacy.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn primitives
│   │   ├── layout/             # Topnav, Footer, LangSwitch, ThemeToggle, Container
│   │   ├── brand/              # Logo
│   │   └── sections/           # Hero, FormatCard, PrivacySpotlight, WorkflowStrip, …
│   ├── i18n/                   # zh-CN.json, en.json + provider/useT/detect
│   ├── styles/
│   │   ├── tokens.css          # design tokens (colors, fonts, radii)
│   │   └── globals.css         # @theme inline + @layer base resets
│   └── lib/                    # cn, seo
├── scripts/
│   ├── build-brand-assets.mjs  # generates logo.png + favicon.png + OG cards
│   └── prerender.mjs           # Playwright prerender for SSG output
├── tests/
│   ├── unit/                   # Vitest specs (54)
│   └── e2e/                    # Playwright specs (6)
└── docs/
    └── lighthouse/             # mobile Lighthouse baselines
```

---

## Deploy

Deploys target Cloudflare Pages. From this repo:

```bash
pnpm build
pnpm dlx wrangler pages deploy dist/client --project-name=novaview-com
```

Configure the Cloudflare Pages project to use:

- **Build command:** `pnpm build`
- **Build output directory:** `dist/client`
- **Node version:** 20
- **Environment variables:** `PUBLIC_SITE_URL=https://novaview.app`

`_headers` and `_redirects` in `public/` ship automatically with the build (CSP, security headers, `/zh` → `/zh/` trailing-slash normalization).

---

## Verify

```bash
pnpm typecheck     # tsc --noEmit
pnpm test          # Vitest unit tests (54 specs across 19 files)
pnpm test:e2e      # Playwright E2E (6 specs × 3 viewports)
```

`docs/lighthouse/` stores the latest mobile Lighthouse JSON reports as a regression baseline. Regenerate with:

```bash
pnpm preview &                     # serves prerendered HTML on :4173
for r in /zh/ /zh/privacy/ /en/ /en/privacy/; do
  npx --yes lighthouse@latest "http://127.0.0.1:4173$r" \
    --form-factor=mobile --screenEmulation.mobile=true \
    --output=json --output-path="./docs/lighthouse/lh${r//\//-}.json" \
    --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage"
done
```

> **Important:** paths must end with `/`. Without the trailing slash, Vite preview falls back to the SPA shell (`dist/client/index.html`) instead of serving the prerendered HTML.

---

## Brand assets

The single source for the LOGO is `public/brand/logo-source.png`. To regenerate all derived assets (transparent `logo.png`, `favicon.png`, `og-{zh,en}.png`):

```bash
node scripts/build-brand-assets.mjs
```

The script color-keys the warm-brown backdrop from the source asset (`#6F5939`, tolerance 50) so every derived file is truly transparent. To swap in a new LOGO, replace `public/brand/logo-source.png` and re-run.

---

## Contributing

Open issues for anything user-facing: copy edits, design tweaks, new locale support, accessibility fixes, broken links, download-button bugs, release notes, signing keys.

Before opening a PR:

1. `pnpm test` and `pnpm test:e2e` both green
2. `pnpm typecheck` clean
3. Run Lighthouse on `/zh/` and `/en/` and confirm a11y ≥ 0.95
4. If you added new i18n keys, run `pnpm test tests/unit/i18n-integrity.test.ts` to verify zh-CN ↔ en parity

Translation PRs are welcome for any locale — the dictionary contract is strict (both languages must define identical key sets), so partial translations fail the integrity test until they reach parity.

---

## Privacy

NovaView's privacy policy is the canonical reference: **[`/zh/privacy`](https://novaview.app/zh/privacy)** · **[`/en/privacy`](https://novaview.app/en/privacy)**.

The site itself collects nothing — no analytics SDK, no cookies, no third-party scripts. The only client-side storage is `localStorage` for the user's explicit locale and theme preferences.

---

## License

The contents of this repository — marketing site source, build scripts, tests, design assets — are released under the **MIT License**. See [`LICENSE`](./LICENSE).
