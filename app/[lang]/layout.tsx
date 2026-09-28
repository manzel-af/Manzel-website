/**
 * The root layout. The language segment sits above it, so each language has
 * its own <html lang dir> from the first byte — no client-side flip from LTR
 * to RTL, and a crawler sees the right language on every page.
 *
 * Deliberately just the shell — fonts, theme, <html> — and nothing about the
 * product: it wraps both the full site, (site)/layout.tsx, and the
 * coming-soon page, soon/page.tsx, and the coming-soon page must not carry
 * the site's description, navigation or structured data.
 */

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';

import { ThemeSync } from '@/components/layout/theme-sync';
import { isLocale, localeInfo, locales } from '@/lib/i18n';
import { brandName } from '@/lib/seo';
import { site } from '@/lib/site';

import '../globals.css';

/* ------------------------------------------------------------------------ */
/* Type: the app's three faces, self-hosted and content-hashed.              */
/* ------------------------------------------------------------------------ */

/** Dari and Pashto, and the wordmark on every page — so always preloaded. */
const vazirmatn = localFont({
  src: '../fonts/Vazirmatn-Variable.woff2',
  variable: '--font-vazirmatn',
  weight: '100 900',
  display: 'swap',
});

/** English. Not preloaded: most visitors read the Dari or Pashto pages. */
const sansation = localFont({
  src: [
    { path: '../fonts/Sansation-Light.woff2', weight: '300' },
    { path: '../fonts/Sansation-Regular.woff2', weight: '400' },
    { path: '../fonts/Sansation-Bold.woff2', weight: '700' },
  ],
  variable: '--font-sansation',
  display: 'swap',
  preload: false,
});

/**
 * The afghani sign. Neither face above has ؋, so this one-glyph font sits
 * first in every stack, restricted to U+060B — the browser only fetches it on
 * a page that actually prints a price.
 */
const afghani = localFont({
  src: [
    { path: '../fonts/ManzelAfghani-Regular.woff2', weight: '400' },
    { path: '../fonts/ManzelAfghani-Bold.woff2', weight: '700' },
  ],
  variable: '--font-afghani',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+060B' }],
});

/* ------------------------------------------------------------------------ */

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    metadataBase: new URL(site.url),
    applicationName: brandName(lang),
    authors: [{ name: site.name }],
    creator: site.name,
    formatDetection: { telephone: false, email: false, address: false },
    // Title, description and `robots` come from each page (lib/seo.ts), so a
    // 404 carries only the noindex Next adds for it.
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: site.colors.paper },
    { media: '(prefers-color-scheme: dark)', color: site.colors.ink900 },
  ],
  colorScheme: 'light dark',
};

/**
 * Applies the stored theme (or the system's) before the first paint, and
 * follows the system while no explicit choice has been made. Inline and tiny
 * on purpose: an external script would arrive after the page had already
 * flashed the wrong colours.
 */
const THEME_SCRIPT = `(function(){var d=document.documentElement,m=matchMedia('(prefers-color-scheme: dark)');function a(){var t=null;try{t=localStorage.getItem('theme')}catch(e){}var k=t==='dark'||(t!=='light'&&m.matches);d.classList.toggle('dark',k);d.style.colorScheme=k?'dark':'light'}a();m.addEventListener('change',a)})()`;

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const info = localeInfo[lang];

  return (
    <html
      lang={info.tag}
      dir={info.dir}
      className={`${vazirmatn.variable} ${sansation.variable} ${afghani.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-bg text-fg antialiased">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
