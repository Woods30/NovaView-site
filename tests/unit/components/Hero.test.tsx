import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero, type HeroProps } from '~/components/sections/Hero';

/**
 * Hero takes all visible text via props (eyebrow, headline, sub, primaryCta,
 * secondaryCta, metaItems) plus an optional mockSlot. We exercise each prop
 * surface with literal strings, no I18nProvider needed.
 */

const FULL_PROPS: HeroProps = {
  eyebrow: 'v1 · local-first',
  headline: 'Read AI docs<br><span class="accent">on your phone</span>',
  sub: 'Markdown, HTML, JSON — all rendered locally.',
  primaryCta: { label: 'Download', href: '#download' },
  secondaryCta: { label: 'See workflow', href: '#workflow' },
  metaItems: ['No ads', 'No tracking', 'Open source'],
  mockSlot: <div data-testid="mock-slot">mock</div>,
};

function renderHero(overrides: Partial<HeroProps> = {}) {
  return render(<Hero {...FULL_PROPS} {...overrides} />);
}

/** Strip a key out of FULL_PROPS so we can render without it. */
function without<K extends keyof HeroProps>(key: K, extra?: Partial<HeroProps>): Omit<HeroProps, K> {
  const { [key]: _omitted, ...rest } = FULL_PROPS;
  return { ...rest, ...extra };
}

describe('Hero', () => {
  it('renders eyebrow, headline (as HTML), and sub', () => {
    renderHero();
    // eyebrow is rendered as a span — match by exact text
    expect(screen.getByText('v1 · local-first')).toBeInTheDocument();
    // headline is rendered via dangerouslySetInnerHTML — the literal text appears
    expect(screen.getByText(/Read AI docs/)).toBeInTheDocument();
    // sub renders as plain text in a <p>
    expect(screen.getByText(/Markdown, HTML, JSON/)).toBeInTheDocument();
  });

  it('renders primary CTA as an anchor with the correct href', () => {
    renderHero();
    const primary = screen.getByRole('link', { name: 'Download' });
    expect(primary).toBeInTheDocument();
    expect(primary).toHaveAttribute('href', '#download');
  });

  it('renders secondary CTA when provided', () => {
    renderHero();
    const secondary = screen.getByRole('link', { name: 'See workflow' });
    expect(secondary).toBeInTheDocument();
    expect(secondary).toHaveAttribute('href', '#workflow');
  });

  it('omits secondary CTA when not provided', () => {
    render(<Hero {...without('secondaryCta')} />);
    expect(screen.queryByRole('link', { name: 'See workflow' })).toBeNull();
  });

  it('renders metaItems as HTML (supports inline markup)', () => {
    renderHero({ metaItems: ['Plain', '<b>Bold</b> meta'] });
    expect(screen.getByText('Plain')).toBeInTheDocument();
    // The second item is rendered via dangerouslySetInnerHTML — the <b> tag
    // appears as a child element rather than literal text.
    expect(screen.getByText('Bold')).toBeInTheDocument();
  });

  it('renders mockSlot when provided', () => {
    renderHero();
    expect(screen.getByTestId('mock-slot')).toBeInTheDocument();
  });

  it('omits mockSlot when not provided', () => {
    render(<Hero {...without('mockSlot')} />);
    expect(screen.queryByTestId('mock-slot')).toBeNull();
  });
});

// Suppress unused-import warning for ReactNode when no other reference exists.
const _unused: ReactNode = null;
void _unused;