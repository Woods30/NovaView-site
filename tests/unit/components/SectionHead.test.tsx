import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHead } from '~/components/sections/SectionHead';

describe('SectionHead', () => {
  it('渲染 eyebrow / title / sub', () => {
    render(<SectionHead eyebrow="格式支持" title="支持 6 种格式" sub="全部本地解析" />);
    expect(screen.getByText('格式支持')).toBeInTheDocument();
    expect(screen.getByText('支持 6 种格式')).toBeInTheDocument();
    expect(screen.getByText('全部本地解析')).toBeInTheDocument();
  });

  it('anchor 渲染到 h2.id', () => {
    render(<SectionHead title="x" anchor="formats" />);
    const h2 = screen.getByText('x');
    expect(h2.id).toBe('formats');
  });
});