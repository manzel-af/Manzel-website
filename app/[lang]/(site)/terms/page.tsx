import type { Metadata } from 'next';

import { LegalDocument } from '@/components/sections/legal';
import { getDictionary, localeFrom } from '@/lib/dictionary';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]/terms'>): Promise<Metadata> {
  return pageMetadata(await localeFrom(params), 'terms');
}

export default async function TermsPage({ params }: PageProps<'/[lang]/terms'>) {
  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  return (
    <LegalDocument
      locale={locale}
      dict={dict}
      title={dict.meta.pages.terms.title}
      path="/terms"
      sections={dict.legal.terms}
    />
  );
}
