/**
 * The site's icons, drawn in the app's hand: a 24-unit grid, 1.75 strokes,
 * rounded ends. Inline SVG rather than an icon font or library — each page
 * ships only the few paths it uses, and they take the text colour.
 *
 * Icons that point somewhere (arrows, chevrons) flip in right-to-left pages,
 * because "next" is to the left in Dari and Pashto.
 */

import type { SVGProps } from 'react';

const PATHS = {
  check: <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />,
  arrow: <path d="M4 12h15M13 5.5 19.5 12 13 18.5" />,
  chevronDown: <path d="M6 9.5 12 15.5 18 9.5" />,
  receipt: (
    <>
      <path d="M6 3.5h12v17l-2.5-1.6L13 20.5l-2.5-1.6-2 1.6-2.5-1.6Z" />
      <path d="M9 8.5h6M9 12h6M9 15.5h3.5" />
    </>
  ),
  bills: (
    <>
      <rect x="4" y="4.5" width="16" height="15" rx="2.5" />
      <path d="M4 9.5h16M8 3v3M16 3v3M8 13.5h3M8 16.5h6" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.6 2.1a.5.5 0 0 1-.4.8H4.8a.5.5 0 0 1-.4-.8Z" />
      <path d="M10 21a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  wrench: <path d="M15.6 3.6a5 5 0 0 0-5.9 6.6L3.9 16a2 2 0 1 0 2.8 2.8l5.8-5.8a5 5 0 0 0 6.6-5.9l-3 3-2.5-2.5Z" />,
  gate: (
    <>
      <path d="M4 21V9.5a8 8 0 0 1 16 0V21" />
      <path d="M12 21V11.5M4 21h16M8 14h1.5M14.5 14H16" />
    </>
  ),
  chat: (
    <>
      <path d="M20 12a7.5 7.5 0 0 1-11 6.6L4.5 20l1.3-4.2A7.5 7.5 0 1 1 20 12Z" />
      <path d="M9 11.5h.01M12.5 11.5h.01M16 11.5h.01" />
    </>
  ),
  qr: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <path d="M14 14h2.5v2.5M20.5 14v6.5H17M14 20.5v.01M6.5 6.5h1v1h-1zM16.5 6.5h1v1h-1zM6.5 16.5h1v1h-1z" />
    </>
  ),
  wifiOff: (
    <>
      <path d="M3 3l18 18" />
      <path d="M8.5 16.3a5 5 0 0 1 7 0M5.2 12.9a9.6 9.6 0 0 1 4.2-2.3M18.8 12.9a9.6 9.6 0 0 0-2.2-1.5M2 9.3a14 14 0 0 1 3.7-2.6M22 9.3A14 14 0 0 0 11 5.6M12 20h.01" />
    </>
  ),
  wifi: (
    <>
      <path d="M2 9.3a14.5 14.5 0 0 1 20 0M5.2 12.9a9.8 9.8 0 0 1 13.6 0M8.5 16.3a5 5 0 0 1 7 0" />
      <path d="M12 20h.01" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.1 7.5 9.5 4.4-1.4 7.5-4.9 7.5-9.5V6Z" />
      <path d="M8.8 12.2 11 14.4l4.3-4.6" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5" />
    </>
  ),
  eraser: (
    <>
      <path d="m7 20.5-3.5-3.5a1.6 1.6 0 0 1 0-2.3l9.8-9.8a1.6 1.6 0 0 1 2.3 0l4.3 4.3a1.6 1.6 0 0 1 0 2.3L12.5 20.5Z" />
      <path d="M20.5 20.5H7M9.2 10.5l6 6" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5V21M15 10h3.5A1.5 1.5 0 0 1 20 11.5V21M2.5 21h19" />
      <path d="M7.5 8h1M11 8h1M7.5 11.5h1M11 11.5h1M7.5 15h1M11 15h1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  language: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.6 3.6 5.4 3.6 8.5s-1.2 5.9-3.6 8.5c-2.4-2.6-3.6-5.4-3.6-8.5S9.6 6.1 12 3.5Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.3A6.5 6.5 0 0 1 21.5 20" />
    </>
  ),
  phone: <path d="M8.5 3.5 6 3.2a1.5 1.5 0 0 0-1.6 1.2C3.8 7.7 5.7 12.6 9.6 15.4c3.2 2.3 6.7 3.6 9.5 3.4a1.5 1.5 0 0 0 1.4-1.5l-.3-2.5a1.2 1.2 0 0 0-.9-1l-3-.8a1.2 1.2 0 0 0-1.2.4l-1.2 1.4a11 11 0 0 1-4.9-4.9l1.4-1.2a1.2 1.2 0 0 0 .4-1.2l-.8-3a1.2 1.2 0 0 0-1-.9Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.8 6.5 8.2 6.3 8.2-6.3" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4.5 20.5 5.8 16a8.5 8.5 0 1 1 3.3 3.2Z" />
      <path d="M9.2 8.6c.3-.7 1-.6 1.3 0l.6 1.3c.1.3 0 .6-.2.8l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.5-.3.8-.2l1.3.6c.6.3.7 1 0 1.3-2.3 1.4-8-3.7-6.7-6.7Z" />
    </>
  ),
  download: <path d="M12 3.5v12M7 10.5l5 5 5-5M4.5 20h15" />,
  android: (
    <>
      <path d="M5 11a7 7 0 0 1 14 0v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18Z" />
      <path d="M8 6 6.5 4M16 6l1.5-2M9.5 9.5h.01M14.5 9.5h.01M5 13h14" />
    </>
  ),
  sparkle: <path d="M12 3.5 13.9 10.1 20.5 12 13.9 13.9 12 20.5 10.1 13.9 3.5 12 10.1 10.1Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12.5" rx="2" />
      <path d="M8.5 20.5h7M12 16.5v4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  eyeOff: (
    <>
      <path d="M3 3l18 18M10.6 5.1A9.7 9.7 0 0 1 12 5c5 0 8.6 4.5 9.5 7a13.4 13.4 0 0 1-2.6 3.8M6.6 6.6C4.4 8 3 10.3 2.5 12c.9 2.5 4.5 7 9.5 7a9.6 9.6 0 0 0 5.4-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  money: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.8" />
      <path d="M6 9.5v5M18 9.5v5" />
    </>
  ),
  support: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13.5" width="4" height="6" rx="1.5" />
      <rect x="17" y="13.5" width="4" height="6" rx="1.5" />
      <path d="M19 19.5a3 3 0 0 1-3 2h-2.5" />
    </>
  ),
} as const;

export type IconName = keyof typeof PATHS;

const DIRECTIONAL: ReadonlySet<IconName> = new Set(['arrow']);

export function Icon({
  name,
  size = 22,
  className,
  strokeWidth = 1.75,
  ...rest
}: { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={[DIRECTIONAL.has(name) ? 'rtl:-scale-x-100' : '', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
