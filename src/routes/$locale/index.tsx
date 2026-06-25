import { createFileRoute } from '@tanstack/react-router';
import { Apple, Play, Download } from 'lucide-react';
import { Container } from '~/components/layout/Container';
import { FeatureCard } from '~/components/sections/FeatureCard';
import { FormatCard } from '~/components/sections/FormatCard';
import { Hero } from '~/components/sections/Hero';
import { HeroMock } from '~/components/sections/HeroMock';
import { OssSideBlock } from '~/components/sections/OssSideBlock';
import { PlatformCard } from '~/components/sections/PlatformCard';
import { PrivacySpotlight } from '~/components/sections/PrivacySpotlight';
import { SectionHead } from '~/components/sections/SectionHead';
import { UseCaseCard } from '~/components/sections/UseCaseCard';
import { WorkflowStrip } from '~/components/sections/WorkflowStrip';
import { isUrlLocale, localeToUrlLocale, urlLocaleToLocale, type Locale } from '~/i18n/locales';
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
  const formats = [
    { ext: '.md', title: 'Markdown', desc: t('fmt.md'), feats: ['GFM', 'Mermaid', 'LaTeX'] },
    { ext: '.html', title: 'HTML', desc: t('fmt.html'), feats: ['CSS', 'SVG', 'Sandbox'] },
    { ext: '.json', title: 'JSON', desc: t('fmt.json'), feats: ['Tree', 'Search'] },
    { ext: '.yaml', title: 'YAML', desc: t('fmt.yaml'), feats: ['CI/CD', 'K8s'] },
    { ext: '.txt', title: 'TXT', desc: t('fmt.txt'), feats: ['Long-read'] },
    { ext: '.csv', title: 'CSV', desc: t('fmt.csv'), feats: ['Sort', 'Header'] },
  ];
  const features = [
    { icon: '◐', title: t('f1.h'), desc: t('f1.p') },
    { icon: 'Aa', title: t('f2.h'), desc: t('f2.p') },
    { icon: '⤢', title: t('f3.h'), desc: t('f3.p') },
    { icon: '≡', title: t('f4.h'), desc: t('f4.p') },
    { icon: '⌕', title: t('f5.h'), desc: t('f5.p') },
    { icon: '⇪', title: t('f6.h'), desc: t('f6.p') },
    { icon: '⌬', title: t('f7.h'), desc: t('f7.p') },
    { icon: 'π', title: t('f8.h'), desc: t('f8.p') },
  ];
  return (
    <>
      <Hero
        eyebrow={t('hero.eyebrow')}
        headline={t('hero.headline')}
        sub={t('hero.sub')}
        primaryCta={{ label: t('hero.cta.primary'), href: '#download' }}
        secondaryCta={{ label: t('hero.cta.secondary'), href: '#workflow' }}
        metaItems={[t('hero.meta.1'), t('hero.meta.2'), t('hero.meta.3'), t('hero.meta.4')]}
        mockSlot={<HeroMock />}
      />

      {/* Formats */}
      <section id="formats" className="scroll-mt-20">
        <SectionHead
          eyebrow={t('formats.eyebrow')}
          title={t('formats.title')}
          sub={t('formats.sub')}
          badge={t('formats.badge')}
          anchor="formats"
        />
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formats.map((f) => (
              <FormatCard key={f.ext} ext={f.ext} title={f.title} description={f.desc} features={f.feats} />
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3.5 p-5 bg-surface border border-dashed border-border rounded-md">
            <span className="w-8 h-8 rounded-md bg-accent/10 text-accent grid place-items-center font-mono font-bold">
              +
            </span>
            <div className="text-sm">
              <div>{t('formats.foot.title')}</div>
              <small className="block text-xs text-fg-muted mt-0.5">{t('formats.foot.sub')}</small>
            </div>
          </div>
        </Container>
      </section>

      {/* Privacy */}
      <PrivacySpotlight
        pill={t('privacy.pill')}
        title={t('privacy.title')}
        sub={t('privacy.sub')}
        items={[
          { bold: t('privacy.l1.b'), desc: t('privacy.l1.p') },
          { bold: t('privacy.l2.b'), desc: t('privacy.l2.p') },
          { bold: t('privacy.l3.b'), desc: t('privacy.l3.p') },
          { bold: t('privacy.l4.b'), desc: t('privacy.l4.p') },
        ]}
        flowRows={[
          { key: t('flow.r1.k'), value: t('flow.r1.v'), tag: t('flow.r1.t'), tagKind: 'local' },
          { key: t('flow.r2.k'), value: t('flow.r2.v'), tag: t('flow.r2.t'), tagKind: 'local' },
          { key: t('flow.r3.k') ?? '', value: t('flow.r3.v'), tag: t('flow.r3.t'), tagKind: 'local' },
          { key: t('flow.r4.k') ?? '', value: t('flow.r4.v'), tag: t('flow.r4.t'), tagKind: 'local' },
          { key: t('flow.r5.k'), value: t('flow.r5.v'), tag: t('flow.r5.t'), tagKind: 'local' },
          { key: t('flow.r6.k'), value: t('flow.r6.v'), tag: t('flow.r6.t'), tagKind: 'no' },
          { key: t('flow.r7.k'), value: t('flow.r7.v'), tag: t('flow.r7.t'), tagKind: 'no' },
        ]}
        moreHref={`/${localeToUrlLocale(locale)}/privacy`}
        moreLabel={t('privacy.more')}
      />

      {/* Features */}
      <section id="features" className="scroll-mt-20">
        <SectionHead
          eyebrow={t('feat.eyebrow')}
          title={t('feat.title')}
          sub={t('feat.sub')}
          anchor="features"
        />
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.desc} />
            ))}
          </div>
        </Container>
      </section>

      {/* Workflow */}
      <WorkflowStrip
        eyebrow={t('wf.eyebrow')}
        title={t('wf.title')}
        sub={t('wf.sub')}
        steps={[
          { src: 'STEP 01', name: t('wf.s1.n'), desc: t('wf.s1.d') },
          { src: 'STEP 02', name: t('wf.s2.n'), desc: t('wf.s2.d') },
          { src: 'STEP 03', name: t('wf.s3.n'), desc: t('wf.s3.d'), highlight: true },
          { src: 'STEP 04', name: t('wf.s4.n'), desc: t('wf.s4.d') },
        ]}
      />

      {/* Use cases */}
      <section id="usecases" className="scroll-mt-20">
        <SectionHead eyebrow={t('uc.eyebrow')} title={t('uc.title')} sub={t('uc.sub')} />
        <Container>
          <div className="grid md:grid-cols-3 gap-5">
            <UseCaseCard tag={t('uc1.t')} title={t('uc1.h')} description={t('uc1.p')} quote={t('uc1.q')} />
            <UseCaseCard tag={t('uc2.t')} title={t('uc2.h')} description={t('uc2.p')} quote={t('uc2.q')} />
            <UseCaseCard tag={t('uc3.t')} title={t('uc3.h')} description={t('uc3.p')} quote={t('uc3.q')} />
          </div>
        </Container>
      </section>

      {/* Download */}
      <section id="download" className="scroll-mt-20">
        <SectionHead
          eyebrow={t('dl.eyebrow')}
          title={t('dl.title')}
          sub={t('dl.sub')}
          anchor="download"
        />
        <Container>
          <div className="grid md:grid-cols-2 gap-5">
            <PlatformCard
              badge="iOS"
              title={t('dl.ios.title')}
              sub={t('ios.sub')}
              cta={{
                label: t('ios.cta'),
                href: 'https://apps.apple.com/app/novaview',
                icon: <Apple size={16} />,
              }}
            />
            <PlatformCard
              badge="APK"
              title={t('dl.android.title')}
              sub={t('and.sub')}
              cta={{
                label: t('and.cta'),
                href: 'https://play.google.com/store/apps/details?id=app.novaview',
                icon: <Play size={16} />,
              }}
              secondary={{
                label: t('and.apk'),
                href: 'https://github.com/Woods30/NovaView/releases/latest',
                icon: <Download size={14} />,
              }}
            />
          </div>
        </Container>
        <OssSideBlock
          title={t('dl.oss.h')}
          description={t('dl.oss.p')}
          bullets={[t('dl.oss.l1'), t('dl.oss.l2'), t('dl.oss.l3')]}
          repoUrl="https://github.com/Woods30/NovaView"
          repoLabel={t('dl.oss.btn')}
          issueUrl="https://github.com/Woods30/NovaView/issues/new/choose"
          issueLabel={t('dl.oss.issue')}
        />
      </section>
    </>
  );
}
