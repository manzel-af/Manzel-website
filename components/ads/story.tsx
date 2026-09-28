/**
 * The coming-soon story (1080×1920), as a pure function of time.
 *
 * `t` is milliseconds into the video. The still image is the last frame;
 * the video (story-animated.tsx) draws every frame from 0 to STORY_DURATION:
 * the night comes up, then the windows light one by one — each with a small
 * flicker, as a real bulb does — the door lamps come on, and the stores and
 * the address appear.
 */

import { Icon } from '@/components/ui/icon';

import { Brand, Building, Chip, Headline, Night, Stores, WINDOWS } from './scene';

export const STORY_DURATION = 9000;

/** The order the homes light up in — scattered, as a real building does. */
const ORDER = [9, 2, 14, 6, 17, 0, 11, 4, 19, 7, 13, 1, 16, 5, 10, 18, 3, 12, 8, 15];
const FIRST_LIGHT = 1100;
const STEP = 170;
const ALL_LIT = FIRST_LIGHT + STEP * (WINDOWS - 1) + 260;

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (x: number) => 1 - (1 - clamp(x)) ** 3;
/** 0 → 1 between two moments. */
const between = (t: number, from: number, to: number) => easeOut((t - from) / (to - from));

/** A bulb coming on: a flash, a dip, then steady. */
function bulb(dt: number): number {
  if (dt < 0) return 0;
  if (dt < 60) return 0.85;
  if (dt < 110) return 0.2;
  if (dt < 260) return 0.2 + ((dt - 110) / 150) * 0.8;
  return 1;
}

const SPARKLES = [
  { x: 14, y: 40, s: 54 }, { x: 82, y: 44, s: 40 }, { x: 10, y: 60, s: 36 }, { x: 88, y: 62, s: 56 },
  { x: 22, y: 34, s: 30 }, { x: 76, y: 36, s: 34 }, { x: 16, y: 74, s: 42 }, { x: 84, y: 76, s: 30 },
];

export interface StoryLabels {
  eyebrow: string;
  title: string;
  titleAccent: string;
  follow: string;
  stores: { play: string; apple: string };
  host: string;
}

export function StoryScene({ t, labels, latin }: { t: number; labels: StoryLabels; latin: boolean }) {
  const levels = ORDER.reduce<number[]>((acc, window, k) => {
    acc[window] = bulb(t - (FIRST_LIGHT + k * STEP));
    return acc;
  }, Array.from({ length: WINDOWS }, () => 0));
  const lamps = between(t, ALL_LIT, ALL_LIT + 500);
  const sparkle = between(t, ALL_LIT + 100, ALL_LIT + 900);

  const fade = (from: number, to: number) => {
    const p = between(t, from, to);
    return { opacity: p, transform: `translateY(${(1 - p) * 34}px)` };
  };

  return (
    <Night horizon={80} t={t} stars={90}>
      {/* The sky itself comes up out of black. */}
      <div className="absolute inset-0 z-30 bg-black" style={{ opacity: 1 - between(t, 0, 700) }} />

      <div className="absolute inset-x-0 top-[210px] flex justify-center" style={fade(200, 900)}>
        <Brand zoom={1.9} latin={latin} />
      </div>
      <div className="absolute inset-x-0 top-[350px] flex justify-center" style={fade(500, 1100)}>
        <Chip>{labels.eyebrow}</Chip>
      </div>
      <div className="absolute inset-x-[80px] top-[450px] text-center" style={fade(900, 1700)}>
        <Headline className="text-[88px] leading-[1.18]" title={labels.title} accent={labels.titleAccent} />
      </div>

      <div className="absolute inset-x-0 bottom-[384px] flex justify-center">
        <div className="absolute bottom-0 h-[70%] w-[80%] rounded-full bg-saffron-300/20 blur-[110px]" style={{ opacity: 0.3 + 0.7 * lamps }} />
        <Building levels={levels} lamps={lamps} glow={lamps} style={{ zoom: 1.36 }} />
      </div>

      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="absolute text-saffron-300"
          style={{
            insetInlineStart: `${s.x}%`,
            top: `${s.y}%`,
            opacity: sparkle * (i % 2 ? 0.8 : 1),
            transform: `translate(-50%, -50%) scale(${0.3 + 0.7 * sparkle}) rotate(${(1 - sparkle) * -40}deg)`,
          }}
        >
          <Icon name="sparkle" size={s.s} strokeWidth={1.3} />
        </span>
      ))}

      <div className="absolute inset-x-0 top-[1590px] flex flex-col items-center gap-7" style={fade(ALL_LIT + 400, ALL_LIT + 1100)}>
        <Stores names={labels.stores} size="lg" />
        <p className="flex items-center gap-4 text-[30px] font-bold text-white/80">
          <span dir="ltr" className="font-extrabold text-saffron-300">{labels.host}</span>
          <span className="text-white/35">·</span>
          {labels.follow}
        </p>
      </div>
    </Night>
  );
}
