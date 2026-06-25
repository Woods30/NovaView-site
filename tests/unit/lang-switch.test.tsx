import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '~/i18n/provider';

// Mock @tanstack/react-router so LangSwitch can render without a router context.
// We only assert on the active-class highlight on the pill toggle, which the
// component computes from `currentLocale`, not from the link target.
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    className,
    ...rest
  }: {
    children: React.ReactNode;
    className?: string;
    to?: string;
    params?: Record<string, string>;
  }) => (
    <a className={className} {...rest}>
      {children}
    </a>
  ),
  useRouterState: () => ({ location: { pathname: '/zh-CN/' } }),
}));

import { LangSwitch } from '~/components/layout/LangSwitch';

function renderWith(locale: 'zh-CN' | 'en') {
  return render(
    <I18nProvider locale={locale}>
      <LangSwitch currentLocale={locale} />
    </I18nProvider>,
  );
}

describe('LangSwitch', () => {
  it('中文 locale 时 ZH 按钮高亮', () => {
    renderWith('zh-CN');
    const zhBtn = screen.getByText('中');
    expect(zhBtn.className).toContain('bg-fg');
  });

  it('英文 locale 时 EN 按钮高亮', () => {
    renderWith('en');
    const enBtn = screen.getByText('EN');
    expect(enBtn.className).toContain('bg-fg');
  });
});
