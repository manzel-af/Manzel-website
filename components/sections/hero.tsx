/**
 * The first screen: what Manzel is, in one sentence, and the app itself
 * standing in a doorway — the arch from the logo, lit from behind.
 */

import { ManagerScreen, OfflineChip, Phone, ReceiptCard } from '@/components/mockups/phone';
import { ButtonLink } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Container } from '@/components/ui/section';
import type { Dictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { hero } = dict.home;
  return (
    <section className="relative overflow-hidden">
      {/* Atmosphere: the girih field fading out, and a warm light high up. */}
      <div aria-hidden="true" className="girih absolute inset-0 [--girih-opacity:0.05] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div aria-hidden="true" className="absolute -top-48 end-[-10%] h-[36rem] w-[36rem] rounded-full bg-saffron-300/20 blur-[120px]" />
      <div aria-hidden="true" className="absolute -bottom-40 start-[-15%] h-[30rem] w-[30rem] rounded-full bg-lapis-400/15 blur-[120px]" />

      <Container className="relative grid items-center gap-14 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:pb-28 lg:pt-20">
        <div className="flex flex-col items-start">
          <p className="rise rise-1 inline-flex items-center gap-2 rounded-pill border border-line bg-surface/80 px-3.5 py-1.5 text-sm font-bold text-fg-muted shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bright opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-bright" />
            </span>
            {hero.eyebrow}
          </p>

          <h1 className="rise-text mt-6 text-balance text-[2.5rem] font-black leading-[1.22] tracking-tight text-fg sm:text-5xl lg:text-[3.6rem] lg:leading-[1.18]">
            {hero.title} <span className="text-shine">{hero.titleAccent}</span>
          </h1>

          <p className="rise-text mt-6 max-w-xl text-pretty text-lg leading-relaxed text-fg-muted sm:text-xl sm:leading-relaxed">
            {hero.lead}
          </p>

          <div className="rise rise-4 mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href={`/${locale}/download`} size="lg" icon="download">
              {hero.primary}
            </ButtonLink>
            <ButtonLink href="#how" size="lg" variant="secondary" iconEnd="arrow">
              {hero.secondary}
            </ButtonLink>
          </div>

          <ul className="rise rise-5 mt-9 flex flex-wrap gap-x-5 gap-y-2.5">
            {hero.chips.map((chip) => (
              <li key={chip} className="flex items-center gap-1.5 text-[0.92rem] font-semibold text-fg-muted">
                <Icon name="check" size={16} strokeWidth={2.4} className="text-success" />
                {chip}
              </li>
            ))}
          </ul>
        </div>

        {/* The phone in the doorway. */}
        <div className="rise rise-3 relative mx-auto flex w-full max-w-[30rem] justify-center py-6">
          <div aria-hidden="true" className="arch absolute inset-y-0 inset-x-[8%] bg-linear-to-b from-lapis-500 to-lapis-800 opacity-95 dark:from-lapis-600 dark:to-lapis-950" />
          <div aria-hidden="true" className="arch girih absolute inset-y-0 inset-x-[8%] [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.14]" />
          <div aria-hidden="true" className="absolute inset-x-[20%] top-[18%] h-1/2 rounded-full bg-saffron-300/45 blur-[70px] animate-glow" />
          {/* The ground the doorway stands on. */}
          <div aria-hidden="true" className="absolute inset-x-[2%] -bottom-3 h-10 rounded-[50%] bg-lapis-900/25 blur-xl dark:bg-black/50" />

          <Phone className="relative z-10 mt-10">
            <ManagerScreen locale={locale} m={dict.mockup} />
          </Phone>

          <ReceiptCard
            locale={locale}
            m={dict.mockup}
            className="absolute bottom-6 start-[-4%] z-20 animate-float [--tilt:-4deg] max-sm:scale-[0.82] max-sm:origin-bottom-left sm:start-[-8%] rtl:max-sm:origin-bottom-right"
          />
          <OfflineChip
            m={dict.mockup}
            className="absolute end-[-2%] top-16 z-20 animate-float [--tilt:3deg] [animation-delay:-3s] max-sm:scale-90 max-sm:origin-top-right sm:end-[-6%] rtl:max-sm:origin-top-left"
          />
        </div>
      </Container>
    </section>
  );
}
