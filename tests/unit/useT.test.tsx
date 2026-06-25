import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '~/i18n/provider';
import { useT } from '~/i18n/useT';

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
      return <div>{t('nonexistent.key')}</div>;
    }
    render(
      <I18nProvider locale="zh-CN">
        <Bad />
      </I18nProvider>,
    );
    expect(screen.getByText('nonexistent.key')).toBeInTheDocument();
  });
});
