import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '~/i18n/provider';
import { useT } from '~/i18n/useT';
import type { DictionaryKey } from '~/i18n/types';

function Probe() {
  const t = useT();
  return <div>{t('brand.tagline')}</div>;
}

describe('useT', () => {
  it('zh-CN 渲染中文', () => {
    render(
      <I18nProvider locale="zh-CN">
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByText('本地优先 · 极速阅读')).toBeInTheDocument();
  });

  it('en 渲染英文', () => {
    render(
      <I18nProvider locale="en">
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByText('Local-first · Lightning fast')).toBeInTheDocument();
  });

  it('缺 key 时返回 key 本身', () => {
    function Bad() {
      const t = useT();
      // Cast through DictionaryKey — we intentionally call with an unknown
      // key here to exercise the runtime "missing key" branch. The typed
      // useT() should reject this at compile time, which is the point.
      return <div>{t('nonexistent.key' as DictionaryKey)}</div>;
    }
    render(
      <I18nProvider locale="zh-CN">
        <Bad />
      </I18nProvider>,
    );
    expect(screen.getByText('nonexistent.key')).toBeInTheDocument();
  });
});
