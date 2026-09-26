import type { Metadata } from 'next';

import { FeeCalculator } from '@/components/interactive/fee-calculator';
import { Faq, FinalCta } from '@/components/sections/home';
import { PageHero } from '@/components/sections/page-hero';
import { ButtonLink } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Container, Heading, Section } from '@/components/ui/section';
import { fill, getDictionary, localeFrom } from '@/lib/dictionary';
import { formatMoney, formatNumber, localizeDigits } from '@/lib/format';
import { getPlatformInfo } from '@/lib/platform';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]/pricing'>): Promise<Metadata> {
  return pageMetadata(await localeFrom(params), 'pricing');
}

export default async function PricingPage({ params }: PageProps<'/[lang]/pricing'>) {
  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  const page = dict.pricingPage;
  const platform = await getPlatformInfo();
  const price = formatMoney(platform.monthlyFeeMinor, locale, platform.currency);
  const grace = formatNumber(platform.graceDays, locale);
  const howIcons: IconName[] = ['calendar', 'clock', 'money'];

  return (
    <>
      <PageHero
        locale={locale}
        home={dict.nav.home}
        breadcrumbLabel={dict.nav.breadcrumb}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        path="/pricing"
        crumb={dict.nav.pricing}
      />

      <Section>
        <Container className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          {/* The one plan. */}
          <div className="reveal girih relative overflow-hidden rounded-[2rem] bg-band p-8 text-white [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.06] sm:p-10">
            <div aria-hidden="true" className="absolute -end-20 -top-24 h-72 w-72 rounded-full bg-saffron-300/25 blur-[90px]" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-pill bg-saffron-300 px-3.5 py-1.5 text-sm font-extrabold text-lapis-950">
                <Icon name="sparkle" size={15} />
                {page.planName}
              </span>
              <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2">
                <span className="text-6xl font-black leading-none tracking-tight sm:text-7xl">{price}</span>
                <span className="pb-1 text-lg font-semibold leading-snug text-white/70">
                  {dict.common.perBuilding}
                  <br />
                  {dict.common.perMonth}
                </span>
              </div>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">{page.planBody}</p>

              <h2 className="mt-9 text-sm font-extrabold text-saffron-300">{page.includesTitle}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {page.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-saffron-300 text-lapis-950">
                      <Icon name="check" size={12} strokeWidth={3} />
                    </span>
                    <span className="leading-relaxed text-white/85">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/${locale}/download`} variant="accent" size="lg" icon="download">
                  {dict.nav.getApp}
                </ButtonLink>
                <ButtonLink href={`/${locale}/contact`} variant="light" size="lg" icon="chat">
                  {dict.home.cta.secondary}
                </ButtonLink>
              </div>
            </div>
          </div>

          <div className="reveal lg:sticky lg:top-28">
            <FeeCalculator
              locale={locale}
              feeMinor={platform.monthlyFeeMinor}
              currency={platform.currency}
              labels={{ ...dict.calculator, perMonth: dict.common.perMonth }}
            />
          </div>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container>
          <Heading title={page.howTitle} align="center" />
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {page.how.map((step, index) => (
              <li key={step.title} className="reveal relative rounded-card border border-line bg-surface p-7">
                <span className="absolute end-6 top-6 text-5xl font-black leading-none text-line">
                  {localizeDigits(String(index + 1), locale)}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <Icon name={howIcons[index]} size={23} />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-fg">{fill(step.title, { grace })}</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">{fill(step.body, { grace })}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Faq items={page.faq} eyebrow={page.eyebrow} title={dict.home.faq.title} />

      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
