/**
 * The pieces social media artwork is made of: the night sky, the building,
 * the store pills. Pure components — no hooks — so both the still images
 * (server components) and the animated story (a client component that
 * redraws itself for every video frame) are drawn by the same code.
 *
 * Every size is fixed in pixels: these are drawn once, at exact sizes, by
 * scripts/generate-ads.mts, not laid out for a screen.
 */

import type { CSSProperties, ReactNode } from 'react';

import { Logo, LogoMark } from '@/components/brand/logo';
import { Icon } from '@/components/ui/icon';

/* ------------------------------------------------------------------------ */

export const WINDOWS = 20;
const PER_FLOOR = 4;

/** Lit patterns for the teaser series: a building waking up. */
export const LIT = {
  few: [5, 10, 18],
  some: [1, 3, 5, 6, 9, 10, 12, 15, 16, 18, 19],
  most: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19],
  all: Array.from({ length: WINDOWS }, (_, i) => i),
} as const;

/** 0…1 per window, from a list of lit indices. */
export function levelsFrom(indices: readonly number[]): number[] {
  return Array.from({ length: WINDOWS }, (_, i) => (indices.includes(i) ? 1 : 0));
}

/** A small seeded generator, so every image draws the same sky. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function starField(count: number, seed: number) {
  const random = seeded(seed);
  return Array.from({ length: count }, () => ({
    x: random() * 100,
    y: random() * 62,
    size: random() < 0.12 ? 4 : random() < 0.45 ? 2.6 : 1.8,
    opacity: 0.3 + random() * 0.65,
    phase: random() * Math.PI * 2,
  }));
}

/* ------------------------------------------------------------------------ */

/**
 * Night over Kabul: sky, stars, a crescent, two mountain ranges and — when
 * `horizon` is set — a street in front of them, where the building stands.
 * `t` (milliseconds) makes the stars twinkle, for video frames.
 */
export function Night({
  children,
  horizon,
  stars = 70,
  seed = 1405,
  t,
  moon = 'end',
  mountains = true,
}: {
  children?: ReactNode;
  /** Where the street begins, in percent from the top. Omit for mountains to the bottom edge. */
  horizon?: number;
  stars?: number;
  seed?: number;
  t?: number;
  moon?: 'start' | 'end' | 'none';
  mountains?: boolean;
}) {
  const ground = horizon ?? 100;
  return (
    <div className="absolute inset-0 overflow-hidden bg-linear-to-b from-[#050d1b] via-[#0b1c37] to-[#16325c] text-white">
      <div className="girih absolute inset-0 [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.035]" />
      {starField(stars, seed).map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            insetInlineStart: `${star.x}%`,
            top: `${star.y * (ground / 100)}%`,
            width: star.size,
            height: star.size,
            opacity: t === undefined ? star.opacity : star.opacity * (0.55 + 0.45 * Math.sin(t / 650 + star.phase)),
          }}
        />
      ))}
      {moon !== 'none' ? (
        <div className={`absolute top-[6%] size-[96px] ${moon === 'end' ? 'end-[9%]' : 'start-[9%]'}`}>
          <span className="absolute inset-0 rounded-full bg-[#fbeac0] shadow-[0_0_90px_18px_rgba(251,234,192,0.22)]" />
          <span
            className={`absolute inset-0 -translate-y-[10px] rounded-full bg-[#071326] ${
              moon === 'end' ? '-translate-x-[26px] rtl:translate-x-[26px]' : 'translate-x-[26px] rtl:-translate-x-[26px]'
            }`}
          />
        </div>
      ) : null}

      {/* Mountains sit on the horizon (or the bottom edge). */}
      {mountains ? (
        <svg
          className="absolute inset-x-0 w-full"
          style={{ bottom: `${100 - ground}%`, height: `${Math.min(34, ground * 0.4)}%` }}
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          {/* The far range is lighter than the sky behind it, so its snow sits on a mountain, not in the air. */}
          <path d="M0 120 L40 78 L70 98 L118 44 L160 92 L196 64 L236 104 L282 50 L324 96 L360 70 L400 96 V200 H0Z" fill="#23467a" opacity="0.9" />
          <path d="M118 44 L131 60 L122 58 L112 66 Z M282 50 L296 66 L286 63 L275 70 Z" fill="#dfe8f5" opacity="0.4" />
          <path d="M0 150 L52 118 L96 140 L150 104 L204 142 L262 112 L318 146 L362 124 L400 140 V200 H0Z" fill="#10264a" />
        </svg>
      ) : null}

      {horizon !== undefined ? (
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-b from-[#0a1830] to-[#050d1b]" style={{ top: `${horizon}%` }}>
          <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        </div>
      ) : null}

      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * The building from the coming-soon page, as a picture. `levels` is each
 * window's light, 0 to 1 — the animated story fades them in with a flicker.
 */
export function Building({
  levels,
  lamps = 0,
  glow = 0,
  style,
}: {
  levels: number[];
  /** The door lamps, 0…1. */
  lamps?: number;
  /** The warm outline when every home is lit, 0…1. */
  glow?: number;
  style?: CSSProperties;
}) {
  return (
    <div className="relative w-[368px]" style={style}>
      <div className="relative mx-auto flex h-7 w-[90%] items-end justify-end px-6">
        <span className="h-6 w-10 rounded-t-md bg-[#15315a]" />
      </div>
      <div className="mx-auto h-2.5 w-[94%] rounded-t-md bg-[#1a3a68]" />

      <div
        className="girih relative overflow-hidden rounded-t-[1.6rem] border border-white/10 bg-linear-to-b from-[#1c3d70] to-[#11274a] px-5 pt-6 [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.05]"
        style={{
          boxShadow: `0 0 0 1px rgb(240 190 81 / ${0.45 * glow}), 0 0 60px -6px rgb(240 190 81 / ${0.45 * glow}), 0 50px 90px -35px rgb(0 0 0 / 0.85)`,
        }}
      >
        {Array.from({ length: WINDOWS / PER_FLOOR }, (_, floor) => (
          <div key={floor} className="border-b border-black/25 pb-4 pt-1 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
            <div className="grid grid-cols-4 gap-x-2">
              {Array.from({ length: PER_FLOOR }, (_, column) => {
                const level = levels[floor * PER_FLOOR + column] ?? 0;
                return (
                  <span key={column} className="relative block h-[4.6rem]">
                    <span className="absolute -inset-y-2 inset-x-0 rounded-full bg-saffron-300/60 blur-xl" style={{ opacity: 0.6 * level }} />
                    <span className="window-pane arch absolute inset-y-0 inset-x-[13%]" />
                    <span className="window-pane is-lit arch absolute inset-y-0 inset-x-[13%] [animation:none]" style={{ opacity: level }} />
                    <span className="arch absolute inset-y-0 inset-x-[13%]">
                      <span className="absolute inset-x-0 inset-y-[14%] mx-auto w-[6%] rounded-full bg-[#10254a]/70" />
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}

        <div className="relative flex items-end justify-center gap-6 pt-4">
          <Lamp level={lamps} />
          <span className="relative grid h-24 w-20 place-items-center">
            <span className="absolute inset-x-[8%] bottom-[-6%] top-[18%] rounded-full bg-saffron-300/45 blur-[18px]" style={{ opacity: lamps }} />
            <LogoMark size={64} variant="mark" light className="relative" />
          </span>
          <Lamp level={lamps} />
        </div>
      </div>
      <div className="-mx-[4%] h-2 rounded-full bg-[#0b1a31] shadow-[0_18px_40px_8px_rgba(0,0,0,0.55)]" />
    </div>
  );
}

function Lamp({ level }: { level: number }) {
  return (
    <span
      className="mb-10 size-2.5 rounded-full"
      style={{
        background: level > 0.5 ? '#f7d78d' : '#6d5a2f',
        boxShadow: `0 0 18px 6px rgb(240 190 81 / ${0.55 * level})`,
      }}
    />
  );
}

/* ------------------------------------------------------------------------ */

/** The brand lock-up, drawn larger. */
export function Brand({ zoom = 1.6, latin = false, light = true }: { zoom?: number; latin?: boolean; light?: boolean }) {
  return (
    <div style={{ zoom }}>
      <Logo light={light} latin={latin} size={38} />
    </div>
  );
}

/** "● Coming soon" */
export function Chip({ children, tone = 'night', className = '' }: { children: ReactNode; tone?: 'night' | 'paper'; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-3 rounded-full border px-6 py-2.5 text-[28px] font-extrabold ${
        tone === 'night' ? 'border-white/20 bg-white/[0.07] text-saffron-200' : 'border-line bg-surface text-accent'
      } ${className}`}
    >
      <span className="size-3.5 rounded-full bg-saffron-300 shadow-[0_0_16px_#F0BE51]" />
      {children}
    </span>
  );
}

/** Google Play · App Store, as pills (not official badges: the apps are not listed yet). */
export function Stores({
  names,
  tone = 'night',
  size = 'md',
}: {
  names: { play: string; apple: string };
  tone?: 'night' | 'paper';
  size?: 'md' | 'lg';
}) {
  const pill =
    tone === 'night'
      ? 'border-white/20 bg-black/30 text-white'
      : 'border-transparent bg-[#0E1116] text-white';
  const text = size === 'lg' ? 'text-[30px] h-[84px] px-8 gap-4' : 'text-[24px] h-[68px] px-6 gap-3';
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {[
        { icon: 'android' as const, name: names.play },
        { icon: 'apple' as const, name: names.apple },
      ].map((store) => (
        <span key={store.name} className={`inline-flex items-center rounded-[22px] border font-bold ${pill} ${text}`}>
          <Icon name={store.icon} size={size === 'lg' ? 38 : 30} />
          {store.name}
        </span>
      ))}
    </div>
  );
}

/** Headline with the second half in lit-window saffron. */
export function Headline({
  title,
  accent,
  className = '',
  tone = 'night',
}: {
  title: string;
  accent?: string;
  className?: string;
  tone?: 'night' | 'paper';
}) {
  return (
    <h1 className={`text-balance font-black tracking-tight ${tone === 'night' ? 'text-white' : 'text-fg'} ${className}`}>
      {title}
      {accent ? (
        <>
          {' '}
          <span
            className={
              tone === 'night'
                ? 'bg-linear-to-r from-saffron-200 via-saffron-300 to-saffron-500 bg-clip-text text-transparent [box-decoration-break:clone] rtl:bg-linear-to-l'
                : 'text-shine'
            }
          >
            {accent}
          </span>
        </>
      ) : null}
    </h1>
  );
}

/** Each artwork: a fixed-size box the generator captures, with its file name. */
export function Artboard({ file, width, height, children, className = '' }: {
  file: string;
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="font-mono text-sm text-fg-muted" dir="ltr">
        {file} · {width}×{height}
      </figcaption>
      <div data-ad={file} className={`relative shrink-0 overflow-hidden ${className}`} style={{ width, height }}>
        {children}
      </div>
    </figure>
  );
}
