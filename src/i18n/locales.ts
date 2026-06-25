export const SUPPORTED_LOCALES = ['zh-CN', 'en'] as const;
export const URL_LOCALE_ALIASES = ['zh', 'en'] as const;
export const DEFAULT_LOCALE = 'zh-CN' as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export type UrlLocale = (typeof URL_LOCALE_ALIASES)[number];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Accept URL form (zh, en) for route validation. Returns true if value is a valid URL locale. */
export function isUrlLocale(value: unknown): value is UrlLocale {
  return value === 'zh' || value === 'en';
}

/** Map a URL locale (e.g. 'zh') to its canonical internal Locale (e.g. 'zh-CN'). */
export function urlLocaleToLocale(value: UrlLocale): Locale {
  return value === 'zh' ? 'zh-CN' : value;
}

/**
 * Map an internal `Locale` (e.g. 'zh-CN') to its URL form (e.g. 'zh').
 *
 * Use this whenever building hrefs to in-app routes so the link matches
 * the `$locale` path segment registered in the router (which only
 * accepts `zh` or `en`).
 */
export function localeToUrlLocale(locale: Locale): UrlLocale {
  return locale === 'zh-CN' ? 'zh' : 'en';
}