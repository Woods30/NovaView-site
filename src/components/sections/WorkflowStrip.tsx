import { Fragment } from 'react';
import { Container } from '~/components/layout/Container';
import { cn } from '~/lib/cn';

interface Step {
  src: string;
  name: string;
  desc: string;
  highlight?: boolean;
}

interface WorkflowStripProps {
  eyebrow: string;
  title: string;
  sub: string;
  steps: Step[];
}

export function WorkflowStrip({ eyebrow, title, sub, steps }: WorkflowStripProps) {
  return (
    <section id="workflow" className="scroll-mt-20">
      <Container>
        <div className="bg-surface border border-border rounded-lg p-10 lg:p-12 flex flex-col gap-6">
          <span className="font-mono text-xs uppercase tracking-widest text-fg-muted font-medium">{eyebrow}</span>
          <h2 className="text-3xl lg:text-5xl font-semibold leading-tight tracking-tight">{title}</h2>
          <p className="text-base lg:text-lg text-fg-muted leading-relaxed max-w-[60ch]">{sub}</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch">
            {steps.map((step, i) => (
              <Fragment key={i}>
                <div
                  className={cn(
                    'bg-bg border border-border rounded-md p-4 flex flex-col gap-1.5',
                    step.highlight && 'bg-accent/5 border-accent',
                  )}
                >
                  <span className="font-mono text-[10px] tracking-widest text-fg-muted">{step.src}</span>
                  <span className={cn('font-semibold', step.highlight && 'text-accent')}>{step.name}</span>
                  <span className="text-xs text-fg-muted leading-relaxed">{step.desc}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center text-fg-muted">→</div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}