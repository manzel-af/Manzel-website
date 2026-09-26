/**
 * The site header: sticky, translucent over the page, and short enough on a
 * phone to leave the screen to the content.
 */

import Link from 'next/link';

import { Logo } from '@/components/brand/logo';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/section';
import type { Dictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';
import { brandName } from '@/lib/seo';

import { LanguageSwitcher } from './language-switcher';
import { MobileMenu, NavLinks, type NavItem } from './nav';
import { ThemeToggle } from './theme-toggle';

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { nav } = dict;
  const items: NavItem[] = [
    { href: `/${locale}/features`, label: nav.features },
    { href: `/${locale}/pricing`, label: nav.pricing },
    { href: `/${locale}/security`, label: nav.security },
    { href: `/${locale}/download`, label: nav.download },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex h-16 items-center gap-3 sm:h-[4.5rem]">
        <Link href={`/${locale}`} className="-ms-1 rounded-xl p-1" aria-label={`${brandName(locale)} — ${nav.home}`}>
          <Logo latin={locale === 'en'} size={34} />
        </Link>

        <div className="ms-auto flex items-center gap-2 lg:ms-8 lg:flex-1">
          <NavLinks items={items} label={nav.menu} />
          <div className="ms-auto flex items-center gap-2">
            <LanguageSwitcher current={locale} label={nav.language} className="max-md:hidden" />
            <ThemeToggle label={nav.theme.label} />
            <ButtonLink href={`/${locale}/download`} size="md" className="max-sm:hidden">
              {nav.getApp}
            </ButtonLink>
            <MobileMenu
              items={[{ href: `/${locale}`, label: nav.home }, ...items]}
              label={nav.menu}
              openLabel={nav.menu}
              closeLabel={nav.close}
              footer={
                <>
                  <LanguageSwitcher current={locale} label={nav.language} className="self-start md:hidden" />
                  <ButtonLink href={`/${locale}/download`} size="lg" icon="download" className="w-full">
                    {nav.getApp}
                  </ButtonLink>
                </>
              }
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
