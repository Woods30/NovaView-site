import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('public/brand', { recursive: true });

const src = 'public/brand/logo.png';

// The original LOGO asset ships with a navy backdrop (#0F1B3D) baked into
// every pixel. To produce truly transparent derivatives we must key out
// that color BEFORE resizing — `fit: contain` only controls padding, not
// what's inside the source pixels. We do this once on a high-res buffer
// and reuse it for every size.
const { data: raw, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const NAVY = { r: 15, g: 27, b: 61 };        // exact backdrop color from the asset
const TOLERANCE = 35;                          // generous — soft edges + glow
const keyd = Buffer.alloc(raw.length);
for (let i = 0; i < raw.length; i += 4) {
  const r = raw[i], g = raw[i + 1], b = raw[i + 2];
  const dr = r - NAVY.r, dg = g - NAVY.g, db = b - NAVY.b;
  const dist = Math.sqrt(dr * dr + dg * dg + db * db);
  if (dist > TOLERANCE) {
    keyd[i] = r;
    keyd[i + 1] = g;
    keyd[i + 2] = b;
    keyd[i + 3] = 255;
  } else {
    // Inside navy range → fully transparent.
    keyd[i] = 0;
    keyd[i + 1] = 0;
    keyd[i + 2] = 0;
    keyd[i + 3] = 0;
  }
}

// Save the keyed-out source at native resolution as the canonical logo.png
// so any downstream consumer (Logo component, OG compositor) sees the
// transparent version.
await sharp(keyd, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .toFile('public/brand/logo.png');

// Down-sample once into a clean 360px transparent buffer used by every
// derivative + the OG composite.
const logoBuf = await sharp(keyd, { raw: { width: info.width, height: info.height, channels: 4 } })
  .resize(360, 360, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
await sharp(logoBuf).toFile('public/brand/logo.png');

const meta = await sharp('public/brand/logo.png').metadata();
console.log('logo.png:', meta.width, 'x', meta.height);

// All derivatives use a transparent background so the LOGO sits cleanly on
// any surface (light/dark mode, hero glow, OG card, favicon).
// favicon.png keeps a navy fill because browser chrome tab backgrounds
// vary and a transparent favicon can look invisible on dark themes.
await sharp('public/brand/logo.png')
  .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ quality: 90 })
  .toFile('public/brand/logo-32.png');

await sharp('public/brand/logo.png')
  .resize(60, 60, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ quality: 90 })
  .toFile('public/brand/logo-60.png');

await sharp('public/brand/logo.png')
  .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ quality: 90 })
  .toFile('public/brand/logo-180.png');

await sharp('public/brand/logo.png')
  .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ quality: 90 })
  .toFile('public/favicon.png');

// OG images: solid background with logo centered
// Reuse the 360px transparent logoBuf from above.
await sharp({
  create: { width: 1200, height: 630, channels: 3, background: '#0F1B3D' },
})
  .composite([
    { input: logoBuf, gravity: 'center', blend: 'over' },
    {
      input: Buffer.from(
        `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">` +
          `<text x="50%" y="560" font-family="sans-serif" font-size="48" font-weight="600" fill="white" text-anchor="middle">NovaView</text>` +
          `</svg>`
      ),
      top: 0,
      left: 0,
    },
  ])
  .png()
  .toFile('public/brand/og-zh.png');

// English OG: same image, different text
await sharp({
  create: { width: 1200, height: 630, channels: 3, background: '#0F1B3D' },
})
  .composite([
    { input: logoBuf, gravity: 'center', blend: 'over' },
    {
      input: Buffer.from(
        `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">` +
          `<text x="50%" y="560" font-family="sans-serif" font-size="48" font-weight="600" fill="white" text-anchor="middle">NovaView — Sky Tonight</text>` +
          `</svg>`
      ),
      top: 0,
      left: 0,
    },
  ])
  .png()
  .toFile('public/brand/og-en.png');

console.log('Brand assets generated.');
