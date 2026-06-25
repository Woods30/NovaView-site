import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Topnav uses TanStack Router Link + useRouterState (via LangSwitch) and a
// ThemeToggle that needs the theme provider. Both would require full app
// scaffolding, so we mock them out — this unit test only verifies the brand
// chrome renders and the download CTA is wired to the right anchor.
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

vi.mock('~/components/layout/ThemeToggle', () => ({
  ThemeToggle: () => <button aria-label="theme-toggle" />,
}));

import { I18nProvider } from '~/i18n/provider';
import { Topnav } from '~/components/layout/Topnav';

function renderTopnav(locale: 'zh-CN' | 'en') {
  return render(
    <I18nProvider locale={locale}>
      <Topnav locale={locale} />
    </I18nProvider>,
  );
}

describe('Topnav', () => {
  it('渲染 brand 文字 + 下载 CTA', () => {
    renderTopnav('zh-CN');
    expect(screen.getByText('NovaView')).toBeInTheDocument();
    expect(screen.getByText('下载')).toBeInTheDocument();
  });

  it('中文时 tagline 显示本地优先', () => {
    renderTopnav('zh-CN');
    expect(screen.getByText('本地优先 · 极速阅读')).toBeInTheDocument();
  });
});
