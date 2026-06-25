import { DEFAULT_LOCALE, isLocale, type Locale } from './locales';

export interface DetectInput {
  pathname: string;
  storage: string | null;
  navigatorLang: string | undefined;
}

/**
 * Map a URL path segment to a supported Locale.
 * 'zh' is an accepted shorthand for 'zh-CN' (e.g. '/zh/').
 */
function normalizeSegment(seg: string | undefined): Locale | null {
  if (!seg) return null;
  if (isLocale(seg)) return seg;
  if (seg === 'zh') return 'zh-CN';
  return null;
}

export function detectLocale({ pathname, storage, navigatorLang }: DetectInput): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  const fromUrl = normalizeSegment(seg);
  if (fromUrl) return fromUrl;

  if (isLocale(storage)) return storage;

  const lang = (navigatorLang ?? '').toLowerCase();
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('zh')) return 'zh-CN';

  return DEFAULT_LOCALE;
}
