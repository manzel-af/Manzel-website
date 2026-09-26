/**
 * Numbers and money, written the way the app writes them.
 *
 * Deliberately NOT `Intl.NumberFormat`: its output for `fa-AF` / `ps-AF`
 * varies between Node, Chrome and Safari versions (grouping mark, digit set,
 * where the currency goes), and the site must print a fee exactly as the app
 * prints it on a receipt. So the rules are written out once, here, matching
 * src/lib/format/money.ts in the app:
 *
 *   Dari / Pashto   ۱٬۵۰۰ ؋   Extended Arabic-Indic digits, U+066C grouping
 *   English         1,500 ؋   Latin digits, comma grouping
 *
 * ؋ trails the amount in all three languages — it is what the app shows, and
 * a price that looks different on the website and in the app looks wrong.
 */

import type { Locale } from './i18n';

const EASTERN = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_THOUSANDS = '٬'; // ٬
const ARABIC_DECIMAL = '٫'; // ٫

export function usesEasternDigits(locale: Locale): boolean {
  return locale === 'fa' || locale === 'ps';
}

/** Latin digits → the locale's digits. Leaves everything else alone. */
export function localizeDigits(text: string, locale: Locale): string {
  if (!usesEasternDigits(locale)) return text;
  return text.replace(/[0-9]/g, (digit) => EASTERN[Number(digit)]);
}

/** A whole number with thousands grouping, in the locale's digits. */
export function formatNumber(value: number, locale: Locale): string {
  const negative = value < 0;
  const [whole, fraction] = Math.abs(value).toString().split('.');
  const separator = usesEasternDigits(locale) ? ARABIC_THOUSANDS : ',';
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  const decimal = usesEasternDigits(locale) ? ARABIC_DECIMAL : '.';
  const body = fraction ? `${grouped}${decimal}${fraction}` : grouped;
  return localizeDigits(`${negative ? '−' : ''}${body}`, locale);
}

/**
 * Minor units → "۵۰۰ ؋". Whole afghanis drop ".00", as in the app: a fee of
 * 500 is written 500, not 500.00 — but a share of 12.50 keeps both digits.
 * Integer arithmetic, as in the app, so no float ever rounds a pul away.
 */
export function formatMoney(minor: number, locale: Locale, currency = 'AFN'): string {
  const absolute = Math.abs(Math.trunc(minor));
  const whole = Math.floor(absolute / 100);
  const fraction = absolute % 100;
  const decimal = usesEasternDigits(locale) ? ARABIC_DECIMAL : '.';
  let body = formatNumber(whole, locale);
  if (fraction !== 0) body += localizeDigits(`${decimal}${String(fraction).padStart(2, '0')}`, locale);
  const symbol = currency === 'AFN' ? '؋' : currency;
  return `${minor < 0 ? '−' : ''}${body} ${symbol}`;
}
