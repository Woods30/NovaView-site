import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Logo } from '~/components/brand/Logo';

describe('Logo', () => {
  it('渲染 img 标签带 alt', () => {
    const { container } = render(<Logo alt="NovaView logo" />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('alt')).toBe('NovaView logo');
  });

  it('sm 尺寸 = 32px', () => {
    const { container } = render(<Logo size="sm" alt="x" />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('32');
  });

  it('md 尺寸 = 60px', () => {
    const { container } = render(<Logo size="md" alt="x" />);
    expect(container.querySelector('img')?.getAttribute('width')).toBe('60');
  });
});
