/**
 * Loading a dictionary, and filling its `{placeholders}`.
 *
 * Imported statically rather than with dynamic `import()`: there are three
 * small files, every page is prerendered, and all of this runs on the server —
 * none of it reaches the browser except the words a page actually renders.
 */

import 'server-only';

import { notFound } from 'next/navigation';

import { en, type Dictionary } from '@/dictionaries/en';
import { fa } from '@/dictionaries/fa';
import { ps } from '@/dictionaries/ps';

import { isLocale, type Locale } from './i18n';

const dictionaries: Record<Locale, Dictionary> = { en, fa, ps };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };

/** `fill('{grace} days', { grace: '۱۵' })` → `'۱۵ days'`. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match);
}

/** The page's locale from its params — or a 404 for anything that is not one. */
export async function localeFrom(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}
