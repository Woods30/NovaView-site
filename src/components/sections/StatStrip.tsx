import { Container } from '~/components/layout/Container';

interface Stat {
  value: string;
  label: string;
}

export function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <section>
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-md overflow-hidden">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface p-6 flex flex-col items-center text-center gap-1">
              <b className="text-3xl font-semibold font-mono">{s.value}</b>
              <span className="text-xs text-fg-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}