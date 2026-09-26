'use client';

/**
 * Four roles, one at a time: a tab list, what the role gets, and the app as
 * that person sees it.
 *
 * Every panel is rendered on the server and is in the HTML — the inactive
 * ones are `hidden`, not missing — so search engines and people without
 * JavaScript get all four. The phones are server-rendered too and arrive as
 * props; this component only decides which one is showing.
 *
 * Keyboard: the WAI-ARIA tabs pattern. Arrow keys follow the reading
 * direction, so in Dari and Pashto "next" is the left arrow.
 */

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import { Icon, type IconName } from '@/components/ui/icon';

export interface RoleTab {
  key: string;
  icon: IconName;
  name: string;
  headline: string;
  points: string[];
  screen: ReactNode;
}

export function RoleShowcase({ tabs, dir }: { tabs: RoleTab[]; dir: 'rtl' | 'ltr' }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward) select(active + 1);
    else if (event.key === back) select(active - 1);
    else if (event.key === 'Home') select(0);
    else if (event.key === 'End') select(tabs.length - 1);
    else return;
    event.preventDefault();
  }

  return (
    <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:mt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <div className="min-w-0">
        <div
          role="tablist"
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="grid grid-cols-2 gap-1.5 rounded-[1.4rem] border border-line bg-surface p-1.5 sm:flex sm:gap-2"
        >
          {tabs.map((tab, index) => {
            const selected = index === active;
            return (
              <button
                key={tab.key}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${base}-panel-${index}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-3 py-3 text-[0.95rem] font-bold sm:px-4 transition-[background-color,color,box-shadow] duration-300 ${
                  selected
                    ? 'bg-primary text-fg-on-primary shadow-[0_10px_24px_-12px_color-mix(in_oklab,var(--primary)_80%,transparent)]'
                    : 'text-fg-muted hover:bg-surface-sunken hover:text-fg'
                }`}
              >
                <Icon name={tab.icon} size={18} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {tabs.map((tab, index) => (
          <div
            key={tab.key}
            role="tabpanel"
            id={`${base}-panel-${index}`}
            aria-labelledby={`${base}-tab-${index}`}
            hidden={index !== active}
            className="mt-8"
          >
            <h3 className="text-2xl font-black leading-snug text-fg sm:text-3xl">{tab.headline}</h3>
            <ul className="mt-6 flex flex-col gap-4">
              {tab.points.map((point, i) => (
                <li
                  key={point}
                  className="role-point flex items-start gap-3"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                    <Icon name="check" size={14} strokeWidth={2.6} />
                  </span>
                  <span className="text-lg leading-relaxed text-fg-muted">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative mx-auto flex h-[600px] w-full max-w-md items-center justify-center">
        <div aria-hidden="true" className="arch absolute inset-x-6 bottom-0 top-6 bg-linear-to-b from-lapis-500/25 to-lapis-500/5 dark:from-lapis-400/25" />
        <div aria-hidden="true" className="window-glow absolute inset-0 opacity-70" />
        {tabs.map((tab, index) => (
          <div
            key={tab.key}
            aria-hidden="true"
            className={`absolute transition-[opacity,transform] duration-500 ease-[var(--ease-out-soft)] ${
              index === active ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-4 scale-[0.97] opacity-0'
            }`}
          >
            {tab.screen}
          </div>
        ))}
      </div>
    </div>
  );
}
