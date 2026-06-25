import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('public/brand', { recursive: true });

const src = 'public/brand/logo.png';

// First, re-encode logo.png itself to a 360px transparent version so it
// stays within the asset budget and serves as a clean source for derivatives.
const logoBuf = await sharp(src)
  .resize(360, 360, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ quality: 90 })
  .toBuffer();
await sharp(logoBuf).toFile('public/brand/logo.png');

const meta = await sharp('public/brand/logo.png').metadata();
console.log('logo.png:', meta.width, 'x', meta.height);

await sharp('public/brand/logo.png')
  .resize(32, 32, { fit: 'contain', background: '#0F1B3D' })
  .png({ quality: 90 })
  .toFile('public/brand/logo-32.png');

await sharp('public/brand/logo.png')
  .resize(60, 60, { fit: 'contain', background: '#0F1B3D' })
  .png({ quality: 90 })
  .toFile('public/brand/logo-60.png');

await sharp('public/brand/logo.png')
  .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ quality: 90 })
  .toFile('public/brand/logo-180.png');

await sharp('public/brand/logo.png')
  .resize(180, 180, { fit: 'contain', background: '#0F1B3D' })
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
