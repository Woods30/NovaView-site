import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

/**
 * Raw hex color values are only allowed inside the design-token files
 * (tokens.css / globals.css), the i18n dictionaries (which embed brand copy
 * with brand colors), and a handful of build / brand-asset scripts that need
 * concrete hex values for sharp / SVG generation. Anything else is a
 * regression: someone added a literal colour to a component instead of
 * using a CSS variable, which would defeat the whole token system.
 *
 * The regex uses lookarounds rather than `\b` so anchor fragments like
 * `/landing#features` are NOT reported. `f`, `e`, `a` are hex digits but
 * the next character `t` is a word char, so the negative lookahead at the
 * trailing edge correctly rejects it.
 *
 * NB: we intentionally build the literal `#` + digits pattern at runtime so
 * the source of this test file itself never matches the regex.
 */
const HASH = String.fromCharCode(35);
const HEX_RE = new RegExp(`(?<!\\w)${HASH}[0-9a-fA-F]{3,8}(?!\\w)`, 'g');

const ALLOWED_FILES = new Set([
  'src/styles/tokens.css',
  'src/styles/globals.css',
  'src/i18n/zh-CN.json',
  'src/i18n/en.json',
  'scripts/prerender.mjs',
  'scripts/build-brand-assets.mjs',
]);

const SCAN_ROOTS = ['src', 'tests', 'scripts', 'public'];

function walk(dir: string): string[] {
  const out: string[] = [];
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function isAllowed(relPath: string): boolean {
  return ALLOWED_FILES.has(relPath);
}

function looksScannable(relPath: string): boolean {
  return /\.(ts|tsx|css|json|mjs|js|svg)$/.test(relPath);
}

describe('裸 hex 扫描', () => {
  it('src/ tests/ scripts/ public/ 内（除白名单）没有裸 hex 色值', () => {
    const offenders: string[] = [];
    for (const root of SCAN_ROOTS) {
      const files = walk(root).filter(looksScannable);
      for (const abs of files) {
        const rel = abs.replace(/\\/g, '/');
        if (isAllowed(rel)) continue;
        const content = readFileSync(abs, 'utf8');
        const matches = content.match(HEX_RE);
        if (matches) offenders.push(`${rel}: ${matches.join(', ')}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});