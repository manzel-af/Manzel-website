/**
 * The full website: header, footer, and the structured data that describes
 * the product. Everything here stays behind the launch switch (lib/mode.ts)
 * while the site is in coming-soon mode — the coming-soon page has its own
 * layout and shares none of this.
 */

import type { Metadata } from 'next';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SiteJsonLd } from '@/components/seo/json-ld';
import { getDictionary, localeFrom } from '@/lib/dictionary';
import { getPlatformInfo } from '@/lib/platform';
import { brandName } from '@/lib/seo';

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  return {
    title: { default: dict.meta.siteTitle, template: `%s | ${brandName(locale)}` },
    description: dict.meta.siteDescription,
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  const platform = await getPlatformInfo();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-primary focus:px-5 focus:py-3 focus:font-bold focus:text-fg-on-primary"
      >
        {dict.nav.skip}
      </a>
      <Header locale={locale} dict={dict} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer locale={locale} dict={dict} />
      <SiteJsonLd locale={locale} dict={dict} platform={platform} />
    </>
  );
}
