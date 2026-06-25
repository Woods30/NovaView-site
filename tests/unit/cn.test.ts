import { describe, expect, it } from 'vitest';
import { cn } from '~/lib/cn';

describe('cn', () => {
  it('合并多个类名', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('过滤 falsy 值', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar');
  });

  it('去重 tailwind 冲突类（px-2 vs px-4 保留后者）', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('保留非冲突 tailwind 类', () => {
    expect(cn('text-fg', 'px-4')).toBe('text-fg px-4');
  });
});
