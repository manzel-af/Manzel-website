import { lang } from 'next/root-params';

import { LogoMark } from '@/components/brand/logo';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/section';
import { getDictionary } from '@/lib/dictionary';
import { localizeDigits } from '@/lib/format';
import { defaultLocale, isLocale } from '@/lib/i18n';

/** A 404 in the visitor's language: an empty doorway, and the way home. */
export default async function NotFound() {
  const current = await lang();
  const locale = isLocale(current) ? current : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="girih absolute inset-0 [--girih-opacity:0.05] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
      <Container className="relative flex flex-col items-center py-24 text-center sm:py-32">
        <div aria-hidden="true" className="relative grid h-56 w-44 place-items-center">
          <div className="arch absolute inset-0 bg-linear-to-b from-lapis-500 to-lapis-800 dark:from-lapis-600 dark:to-lapis-950" />
          <div className="arch absolute inset-[18%_22%_0] bg-bg" />
          <LogoMark size={44} className="relative mt-16 opacity-90" />
        </div>
        <p className="mt-10 text-sm font-extrabold tracking-[0.3em] text-accent">{localizeDigits('404', locale)}</p>
        <h1 className="mt-3 max-w-xl text-balance text-3xl font-black leading-snug text-fg sm:text-4xl">
          {dict.notFound.title}
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-fg-muted">{dict.notFound.body}</p>
        <ButtonLink href={`/${locale}`} size="lg" icon="building" className="mt-9">
          {dict.notFound.home}
        </ButtonLink>
      </Container>
    </section>
  );
}
