import type { Locale } from '~/i18n/locales';

const SITE = 'https://novaview.app';

const META: Record<string, Record<Locale, { title: string; description: string }>> = {
  index: {
    'zh-CN': {
      title: 'NovaView · 本地优先 极速阅读',
      description:
        '手机上阅读 AI 生成文档的最佳方式。Markdown / HTML / JSON / YAML / TXT / CSV 全部支持，开源透明。',
    },
    en: {
      title: 'NovaView · Local-first Lightning Fast',
      description:
        'The best way to read AI-generated documents on mobile. Markdown, HTML, JSON, YAML, TXT, CSV — all supported, fully open source.',
    },
  },
  landing: {
    'zh-CN': {
      title: 'NovaView · 手机上阅读 AI 文档的最佳方式',
      description:
        '本地优先、轻量、秒级打开。Markdown、HTML、JSON、YAML、TXT、CSV 一气呵成 — 文件不离开设备，开源透明。',
    },
    en: {
      title: 'NovaView · The best way to read AI docs on phone',
      description:
        'Local-first, lightweight, instant open. Markdown, HTML, JSON, YAML, TXT, CSV — files never leave your device, open source.',
    },
  },
  privacy: {
    'zh-CN': {
      title: 'NovaView · 隐私政策',
      description:
        'NovaView 的完整数据处理规则：本地优先、不上传文件、不保存文档原文、零第三方 SDK 集成。',
    },
    en: {
      title: 'NovaView · Privacy Policy',
      description:
        'Complete data handling rules for NovaView: local-first, no file upload, no document content stored, zero third-party SDKs.',
    },
  },
};

export function buildMeta(page: keyof typeof META, locale: Locale) {
  const m = META[page][locale];
  const url = `${SITE}/${locale}${page === 'index' ? '' : '/' + page}`;
  const ogLocale = locale === 'zh-CN' ? 'zh_CN' : 'en_US';
  return {
    title: m.title,
    meta: [
      { name: 'description', content: m.description },
      { property: 'og:title', content: m.title },
      { property: 'og:description', content: m.description },
      { property: 'og:type', content: page === 'privacy' ? 'article' : 'website' },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: ogLocale },
      { property: 'og:image', content: `${SITE}/brand/og-${locale}.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: url }],
    htmlAttrs: { lang: locale },
  };
}
