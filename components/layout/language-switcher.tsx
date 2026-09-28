'use client';

/**
 * Three languages, all visible at once — a dropdown would hide the one a
 * visitor is looking for behind a word in a language they may not read.
 *
 * Each option is a real link to the same page in that language (crawlable,
 * and it works before JavaScript loads). Clicking also stores the choice in a
 * cookie, so the next visit to `/` goes straight to it instead of guessing
 * from the browser's settings.
 *
 * These are plain <a> elements on purpose, not <Link>: the language is the
 * root of the route, so a client-side switch remounts the root layout, and
 * React resets <html> — dropping the theme class — while the pre-paint theme
 * script cannot run again. A new language is a new document (new lang, new
 * dir), so it is loaded as one.
 */

import { usePathname } from 'next/navigation';

import { LOCALE_COOKIE, localeInfo, locales, swapLocale, type Locale } from '@/lib/i18n';

function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSwitcher({
  current,
  label,
  className = '',
  tone = 'default',
  path,
}: {
  current: Locale;
  label: string;
  className?: string;
  /** `night` for the always-dark coming-soon page. */
  tone?: 'default' | 'night';
  /**
   * The path after the language to link to, when it is not the current one —
   * the coming-soon page is shown at /fa but rendered from /fa/soon, and its
   * links must not expose that.
   */
  path?: string;
}) {
  const night = tone === 'night';
  const pathname = usePathname() ?? `/${current}`;

  return (
    <nav
      aria-label={label}
      className={`flex items-center rounded-pill border p-1 ${night ? 'border-white/15 bg-white/5 backdrop-blur' : 'border-line bg-surface'} ${className}`}
    >
      {locales.map((locale) => {
        const active = locale === current;
        const info = localeInfo[locale];
        return (
          <a
            key={locale}
            href={path === undefined ? swapLocale(pathname, locale) : `/${locale}${path}`}
            hrefLang={info.tag}
            lang={info.tag}
            aria-current={active ? 'true' : undefined}
            onClick={() => remember(locale)}
            className={`grid h-8 min-w-11 place-items-center rounded-pill px-2.5 text-[0.82rem] font-bold transition-colors ${
              active
                ? night
                  ? 'bg-saffron-300 text-lapis-950'
                  : 'bg-primary text-fg-on-primary'
                : night
                  ? 'text-white/75 hover:text-white'
                  : 'text-fg-muted hover:text-fg'
            } ${info.script === 'latin' ? 'tracking-wide' : ''}`}
          >
            {locale === 'en' ? 'EN' : info.nativeName}
          </a>
        );
      })}
    </nav>
  );
}
