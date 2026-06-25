import { describe, expect, it } from 'vitest';
import { isLocale, isUrlLocale } from '~/i18n/locales';

describe('locale 验证 (i18n/locales)', () => {
  it('合法 locale 通过 isLocale', () => {
    expect(isLocale('zh-CN')).toBe(true);
    expect(isLocale('en')).toBe(true);
  });

  it('非法 locale 拒绝 isLocale', () => {
    expect(isLocale('fr')).toBe(false);
    // 'zh' is a URL alias, NOT a canonical Locale — confirm the distinction.
    expect(isLocale('zh')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(123)).toBe(false);
    expect(isLocale({})).toBe(false);
    expect(isLocale([])).toBe(false);
    expect(isLocale('ZH-CN')).toBe(false); // case-sensitive
    expect(isLocale('en-US')).toBe(false); // not in supported set
  });

  it('合法 URL locale 通过 isUrlLocale', () => {
    expect(isUrlLocale('zh')).toBe(true);
    expect(isUrlLocale('en')).toBe(true);
  });

  it('非法 URL locale 拒绝 isUrlLocale', () => {
    expect(isUrlLocale('zh-CN')).toBe(false); // canonical form, not URL form
    expect(isUrlLocale('fr')).toBe(false);
    expect(isUrlLocale('')).toBe(false);
    expect(isUrlLocale(null)).toBe(false);
    expect(isUrlLocale(42)).toBe(false);
  });
});

describe('not-found 行为', () => {
  it('__root 路由定义了 notFoundComponent', async () => {
    // The __root route registers a fallback UI for unmatched paths. Loading
    // the module proves the export exists; the component itself is a
    // presentational placeholder rendered by TanStack Router when no child
    // route matches.
    const mod = await import('~/routes/__root');
    expect(mod).toBeDefined();
    expect(mod.Route).toBeDefined();
    const route = mod.Route as unknown as {
      options: { notFoundComponent?: unknown };
    };
    expect(route.options.notFoundComponent).toBeDefined();
  });
});