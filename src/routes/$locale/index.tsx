import { createFileRoute } from '@tanstack/react-router';
import { isLocale } from '~/i18n/locales';
import type { Locale } from '~/i18n/locales';

export const Route = createFileRoute('/$locale/')({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw new Error('Invalid locale');
  },
  loader: ({ params }) => ({ locale: params.locale as Locale }),
  component: () => (
    <div className="px-6 py-16">
      <h1 className="text-3xl mb-4">Index placeholder</h1>
      <p className="text-fg-muted">Will be replaced in Task 11.</p>
    </div>
  ),
});