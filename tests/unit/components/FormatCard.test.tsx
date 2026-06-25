import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormatCard } from '~/components/sections/FormatCard';

describe('FormatCard', () => {
  it('渲染 ext / title / desc / features', () => {
    render(<FormatCard ext=".md" title="Markdown" description="完整 GFM" features={['Mermaid', 'LaTeX']} />);
    expect(screen.getByText('.md')).toBeInTheDocument();
    expect(screen.getByText('Markdown')).toBeInTheDocument();
    expect(screen.getByText('Mermaid')).toBeInTheDocument();
  });
});