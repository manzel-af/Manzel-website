/**
 * A link that looks like a button. Every call to action on the site goes
 * somewhere, so these are anchors (crawlable, middle-clickable, shareable)
 * rather than buttons with click handlers.
 */

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { Icon, type IconName } from './icon';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'light';
type Size = 'md' | 'lg';

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-primary text-fg-on-primary shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--primary)_70%,transparent)] hover:bg-primary-hover',
  accent:
    'bg-saffron-300 text-lapis-950 shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--accent-bright)_80%,transparent)] hover:bg-saffron-200',
  secondary: 'border border-line-strong bg-surface text-fg hover:border-primary hover:text-primary',
  ghost: 'text-fg hover:bg-surface-sunken',
  light: 'border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20',
};

const SIZE: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.95rem] gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconEnd,
  className = '',
  external = false,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconEnd?: IconName;
  className?: string;
  external?: boolean;
} & Omit<ComponentProps<'a'>, 'href'>) {
  const classes = [
    'inline-flex items-center justify-center rounded-pill font-bold whitespace-nowrap',
    'transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out',
    'active:scale-[0.98] focus-visible:outline-offset-4',
    VARIANT[variant],
    SIZE[size],
    className,
  ].join(' ');

  const content = (
    <>
      {icon ? <Icon name={icon} size={size === 'lg' ? 20 : 18} /> : null}
      <span>{children}</span>
      {iconEnd ? <Icon name={iconEnd} size={size === 'lg' ? 20 : 18} /> : null}
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
