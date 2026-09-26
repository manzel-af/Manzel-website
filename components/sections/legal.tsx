/**
 * A legal document: numbered sections with a table of contents beside them
 * on wide screens.
 *
 * The date is written on the Shamsi calendar, as every date in the app is,
 * with the Gregorian date alongside on the English page.
 */

import { PageHero } from '@/components/sections/page-hero';
import { Container } from '@/components/ui/section';
import type { Dictionary } from '@/lib/dictionary';
import { localizeDigits } from '@/lib/format';
import type { Locale } from '@/lib/i18n';

/** When the privacy policy and terms last changed. Update with the text. */
const UPDATED = {
  iso: '2026-09-26',
  // 4 Mizan 1405 in the Solar Hijri calendar.
  label: { fa: '۴ میزان ۱۴۰۵', ps: '۴ تله ۱۴۰۵', en: '4 Mizan 1405 (26 September 2026)' } as Record<Locale, string>,
};

export function LegalDocument({
  locale,
  dict,
  title,
  path,
  sections,
}: {
  locale: Locale;
  dict: Dictionary;
  title: string;
  path: string;
  sections: { title: string; body: string }[];
}) {
  return (
    <>
      <PageHero
        locale={locale}
        home={dict.nav.home}
        breadcrumbLabel={dict.nav.breadcrumb}
        eyebrow={dict.footer.legal}
        title={title}
        path={path}
        crumb={title}
      >
        <p className="text-sm font-semibold text-fg-subtle">
          {dict.legal.updated}: <time dateTime={UPDATED.iso}>{UPDATED.label[locale]}</time>
        </p>
      </PageHero>

      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <nav aria-label={title} className="hidden lg:block">
          <ol className="sticky top-28 flex flex-col gap-1 border-s-2 border-line">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#s${index + 1}`}
                  className="-ms-0.5 block border-s-2 border-transparent py-1.5 ps-4 text-sm font-semibold text-fg-muted transition-colors hover:border-primary hover:text-primary"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="max-w-3xl">
          {sections.map((section, index) => (
            <section key={section.title} id={`s${index + 1}`} className="scroll-mt-28 border-b border-line py-8 first:pt-0 last:border-0">
              <h2 className="flex items-baseline gap-3 text-2xl font-black text-fg">
                <span className="text-base font-extrabold text-accent">{localizeDigits(String(index + 1), locale)}.</span>
                {section.title}
              </h2>
              <p className="mt-4 text-lg leading-loose text-fg-muted">{section.body}</p>
            </section>
          ))}
        </article>
      </Container>
    </>
  );
}
