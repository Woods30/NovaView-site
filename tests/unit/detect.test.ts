import { describe, expect, it } from 'vitest';
import { detectLocale } from '~/i18n/detect';

describe('detectLocale', () => {
  it('URL 第一段是合法 locale → 用之', () => {
    expect(detectLocale({ pathname: '/en/', storage: null, navigatorLang: 'zh-CN' })).toBe('en');
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
