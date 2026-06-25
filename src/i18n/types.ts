import type zhCN from './zh-CN.json';
import type { Locale } from './locales';

export type Dictionary = Readonly<Record<string, string>>;

/**
 * Literal-union of every translation key in the zh-CN dict. Both dicts must
 * carry the same set of keys (enforced by `tests/unit/i18n-integrity.test.ts`),
 * so zh-CN is the canonical source for compile-time key checks.
 */
type DictKeys<T> = T extends Record<string, string> ? keyof T & string : never;
export type DictionaryKey = DictKeys<typeof zhCN>;

export type { Locale };