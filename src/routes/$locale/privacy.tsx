import { createFileRoute } from '@tanstack/react-router';
import { Container } from '~/components/layout/Container';
import { PrivacyToc } from '~/components/sections/PrivacyToc';
import { isUrlLocale, urlLocaleToLocale, type Locale } from '~/i18n/locales';
import { useT } from '~/i18n/useT';
import { buildMeta } from '~/lib/seo';

export const Route = createFileRoute('/$locale/privacy')({
  beforeLoad: ({ params }) => {
    if (!isUrlLocale(params.locale)) throw new Error('Invalid locale');
  },
  loader: ({ params }) => {
    const locale: Locale = urlLocaleToLocale(params.locale as 'zh' | 'en');
    return { locale };
  },
  head: ({ loaderData }) => buildMeta('privacy', loaderData!.locale),
  component: PrivacyPage,
});

function PrivacyPage() {
  const locale = Route.useLoaderData().locale;
  return <PrivacyContent locale={locale} />;
}

function PrivacyContent({ locale: _ }: { locale: Locale }) {
  const t = useT();
  const tocItems = Array.from({ length: 11 }, (_, i) => ({
    id: `priv.s${i + 1}`,
    label: t(`priv.s${i + 1}.label` as `priv.s${number}.label`),
  }));

  return (
    <>
      <section className="pt-16 pb-8">
        <Container className="max-w-[720px]">
          <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">Privacy Policy</span>
          <h1
            className="text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mt-4"
            dangerouslySetInnerHTML={{ __html: t('priv.title') }}
          />
          <p
            className="text-base text-fg-muted mt-5"
            dangerouslySetInnerHTML={{ __html: t('priv.intro') }}
          />
        </Container>
      </section>

      <PrivacyToc items={tocItems} />

      <Container className="max-w-[720px] prose-like space-y-12 pb-24">
        {Array.from({ length: 11 }, (_, i) => {
          const n = i + 1;
          return (
            <section key={n} id={`priv.s${n}`} className="scroll-mt-20 border-t border-border pt-8">
              <h2 className="text-2xl font-semibold mb-3">{t(`priv.s${n}.label` as `priv.s${number}.label`)}</h2>
              <div
                className="text-fg-muted leading-relaxed space-y-3 text-[15px]"
                dangerouslySetInnerHTML={{ __html: t(`priv.s${n}.body` as `priv.s${number}.body`) }}
              />
            </section>
          );
        })}
      </Container>
    </>
  );
}
