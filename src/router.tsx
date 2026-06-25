import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: () => <div className="p-8 text-fg">NovaView placeholder</div>,
});

const router = createRouter({ routeTree: rootRoute });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export { router };
