/**
 * The home page, section by section, below the hero.
 *
 * All server components: the only JavaScript the home page ships is for the
 * three interactive islands (role tabs, the offline demo, the fee calculator)
 * and the header controls.
 */

import Link from 'next/link';

import { LogoMark } from '@/components/brand/logo';

import { FeeCalculator } from '@/components/interactive/fee-calculator';
import { OfflineDemo } from '@/components/interactive/offline-demo';
import { RoleShowcase, type RoleTab } from '@/components/interactive/role-showcase';
import {
  AccountantScreen,
  GuardScreen,
  ManagerScreen,
  Phone,
  ReceiptPaper,
  ResidentScreen,
} from '@/components/mockups/phone';
import { FaqJsonLd } from '@/components/seo/json-ld';
import { ButtonLink } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Container, Heading, Section } from '@/components/ui/section';
import type { Dictionary } from '@/lib/dictionary';
import { formatMoney, localizeDigits } from '@/lib/format';
import { localeInfo, type Locale } from '@/lib/i18n';
import type { PlatformInfo } from '@/lib/platform';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

/* ------------------------------------------------------------------------ */

export function Problem({ dict }: Props) {
  const { problem } = dict.home;
  const icons: IconName[] = ['users', 'receipt', 'bell'];
  return (
    <Section tone="sunken">
      <Container>
        <Heading eyebrow={problem.eyebrow} title={problem.title} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {problem.items.map((item, index) => (
            <article
              key={item.title}
              className="reveal group relative overflow-hidden rounded-card border border-line bg-surface p-7"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-danger-soft text-danger">
                <Icon name={icons[index]} size={24} />
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-fg">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-fg-muted">{item.body}</p>
            </article>
          ))}
        </div>
        <p className="reveal mt-12 flex items-center justify-center gap-3 text-center text-xl font-extrabold text-primary sm:text-2xl">
          <Icon name="sparkle" size={22} className="shrink-0 text-accent-bright" />
          {problem.turn}
        </p>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

export function Roles({ locale, dict }: Props) {
  const { roles } = dict.home;
  const m = dict.mockup;
  const tabs: RoleTab[] = [
    { key: 'manager', icon: 'building', ...roles.tabs.manager, screen: <Phone><ManagerScreen locale={locale} m={m} /></Phone> },
    { key: 'accountant', icon: 'chart', ...roles.tabs.accountant, screen: <Phone><AccountantScreen locale={locale} m={m} /></Phone> },
    { key: 'resident', icon: 'users', ...roles.tabs.resident, screen: <Phone><ResidentScreen locale={locale} m={m} /></Phone> },
    { key: 'guard', icon: 'gate', ...roles.tabs.guard, screen: <Phone><GuardScreen locale={locale} m={m} /></Phone> },
  ];
  return (
    <Section id="how">
      <Container>
        <Heading eyebrow={roles.eyebrow} title={roles.title} lead={roles.lead} align="center" />
        <RoleShowcase tabs={tabs} dir={localeInfo[locale].dir} />
        <p className="mt-6 text-center text-xs text-fg-subtle">{dict.common.illustrative}</p>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

export function Money({ locale, dict }: Props) {
  const { money } = dict.home;
  const icons: IconName[] = ['bills', 'money', 'receipt'];
  return (
    <Section tone="sunken" className="overflow-hidden">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Heading eyebrow={money.eyebrow} title={money.title} lead={money.lead} />
          <ol className="mt-10 flex flex-col">
            {money.steps.map((step, index) => (
              <li key={step.title} className="reveal relative flex gap-5 pb-9 last:pb-0">
                {/* The thread between steps. */}
                {index < money.steps.length - 1 ? (
                  <span aria-hidden="true" className="absolute start-6 top-14 bottom-1 w-px border-s-2 border-dashed border-line-strong" />
                ) : null}
                <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-fg-on-primary shadow-[0_10px_24px_-12px_var(--primary)]">
                  <Icon name={icons[index]} size={22} />
                </span>
                <div className="pt-1">
                  <h3 className="text-xl font-extrabold text-fg">
                    <span className="me-2 text-accent">{localizeDigits(String(index + 1), locale)}.</span>
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-fg-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* The receipt the resident keeps, and the moment it lands on their phone. */}
        <div className="reveal relative mx-auto grid min-h-[30rem] w-full max-w-md place-items-center">
          <div aria-hidden="true" className="window-glow absolute inset-0" />
          <ReceiptPaper locale={locale} m={dict.mockup} className="relative rotate-[-3deg]" />
          {/* …and the notification that tells the resident it is on their phone. */}
          <div
            aria-hidden="true"
            className="absolute -bottom-3 end-0 z-10 flex w-64 items-center gap-3 rounded-2xl border border-line bg-surface/95 p-3 shadow-[0_24px_48px_-20px_rgba(12,27,49,0.45)] backdrop-blur animate-float [--tilt:2deg] sm:-end-6"
          >
            <LogoMark size={36} />
            <div className="min-w-0 leading-tight">
              <p className="text-[13px] font-extrabold text-fg">
                {dict.mockup.receipt} · {dict.mockup.paid}
              </p>
              <p className="truncate text-[11.5px] text-fg-muted">
                {formatMoney(295000, locale)} · {dict.mockup.flat} <bdi>{localizeDigits('304', locale)}</bdi>
              </p>
            </div>
            <span className="ms-auto grid h-7 w-7 shrink-0 place-items-center rounded-full bg-success text-bg">
              <Icon name="check" size={14} strokeWidth={2.8} />
            </span>
          </div>
          <div
            aria-hidden="true"
            className="absolute start-0 top-8 z-10 flex items-center gap-2 rounded-pill border border-line bg-surface px-3.5 py-2 text-sm font-bold text-fg shadow-lg sm:-start-4"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-danger-soft text-[0.6rem] font-black text-danger">PDF</span>
            {dict.mockup.receipt}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

export function Offline({ locale, dict }: Props) {
  const { offline } = dict.home;
  return (
    <Section tone="band" className="girih overflow-hidden [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.05]">
      <div aria-hidden="true" className="absolute -top-32 end-[-10%] h-[28rem] w-[28rem] rounded-full bg-lapis-500/30 blur-[110px]" />
      <Container className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Heading eyebrow={offline.eyebrow} title={offline.title} lead={offline.lead} light />
          <ul className="mt-9 flex flex-col gap-4">
            {offline.points.map((point) => (
              <li key={point} className="reveal flex items-start gap-3">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-saffron-300 text-lapis-950">
                  <Icon name="check" size={14} strokeWidth={2.8} />
                </span>
                <span className="text-lg leading-relaxed text-white/80">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal">
          <OfflineDemo locale={locale} labels={{ ...offline.demo }} />
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

const FEATURE_ICONS: Record<string, IconName> = {
  bills: 'bills',
  receipts: 'receipt',
  arrears: 'chart',
  notices: 'bell',
  repairs: 'wrench',
  gate: 'gate',
  chat: 'chat',
  join: 'qr',
};

export function Features({ locale, dict }: Props) {
  const { features } = dict.home;
  return (
    <Section>
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Heading eyebrow={features.eyebrow} title={features.title} />
          <ButtonLink href={`/${locale}/features`} variant="secondary" iconEnd="arrow" className="reveal shrink-0">
            {dict.common.seeAll}
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.items.map((item) => (
            <article
              key={item.key}
              className={`reveal group relative overflow-hidden rounded-card border border-line bg-surface p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_48px_-24px_rgba(12,27,49,0.35)]`}
            >
              <div aria-hidden="true" className="absolute -end-10 -top-10 h-28 w-28 rounded-full bg-accent-soft opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-fg-on-primary">
                <Icon name={FEATURE_ICONS[item.key]} size={24} />
              </span>
              <h3 className="relative mt-5 text-lg font-extrabold text-fg">{item.title}</h3>
              <p className="relative mt-2 leading-relaxed text-fg-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

export function Privacy({ locale, dict }: Props) {
  const { privacy } = dict.home;
  const never = [dict.securityPage.never[0], dict.securityPage.never[2], dict.securityPage.never[4]];
  const m = dict.mockup;
  return (
    <Section tone="sunken" className="overflow-hidden">
      <Container className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* What a person's record holds: two lines, and a list of what it never will. */}
        <div className="reveal relative mx-auto w-full max-w-md lg:order-last">
          <div aria-hidden="true" className="arch girih absolute inset-x-2 inset-y-0 bg-band [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.08] sm:inset-x-4" />
          {/* The lit window of the arch: a lock. */}
          <div aria-hidden="true" className="relative mx-auto mt-16 grid h-24 w-24 place-items-center rounded-[2rem] bg-saffron-300 text-lapis-950 shadow-[0_0_70px_rgba(240,190,81,0.5)]">
            <Icon name="lock" size={44} strokeWidth={1.6} />
          </div>
          <div className="relative mx-6 mt-10 rounded-3xl border border-line bg-surface p-5 shadow-[0_30px_60px_-30px_rgba(12,27,49,0.5)] sm:mx-10">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-lapis-100 text-base font-black text-lapis-700">
                {m.names[0].charAt(0)}
              </span>
              <div className="leading-tight">
                <p className="font-extrabold text-fg">{m.names[0]}</p>
                <p dir="ltr" className="text-start text-sm text-fg-muted rtl:text-end">
                  {localizeDigits('+93 70 000 0000', locale)}
                </p>
              </div>
              <span className="ms-auto grid h-8 w-8 place-items-center rounded-full bg-success-soft text-success">
                <Icon name="check" size={16} strokeWidth={2.4} />
              </span>
            </div>
            <ul className="mt-5 flex flex-col gap-2 border-t border-dashed border-line pt-4">
              {never.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-fg-subtle">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-surface-sunken">
                    <Icon name="close" size={12} strokeWidth={2.4} />
                  </span>
                  <span className="line-through decoration-danger/60">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto -mt-5 mb-8 flex w-fit items-center gap-2 rounded-pill bg-saffron-300 px-4 py-2 text-sm font-extrabold text-lapis-950 shadow-lg">
            <Icon name="shield" size={17} />
            {dict.nav.security}
          </div>
        </div>

        <div>
          <Heading eyebrow={privacy.eyebrow} title={privacy.title} lead={privacy.lead} />
          <ul className="mt-9 grid gap-3 sm:grid-cols-2">
            {privacy.items.map((item) => (
              <li key={item} className="reveal flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                  <Icon name="check" size={15} strokeWidth={2.5} />
                </span>
                <span className="font-semibold leading-relaxed text-fg">{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/${locale}/security`}
            className="reveal mt-8 inline-flex items-center gap-2 font-extrabold text-primary underline-offset-4 hover:underline"
          >
            {privacy.cta}
            <Icon name="arrow" size={18} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

export function Steps({ locale, dict }: Props) {
  const { steps } = dict.home;
  const icons: IconName[] = ['building', 'qr', 'check'];
  return (
    <Section>
      <Container>
        <Heading eyebrow={steps.eyebrow} title={steps.title} align="center" />
        <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
          <span aria-hidden="true" className="absolute inset-x-[16%] top-10 hidden border-t-2 border-dashed border-line-strong md:block" />
          {steps.items.map((step, index) => (
            <li key={step.title} className="reveal relative flex flex-col items-center text-center">
              <span className="relative grid h-20 w-20 place-items-center rounded-full border-8 border-bg bg-primary text-fg-on-primary shadow-[0_16px_32px_-16px_var(--primary)]">
                <Icon name={icons[index]} size={28} />
                <span className="absolute -end-1 -top-1 grid h-8 w-8 place-items-center rounded-full bg-saffron-300 text-sm font-black text-lapis-950">
                  {localizeDigits(String(index + 1), locale)}
                </span>
              </span>
              <h3 className="mt-6 text-xl font-extrabold text-fg">{step.title}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-fg-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

export function PricingTeaser({ locale, dict, platform }: Props & { platform: PlatformInfo }) {
  const { pricing } = dict.home;
  return (
    <Section tone="sunken">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Heading eyebrow={pricing.eyebrow} title={pricing.title} lead={pricing.lead} />
          <div className="reveal mt-8 flex items-end gap-3">
            <span className="text-6xl font-black leading-none tracking-tight text-fg sm:text-7xl">
              {formatMoney(platform.monthlyFeeMinor, locale, platform.currency)}
            </span>
            <span className="pb-1.5 text-lg font-semibold leading-snug text-fg-muted">
              {dict.common.perBuilding}
              <br />
              {dict.common.perMonth}
            </span>
          </div>
          <ButtonLink href={`/${locale}/pricing`} variant="secondary" iconEnd="arrow" size="lg" className="reveal mt-9">
            {pricing.cta}
          </ButtonLink>
        </div>
        <div className="reveal">
          <FeeCalculator
            locale={locale}
            feeMinor={platform.monthlyFeeMinor}
            currency={platform.currency}
            labels={{ ...dict.calculator, perMonth: dict.common.perMonth }}
          />
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

export function Faq({ items, eyebrow, title }: { items: { q: string; a: string }[]; eyebrow: string; title: string }) {
  return (
    <Section>
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Heading eyebrow={eyebrow} title={title} />
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <details
              key={item.q}
              className="reveal group rounded-card border border-line bg-surface transition-colors open:border-line-strong open:shadow-[0_20px_40px_-28px_rgba(12,27,49,0.4)]"
            >
              <summary className="flex items-center justify-between gap-4 p-5 text-lg font-extrabold text-fg sm:p-6">
                {item.q}
                <span className="chevron grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-sunken text-fg-muted transition-transform duration-300">
                  <Icon name="chevronDown" size={18} />
                </span>
              </summary>
              <p className="px-5 pb-6 leading-relaxed text-fg-muted sm:px-6">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
      <FaqJsonLd items={items} />
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

export function FinalCta({ locale, dict }: Props) {
  const { cta } = dict.home;
  return (
    <section className="px-4 pb-20 sm:px-8 sm:pb-28">
      <div className="girih relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-band px-6 py-16 text-center [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.07] sm:px-12 sm:py-20">
        <div aria-hidden="true" className="absolute inset-x-0 -bottom-48 mx-auto h-96 w-[min(40rem,100%)] rounded-full bg-saffron-300/25 blur-[100px]" />
        <div aria-hidden="true" className="arch absolute inset-x-0 bottom-0 mx-auto h-[85%] w-[min(26rem,70%)] bg-linear-to-b from-lapis-500/40 to-transparent" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="reveal text-balance text-3xl font-black leading-[1.3] text-white sm:text-5xl sm:leading-[1.2]">{cta.title}</h2>
          <p className="reveal mt-5 text-lg leading-relaxed text-white/75">{cta.lead}</p>
          <div className="reveal mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href={`/${locale}/download`} variant="accent" size="lg" icon="download">
              {cta.primary}
            </ButtonLink>
            <ButtonLink href={`/${locale}/contact`} variant="light" size="lg" icon="chat">
              {cta.secondary}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
