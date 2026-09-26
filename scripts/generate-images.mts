/**
 * Renders the site's raster images with a real browser:
 *
 *   public/og/{fa,ps,en}.jpg   1200×630 social cards, one per language
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

const MARK = (size: number) => `
  <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3467BD"/><stop offset="1" stop-color="#1A4176"/></linearGradient></defs>
    <path d="M24 2.5 6 15.5V44a1.5 1.5 0 0 0 1.5 1.5h33A1.5 1.5 0 0 0 42 44V15.5Z" fill="url(#g)"/>
    <path d="M24 11.5c-5.2 0-9 3.9-9 9.2V37a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V20.7c0-5.3-3.8-9.2-9-9.2Z" fill="#F0BE51"/>
    <rect x="22.9" y="13.5" width="2.2" height="24.5" rx="1" fill="#1E4E8C" opacity="0.92"/>
    <rect x="15" y="24.4" width="18" height="2.2" rx="1" fill="#1E4E8C" opacity="0.92"/>
  </svg>`;

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
  .word { font-family: Vazirmatn; font-weight: 900; font-size: 64px; line-height: 1; }
  .latin { font-family: Sansation; font-weight: 700; font-size: 20px; letter-spacing: .28em; color: rgba(243,241,236,.6); margin-top: 6px; }
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
      <div><div class="word" lang="fa">منزل</div>${rtl ? '' : '<div class="latin">MANZEL</div>'}</div>
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

function iconHtml(size: number, padding: number) {
  return `<!doctype html><html><head><style>
    * { margin: 0; } body { width: ${size}px; height: ${size}px; display: grid; place-items: center;
    background: linear-gradient(160deg, #FBF8F3, #F5F1E9); }
  </style></head><body>${MARK(size - padding * 2)}</body></html>`;
}

shoot(iconHtml(180, 22), join(root, 'app', 'apple-icon.png'), 180, 180);
shoot(iconHtml(192, 22), join(root, 'public', 'icon-192.png'), 192, 192);
shoot(iconHtml(512, 60), join(root, 'public', 'icon-512.png'), 512, 512);

rmSync(work, { recursive: true, force: true });
