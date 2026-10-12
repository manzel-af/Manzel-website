import type { Metadata } from 'next';

import { ContactOptions } from '@/components/sections/contact-options';
import { Faq } from '@/components/sections/home';
import { PageHero } from '@/components/sections/page-hero';
import { Icon } from '@/components/ui/icon';
import { MailLink } from '@/components/ui/mail-link';
import { Container, Section } from '@/components/ui/section';
import { getDictionary, localeFrom } from '@/lib/dictionary';
import { getPlatformInfo } from '@/lib/platform';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>): Promise<Metadata> {
  return pageMetadata(await localeFrom(params), 'contact');
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  const page = dict.contactPage;
  const platform = await getPlatformInfo();

  return (
    <>
      <PageHero
        locale={locale}
        home={dict.nav.home}
        breadcrumbLabel={dict.nav.breadcrumb}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        path="/contact"
        crumb={dict.nav.contact}
      />

      <Section>
        <Container className="flex flex-col gap-8">
          <div className="reveal">
            <ContactOptions locale={locale} dict={dict} platform={platform} />
          </div>

          {/* Already a customer: the fastest way is the chat inside the app. */}
          <div className="reveal girih relative flex flex-col items-start gap-5 overflow-hidden rounded-[1.75rem] bg-band p-7 text-white [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.06] sm:flex-row sm:items-center sm:p-9">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-saffron-300 text-lapis-950">
              <Icon name="support" size={26} />
            </span>
            <p className="text-lg leading-relaxed text-white/85">{page.inApp}</p>
          </div>

          {/* Everything that is not help with the app: the company's own mailbox,
              not the support line above. */}
          <div className="reveal flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-6 sm:flex-row sm:items-center sm:gap-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
              <Icon name="mail" size={23} />
            </span>
            <div className="flex-1">
              <h2 className="font-extrabold text-fg">{page.generalTitle}</h2>
              <p className="mt-1 leading-relaxed text-fg-muted">{page.generalBody}</p>
            </div>
            <MailLink
              address={site.email.info}
              className="text-lg font-extrabold text-fg transition-colors hover:text-primary"
            />
          </div>
        </Container>
      </Section>

      <Faq items={dict.home.faq.items} eyebrow={dict.home.faq.eyebrow} title={dict.home.faq.title} />
    </>
  );
}
