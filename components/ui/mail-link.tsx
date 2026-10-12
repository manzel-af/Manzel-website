/**
 * Email addresses in the page's text.
 *
 * An address is always isolated and set left to right. Inside a Dari or
 * Pashto sentence the bidi algorithm decides where neutral characters go —
 * the dots, the @, the full stop after it — by what surrounds them, and an
 * address next to a number or another Latin word can come out in the wrong
 * order. `<bdi dir="ltr">` takes it out of the sentence's reordering, as the
 * phone numbers already are.
 */

import type { ReactNode } from 'react';

import { site } from '@/lib/site';

type Mailbox = keyof typeof site.email;

/** `{info}`, `{support}`, `{developer}`: whatever mailboxes lib/site.ts has. */
const MAILBOX_TOKEN = new RegExp(`\\{(${Object.keys(site.email).join('|')})\\}`);

/** An address as a link that opens the visitor's mail app. `children` comes before it, e.g. an icon. */
export function MailLink({ address, className, children }: { address: string; className?: string; children?: ReactNode }) {
  return (
    <a href={`mailto:${address}`} className={className}>
      {children}
      <bdi dir="ltr">{address}</bdi>
    </a>
  );
}

/**
 * Copy with `{support}` (or `{info}`, `{developer}`) in it, with each one
 * turned into that mailbox's link. The dictionaries name a mailbox, never
 * spell its address, so changing one is lib/site.ts and nothing else.
 */
export function withMailboxes(text: string, linkClassName?: string): ReactNode[] {
  // split() with a capturing group keeps the captured names at the odd indices.
  return text.split(MAILBOX_TOKEN).map((part, index) =>
    index % 2 === 0 ? part : <MailLink key={index} address={site.email[part as Mailbox]} className={linkClassName} />,
  );
}
