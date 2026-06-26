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

  it('默认 size = 60px', () => {
    const { container } = render(<Logo alt="x" />);
    expect(container.querySelector('img')?.getAttribute('width')).toBe('60');
  });

  it('自定义 size 通过 width/height 属性生效', () => {
    const { container } = render(<Logo size={32} alt="x" />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('32');
    expect(img?.getAttribute('height')).toBe('32');
  });

  it('始终引用同一个 logo.png 源', () => {
    const { container } = render(<Logo size={180} alt="x" />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/brand/logo.png');
  });
});
