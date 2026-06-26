# NovaView

> **Read AI-generated documents on your phone — local-first, offline by default, zero tracking.**
>
> iOS / Android app for reading Markdown, HTML, JSON, YAML, TXT and CSV files that ChatGPT, Claude and Codex generate.

This repository hosts the **open-source marketing site** for NovaView, plus the **public release artifacts** for the iOS and Android apps. The app source itself lives in a separate private repository and is mirrored here as signed binaries on each release.

---

## Repository map

NovaView is split across two repositories on purpose — the marketing site and the app runtime have different release cadences, threat models and licensing needs.

| Repo | Public? | Contents |
|---|---|---|
| **[Woods30/NovaView-site](https://github.com/Woods30/NovaView-site)** (this repo) | ✅ open source | Marketing site (3 pages × 2 locales), Playwright E2E tests, Lighthouse reports, signed app release artifacts under [Releases](../../releases) |
| **[Woods30/NovaView](https://github.com/Woods30/NovaView)** | 🔒 private | iOS / Android app source — a closed-source runtime. New versions are published here as Releases |

The app's closed-source status lets us ship a fast native WebView-based reader without exposing the local rendering pipeline, sandbox policy and on-device parser. Everything user-facing *around* the app — the marketing site, the privacy policy, the public download links, the GitHub issue tracker — is in this repo and is open to contributions.

### Release flow

When a new app version ships, the maintainer copies the signed iOS / Android / APK builds from `Woods30/NovaView` into a draft Release in this repo. The marketing site's download section then links to those release assets. The site itself does **not** rebuild on every app release — only the asset URLs change.

```
Woods30/NovaView (private)                 Woods30/NovaView-site (this repo, public)
─────────────────────                      ─────────────────────────────────
   app v1.4.2 built + signed                  →  Release v1.4.2 published
   App Store / Google Play / GitHub Releases     •  iOS .ipa
                                            •  Android .apk
                                            •  Universal APK
                                            →  landing page download cards
                                                automatically point to the new assets
```

---

## Tech stack

The site is intentionally boring:

- **Vite 5** + **TanStack Start** with file-based routing + static prerender
- **React 19** + **TypeScript strict**
- **Tailwind CSS v4** with `@theme inline` mapping the design tokens
- **shadcn/ui** primitives (Button, Card, Badge, Separator, Sheet)
- **lucide-react** for icons
- **Vitest** + **Playwright** for unit + E2E
- **pnpm 9**
- **Cloudflare Pages** for hosting

Three prerendered HTML files per locale — `/zh/`, `/zh/privacy`, `/en/`, `/en/privacy`. No client-side data fetching, no analytics, no third-party scripts. Dark mode is a static `.dark` class swap on `<html>`; the inline script in `index.html` prevents a flash of wrong theme on first paint.

---

## Quickstart

```bash
pnpm install
pnpm dev                  # http://localhost:3000
```

The dev server hot-reloads routing, Tailwind and React. Locale switching works without a reload — try visiting `/zh/` and clicking the `EN` pill in the topnav.

### Production build

```bash
pnpm build                # vite build + Playwright-driven prerender
pnpm preview              # serves prerendered HTML on http://localhost:4173
```

`pnpm build` writes 4 static HTML files to `dist/client/{zh,en}/.../index.html` plus the shared `assets/` and `brand/` directories.

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

## Brand assets

The single source for the LOGO is `public/brand/logo-source.png`. To regenerate all derived assets (transparent `logo.png`, `favicon.png`, `og-{zh,en}.png`):

```bash
node scripts/build-brand-assets.mjs
```

The script color-keys the warm-brown backdrop from the source asset (`#6F5939`, tolerance 50) so every derived file is truly transparent. To swap in a new LOGO, replace `public/brand/logo-source.png` and re-run.

---

## Contributing

Open issues for anything user-facing: copy edits, design tweaks, new locale support, accessibility fixes, broken links, download-button bugs. For app-specific bug reports (rendering glitches inside the reader, Share Extension issues, sandbox policy questions), open the issue in the closed-source app repo or use the in-app feedback channel — those topics need access to runtime internals.

Before opening a PR:

1. `pnpm test` and `pnpm test:e2e` both green
2. `pnpm typecheck` clean
3. Run Lighthouse on `/zh/` and `/en/` and confirm a11y ≥ 0.95
4. If you added new i18n keys, run `pnpm test tests/unit/i18n-integrity.test.ts` to verify zh-CN ↔ en parity

Translation PRs are welcome for any locale — the dictionary contract is strict (both languages must define identical key sets), so partial translations fail the integrity test until they reach parity.

---

## Privacy

NovaView's privacy policy is the canonical reference for both the app and the site: **[`/zh/privacy`](https://novaview.app/zh/privacy)** · **[`/en/privacy`](https://novaview.app/en/privacy)**.

The site itself collects nothing — no analytics SDK, no cookies, no third-party scripts. The only client-side storage is `localStorage` for the user's explicit locale and theme preferences.

---

## License

The marketing site code (everything in this repo) is released under the **MIT License**. See [`LICENSE`](./LICENSE).

The NovaView iOS / Android app (in `Woods30/NovaView`) is a separate work — see its own license terms when published.
