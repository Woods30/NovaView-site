import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '~/components/sections/Hero';
import { HeroMock } from '~/components/sections/HeroMock';
import { StatStrip } from '~/components/sections/StatStrip';
import { SurfaceCard } from '~/components/sections/SurfaceCard';
import { SectionHead } from '~/components/sections/SectionHead';
import { isUrlLocale, urlLocaleToLocale, type Locale } from '~/i18n/locales';
import { useT } from '~/i18n/useT';
import { buildMeta } from '~/lib/seo';

export const Route = createFileRoute('/$locale/')({
  beforeLoad: ({ params }) => {
    if (!isUrlLocale(params.locale)) throw new Error('Invalid locale');
  },
  loader: ({ params }) => {
    const locale: Locale = urlLocaleToLocale(params.locale as 'zh' | 'en');
    return { locale };
  },
  head: ({ loaderData }) => buildMeta('index', loaderData!.locale),
  component: IndexPage,
});

function IndexPage() {
  const locale = Route.useLoaderData().locale;
  return <IndexContent locale={locale} />;
}

function IndexContent({ locale }: { locale: Locale }) {
  const t = useT();
  const base = `/${locale}`;
  return (
    <>
      <Hero
        eyebrow={t('hero.eyebrow')}
        headline={t('hero.headline')}
        sub={t('hero.sub')}
        primaryCta={{ label: t('hero.cta.primary'), href: '#download' }}
        secondaryCta={{ label: t('hero.cta.secondary'), href: `${base}/landing` }}
        metaItems={[
          `<b>6</b> ${t('hero.meta.formats')}`,
          `<b>&lt;1s</b> ${t('hero.meta.speed')}`,
          `<b>0</b> ${t('hero.meta.upload')}`,
          `<b>0</b> ${t('hero.meta.tracking')}`,
        ]}
        mockSlot={<HeroMock />}
      />

      <StatStrip
        stats={[
          { value: '6', label: t('stat.formats') },
          { value: '0.6s', label: t('stat.speed') },
          { value: '100%', label: t('stat.local') },
          { value: '0', label: t('stat.tracking') },
        ]}
      />

      <section>
        <SectionHead
          eyebrow={t('surfaces.eyebrow')}
          title={t('surfaces.title')}
          sub={t('surfaces.sub')}
        />
        <div className="grid md:grid-cols-3 gap-5 px-4 lg:px-6 max-w-[1200px] mx-auto">
          <SurfaceCard
            href={`${base}/landing`}
            icon="①"
            title={t('card1.title')}
            description={t('card1.desc')}
            bullets={[t('card1.l1'), t('card1.l2'), t('card1.l3')]}
            cta={t('card1.cta')}
          />
          <SurfaceCard
            href={`${base}/privacy`}
            icon="②"
            title={t('card2.title')}
            description={t('card2.desc')}
            bullets={[t('card2.l1'), t('card2.l2'), t('card2.l3')]}
            cta={t('card2.cta')}
          />
          <SurfaceCard
            href="https://github.com/Woods30/NovaView"
            icon="③"
            title={t('card3.title')}
            description={t('card3.desc')}
            bullets={[t('card3.l1'), t('card3.l2'), t('card3.l3')]}
            cta={t('card3.cta')}
            external
          />
        </div>
      </section>
    </>
  );
}