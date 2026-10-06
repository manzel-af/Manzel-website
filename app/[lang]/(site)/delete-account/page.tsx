/**
 * Deleting a Manzel account (V033).
 *
 * Google Play asks every app where an account can be made for a web page
 * where people can ask for deletion without the app, naming the app as its
 * store listing does. The steps in the app come first; without the app, the
 * way is to contact us — the live contact details, the same as the contact
 * page's, sit right under the text.
 *
 * Reachable while the site is coming soon (proxy.ts), like the privacy policy
 * and terms the stores link to.
 */

import type { Metadata } from 'next';

import { ContactOptions } from '@/components/sections/contact-options';
import { LegalDocument } from '@/components/sections/legal';
import { Container, Section } from '@/components/ui/section';
import { getDictionary, localeFrom } from '@/lib/dictionary';
import { getPlatformInfo } from '@/lib/platform';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]/delete-account'>): Promise<Metadata> {
  return pageMetadata(await localeFrom(params), 'deleteAccount');
}

export default async function DeleteAccountPage({ params }: PageProps<'/[lang]/delete-account'>) {
  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  const platform = await getPlatformInfo();

  return (
    <>
      <LegalDocument
        locale={locale}
        dict={dict}
        title={dict.meta.pages.deleteAccount.title}
        path="/delete-account"
        sections={dict.legal.deleteAccount}
      />
      <Section>
        <Container>
          <ContactOptions locale={locale} dict={dict} platform={platform} />
        </Container>
      </Section>
    </>
  );
}
