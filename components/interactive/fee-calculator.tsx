'use client';

/**
 * "What would my building pay?" — the platform fee split across its flats.
 *
 * The share is rounded UP to the nearest pul, exactly as the database does it
 * (V025: ceil(monthly_fee_minor / flats)), so the number here is the number a
 * manager will see in the app.
 */

import { useId, useState, type CSSProperties } from 'react';

import { formatMoney, formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';

const PRESETS = [8, 16, 24, 48, 96];
const MIN = 2;
const MAX = 200;

export function FeeCalculator({
  locale,
  feeMinor,
  currency,
  labels,
}: {
  locale: Locale;
  feeMinor: number;
  currency: string;
  labels: { title: string; flats: string; building: string; perFlat: string; note: string; perMonth: string };
}) {
  const [flats, setFlats] = useState(24);
  const id = useId();
  const share = Math.ceil(feeMinor / flats);
  const fill = ((flats - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-[0_30px_60px_-30px_rgba(12,27,49,0.35)] sm:p-8">
      <p className="text-sm font-bold text-accent">{labels.title}</p>

      <div className="mt-5 flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-[0.95rem] font-semibold text-fg-muted">
          {labels.flats}
        </label>
        <output htmlFor={id} className="text-3xl font-black text-fg tabular-nums">
          {formatNumber(flats, locale)}
        </output>
      </div>

      <input
        id={id}
        type="range"
        min={MIN}
        max={MAX}
        step={1}
        value={flats}
        onChange={(event) => setFlats(Number(event.target.value))}
        aria-valuetext={formatNumber(flats, locale)}
        className="brand-range mt-4 w-full rtl:[--range-end:left]"
        style={{ '--fill': `${fill}%` } as CSSProperties}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setFlats(preset)}
            aria-pressed={flats === preset}
            className={`h-9 min-w-12 rounded-pill border px-3 text-sm font-bold transition-colors ${
              flats === preset
                ? 'border-primary bg-primary text-fg-on-primary'
                : 'border-line bg-surface-sunken text-fg-muted hover:border-line-strong hover:text-fg'
            }`}
          >
            {formatNumber(preset, locale)}
          </button>
        ))}
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-surface-sunken p-4">
          <p className="text-[0.82rem] font-semibold text-fg-muted">{labels.building}</p>
          <p className="mt-1 text-xl font-extrabold text-fg">{formatMoney(feeMinor, locale, currency)}</p>
          <p className="text-xs text-fg-subtle">{labels.perMonth}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-primary p-4 text-fg-on-primary">
          <div aria-hidden="true" className="absolute -end-6 -top-8 h-24 w-24 rounded-full bg-saffron-300/30 blur-xl" />
          <p className="relative text-[0.82rem] font-semibold">{labels.perFlat}</p>
          <p className="relative mt-1 text-2xl font-black" aria-live="polite">
            {formatMoney(share, locale, currency)}
          </p>
          <p className="relative text-xs font-semibold">{labels.perMonth}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-fg-subtle">{labels.note}</p>
    </div>
  );
}
