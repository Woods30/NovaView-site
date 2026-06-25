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
