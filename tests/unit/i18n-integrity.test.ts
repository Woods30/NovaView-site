import { describe, expect, it } from 'vitest';
import zhCN from '~/i18n/zh-CN.json';
import en from '~/i18n/en.json';

describe('i18n dict integrity', () => {
  it('zh-CN 与 en 的 key 集合严格相等', () => {
    const zhKeys = Object.keys(zhCN).sort();
    const enKeys = Object.keys(en).sort();
    expect(enKeys).toEqual(zhKeys);
  });

  it('任何 value 都不是空字符串', () => {
    for (const [k, v] of Object.entries(zhCN)) expect(v, `${k} (zh)`).not.toBe('');
    for (const [k, v] of Object.entries(en)) expect(v, `${k} (en)`).not.toBe('');
  });

  it('key 数量 ≥ 300', () => {
    expect(Object.keys(zhCN).length).toBeGreaterThanOrEqual(300);
  });
});
