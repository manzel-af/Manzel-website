/**
 * The footer, on the deep lapis band with the girih pattern — the same pair
 * the app uses at the top of its sign-in screen.
 *
 * It also links every page in every language, which gives search engines a
 * plain-HTML path to each translation alongside the hreflang tags.
 */

import Link from 'next/link';

import { Logo } from '@/components/brand/logo';
import { Container } from '@/components/ui/section';
import { Icon } from '@/components/ui/icon';
import type { Dictionary } from '@/lib/dictionary';
import { localizeDigits } from '@/lib/format';
import { localeInfo, locales, type Locale } from '@/lib/i18n';
import { brandName } from '@/lib/seo';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { nav, footer } = dict;
  const base = `/${locale}`;
  const columns = [
    {
      title: footer.product,
      links: [
        { href: `${base}/features`, label: nav.features },
        { href: `${base}/pricing`, label: nav.pricing },
        { href: `${base}/security`, label: nav.security },
        { href: `${base}/download`, label: nav.download },
      ],
    },
    {
      title: footer.company,
      links: [
        { href: `${base}/contact`, label: nav.contact },
        { href: `${base}/download`, label: dict.common.earlyAccess },
      ],
    },
    {
      title: footer.legal,
      links: [
        { href: `${base}/privacy`, label: dict.meta.pages.privacy.title },
        { href: `${base}/terms`, label: dict.meta.pages.terms.title },
        { href: `${base}/delete-account`, label: dict.meta.pages.deleteAccount.title },
      ],
    },
  ];

  const year = localizeDigits(String(new Date().getFullYear()), locale);

  return (
    <footer className="girih relative overflow-hidden bg-band text-band-fg [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.06]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 w-[min(36rem,100%)] rounded-full bg-lapis-500/25 blur-3xl"
      />
      <Container className="relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex max-w-sm flex-col gap-5">
            <Logo light latin={locale === 'en'} size={40} />
            <p className="text-lg font-semibold text-white/85">{footer.tagline}</p>
            <p className="flex items-center gap-2 text-sm text-white/60">
              <Icon name="eyeOff" size={16} className="text-saffron-300" />
              {footer.noTrackers}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-extrabold text-saffron-300">{column.title}</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-[0.95rem] text-white/75 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/55">
            © <bdi>{year}</bdi> {brandName(locale)}. {footer.rights} {footer.madeFor}
          </p>
          <nav aria-label={nav.language}>
            <ul className="flex items-center gap-1">
              {locales.map((other) => (
                <li key={other}>
                  {/* A full load, like the header switcher: a new language is a new document. */}
                  <a
                    href={`/${other}`}
                    hrefLang={localeInfo[other].tag}
                    lang={localeInfo[other].tag}
                    aria-current={other === locale ? 'true' : undefined}
                    className={`rounded-pill px-3 py-1.5 text-sm font-bold transition-colors ${
                      other === locale ? 'bg-white/12 text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {localeInfo[other].nativeName}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
