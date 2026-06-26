import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '~/i18n/provider';
import { Footer } from '~/components/layout/Footer';

function renderFooter(locale: 'zh-CN' | 'en') {
  return render(
    <I18nProvider locale={locale}>
      <Footer locale={locale} />
    </I18nProvider>,
  );
}

describe('Footer', () => {
  it('包含 4 列标题（产品/法律/联系）', () => {
    renderFooter('zh-CN');
    expect(screen.getByText('产品')).toBeInTheDocument();
    expect(screen.getByText('法律')).toBeInTheDocument();
    expect(screen.getByText('联系')).toBeInTheDocument();
  });

  it('联系列显示邮箱地址', () => {
    renderFooter('zh-CN');
    // The mailto link in the 联系 column; meta row no longer duplicates it.
    const link = screen.getByRole('link', { name: 'hello@novaview.app' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'mailto:hello@novaview.app');
  });
});
