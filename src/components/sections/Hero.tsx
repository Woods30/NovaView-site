import type { ReactNode } from 'react';
import { Container } from '~/components/layout/Container';
import { Button } from '~/components/ui/button';

export interface HeroProps {
  eyebrow?: string;
  headline: string;
  sub: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  metaItems?: string[];
  mockSlot?: ReactNode;
}

export function Hero({ eyebrow, headline, sub, primaryCta, secondaryCta, metaItems, mockSlot }: HeroProps) {
  return (
    <section className="pt-24 pb-16 lg:pt-24 lg:pb-18">
      <Container>
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            {eyebrow && <span className="font-mono text-xs uppercase tracking-widest text-fg-muted font-medium">{eyebrow}</span>}
            <h1
              className="text-4xl lg:text-6xl font-semibold leading-tight tracking-tight mt-4"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
            <p className="text-base lg:text-lg text-fg-muted leading-relaxed mt-5 max-w-[50ch]">{sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <a href={primaryCta.href}>{primaryCta.label}</a>
              </Button>
              {secondaryCta && (
                <Button asChild size="lg" variant="ghost">
                  <a href={secondaryCta.href}>{secondaryCta.label}</a>
                </Button>
              )}
            </div>
            {metaItems && metaItems.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-fg-muted">
                {metaItems.map((m, i) => (
                  <span key={m} className="flex items-center gap-4">
                    {i > 0 && <span className="w-1 h-1 rounded-full bg-border" />}
                    <span dangerouslySetInnerHTML={{ __html: m }} />
                  </span>
                ))}
              </div>
            )}
          </div>
          {mockSlot && <div>{mockSlot}</div>}
        </div>
      </Container>
    </section>
  );
}