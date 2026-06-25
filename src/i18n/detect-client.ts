import { detectLocale } from './detect';
import type { Locale } from './locales';

export function detectLocaleClient(): Locale {
  if (typeof window === 'undefined') return 'zh-CN';
  try {
    return detectLocale({
      pathname: window.location.pathname,
      storage: localStorage.getItem('novaview-locale'),
      navigatorLang: window.navigator.language,
    });
  } catch {
    return 'zh-CN';
  }
}