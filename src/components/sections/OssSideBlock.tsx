import { AlertCircle, GitBranch } from 'lucide-react';
import { Container } from '~/components/layout/Container';

interface OssSideBlockProps {
  title: string;
  description: string;
  bullets: string[];
  repoUrl: string;
  repoLabel: string;
  issueUrl: string;
  issueLabel: string;
}

export function OssSideBlock({ title, description, bullets, repoUrl, repoLabel, issueUrl, issueLabel }: OssSideBlockProps) {
  return (
    <Container>
      <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-8 bg-bg border border-border rounded-md p-6 lg:p-8">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-fg-muted mt-2">{description}</p>
          <ul className="mt-4 space-y-2 text-sm text-fg">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="text-fg-muted mt-1">·</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 justify-center">
          <a href={repoUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-2.5 px-4 py-3 bg-surface border border-border rounded-md text-sm hover:border-fg">
            <GitBranch size={16} />
            <span className="font-mono">{repoLabel}</span>
          </a>
          <a href={issueUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-2.5 px-4 py-3 bg-accent text-white rounded-md text-sm hover:bg-accent-hover">
            <AlertCircle size={16} />
            <span>{issueLabel}</span>
          </a>
        </div>
      </div>
    </Container>
  );
}