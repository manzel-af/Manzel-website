/**
 * The three languages the site speaks, and everything that depends on which
 * one a page is in.
 *
 * URL segments are the short codes (`/fa`, `/ps`, `/en`) because they are what
 * a person types and shares. `tag` is the full BCP-47 tag for `<html lang>`,
 * `hreflang` and Open Graph — `fa-AF` rather than `fa`, so a search engine
 * knows this is Afghan Dari and not Iranian Persian, which reads differently
 * and uses different words for half the things on this site.
 *
 * Dari is the default: the product is for buildings in Afghanistan, and the
 * building is called منزل on its own door.
 */

export const locales = ['fa', 'ps', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fa';

interface LocaleInfo {
  /** BCP-47, for `<html lang>`, hreflang and `og:locale`. */
  tag: string;
  /** Open Graph wants an underscore: `fa_AF`. */
  ogLocale: string;
  dir: 'rtl' | 'ltr';
  /** The language's own name for itself, for the switcher. */
  nativeName: string;
  /** Which of the two type families the page is set in. */
  script: 'arabic' | 'latin';
}

export const localeInfo: Record<Locale, LocaleInfo> = {
  fa: { tag: 'fa-AF', ogLocale: 'fa_AF', dir: 'rtl', nativeName: 'دری', script: 'arabic' },
  ps: { tag: 'ps-AF', ogLocale: 'ps_AF', dir: 'rtl', nativeName: 'پښتو', script: 'arabic' },
  en: { tag: 'en', ogLocale: 'en_US', dir: 'ltr', nativeName: 'English', script: 'latin' },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value) && (locales as readonly string[]).includes(value as string);
}

/**
 * Picks a locale from an Accept-Language header.
 *
 * Deliberately tiny instead of pulling in a negotiation library for three
 * languages. `prs` is the ISO 639-3 code for Dari specifically; some Afghan
 * Android builds send it instead of `fa`.
 */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [range, ...params] = part.trim().toLowerCase().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { range: range.trim(), q: q ? Number(q.split('=')[1]) || 0 : 1 };
    })
    .filter((entry) => entry.range && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { range } of ranked) {
    const primary = range.split('-')[0];
    if (primary === 'ps' || primary === 'pus') return 'ps';
    if (primary === 'fa' || primary === 'prs' || primary === 'per') return 'fa';
    if (primary === 'en') return 'en';
  }
  return defaultLocale;
}

/** The cookie that remembers a choice made with the language switcher. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

/** `/fa/pricing` → `/en/pricing`, keeping the rest of the path. */
export function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split('/');
  if (isLocale(segments[1])) {
    segments[1] = next;
    return segments.join('/') || `/${next}`;
  }
  return `/${next}${pathname === '/' ? '' : pathname}`;
}
