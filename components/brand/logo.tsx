/**
 * The Manzel mark, exactly as the app draws it (components/ui/brand.tsx).
 *
 * A pointed arch — the shape over every doorway in Afghan domestic and civic
 * architecture — around a window of four panes, one per flat on a landing.
 * Lapis for the arch, saffron for the lit window: the building, and somebody
 * home in it.
 */

import { site } from '@/lib/site';

export function LogoMark({
  size = 40,
  className,
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  // A unique id per render so two marks on one page do not share a gradient.
  const id = `arch-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={id} x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3467BD" />
          <stop offset="1" stopColor="#1A4176" />
        </linearGradient>
      </defs>
      <path d="M24 2.5 6 15.5V44a1.5 1.5 0 0 0 1.5 1.5h33A1.5 1.5 0 0 0 42 44V15.5Z" fill={`url(#${id})`} />
      <path
        d="M24 11.5c-5.2 0-9 3.9-9 9.2V37a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V20.7c0-5.3-3.8-9.2-9-9.2Z"
        fill="#F0BE51"
      />
      <rect x="22.9" y="13.5" width="2.2" height="24.5" rx="1" fill="#1E4E8C" opacity="0.92" />
      <rect x="15" y="24.4" width="18" height="2.2" rx="1" fill="#1E4E8C" opacity="0.92" />
    </svg>
  );
}

/**
 * Mark plus the name. The wordmark is always منزل in Vazirmatn, whatever the
 * page language — on the door of the building, that is what it is called —
 * with the Latin name beside it on English pages.
 */
export function Logo({
  latin = false,
  size = 36,
  light = false,
}: {
  latin?: boolean;
  size?: number;
  /** On the dark lapis band, the wordmark is white. */
  light?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="flex flex-col leading-none">
        <span
          lang="fa"
          className={`font-[family-name:var(--font-vazirmatn)] text-[1.55rem] font-black tracking-tight ${light ? 'text-white' : 'text-fg'}`}
        >
          {site.wordmark}
        </span>
        {latin ? (
          <span className={`mt-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] ${light ? 'text-white/60' : 'text-fg-subtle'}`}>
            {site.name}
          </span>
        ) : null}
      </span>
    </span>
  );
}
