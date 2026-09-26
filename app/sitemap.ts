import type { MetadataRoute } from 'next';

import { locales } from '@/lib/i18n';
import { languageAlternates, PAGE_PATHS } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

/** How much each page matters, relative to the others. */
const PRIORITY: Record<keyof typeof PAGE_PATHS, number> = {
  home: 1,
  features: 0.9,
  pricing: 0.9,
  download: 0.8,
  security: 0.7,
  contact: 0.6,
  privacy: 0.3,
  terms: 0.3,
};

/**
 * Every page in every language, each listing its translations — the sitemap
 * form of hreflang, so the three versions are understood as one page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return (Object.keys(PAGE_PATHS) as (keyof typeof PAGE_PATHS)[]).flatMap((page) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${PAGE_PATHS[page]}`),
      lastModified,
      changeFrequency: page === 'pricing' ? ('weekly' as const) : ('monthly' as const),
      priority: PRIORITY[page],
      alternates: { languages: languageAlternates(PAGE_PATHS[page]) },
    })),
  );
}
