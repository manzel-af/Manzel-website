'use client';

/**
 * The site navigation: the row of links in the header on wide screens, and
 * the menu sheet on phones.
 *
 * The phone menu is a native popover — the browser handles opening, closing
 * on Escape or an outside tap, focus, and the top layer — so the only script
 * here is "close it when a link inside is followed".
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';

import { Icon } from '@/components/ui/icon';

export interface NavItem {
  href: string;
  label: string;
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname() ?? '';
  return (
    <nav aria-label={label} className="hidden lg:block">
      <ul className="flex items-center gap-0.5 xl:gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative block whitespace-nowrap rounded-pill px-3 py-2 text-[0.95rem] font-semibold transition-colors xl:px-3.5 ${
                  active ? 'text-primary' : 'text-fg-muted hover:text-fg'
                }`}
              >
                {item.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-accent-bright"
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileMenu({
  items,
  label,
  openLabel,
  closeLabel,
  footer,
}: {
  items: NavItem[];
  label: string;
  openLabel: string;
  closeLabel: string;
  /** The language switcher and the call to action, rendered on the server. */
  footer: ReactNode;
}) {
  const pathname = usePathname() ?? '';

  function closeOnLink(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('a')) event.currentTarget.hidePopover();
  }

  return (
    <>
      <button
        type="button"
        popoverTarget="site-menu"
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-fg lg:hidden"
      >
        <span className="sr-only">{openLabel}</span>
        <Icon name="menu" size={20} />
      </button>

      <div id="site-menu" popover="auto" onClick={closeOnLink} className="menu-sheet" aria-label={label}>
        <div className="flex items-center justify-between pb-2">
          <span className="text-sm font-bold text-fg-subtle">{label}</span>
          <button
            type="button"
            popoverTarget="site-menu"
            popoverTargetAction="hide"
            className="grid h-10 w-10 place-items-center rounded-full bg-surface-sunken text-fg"
          >
            <span className="sr-only">{closeLabel}</span>
            <Icon name="close" size={18} />
          </button>
        </div>
        <nav aria-label={label}>
          <ul className="flex flex-col">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center justify-between rounded-2xl px-3 py-3.5 text-lg font-bold ${
                      active ? 'bg-primary-soft text-primary' : 'text-fg hover:bg-surface-sunken'
                    }`}
                  >
                    {item.label}
                    <Icon name="arrow" size={18} className="opacity-50" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-3 flex flex-col gap-3 border-t border-line pt-4">{footer}</div>
      </div>
    </>
  );
}
