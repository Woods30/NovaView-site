import { createRouter, createRootRoute } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-bg text-fg p-8">
      <h1 className="text-3xl">Tailwind 测试</h1>
      <p className="text-fg-muted">如果背景米色、文字深灰，说明 token 正常。</p>
    </div>
  ),
});

const router = createRouter({ routeTree: rootRoute });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export { router };
