/**
 * Exports the social media artwork from the ad studio (app/[lang]/studio).
 *
 *   npm run dev                 # in one terminal
 *   npm run ads                 # in another
 *
 * Writes into ../advertisements images/ (or ADS_OUT):
 *   coming-soon/…   post now
 *   launch-day/…    keep until the apps are in the stores
 *
 * Every image is captured by Chrome at its exact size. The animated story is
 * drawn frame by frame — 30 per second, each set exactly through
 * window.__adFrame — and joined into an MP4 by ffmpeg.
 *
 * Options (environment variables):
 *   ADS_BASE   the dev server, default http://localhost:3000
 *   ADS_OUT    the output folder
 *   ADS_LANGS  e.g. "fa,en" (default: all three)
 *   ADS_ONLY   only files whose path contains this text
 *   ADS_VIDEO  "0" to skip the videos
 *   CHROME_PATH / FFMPEG_PATH  if they are not found on their own
 */

import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const BASE = process.env.ADS_BASE ?? 'http://localhost:3000';
const OUT = resolve(process.env.ADS_OUT ?? join(root, '..', 'advertisements images'));
const LANGS = (process.env.ADS_LANGS ?? 'fa,ps,en').split(',').map((l) => l.trim());
const ONLY = process.env.ADS_ONLY ?? '';
const VIDEO = process.env.ADS_VIDEO !== '0';
const FPS = 30;

/* ------------------------------------------------------------------------ */

const chromePath = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((candidate) => candidate && existsSync(candidate));
if (!chromePath) throw new Error('Chrome or Edge not found. Set CHROME_PATH.');

function findFfmpeg(): string | null {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return 'ffmpeg';
  } catch {}
  try {
    // `pip install imageio-ffmpeg` ships a self-contained binary.
    return execFileSync('python', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------------ */
/* A minimal Chrome DevTools Protocol client.                                */

const work = mkdtempSync(join(tmpdir(), 'manzel-ads-'));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-color-profile=srgb',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${join(work, 'profile')}`,
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let socketUrl: string | undefined;
for (let i = 0; i < 60 && !socketUrl; i++) {
  await sleep(200);
  try {
    const targets = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()) as { type: string; webSocketDebuggerUrl: string }[];
    socketUrl = targets.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
  } catch {}
}
if (!socketUrl) throw new Error('Could not connect to Chrome.');

const ws = new WebSocket(socketUrl);
await new Promise((r) => ws.addEventListener('open', r));
let nextId = 0;
interface CdpMessage {
  id?: number;
  method?: string;
  result?: unknown;
  error?: { message: string };
}
const pending = new Map<number, (message: CdpMessage) => void>();
const events: string[] = [];
ws.addEventListener('message', (event) => {
  const message = JSON.parse(String(event.data)) as CdpMessage;
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)!(message);
    pending.delete(message.id);
  } else if (message.method) {
    events.push(message.method);
  }
});
async function send<T = unknown>(method: string, params: object = {}): Promise<T> {
  const id = ++nextId;
  const message = await new Promise<CdpMessage>((resolve) => {
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
  if (message.error) throw new Error(`${method}: ${message.error.message}`);
  return message.result as T;
}
async function evaluate<T>(expression: string): Promise<T> {
  const result = await send<{ result: { value: unknown }; exceptionDetails?: { exception?: { description?: string } } }>(
    'Runtime.evaluate',
    { expression, awaitPromise: true, returnByValue: true },
  );
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? 'evaluate failed');
  return result.result.value as T;
}

/* ------------------------------------------------------------------------ */

interface Board {
  file: string;
  width: number;
  height: number;
  duration?: number;
}

/** Scrolls a board to the top of the viewport and returns where it is. */
async function place(file: string) {
  return evaluate<{ x: number; y: number }>(`(async () => {
    const el = document.querySelector('[data-ad="${file}"]');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 20);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const r = el.getBoundingClientRect();
    // Screenshot clips are in page coordinates, not viewport coordinates.
    return { x: r.left + window.scrollX, y: r.top + window.scrollY };
  })()`);
}

async function capture(board: Board, at: { x: number; y: number }, format: 'png' | 'jpeg') {
  const shot = await send<{ data: string }>('Page.captureScreenshot', {
    format,
    ...(format === 'jpeg' ? { quality: 94 } : {}),
    clip: { x: at.x, y: at.y, width: board.width, height: board.height, scale: 1 },
  });
  return Buffer.from(shot.data, 'base64');
}

async function exportImage(board: Board) {
  const at = await place(board.file);
  const png = await capture(board, at, 'png');
  const out = join(OUT, board.file);
  mkdirSync(dirname(out), { recursive: true });
  await sharp(png).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(out);
  console.log('  ✓', board.file);
}

async function exportVideo(board: Board, ffmpeg: string) {
  const at = await place(board.file);
  const frames = join(work, 'frames');
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  const total = Math.round(((board.duration ?? 8000) / 1000) * FPS);
  for (let i = 0; i <= total; i++) {
    const ms = (i / FPS) * 1000;
    await evaluate(`(async () => {
      window.__adFrame[${JSON.stringify(board.file)}](${ms});
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    })()`);
    writeFileSync(join(frames, `f${String(i).padStart(5, '0')}.jpg`), await capture(board, at, 'jpeg'));
    if (i % 60 === 0) process.stdout.write(`\r  … ${board.file} ${Math.round((i / total) * 100)}%`);
  }
  const out = join(OUT, board.file);
  mkdirSync(dirname(out), { recursive: true });
  execFileSync(ffmpeg, [
    '-y', '-loglevel', 'error',
    '-framerate', String(FPS),
    '-i', join(frames, 'f%05d.jpg'),
    // H.264 in yuv420p with the index up front: what Instagram, Facebook
    // and WhatsApp all accept without re-encoding surprises.
    // The frames are full-range JPEGs; convert to standard video range and
    // BT.709, or some uploaders read the legacy yuvj420p output wrongly.
    '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high',
    '-movflags', '+faststart',
    out,
  ]);
  process.stdout.write('\r');
  console.log('  ✓', board.file, `(${total} frames)`);
}

/* ------------------------------------------------------------------------ */

const ffmpeg = VIDEO ? findFfmpeg() : null;
if (VIDEO && !ffmpeg) console.warn('ffmpeg not found — skipping videos. `pip install imageio-ffmpeg` or set FFMPEG_PATH.');

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1800, height: 2000, deviceScaleFactor: 1, mobile: false });
// Light theme (the launch artwork uses the paper palette) and no CSS
// animation mid-flight in a still image.
await send('Emulation.setEmulatedMedia', {
  features: [
    { name: 'prefers-color-scheme', value: 'light' },
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ],
});

console.log(`Exporting to ${OUT}`);
for (const lang of LANGS) {
  console.log(`\n${lang}`);
  events.length = 0;
  await send('Page.navigate', { url: `${BASE}/${lang}/studio` });
  for (let i = 0; i < 300 && !events.includes('Page.loadEventFired'); i++) await sleep(100);
  await evaluate('document.fonts.ready.then(() => true)');
  await sleep(800);

  const boards = await evaluate<Board[]>(`[...document.querySelectorAll('[data-ad]')].map(el => ({
    file: el.dataset.ad,
    width: Math.round(el.getBoundingClientRect().width),
    height: Math.round(el.getBoundingClientRect().height),
    duration: Number(el.closest('[data-ad-video]')?.dataset.duration) || undefined,
  }))`);
  if (boards.length === 0) throw new Error(`No artwork at ${BASE}/${lang}/studio — is the dev server running?`);

  for (const board of boards.filter((b) => b.file.includes(ONLY))) {
    if (board.file.endsWith('.mp4')) {
      if (ffmpeg) await exportVideo(board, ffmpeg);
    } else {
      await exportImage(board);
    }
  }
}

ws.close();
chrome.kill();
await sleep(300);
rmSync(work, { recursive: true, force: true });
console.log('\nDone.');
