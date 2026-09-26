/**
 * The opening of every inner page: a breadcrumb, the page's one <h1>, and a
 * lead — over the same girih field and warm light as the home page.
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { Icon } from '@/components/ui/icon';
import { Container, Eyebrow } from '@/components/ui/section';
import type { Locale } from '@/lib/i18n';

export function PageHero({
  locale,
  home,
  breadcrumbLabel,
  eyebrow,
  title,
  lead,
  path,
  crumb,
  children,
  aside,
}: {
  locale: Locale;
  /** "Home", in this language. */
  home: string;
  /** The breadcrumb's accessible name, in this language. */
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  lead?: string;
  /** This page's path after the locale, e.g. "/pricing". */
  path: string;
  /** This page's name in the breadcrumb. */
  crumb: string;
  /** Under the lead: buttons, a notice. */
  children?: ReactNode;
  /** Beside the text on wide screens. */
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line/70">
      <div aria-hidden="true" className="girih absolute inset-0 [--girih-opacity:0.05] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div aria-hidden="true" className="absolute -top-40 end-[-8%] h-[28rem] w-[28rem] rounded-full bg-saffron-300/20 blur-[110px]" />
      <div aria-hidden="true" className="absolute -bottom-48 start-[-10%] h-[26rem] w-[26rem] rounded-full bg-lapis-400/15 blur-[110px]" />

      <Container className={`relative py-14 sm:py-20 ${aside ? 'grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]' : ''}`}>
        <div className="flex max-w-3xl flex-col items-start">
          <nav aria-label={breadcrumbLabel} className="rise rise-1 mb-6">
            <ol className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
              <li>
                <Link href={`/${locale}`} className="transition-colors hover:text-primary">
                  {home}
                </Link>
              </li>
              <li aria-hidden="true">
                <Icon name="arrow" size={14} className="opacity-60" />
              </li>
              <li aria-current="page" className="text-fg">
                {crumb}
              </li>
            </ol>
          </nav>
          <div className="rise rise-2">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h1 className="rise-text mt-4 text-balance text-4xl font-black leading-[1.25] tracking-tight text-fg sm:text-5xl sm:leading-[1.2]">
            {title}
          </h1>
          {lead ? (
            <p className="rise-text mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-fg-muted sm:text-xl sm:leading-relaxed">
              {lead}
            </p>
          ) : null}
          {children ? <div className="rise rise-5 mt-8 w-full">{children}</div> : null}
        </div>
        {aside ? <div className="rise rise-4 relative">{aside}</div> : null}
      </Container>
      <BreadcrumbJsonLd locale={locale} home={home} name={crumb} path={path} />
    </section>
  );
}
