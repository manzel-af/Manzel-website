import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Hero } from '@/components/sections/hero';
import {
  Faq,
  Features,
  FinalCta,
  Money,
  Offline,
  PricingTeaser,
  Privacy,
  Problem,
  Roles,
  Steps,
} from '@/components/sections/home';
import { getDictionary } from '@/lib/dictionary';
import { isLocale } from '@/lib/i18n';
import { getPlatformInfo } from '@/lib/platform';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, 'home') : {};
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const platform = await getPlatformInfo();
  const props = { locale: lang, dict };

  return (
    <>
      <Hero {...props} />
      <Problem {...props} />
      <Roles {...props} />
      <Money {...props} />
      <Offline {...props} />
      <Features {...props} />
      <Privacy {...props} />
      <Steps {...props} />
      <PricingTeaser {...props} platform={platform} />
      <Faq items={dict.home.faq.items} eyebrow={dict.home.faq.eyebrow} title={dict.home.faq.title} />
      <FinalCta {...props} />
    </>
  );
}
