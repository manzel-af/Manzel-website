/**
 * The coming-soon page — the whole of manzel.af until launch.
 *
 * Visitors never see this path: proxy.ts shows it at /fa, /ps and /en and
 * sends every other page there, until SITE_MODE=live (lib/mode.ts).
 *
 * It says what the brand is and who it is for, and nothing about how the
 * product works: no features, no screens, no prices. It shares nothing with
 * the full site but the root shell (fonts, theme) — not its header, footer,
 * metadata or structured data.
 */

import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';

import { Logo } from '@/components/brand/logo';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { JsonLd } from '@/components/seo/json-ld';
import { LitBuilding } from '@/components/soon/lit-building';
import { Icon, type IconName } from '@/components/ui/icon';
import { getDictionary, localeFrom } from '@/lib/dictionary';
import { localizeDigits } from '@/lib/format';
import { localeInfo, locales, type Locale } from '@/lib/i18n';
import { getPlatformInfo, whatsappLink, type PlatformInfo } from '@/lib/platform';
import { brandName, languageAlternates } from '@/lib/seo';
import { absoluteUrl, site } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[lang]/soon'>): Promise<Metadata> {
  const locale = await localeFrom(params);
  const { soon } = getDictionary(locale);
  // Visitors see this page at /fa, /ps, /en — so that is its canonical URL.
  const url = absoluteUrl(`/${locale}`);
  const image = { url: absoluteUrl(`/og/soon-${locale}.jpg`), width: 1200, height: 630, alt: soon.metaTitle };
  return {
    title: { absolute: soon.metaTitle },
    description: soon.metaDescription,
    robots: { index: true, follow: true },
    alternates: { canonical: url, languages: languageAlternates('') },
    openGraph: {
      type: 'website',
      url,
      siteName: brandName(locale),
      title: soon.metaTitle,
      description: soon.metaDescription,
      locale: localeInfo[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeInfo[l].ogLocale),
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: soon.metaTitle, description: soon.metaDescription, images: [image] },
  };
}

/* ------------------------------------------------------------------------ */

/** A small seeded generator, so the stars sit in the same place for everyone. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STARS = (() => {
  const random = seeded(1405);
  return Array.from({ length: 46 }, () => ({
    x: random() * 100,
    y: random() * 55,
    size: random() < 0.15 ? 2.5 : random() < 0.5 ? 1.5 : 1,
    opacity: 0.35 + random() * 0.6,
    delay: -random() * 4,
  }));
})();

/** The night the building stands in: stars, a crescent moon, and the mountains around Kabul. */
function NightScene({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[2.25rem] border border-white/10 bg-linear-to-b from-[#060f1f] via-[#0c1d38] to-[#15315a] px-4 pb-8 pt-16 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:px-8">
      {STARS.map((star, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="star -z-10"
          style={
            {
              insetInlineStart: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              '--o': star.opacity,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
            } as CSSProperties
          }
        />
      ))}

      {/* A crescent: a lit disc with the sky's own colour laid over it. */}
      <div aria-hidden="true" className="absolute start-[9%] top-[6%] -z-10 h-11 w-11">
        <span className="absolute inset-0 rounded-full bg-[#fbeac0] shadow-[0_0_40px_8px_rgba(251,234,192,0.25)]" />
        <span className="absolute inset-0 translate-x-3 -translate-y-1 rounded-full bg-[#071224] rtl:-translate-x-3" />
      </div>

      {/* Mountains, two ranges deep. */}
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[46%] w-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        <path d="M0 120 L40 78 L70 98 L118 44 L160 92 L196 64 L236 104 L282 50 L324 96 L360 70 L400 96 V200 H0Z" fill="#132a4b" opacity="0.9" />
        <path d="M118 44 L131 60 L122 58 L112 66 Z M282 50 L296 66 L286 63 L275 70 Z" fill="#dfe8f5" opacity="0.35" />
        <path d="M0 150 L52 118 L96 140 L150 104 L204 142 L262 112 L318 146 L362 124 L400 140 V200 H0Z" fill="#0e2240" />
      </svg>

      {/* Warm light from the building, spilling onto the night. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 mx-auto h-2/3 w-3/4 rounded-full bg-saffron-300/15 blur-[90px]" />

      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function ContactButtons({ locale, platform, labels }: {
  locale: Locale;
  platform: PlatformInfo;
  labels: { whatsapp: string; call: string; email: string; noContacts: string };
}) {
  const options: { icon: IconName; label: string; value: string; href: string; primary?: boolean; external?: boolean }[] = [];
  if (platform.supportWhatsapp) {
    options.push({ icon: 'whatsapp', label: labels.whatsapp, value: platform.supportWhatsapp, href: whatsappLink(platform.supportWhatsapp), primary: true, external: true });
  }
  if (platform.supportPhone) {
    options.push({ icon: 'phone', label: labels.call, value: platform.supportPhone, href: `tel:${platform.supportPhone.replace(/[^\d+]/g, '')}` });
  }
  if (platform.supportEmail) {
    options.push({ icon: 'mail', label: labels.email, value: platform.supportEmail, href: `mailto:${platform.supportEmail}` });
  }

  if (options.length === 0) return <p className="text-sm text-white/65">{labels.noContacts}</p>;

  return (
    <ul className="flex flex-wrap gap-3">
      {options.map((option) => (
        <li key={option.icon}>
          <a
            href={option.href}
            {...(option.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`inline-flex h-12 items-center gap-2.5 rounded-pill px-5 text-[0.95rem] font-bold transition-[background-color,transform] active:scale-[0.98] ${
              option.primary
                ? 'bg-saffron-300 text-lapis-950 shadow-[0_10px_30px_-10px_rgba(240,190,81,0.7)] hover:bg-saffron-200'
                : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            <Icon name={option.icon} size={19} />
            <span>{option.label}</span>
            {option.icon !== 'mail' ? (
              <bdi dir="ltr" className="hidden font-semibold opacity-75 sm:inline">
                {localizeDigits(option.value, locale)}
              </bdi>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------------ */

export default async function ComingSoonPage({ params }: PageProps<'/[lang]/soon'>) {
  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  const { soon } = dict;
  const platform = await getPlatformInfo();
  const year = localizeDigits(String(new Date().getFullYear()), locale);
  const host = new URL(site.url).host;

  return (
    <div className="relative isolate flex min-h-dvh flex-1 flex-col overflow-hidden bg-lapis-950 text-white [color-scheme:dark]">
      {/* The page's own night: girih, and two soft lights. */}
      <div aria-hidden="true" className="girih absolute inset-0 -z-10 [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.045]" />
      <div aria-hidden="true" className="absolute -top-56 end-[-10%] -z-10 h-[40rem] w-[40rem] rounded-full bg-saffron-300/12 blur-[140px]" />
      <div aria-hidden="true" className="absolute -bottom-56 start-[-15%] -z-10 h-[36rem] w-[36rem] rounded-full bg-lapis-500/25 blur-[140px]" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 pt-6 sm:px-8 sm:pt-8">
        <Logo light latin={locale === 'en'} size={38} />
        <LanguageSwitcher current={locale} label={dict.nav.language} tone="night" path="" />
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-x-16 gap-y-12 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-16">
        <div className="flex flex-col items-start">
          <p className="rise rise-1 inline-flex items-center gap-2.5 rounded-pill border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-bold text-saffron-200 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron-300 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron-300" />
            </span>
            {soon.eyebrow}
          </p>

          <h1 className="rise-text mt-7 text-balance text-[2.6rem] font-black leading-[1.2] tracking-tight sm:text-6xl sm:leading-[1.15] lg:text-[4.2rem]">
            {soon.title}{' '}
            <span className="bg-linear-to-r from-saffron-200 via-saffron-300 to-saffron-500 bg-clip-text text-transparent [-webkit-box-decoration-break:clone] [box-decoration-break:clone] rtl:bg-linear-to-l">
              {soon.titleAccent}
            </span>
          </h1>

          <p className="rise-text mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/75 sm:text-xl sm:leading-relaxed">
            {soon.lead}
          </p>

          <div className="rise rise-4 mt-9">
            <p className="text-sm font-semibold text-white/60">{soon.storesTitle}</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {[
                { icon: 'android' as const, name: dict.common.googlePlay },
                { icon: 'apple' as const, name: dict.common.appStore },
              ].map((store) => (
                <li
                  key={store.name}
                  className="inline-flex h-12 items-center gap-2.5 rounded-2xl border border-white/15 bg-black/25 px-4 text-white/90"
                >
                  <Icon name={store.icon} size={22} />
                  <span className="text-[0.95rem] font-bold">{store.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The building. After the text in the source, so keyboard users reach it second. */}
        <div className="rise rise-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <NightScene>
            <LitBuilding locale={locale} dir={localeInfo[locale].dir} labels={soon.game} />
          </NightScene>
        </div>

        <section className="rise rise-5 w-full max-w-xl self-start rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-7 lg:col-start-1">
          <h2 className="text-xl font-extrabold">{soon.contactTitle}</h2>
          <p className="mt-2 leading-relaxed text-white/70">{soon.contactBody}</p>
          <div className="mt-5">
            <ContactButtons
              locale={locale}
              platform={platform}
              labels={{ whatsapp: dict.common.whatsapp, call: dict.common.call, email: dict.common.email, noContacts: soon.noContacts }}
            />
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-5 pb-8 text-sm text-white/55 sm:flex-row sm:px-8">
        <p>
          © <bdi>{year}</bdi> {brandName(locale)}. {dict.footer.rights}
        </p>
        <p dir="ltr">{host}</p>
      </footer>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': absoluteUrl('/#organization'),
              name: site.name,
              alternateName: site.wordmark,
              url: absoluteUrl('/'),
              logo: absoluteUrl('/icon.svg'),
            },
            {
              '@type': 'WebSite',
              url: absoluteUrl(`/${locale}`),
              name: brandName(locale),
              inLanguage: localeInfo[locale].tag,
              publisher: { '@id': absoluteUrl('/#organization') },
            },
          ],
        }}
      />
    </div>
  );
}
