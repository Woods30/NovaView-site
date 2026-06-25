import '@testing-library/jest-dom/vitest';
// @ts-expect-error - jsdom 29 ships no .d.ts file
import { JSDOM } from 'jsdom';

// Vitest 4 + jsdom 29: when vitest constructs its jsdom environment it does not
// pass a URL, so jsdom's localStorage is hidden behind a SecurityError and ends
// up undefined on `window`. Build a sidecar JSDOM with a real origin and alias
// localStorage + document onto globalThis so test code can use the bare
// identifiers (matches the brief's test code which uses `localStorage.clear()`,
// `document.documentElement`, etc.).
const sidecar = new JSDOM('<!DOCTYPE html>', { url: 'http://localhost/' });
const w = sidecar.window;

if (typeof (globalThis as { localStorage?: Storage }).localStorage === 'undefined') {
  (globalThis as { localStorage: Storage }).localStorage = w.localStorage;
}
if (typeof (globalThis as { document?: Document }).document === 'undefined') {
  (globalThis as { document: Document }).document = w.document;
}
if (typeof (globalThis as { matchMedia?: unknown }).matchMedia === 'undefined') {
  (globalThis as { matchMedia: (q: string) => MediaQueryList }).matchMedia = (q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}