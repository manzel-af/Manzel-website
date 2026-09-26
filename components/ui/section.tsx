/**
 * Page structure: a width-constrained container, and the eyebrow / title /
 * lead block that opens almost every section.
 */

import type { ReactNode } from 'react';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Section({
  id,
  children,
  className = '',
  tone = 'default',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'sunken' | 'band';
}) {
  const toneClass = {
    default: '',
    sunken: 'bg-surface-sunken',
    band: 'bg-band text-band-fg',
  }[tone];
  return (
    <section id={id} className={`relative scroll-mt-24 py-20 sm:py-28 ${toneClass} ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`inline-flex items-center gap-2 text-sm font-bold ${light ? 'text-saffron-300' : 'text-accent'}`}
    >
      <span aria-hidden="true" className="inline-block h-1.5 w-6 rounded-full bg-current opacity-70" />
      {children}
    </p>
  );
}

export function Heading({
  eyebrow,
  title,
  lead,
  align = 'start',
  light = false,
  as: Tag = 'h2',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'start' | 'center';
  light?: boolean;
  as?: 'h1' | 'h2';
}) {
  const centered = align === 'center';
  return (
    <div className={`reveal flex max-w-3xl flex-col gap-4 ${centered ? 'mx-auto items-center text-center' : ''}`}>
      {eyebrow ? <Eyebrow light={light}>{eyebrow}</Eyebrow> : null}
      <Tag
        className={`text-balance text-3xl font-black leading-[1.25] tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          light ? 'text-white' : 'text-fg'
        }`}
      >
        {title}
      </Tag>
      {lead ? (
        <p className={`text-pretty text-lg leading-relaxed ${light ? 'text-white/75' : 'text-fg-muted'}`}>{lead}</p>
      ) : null}
    </div>
  );
}
