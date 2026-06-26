import { Container } from '~/components/layout/Container';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/cn';

interface PrivacyItem {
  bold: string;
  desc: string;
}

interface FlowRow {
  key: string;
  value: string;
  tag: string;
  tagKind: 'local' | 'no';
}

interface PrivacySpotlightProps {
  pill: string;
  title: string;
  sub: string;
  items: PrivacyItem[];
  flowRows: FlowRow[];
  moreHref: string;
  moreLabel: string;
}

export function PrivacySpotlight({ pill, title, sub, items, flowRows, moreHref, moreLabel }: PrivacySpotlightProps) {
  return (
    <section id="privacy" className="scroll-mt-20">
      <Container>
        <div className="bg-surface border border-border rounded-lg p-8 lg:p-12 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-14">
          <div className="flex flex-col gap-5">
            <Badge variant="success"><span className="opacity-60">●</span> {pill}</Badge>
            {/* `title` rendered as HTML so i18n strings can use <br> for line
                breaks. Dict content is reviewed in PRs — no user-controlled
                input ever reaches this attribute. */}
            <h2
              className="text-3xl lg:text-5xl font-semibold leading-tight tracking-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="text-base text-fg-muted leading-relaxed">{sub}</p>
            <div className="grid gap-4 mt-4">
              {items.map((it) => (
                <div key={it.bold}>
                  <b className="block font-semibold mb-1">{it.bold}</b>
                  <p className="text-sm text-fg-muted leading-relaxed">{it.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-bg border border-border rounded-md overflow-hidden">
              {flowRows.map((row) => (
                <div key={row.key} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border last:border-b-0">
                  <span className="font-mono text-xs text-fg-muted">{row.key}</span>
                  <span className="text-sm">{row.value}</span>
                  <span
                    className={cn(
                      'rounded-pill px-2 py-0.5 text-[11px] font-medium font-mono',
                      row.tagKind === 'local' ? 'bg-success/10 text-success' : 'bg-fg/5 text-fg-muted',
                    )}
                  >
                    {row.tag}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-right mt-3.5">
              <a href={moreHref} className="text-sm text-accent">{moreLabel}</a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}