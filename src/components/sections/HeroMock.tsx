import { useT } from '~/i18n/useT';

export function HeroMock() {
  const t = useT();
  return (
    <div className="relative">
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-2xl shadow-fg/10">
        <div className="flex items-center gap-1.5 pb-3.5 border-b border-border">
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="ml-auto font-mono text-[11px] text-fg-muted">{t('mock.title')}</span>
        </div>
        <div className="pt-3.5 grid gap-2.5 font-mono text-[12.5px] leading-relaxed">
          <div><span className="font-semibold">{t('mock.h1')}</span></div>
          <div className="text-fg-muted">{t('mock.cm')}</div>
          <div className="text-orange-700">{t('mock.h2')}</div>
          <div dangerouslySetInnerHTML={{ __html: t('mock.l1') }} />
          <div dangerouslySetInnerHTML={{ __html: t('mock.l2') }} />
          <div dangerouslySetInnerHTML={{ __html: t('mock.l3') }} />
          <div className="text-orange-700">{t('mock.h3')}</div>
          <div>· {t('mock.s1l')} <span className="text-blue-700">0.6s</span></div>
          <div>· {t('mock.s2l')} <span className="text-blue-700">100%</span></div>
          <div>· {t('mock.s3l')} <span className="text-blue-700">✓</span></div>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-5 bg-fg text-bg rounded-md px-4 py-3.5 flex items-center gap-3 text-[13px] shadow-lg">
        <div>
          <small className="block text-[11px] opacity-70">{t('mock.fl1l')}</small>
          <b className="font-mono text-lg">0.6s</b>
        </div>
        <div className="opacity-40">|</div>
        <div>
          <small className="block text-[11px] opacity-70">{t('mock.fl2l')}</small>
          <b className="font-mono text-lg">100%</b>
        </div>
      </div>
    </div>
  );
}