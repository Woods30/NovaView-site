# NovaView

> **Read AI-generated documents on your phone — local-first, offline by default, zero tracking.**
>
> iOS / Android app for reading Markdown, HTML, JSON, YAML, TXT and CSV files that ChatGPT, Claude and Codex generate.

[中文版](./README.zh-CN.md) · English

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

This repo deploys to Cloudflare Pages via `.github/workflows/deploy.yml`. The workflow is **release-triggered** — production only ships when a GitHub Release is published, not on every commit to `main`.

### Release flow

```
feature branch → PR → main (auto-deployed to preview URLs only)
                          │
                          └── Draft Release v1.4.3 → Publish
                                                       │
                                                       ▼
                                  .github/workflows/deploy.yml
                                                       │
                                                       ▼
                                  Build → Cloudflare Pages → novaview.app
                                  + GitHub Release attached with app binaries
```

Why release-triggered and not push-to-main:

- Site + app are versioned together — every release entry on the right sidebar contains the matching site build plus the signed app binaries in its assets
- Direct pushes to `main` don't change production; only a published release does
- Tags give us a clean audit trail: "what was live at v1.4.2?" → check out the tag, build, see

### One-time setup

#### 1. Protect `main` (PRs only, no direct push)

GitHub → **Settings → Branches → Add rule**:

- **Branch name pattern:** `main`
- ☑ **Require a pull request before merging**
  - ☑ Require approvals: **1**
- ☑ **Require status checks to pass before merging**
  - Search for and select: **Build, ensure project, deploy**
- ☑ **Do not allow bypassing the above settings**

Save. From now on the only way to land changes on `main` is via PR. Direct pushes are rejected.

The PR workflow runs the same build + typecheck + unit tests, so reviewers can see green checks before merging.

#### 2. Create the Cloudflare Pages project

Cloudflare dashboard → **Workers & Pages** → Create application → Pages → **Direct Upload** → name it `novaview-com`.

(Direct Upload is what `cloudflare/pages-action` writes to. You don't need to connect the GitHub repo in the dashboard — the workflow handles deployment.)

#### 3. Create a Cloudflare API token

1. Open <https://dash.cloudflare.com/profile/api-tokens> → click **Create Token**
2. Use the **Edit Cloudflare Pages** template (recommended) or build a custom token with `Account → Cloudflare Pages → Edit` permission, scoped to your account
3. Set a TTL — 90 days or less is a good security default
4. Click **Continue to summary** → **Create Token**
5. **Copy the token immediately** — Cloudflare only shows it once. Format: a 40-character hex string like `aBcD1234eFgH5678iJkL9012mNoP3456qRsT7890`
6. Save it in a password manager before closing the tab

#### 4. Get your Account ID

On the Cloudflare dashboard home (<https://dash.cloudflare.com/>), scroll the right sidebar to the bottom and copy the **Account ID** (a 32-character hex string).

#### 5. Add GitHub secrets

In the GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**, add two entries:

| Name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | the token from step 3 |
| `CLOUDFLARE_ACCOUNT_ID` | the account ID from step 4 |

#### 6. (Recommended) Scope secrets to the `production` environment

GitHub → **Settings → Environments → New environment → `production`** → add the same two secrets under the environment's own secrets panel.

Why: workflow_dispatch runs with `environment=preview` won't have access to production secrets. The workflow's `environment:` block makes GitHub inject only the matching secrets.

#### 7. Shipping a release

```bash
git checkout main && git pull           # make sure you're on latest
gh release create v1.4.3 \
    --title "v1.4.3" \
    --notes "What's new in this version..." \
    path/to/app.ipa path/to/app.apk      # attach signed app binaries
```

`gh release create` publishes the release → triggers the workflow → builds + deploys.

To deploy without an app release (site-only hotfix), create an empty release tag:

```bash
git tag v1.4.3-site.1 && git push origin v1.4.3-site.1
gh release create v1.4.3-site.1 --generate-notes
```

#### 8. Manual deploy (escape hatch)

```bash
gh workflow run deploy.yml -f environment=production
```

Or pick a specific ref:

```bash
gh workflow run deploy.yml -f environment=preview -f ref=feature-branch-name
```

### Manual deploy from a local clone

If you need to deploy without going through GitHub Actions:

```bash
pnpm build
pnpm dlx wrangler pages deploy dist/client --project-name=novaview-com
```

You'll need `CLOUDFLARE_API_TOKEN` set as an environment variable and `CLOUDFLARE_ACCOUNT_ID` from the dashboard.

### Custom domain

After the first deploy, in Cloudflare dashboard → `novaview-com` Pages project → **Custom domains**, add `novaview.app`. Cloudflare handles the DNS record and HTTPS automatically. The wrangler.toml `PUBLIC_SITE_URL` variable (used in OG tags and canonical URLs) should match the production domain.

### Branching workflow

```
main (protected) ───── publish v1.4.x ─────► deploy to Cloudflare Pages
   ▲
   │ PR (squash merge)
   │
feature/something ──── commits, push, open PR ────► CI runs build + tests
```

- `main` is the only release source. Direct pushes blocked by branch protection.
- All changes go through a feature branch → PR → squash merge.
- Release tags (`v*.*.*`) trigger the deploy workflow.
- The PR workflow runs the same `typecheck + test + build` so reviewers see green checks before merging.

### Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Authentication error [code: 10000]` | Wrong or expired token | Regenerate the token, update GitHub secret |
| `Authentication error [code: 9109]` | Token missing `Pages: Edit` permission | Recreate token, confirm `Account → Cloudflare Pages → Edit` is set |
| `Project not found` | Project name mismatch | Confirm `pages_build_output_dir` in `wrangler.toml` matches the Cloudflare project name |
| `Account ID invalid` | Account ID copy error | Re-copy from Cloudflare dashboard sidebar |
| Workflow succeeds but site doesn't update | Caching — Cloudflare Pages caches assets at the edge | Hard-refresh in browser (`Cmd-Shift-R`), or check Deployments tab for build hash |
| `Build artifact validation failed` | Missing HTML file in `dist/client` | Run `pnpm build` locally to reproduce; check that prerender script ran without errors |

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
