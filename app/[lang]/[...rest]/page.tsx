import { notFound } from 'next/navigation';

/**
 * Any path under a language that is not a page — `/fa/nothing-here` — is a
 * 404 rendered inside that language's layout, so the visitor keeps the
 * header, the footer and their own language.
 */
export default function CatchAll() {
  notFound();
}
