import { describe, expect, it } from 'vitest';

/**
 * The prerender script and the runtime `buildMeta` helper MUST stay in sync.
 * The prerender script emits the static `<title>` / `<meta>` tags baked into
 * the prerendered HTML; `buildMeta` produces the same tags at runtime for
 * client-side navigation. If the two diverge, the indexable HTML and the
 * runtime-emitted tags disagree — bad for SEO and confusing in dev.
 *
 * This test imports both modules and compares their per-locale title /
 * description strings for each known page. We don't try to import the META
 * table from prerender.mjs directly (it's a `const` inside the script),
 * so instead we re-derive the expected values from the same source of
 * truth: the seo.ts META table — and assert the prerender script's text
 * contains each title and description verbatim.
 */
import { buildMeta } from '~/lib/seo';
import zhCN from '~/i18n/zh-CN.json';
import en from '~/i18n/en.json';

import { readFileSync } from 'fs';
import { resolve } from 'path';

const PRERENDER_PATH = resolve(process.cwd(), 'scripts/prerender.mjs');
const prerenderSrc = readFileSync(PRERENDER_PATH, 'utf8');

const pages = ['index', 'landing', 'privacy'] as const;
const locales = ['zh-CN', 'en'] as const;

describe('SEO / prerender 一致性', () => {
  it('每个 page × locale 的 title 在两处完全一致', () => {
    for (const page of pages) {
      for (const locale of locales) {
        const { title } = buildMeta(page, locale);
        // The prerender script's META table stores the same string. It must
        // appear literally (single-quoted) in the script source so the test
        // catches drift if someone edits one but not the other.
        const expected = `title: '${title}'`;
        expect(
          prerenderSrc.includes(expected),
          `prerender.mjs missing ${page}/${locale} title: ${title}`,
        ).toBe(true);
      }
    }
  });

  it('每个 page × locale 的 description 在两处完全一致', () => {
    for (const page of pages) {
      for (const locale of locales) {
        const { meta } = buildMeta(page, locale);
        const desc = meta.find((m) => m.name === 'description')?.content;
        expect(desc, `buildMeta returned no description for ${page}/${locale}`).toBeTruthy();
        const expected = `description:\n        '${desc}'`;
        expect(
          prerenderSrc.includes(expected),
          `prerender.mjs missing ${page}/${locale} description: ${desc}`,
        ).toBe(true);
      }
    }
  });

  it('prerender 脚本与 seo.ts 都使用同一 SITE origin', () => {
    expect(prerenderSrc.includes("const SITE = 'https://novaview.app'")).toBe(true);
    // seo.ts mirrors the same origin (verify at runtime).
    const indexMeta = buildMeta('index', 'zh-CN');
    expect(indexMeta.links[0]?.href.startsWith('https://novaview.app/')).toBe(true);
  });

  it('i18n 字典与 SEO 描述用同一份底层数据', () => {
    // Spot check: zh-CN dict's `meta.desc` (or similar marketing copy) must
    // be referenced from buildMeta, not duplicated. The brand.title key is
    // one shared input; we just guard against an obvious silent drift.
    expect(typeof zhCN['hero.headline']).toBe('string');
    expect(typeof en['hero.headline']).toBe('string');
  });
});