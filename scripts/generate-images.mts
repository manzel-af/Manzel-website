/**
 * Renders the site's raster images with a real browser:
 *
 *   public/og/{fa,ps,en}.jpg   1200×630 social cards for the full site
 *   public/og/soon-*.jpg       the coming-soon page's cards — brand only
 *   app/apple-icon.png         180×180 home-screen icon
 *   public/icon-{192,512}.png  manifest icons
 *
 * Why a browser and not `next/og`: the social cards are in Dari and Pashto,
 * and next/og's renderer does not shape Arabic script — letters come out
 * unjoined, which is unreadable. Chrome shapes it perfectly, with the same
 * fonts as the site.
 *
 * Run after changing the brand or the hero copy:
 *
 *   node scripts/generate-images.mts
 *
 * Needs Chrome or Edge installed; set CHROME_PATH if it is not found.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Installed with Next (it optimises images); used here to turn the cards into JPEGs.
import sharp from 'sharp';

import { BRAND, LOCKUP_STACKED, MARK as ARCH_M, TILE, WORDMARK_DARI, type BrandShape } from '../components/brand/paths.ts';
import { en } from '../dictionaries/en.ts';
import { fa } from '../dictionaries/fa.ts';
import { ps } from '../dictionaries/ps.ts';

const root = resolve(import.meta.dirname, '..');
const fonts = pathToFileURL(join(root, 'app', 'fonts')).href;

const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((candidate) => candidate && existsSync(candidate));

if (!chrome) {
  console.error('Chrome or Edge not found. Set CHROME_PATH.');
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), 'manzel-og-'));

function shoot(html: string, out: string, width: number, height: number) {
  const page = join(work, `${width}x${height}-${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(page, html, 'utf8');
  mkdirSync(resolve(out, '..'), { recursive: true });
  execFileSync(chrome!, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--user-data-dir=${join(work, 'profile')}`,
    `--window-size=${width},${height}`,
    '--virtual-time-budget=4000',
    '--default-background-color=00000000',
    `--screenshot=${out}`,
    pathToFileURL(page).href,
  ], { stdio: 'ignore' });
  if (out.startsWith(root)) console.log('✓', out.replace(root, '.'));
}

const FONT_FACES = `
  @font-face { font-family: Vazirmatn; src: url('${fonts}/Vazirmatn-Variable.woff2') format('woff2'); font-weight: 100 900; }
  @font-face { font-family: Sansation; src: url('${fonts}/Sansation-Regular.woff2') format('woff2'); font-weight: 400; }
  @font-face { font-family: Sansation; src: url('${fonts}/Sansation-Bold.woff2') format('woff2'); font-weight: 700; }
`;

// The identity ("Taq"), from components/brand/paths.ts — the same shapes the
// site and the app draw. Run scripts/brand.mts first if the brand changed.
const pieces = (shape: BrandShape, ink: string) =>
  shape.letters.map((d) => `<path fill-rule="evenodd" fill="${ink}" d="${d}"/>`).join('') +
  shape.light.map((d) => `<path fill-rule="evenodd" fill="${BRAND.saffron}" d="${d}"/>`).join('');

/** The app icon: the arch-m on its rounded lapis tile. `radius` 0 for a full square. */
const MARK = (size: number, radius: number = TILE.radius) => `
  <svg width="${size}" height="${size}" viewBox="0 0 ${TILE.size} ${TILE.size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${TILE.size}" height="${TILE.size}" rx="${radius}" fill="${BRAND.lapis}"/>${pieces(ARCH_M, BRAND.paper)}
  </svg>`;

/** The arch-m alone, in paper: for a doorway on a dark ground. */
const GLYPH = (width: number) => `
  <svg width="${width}" height="${(width * ARCH_M.height) / ARCH_M.width}" viewBox="${ARCH_M.viewBox}" xmlns="http://www.w3.org/2000/svg">
    ${pieces(ARCH_M, BRAND.paper)}
  </svg>`;

/** The name in paper: منزل, or منزل over manzel on English cards. `height` is the Dari's. */
const NAME = (height: number, latin: boolean) => {
  const shape = latin ? LOCKUP_STACKED : WORDMARK_DARI;
  const total = (height * shape.height) / WORDMARK_DARI.height;
  const width = (total * shape.width) / shape.height;
  return `<svg width="${width}" height="${total}" viewBox="${shape.viewBox}" xmlns="http://www.w3.org/2000/svg">${pieces(shape, BRAND.paper)}</svg>`;
};

const GIRIH = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23F0BE51' stroke-opacity='0.07' stroke-width='1.2'%3E%3Cpath d='M32 6l7 16 16 7-16 7-7 16-7-16-16-7 16-7z'/%3E%3Cpath d='M32 14l11 7v14l-11 7-11-7V21z'/%3E%3C/g%3E%3C/svg%3E")`;

/* ------------------------------------------------------------------------ */

const cards = { fa, ps, en } as const;

for (const [locale, dict] of Object.entries(cards)) {
  const rtl = locale !== 'en';
  const font = rtl ? 'Vazirmatn' : 'Sansation, Vazirmatn';
  const html = `<!doctype html>
<html lang="${locale}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
  ${FONT_FACES}
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: ${font}; color: #F3F1EC;
    background: ${GIRIH} 0 0 / 64px 64px, radial-gradient(90% 120% at ${rtl ? '0%' : '100%'} 0%, #1E4E8C 0%, #132A4B 45%, #0C1B31 100%); }
  .wrap { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 80px; gap: 40px; }
  .text { flex: 1; }
  .brand { display: flex; align-items: center; gap: 18px; }
  h1 { margin-top: 44px; font-weight: 900; font-size: ${rtl ? 50 : 56}px; line-height: ${rtl ? 1.4 : 1.15}; max-width: 720px; text-wrap: balance; }
  h1 span { color: #F0BE51; }
  .chips { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 40px; }
  .chip { padding: 10px 20px; border-radius: 999px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14);
    font-size: 22px; font-weight: 700; color: rgba(243,241,236,.88); }
  .door { position: relative; width: 300px; height: 520px; flex: none; align-self: flex-end; }
  .arch { position: absolute; inset: 0; background: linear-gradient(#3467BD, #173660);
    clip-path: path('M150 0C66 44 0 106 0 194V520H300V194C300 106 234 44 150 0Z'); }
  .glow { position: absolute; left: 40px; right: 40px; top: 90px; height: 220px; border-radius: 50%;
    background: rgba(240,190,81,.55); filter: blur(60px); }
  .mark { position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%); filter: drop-shadow(0 20px 40px rgba(0,0,0,.35)); }
</style></head><body><div class="wrap">
  <div class="text">
    <div class="brand">
      <div class="name" lang="fa">${NAME(74, !rtl)}</div>
    </div>
    <h1>${dict.home.hero.title} <span>${dict.home.hero.titleAccent}</span></h1>
    <div class="chips">${dict.home.hero.chips.slice(0, 3).map((chip) => `<span class="chip">${chip}</span>`).join('')}</div>
  </div>
  <div class="door"><div class="arch"></div><div class="glow"></div><div class="mark">${MARK(150)}</div></div>
</div></body></html>`;
  // A card is fetched by every chat app a link is pasted into: a JPEG is a
  // quarter the size of the PNG and looks the same.
  const png = join(work, `og-${locale}.png`);
  shoot(html, png, 1200, 630);
  const jpg = join(root, 'public', 'og', `${locale}.jpg`);
  mkdirSync(resolve(jpg, '..'), { recursive: true });
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(jpg);
  console.log('✓', jpg.replace(root, '.'));
}

/* ------------------------------------------------------------------------ */
/* Coming-soon cards: the brand and "coming soon", nothing about the product. */

const STAR_FIELD = Array.from({ length: 60 }, (_, i) => {
  const x = (i * 197) % 1200;
  const y = (i * 113) % 360;
  const size = i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1.4;
  return `<i style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;opacity:${0.3 + ((i * 37) % 60) / 100}"></i>`;
}).join('');

for (const [locale, dict] of Object.entries(cards)) {
  const rtl = locale !== 'en';
  const font = rtl ? 'Vazirmatn' : 'Sansation, Vazirmatn';
  const windows = Array.from({ length: 20 }, (_, i) => `<b class="${[1, 3, 6, 8, 9, 13, 14, 17, 19].includes(i) ? 'on' : ''}"></b>`).join('');
  const html = `<!doctype html>
<html lang="${locale}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
  ${FONT_FACES}
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: ${font}; color: #F3F1EC;
    background: linear-gradient(#060f1f, #0c1d38 55%, #15315a); position: relative; }
  i { position: absolute; border-radius: 50%; background: #fff; }
  .moon { position: absolute; ${rtl ? 'left' : 'right'}: 90px; top: 60px; width: 56px; height: 56px; border-radius: 50%; background: #fbeac0; box-shadow: 0 0 50px 10px rgba(251,234,192,.2); }
  .moon::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: #081426; transform: translate(${rtl ? '14px' : '-14px'}, -5px); }
  svg.m { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 260px; }
  .wrap { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 90px; gap: 70px; }
  .text { flex: 1; }
  .name { margin-top: 30px; direction: ltr; }
  .name svg { display: block; }
  .chip { display: inline-flex; align-items: center; gap: 12px; padding: 10px 22px; border-radius: 999px; border: 1px solid rgba(255,255,255,.18);
    background: rgba(255,255,255,.06); color: #F7D78D; font-weight: 800; font-size: 26px; }
  .chip::before { content: ''; width: 12px; height: 12px; border-radius: 50%; background: #F0BE51; box-shadow: 0 0 14px #F0BE51; }
  h1 { margin-top: 18px; font-weight: 800; font-size: ${rtl ? 36 : 38}px; line-height: 1.45; color: rgba(243,241,236,.85); max-width: 640px; }
  h1 span { color: #F0BE51; }
  .bldg { position: relative; width: 300px; align-self: flex-end; margin-bottom: 0; }
  .glow { position: absolute; inset: 40px -40px 0; background: rgba(240,190,81,.18); filter: blur(60px); border-radius: 50%; }
  .body { position: relative; background: linear-gradient(#1c3d70, #11274a); border: 1px solid rgba(255,255,255,.1); border-radius: 26px 26px 0 0;
    padding: 26px 22px 18px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px 14px; }
  b { display: block; height: 58px; border-radius: 999px 999px 4px 4px; background: linear-gradient(#1f3a68, #0f203d); }
  b.on { background: linear-gradient(#f7d78d, #f0be51 55%, #d9962b); box-shadow: 0 0 26px rgba(240,190,81,.55); }
  .door { grid-column: 2 / span 2; display: flex; justify-content: center; padding-top: 6px; }
</style></head><body>
  ${STAR_FIELD}
  <div class="moon"></div>
  <svg class="m" viewBox="0 0 400 200" preserveAspectRatio="none">
    <path d="M0 120 L40 78 L70 98 L118 44 L160 92 L196 64 L236 104 L282 50 L324 96 L360 70 L400 96 V200 H0Z" fill="#132a4b" opacity=".9"/>
    <path d="M0 150 L52 118 L96 140 L150 104 L204 142 L262 112 L318 146 L362 124 L400 140 V200 H0Z" fill="#0e2240"/>
  </svg>
  <div class="wrap">
    <div class="text">
      <span class="chip">${dict.soon.eyebrow}</span>
      <div class="name" lang="fa">${NAME(118, !rtl)}</div>
      <h1>${dict.soon.title} <span>${dict.soon.titleAccent}</span></h1>
    </div>
    <div class="bldg"><div class="glow"></div><div class="body">${windows}<div class="door">${GLYPH(78)}</div></div></div>
  </div>
</body></html>`;
  const png = join(work, `soon-${locale}.png`);
  shoot(html, png, 1200, 630);
  const jpg = join(root, 'public', 'og', `soon-${locale}.jpg`);
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(jpg);
  console.log('✓', jpg.replace(root, '.'));
}

/* ------------------------------------------------------------------------ */

/** A home-screen icon: the app icon, full bleed (the device rounds it) or on its own rounded tile. */
function iconHtml(size: number, square: boolean) {
  return `<!doctype html><html><head><style>
    * { margin: 0; } html, body { width: ${size}px; height: ${size}px; background: transparent; }
    svg { display: block; }
  </style></head><body>${MARK(size, square ? 0 : TILE.radius)}</body></html>`;
}

// iOS draws its own rounded corners over a square icon (and turns
// transparency black); the manifest icons carry their own.
shoot(iconHtml(180, true), join(root, 'app', 'apple-icon.png'), 180, 180);
shoot(iconHtml(192, false), join(root, 'public', 'icon-192.png'), 192, 192);
shoot(iconHtml(512, false), join(root, 'public', 'icon-512.png'), 512, 512);

rmSync(work, { recursive: true, force: true });
