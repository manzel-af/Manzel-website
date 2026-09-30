'use client';

/**
 * The coming-soon page's building: five floors of four homes, at night.
 *
 * Until someone touches it, lights come on and go off on their own, the way a
 * building looks from the street in the evening. Tap a window and it is
 * yours: the building stops living on its own and waits for you to light
 * every home — which is, quietly, what the product is about.
 *
 * Keyboard: one tab stop; the arrow keys move between windows (following the
 * reading direction, so "next" is the left arrow in Dari and Pashto), and
 * Enter or Space switches a light.
 */

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { LogoMark } from '@/components/brand/logo';
import { Icon } from '@/components/ui/icon';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';

const FLOORS = 5;
const PER_FLOOR = 4;
const TOTAL = FLOORS * PER_FLOOR;

/** A lived-in building: a few homes already lit when the page opens. */
const INITIALLY_LIT = new Set([1, 6, 8, 13, 19]);

/** Where the sparkles land when the last light goes on (percent of the building). */
const SPARKLES = [
  { x: -6, y: 8, d: 0 }, { x: 104, y: 14, d: 80 }, { x: -10, y: 46, d: 160 }, { x: 108, y: 52, d: 40 },
  { x: 8, y: -6, d: 120 }, { x: 88, y: -8, d: 200 }, { x: -4, y: 82, d: 240 }, { x: 102, y: 88, d: 100 },
];

function fillIn(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

export interface LitBuildingLabels {
  label: string;
  window: string;
  hint: string;
  progress: string;
  done: string;
  reset: string;
}

export function LitBuilding({ locale, dir, labels }: { locale: Locale; dir: 'rtl' | 'ltr'; labels: LitBuildingLabels }) {
  const [lit, setLit] = useState<boolean[]>(() => Array.from({ length: TOTAL }, (_, i) => INITIALLY_LIT.has(i)));
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(0);
  const windows = useRef<(HTMLButtonElement | null)[]>([]);

  const count = lit.filter(Boolean).length;
  const done = count === TOTAL;

  // The building lives on its own until someone takes over. Between three and
  // nine homes are lit at any moment — inhabited, but never finished.
  useEffect(() => {
    if (touched || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setLit((current) => {
        const next = [...current];
        const index = Math.floor(Math.random() * TOTAL);
        next[index] = !next[index];
        const on = next.filter(Boolean).length;
        return on < 3 || on > 9 ? current : next;
      });
    }, 1300);
    return () => clearInterval(timer);
  }, [touched]);

  function toggle(index: number) {
    setTouched(true);
    setFocused(index);
    setLit((current) => current.map((on, i) => (i === index ? !on : on)));
  }

  function reset() {
    setLit(Array.from({ length: TOTAL }, () => false));
    setFocused(0);
    windows.current[0]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    // Move from the window that has focus, whatever state last recorded.
    const at = windows.current.indexOf(event.target as HTMLButtonElement);
    const from = at >= 0 ? at : focused;
    let next = from;
    if (event.key === forward) next = from + 1;
    else if (event.key === back) next = from - 1;
    else if (event.key === 'ArrowDown') next = from + PER_FLOOR;
    else if (event.key === 'ArrowUp') next = from - PER_FLOOR;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = TOTAL - 1;
    else return;
    event.preventDefault();
    next = Math.min(TOTAL - 1, Math.max(0, next));
    setFocused(next);
    windows.current[next]?.focus();
  }

  const progress = fillIn(labels.progress, { lit: formatNumber(count, locale), total: formatNumber(TOTAL, locale) });

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[21rem] sm:max-w-[23rem]">
        {/* Sparkles, when the last light goes on. Re-keyed so they replay. */}
        {done
          ? SPARKLES.map((s, i) => (
              <span
                key={`${i}-${count}`}
                aria-hidden="true"
                className="sparkle pointer-events-none absolute z-20 text-saffron-300"
                style={{ insetInlineStart: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}ms` }}
              >
                <Icon name="sparkle" size={i % 2 ? 18 : 26} strokeWidth={1.4} />
              </span>
            ))
          : null}

        {/* Roof: a parapet and a water tank, as on every Kabul block. */}
        <div aria-hidden="true" className="relative mx-auto flex h-7 w-[90%] items-end justify-end px-6">
          <span className="mb-0 h-6 w-10 rounded-t-md bg-[#15315a]" />
        </div>
        <div aria-hidden="true" className="mx-auto h-2.5 w-[94%] rounded-t-md bg-[#1a3a68]" />

        <div
          className={`girih relative overflow-hidden rounded-t-[1.6rem] border border-white/10 bg-linear-to-b from-[#1c3d70] to-[#11274a] px-4 pt-5 shadow-[0_50px_90px_-35px_rgba(0,0,0,0.85)] transition-shadow duration-700 [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.05] sm:px-5 sm:pt-6 ${
            done ? 'building-done' : ''
          }`}
        >
          <div role="group" aria-label={labels.label} onKeyDown={onKeyDown} className="flex flex-col">
            {Array.from({ length: FLOORS }, (_, floor) => (
              <div key={floor} className="border-b border-black/25 pb-3 pt-1 shadow-[0_1px_0_rgba(255,255,255,0.05)] sm:pb-4">
                <div className="grid grid-cols-4 gap-x-1 sm:gap-x-2">
                  {Array.from({ length: PER_FLOOR }, (_, column) => {
                    const index = floor * PER_FLOOR + column;
                    const on = lit[index];
                    return (
                      <button
                        key={index}
                        ref={(node) => {
                          windows.current[index] = node;
                        }}
                        type="button"
                        tabIndex={index === focused ? 0 : -1}
                        aria-pressed={on}
                        aria-label={fillIn(labels.window, { n: formatNumber(index + 1, locale) })}
                        onClick={() => toggle(index)}
                        onFocus={() => setFocused(index)}
                        className="group relative h-[4.1rem] cursor-pointer rounded-t-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-saffron-300 sm:h-[4.6rem]"
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute -inset-y-2 inset-x-0 rounded-full bg-saffron-300/60 blur-xl transition-opacity duration-700 ${
                            on ? 'opacity-60' : 'opacity-0'
                          }`}
                        />
                        <span aria-hidden="true" className={`window-pane arch absolute inset-y-0 inset-x-[13%] ${on ? 'is-lit' : ''}`}>
                          <span className="absolute inset-x-0 inset-y-[14%] mx-auto w-[6%] rounded-full bg-[#10254a]/70" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* The entrance: the Manzel arch over the door, with a lamp on each side. */}
          <div aria-hidden="true" className="relative flex items-end justify-center gap-6 pt-4">
            <span className={`lamp mb-10 ${done ? 'is-on' : ''}`} />
            <span className={`door relative grid h-24 w-20 place-items-center ${done ? 'is-open' : ''}`}>
              <LogoMark size={64} variant="mark" light className="relative" />
            </span>
            <span className={`lamp mb-10 ${done ? 'is-on' : ''}`} />
          </div>
        </div>

        {/* The pavement. */}
        <div aria-hidden="true" className="-mx-[4%] h-2 rounded-full bg-[#0b1a31] shadow-[0_18px_40px_8px_rgba(0,0,0,0.55)]" />
      </div>

      {/* Progress, and what to do. */}
      <div className="mt-7 flex w-full max-w-[21rem] flex-col items-center gap-3 text-center sm:max-w-[23rem]">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <div
            className="h-full rounded-full bg-linear-to-r from-saffron-400 to-saffron-200 transition-[width] duration-500 rtl:bg-linear-to-l"
            style={{ width: `${(count / TOTAL) * 100}%` }}
          />
        </div>
        <p aria-live={touched ? 'polite' : 'off'} className={`text-sm font-bold ${done ? 'text-saffron-300' : 'text-white/75'}`}>
          {done ? labels.done : progress}
        </p>
        {!touched ? (
          <p className="flex items-center gap-2 text-xs text-white/60">
            <Icon name="sparkle" size={14} className="text-saffron-300" />
            {labels.hint}
          </p>
        ) : null}
        {done ? (
          <button
            type="button"
            onClick={reset}
            className="rounded-pill border border-white/20 px-4 py-2 text-sm font-bold text-white/85 transition-colors hover:border-white/40 hover:text-white"
          >
            {labels.reset}
          </button>
        ) : null}
      </div>
    </div>
  );
}
