/**
 * Metadata for every page, built one way.
 *
 * Each page exists three times — /fa, /ps, /en — so each must name its two
 * siblings (hreflang) and itself as canonical, or a search engine sees three
 * near-duplicates and picks one at random. `x-default` points at Dari, the
 * language a visitor with no stated preference is sent to.
 */

import type { Metadata } from 'next';

import { getDictionary } from './dictionary';
import { defaultLocale, localeInfo, locales, type Locale } from './i18n';
import { absoluteUrl, site } from './site';

export type PageKey = keyof ReturnType<typeof getDictionary>['meta']['pages'];

/** `''` for the home page, `'/pricing'` for the others. */
export const PAGE_PATHS: Record<PageKey, string> = {
  home: '',
  features: '/features',
  pricing: '/pricing',
  security: '/security',
  download: '/download',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  deleteAccount: '/delete-account',
};

/** Every language's URL for one page, keyed by hreflang tag. */
export function languageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of locales) alternates[localeInfo[locale].tag] = absoluteUrl(`/${locale}${path}`);
  alternates['x-default'] = absoluteUrl(`/${defaultLocale}${path}`);
  return alternates;
}

/** The brand as it reads in a title in this language. */
export function brandName(locale: Locale): string {
  return locale === 'en' ? site.name : site.wordmark;
}

export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const dict = getDictionary(locale);
  const info = localeInfo[locale];
  const path = PAGE_PATHS[page];
  const entry = dict.meta.pages[page];
  const url = absoluteUrl(`/${locale}${path}`);
  // Rendered by scripts/generate-images.mts — a browser, so Dari and Pashto are shaped.
  const image = { url: absoluteUrl(`/og/${locale}.jpg`), width: 1200, height: 630, alt: dict.meta.siteTitle };

  // The home page carries the full site title; the others are "Pricing | منزل".
  const isHome = page === 'home';
  const title = isHome ? dict.meta.siteTitle : `${entry.title} | ${brandName(locale)}`;
  const description = entry.description || dict.meta.siteDescription;

  return {
    title: { absolute: title },
    description,
    keywords: isHome ? dict.meta.keywords : undefined,
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      url,
      siteName: brandName(locale),
      title,
      description,
      locale: info.ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeInfo[l].ogLocale),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
