import type { Metadata } from 'next';
import Link from 'next/link';

import { FinalCta } from '@/components/sections/home';
import { PageHero } from '@/components/sections/page-hero';
import { Icon, type IconName } from '@/components/ui/icon';
import { Container, Section } from '@/components/ui/section';
import { getDictionary, localeFrom } from '@/lib/dictionary';
import { localizeDigits } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]/security'>): Promise<Metadata> {
  return pageMetadata(await localeFrom(params), 'security');
}

const PILLAR_ICONS: IconName[] = ['lock', 'shield', 'eraser', 'building', 'clock', 'eyeOff'];

export default async function SecurityPage({ params }: PageProps<'/[lang]/security'>) {
  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  const page = dict.securityPage;
  const m = dict.mockup;

  return (
    <>
      <PageHero
        locale={locale}
        home={dict.nav.home}
        breadcrumbLabel={dict.nav.breadcrumb}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        path="/security"
        crumb={dict.nav.security}
        aside={
          <div aria-hidden="true" className="relative mx-auto grid h-80 w-64 place-items-center">
            <div className="arch girih absolute inset-0 bg-band [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.1]" />
            <div className="absolute inset-x-10 top-16 h-32 rounded-full bg-saffron-300/40 blur-3xl animate-glow" />
            <span className="relative grid h-28 w-28 place-items-center rounded-[2.2rem] bg-saffron-300 text-lapis-950 shadow-[0_0_80px_rgba(240,190,81,0.55)]">
              <Icon name="shield" size={56} strokeWidth={1.5} />
            </span>
          </div>
        }
      />

      {/* What we keep, set against what we refuse to. */}
      <Section>
        <Container className="grid gap-6 lg:grid-cols-2">
          <article className="reveal rounded-[1.75rem] border border-line bg-surface p-8 sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-success-soft text-success">
              <Icon name="check" size={24} strokeWidth={2.2} />
            </span>
            <h2 className="mt-6 text-2xl font-black text-fg sm:text-3xl">{page.collectTitle}</h2>
            <p className="mt-4 text-lg leading-relaxed text-fg-muted">{page.collectBody}</p>
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-surface-sunken px-4 py-3.5">
                <Icon name="users" size={20} className="text-primary" />
                <span className="font-bold text-fg">{m.names[1]}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-surface-sunken px-4 py-3.5">
                <Icon name="phone" size={20} className="text-primary" />
                <bdi dir="ltr" className="font-bold text-fg">
                  {localizeDigits('+93 79 000 0000', locale)}
                </bdi>
              </div>
            </div>
          </article>

          <article className="reveal rounded-[1.75rem] border border-line bg-surface-sunken p-8 sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-danger-soft text-danger">
              <Icon name="close" size={24} strokeWidth={2.2} />
            </span>
            <h2 className="mt-6 text-2xl font-black text-fg sm:text-3xl">{page.neverTitle}</h2>
            <ul className="mt-6 flex flex-col divide-y divide-line">
              {page.never.map((item) => (
                <li key={item} className="flex items-center gap-3 py-3.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface text-fg-subtle">
                    <Icon name="close" size={13} strokeWidth={2.4} />
                  </span>
                  <span className="text-lg text-fg-muted">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </Container>
      </Section>

      <Section tone="band" className="girih overflow-hidden [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.05]">
        <Container className="relative">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {page.pillars.map((pillar, index) => (
              <article key={pillar.title} className="reveal rounded-card border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron-300 text-lapis-950">
                  <Icon name={PILLAR_ICONS[index]} size={23} />
                </span>
                <h2 className="mt-5 text-xl font-extrabold text-white">{pillar.title}</h2>
                <p className="mt-3 leading-relaxed text-white/70">{pillar.body}</p>
              </article>
            ))}
          </div>
          <p className="reveal mt-12 text-center">
            <Link
              href={`/${locale}/privacy`}
              className="inline-flex items-center gap-2 font-extrabold text-saffron-300 underline-offset-4 hover:underline"
            >
              {dict.meta.pages.privacy.title}
              <Icon name="arrow" size={18} />
            </Link>
          </p>
        </Container>
      </Section>

      <div className="pt-20 sm:pt-28">
        <FinalCta locale={locale} dict={dict} />
      </div>
    </>
  );
}
