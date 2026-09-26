import type { Metadata } from 'next';

import { LegalDocument } from '@/components/sections/legal';
import { getDictionary, localeFrom } from '@/lib/dictionary';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]/privacy'>): Promise<Metadata> {
  return pageMetadata(await localeFrom(params), 'privacy');
}

export default async function PrivacyPage({ params }: PageProps<'/[lang]/privacy'>) {
  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  return (
    <LegalDocument
      locale={locale}
      dict={dict}
      title={dict.meta.pages.privacy.title}
      path="/privacy"
      sections={dict.legal.privacy}
    />
  );
}
