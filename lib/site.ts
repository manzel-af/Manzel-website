/**
 * Everything about the product's identity that is not a translation.
 *
 * The build spec calls "Manzel" a placeholder codename, so the name lives
 * here once. Renaming the product is this file plus the wordmark strings in
 * the dictionaries, not a search through every page.
 */

export const site = {
  name: 'Manzel',
  /** Always the Dari name, in Vazirmatn, whatever the page language. */
  wordmark: 'منزل',

  /**
   * The public origin, no trailing slash. Canonical URLs, hreflang, the
   * sitemap and Open Graph images are all absolute, so this has to be right
   * in production — see .env.example.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, ''),

  /**
   * Where the app can be installed. `null` means "not published yet", and the
   * site offers early access through the support contacts instead of a dead
   * store badge. Fill these in on launch day and every CTA changes with them.
   */
  links: {
    playStore: null as string | null,
    appStore: null as string | null,
    /** A signed APK for people who install outside the Play Store. */
    apk: null as string | null,
  },

  /** Brand colours used where a CSS variable cannot reach (OG images, manifest). */
  colors: {
    lapis600: '#1E4E8C',
    lapis500: '#3467BD',
    lapis700: '#1A4176',
    lapis900: '#132A4B',
    lapis950: '#0C1B31',
    saffron300: '#F0BE51',
    saffron500: '#D9962B',
    paper: '#FBF8F3',
    ink900: '#0E1116',
  },
} as const;

/** Absolute URL for a path on this site. */
export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}
