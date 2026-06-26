import { redirect, createFileRoute } from '@tanstack/react-router';
import { detectLocaleClient } from '~/i18n/detect-client';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const locale = detectLocaleClient();
    throw redirect({ to: '/$locale/', params: { locale } });
  },
});