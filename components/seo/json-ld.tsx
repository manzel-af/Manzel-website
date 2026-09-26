/**
 * Structured data, so a search result can say what Manzel is — an Android
 * app for managing buildings, and what it costs — rather than guessing from
 * the page text.
 *
 * `<` is escaped because this is written into a <script> tag; a translation
 * containing "</script>" must not be able to end it.
 */

import type { Dictionary } from '@/lib/dictionary';
import { localeInfo, type Locale } from '@/lib/i18n';
import type { PlatformInfo } from '@/lib/platform';
import { brandName } from '@/lib/seo';
import { absoluteUrl, site } from '@/lib/site';

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

/** Organization, WebSite and the app itself, on every page. */
export function SiteJsonLd({ locale, dict, platform }: { locale: Locale; dict: Dictionary; platform: PlatformInfo }) {
  const home = absoluteUrl(`/${locale}`);
  const organization = {
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: site.name,
    alternateName: site.wordmark,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/icon.svg'),
    ...(platform.supportEmail || platform.supportPhone
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            areaServed: 'AF',
            availableLanguage: ['fa-AF', 'ps-AF', 'en'],
            ...(platform.supportEmail ? { email: platform.supportEmail } : {}),
            ...(platform.supportPhone ? { telephone: platform.supportPhone } : {}),
          },
        }
      : {}),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${home}#website`,
    url: home,
    name: brandName(locale),
    description: dict.meta.siteDescription,
    inLanguage: localeInfo[locale].tag,
    publisher: { '@id': organization['@id'] },
  };

  const app = {
    '@type': 'SoftwareApplication',
    '@id': absoluteUrl('/#app'),
    name: brandName(locale),
    alternateName: locale === 'en' ? site.wordmark : site.name,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Property management',
    operatingSystem: 'Android',
    inLanguage: ['fa-AF', 'ps-AF', 'en'],
    description: dict.meta.siteDescription,
    url: home,
    publisher: { '@id': organization['@id'] },
    offers: {
      '@type': 'Offer',
      price: (platform.monthlyFeeMinor / 100).toFixed(2),
      priceCurrency: platform.currency,
      category: 'subscription',
      description: `${dict.pricingPage.planBody} (${dict.common.perBuilding}, ${dict.common.perMonth})`,
      url: absoluteUrl(`/${locale}/pricing`),
    },
  };

  return <JsonLd data={{ '@context': 'https://schema.org', '@graph': [organization, website, app] }} />;
}

/** FAQPage, for pages that show a list of questions and answers. */
export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }}
    />
  );
}

/** Breadcrumbs for the inner pages: Home › Pricing. */
export function BreadcrumbJsonLd({ locale, home, name, path }: { locale: Locale; home: string; name: string; path: string }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: home, item: absoluteUrl(`/${locale}`) },
          { '@type': 'ListItem', position: 2, name, item: absoluteUrl(`/${locale}${path}`) },
        ],
      }}
    />
  );
}
