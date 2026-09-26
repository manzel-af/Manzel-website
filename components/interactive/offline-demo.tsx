'use client';

/**
 * Offline-first, demonstrated rather than claimed: record payments with the
 * internet switched off, watch them wait, switch it on and watch them go —
 * one at a time, each exactly once.
 *
 * Nothing here talks to a server. It is a picture of what the app's outbox
 * does, with the page's own digits and currency.
 */

import { useEffect, useState } from 'react';

import { Icon } from '@/components/ui/icon';
import { formatMoney, localizeDigits } from '@/lib/format';
import type { Locale } from '@/lib/i18n';

interface Entry {
  id: number;
  flat: string;
  amountMinor: number;
  synced: boolean;
}

const SAMPLES = [
  { flat: '304', amountMinor: 250000 },
  { flat: '112', amountMinor: 180000 },
  { flat: '207', amountMinor: 320000 },
  { flat: '405', amountMinor: 250000 },
  { flat: '101', amountMinor: 95000 },
  { flat: '318', amountMinor: 250000 },
];

export function OfflineDemo({
  locale,
  labels,
}: {
  locale: Locale;
  labels: {
    title: string;
    internet: string;
    on: string;
    off: string;
    record: string;
    waiting: string;
    synced: string;
    empty: string;
    flat: string;
  };
}) {
  const [online, setOnline] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [counter, setCounter] = useState(0);

  // With the connection back, the outbox drains one entry at a time.
  const nextPending = entries.findLast((entry) => !entry.synced);
  useEffect(() => {
    if (!online || !nextPending) return;
    const timer = setTimeout(() => {
      setEntries((current) =>
        current.map((entry) => (entry.id === nextPending.id ? { ...entry, synced: true } : entry)));
    }, 650);
    return () => clearTimeout(timer);
  }, [online, nextPending]);

  function record() {
    const sample = SAMPLES[counter % SAMPLES.length];
    setCounter(counter + 1);
    setEntries((current) => [{ id: counter, ...sample, synced: false }, ...current].slice(0, 5));
  }

  const waiting = entries.filter((entry) => !entry.synced).length;

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-bold text-saffron-300">{labels.title}</p>

        {/* The switch: a real checkbox with role="switch", so it is announced
            as on/off and works with the keyboard. */}
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-white/80">
          <span className="flex items-center gap-1.5">
            <Icon name={online ? 'wifi' : 'wifiOff'} size={18} className={online ? 'text-pistachio-300' : 'text-saffron-300'} />
            {labels.internet}
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={online}
            onChange={(event) => setOnline(event.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="relative h-7 w-12 rounded-full bg-white/20 transition-colors peer-checked:bg-pistachio-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-saffron-300"
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-[inset-inline-start] duration-300 ${
                online ? 'start-6' : 'start-1'
              }`}
            />
          </span>
          <span className="min-w-8 font-bold text-white">{online ? labels.on : labels.off}</span>
        </label>
      </div>

      <button
        type="button"
        onClick={record}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-saffron-300 text-base font-extrabold text-lapis-950 transition-[transform,background-color] hover:bg-saffron-200 active:scale-[0.99]"
      >
        <Icon name="money" size={20} />
        {labels.record}
      </button>

      <div className="mt-5 min-h-[17rem]">
        {entries.length === 0 ? (
          <p className="grid h-[17rem] place-items-center rounded-2xl border border-dashed border-white/15 px-6 text-center text-sm leading-relaxed text-white/55">
            {labels.empty}
          </p>
        ) : (
          <ul className="flex flex-col gap-2" aria-live="polite">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="demo-row flex items-center gap-3 rounded-2xl bg-white/[0.07] px-4 py-3"
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
                    entry.synced ? 'bg-pistachio-500 text-white' : 'bg-saffron-300/20 text-saffron-300'
                  }`}
                >
                  <Icon name={entry.synced ? 'check' : 'clock'} size={17} strokeWidth={entry.synced ? 2.6 : 1.9} />
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="text-[0.95rem] font-bold text-white">
                    {labels.flat} <bdi>{localizeDigits(entry.flat, locale)}</bdi>
                  </p>
                  <p className={`text-xs ${entry.synced ? 'text-pistachio-300' : 'text-saffron-300'}`}>
                    {entry.synced ? labels.synced : labels.waiting}
                  </p>
                </div>
                <p className="text-[0.95rem] font-extrabold text-white">{formatMoney(entry.amountMinor, locale)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {waiting > 0 ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-saffron-300">
          <Icon name="wifiOff" size={16} />
          {labels.waiting}: <bdi>{localizeDigits(String(waiting), locale)}</bdi>
        </p>
      ) : null}
    </div>
  );
}
