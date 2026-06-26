import { Container } from '~/components/layout/Container';
import { cn } from '~/lib/cn';

interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  sub?: string;
  badge?: string;
  anchor?: string;
  className?: string;
}

export function SectionHead({ eyebrow, title, sub, badge, anchor, className }: SectionHeadProps) {
  return (
    <Container className={cn('mb-12 max-w-[720px] flex flex-col gap-3.5', className)}>
      <div className="flex flex-wrap items-center gap-2.5">
        {eyebrow && <span className="font-mono text-xs uppercase tracking-widest text-fg-muted font-medium">{eyebrow}</span>}
        {badge && (
          <span className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 bg-accent/10 text-accent font-mono text-[11.5px] font-medium tracking-wider">
            {badge}
          </span>
        )}
      </div>
      {/* `title` is rendered as HTML so i18n strings can use <br> for line breaks
          (e.g. "现已支持 6 种格式，<br>一个应用全部打开"). Dict content is
          authored in PRs and reviewed, so the XSS surface is null — no
          user-controlled input ever reaches this attribute. */}
      <h2
        id={anchor}
        className="text-3xl lg:text-5xl font-semibold leading-tight tracking-tight scroll-mt-20"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {sub && <p className="text-base lg:text-lg text-fg-muted leading-relaxed max-w-[60ch]">{sub}</p>}
    </Container>
  );
}