import { createContext, useCallback, useMemo, type ReactNode } from 'react';
import type { Locale } from './locales';
import type { Dictionary, DictionaryKey } from './types';
import zhCN from './zh-CN.json';
import en from './en.json';

const DICTS: Record<Locale, Dictionary> = { 'zh-CN': zhCN, en };

export interface I18nContextValue {
  locale: Locale;
  t: (key: DictionaryKey) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = DICTS[locale];
  const t = useCallback(
    (key: DictionaryKey) => {
      const v = dict[key];
      if (v === undefined) {
        if (typeof console !== 'undefined') console.warn(`[i18n] missing key: ${key}`);
        return key;
      }
      return v;
    },
    [dict],
  );
  const value = useMemo(() => ({ locale, t }), [locale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}