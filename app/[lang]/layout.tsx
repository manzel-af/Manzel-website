/**
 * The root layout. The language segment sits above it, so each language has
 * its own <html lang dir> from the first byte — no client-side flip from LTR
 * to RTL, and a crawler sees the right language on every page.
 */

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { ThemeSync } from '@/components/layout/theme-sync';
import { SiteJsonLd } from '@/components/seo/json-ld';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, localeInfo, locales } from '@/lib/i18n';
import { getPlatformInfo } from '@/lib/platform';
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
  const dict = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    applicationName: brandName(lang),
    title: { default: dict.meta.siteTitle, template: `%s | ${brandName(lang)}` },
    description: dict.meta.siteDescription,
    authors: [{ name: site.name }],
    creator: site.name,
    formatDetection: { telephone: false, email: false, address: false },
    // `robots` is set per page (lib/seo.ts), not here, so a 404 carries only
    // the noindex Next adds for it rather than two contradictory tags.
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

  const dict = getDictionary(lang);
  const info = localeInfo[lang];
  const platform = await getPlatformInfo();

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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-primary focus:px-5 focus:py-3 focus:font-bold focus:text-fg-on-primary"
        >
          {dict.nav.skip}
        </a>
        <Header locale={lang} dict={dict} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={lang} dict={dict} />
        <SiteJsonLd locale={lang} dict={dict} platform={platform} />
      </body>
    </html>
  );
}
