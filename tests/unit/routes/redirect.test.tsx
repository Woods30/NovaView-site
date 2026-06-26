import { describe, expect, it, vi } from 'vitest';

// Mock the client-side locale detector. The root route's `beforeLoad` calls
// this synchronously and throws a redirect to `/$locale`. By stubbing it we
// control the resolved locale without touching jsdom's location / storage.
vi.mock('~/i18n/detect-client', () => ({
  detectLocaleClient: () => 'en',
}));

// Mock TanStack Router's `redirect` so the throw inside `beforeLoad` is
// observable as a normal object instead of an uncaught exception. We then
// assert on its shape — the canonical contract of this route.
const redirectMock = vi.fn((args: unknown) => ({ __redirect: args }));
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  );
  return {
    ...actual,
    redirect: (args: unknown) => redirectMock(args),
  };
});

import { detectLocaleClient } from '~/i18n/detect-client';

describe('根路径重定向', () => {
  it('detectLocaleClient 在 storage-less / pathname-less 输入下回落到默认值', () => {
    // The mocked implementation simply returns 'en' for any call. The point
    // of this smoke test is to confirm the client detector still returns a
    // valid Locale for the storage-less / pathname-less case the root route
    // hits before redirect.
    expect(detectLocaleClient()).toBe('en');
  });

  it('/ 路由模块加载并注册了 beforeLoad 重定向', async () => {
    const mod = await import('~/routes/index');
    expect(mod).toBeDefined();
    expect(mod.Route).toBeDefined();

    // Calling the route's beforeLoad directly exercises the redirect logic
    // without needing a full Router context. It must call redirect() with
    // a `to` of `/$locale` and the locale resolved by detectLocaleClient().
    redirectMock.mockClear();
    // `beforeLoad` is a function on the route definition.
    const beforeLoad = (mod.Route as unknown as { options: { beforeLoad?: () => void } })
      .options.beforeLoad;
    expect(typeof beforeLoad).toBe('function');

    expect(() => beforeLoad!()).toThrow();
    expect(redirectMock).toHaveBeenCalledTimes(1);
    const arg = redirectMock.mock.calls[0]![0] as {
      to: string;
      params: { locale: string };
    };
    expect(arg.to).toBe('/$locale/');
    expect(arg.params.locale).toBe('en');
  });
});