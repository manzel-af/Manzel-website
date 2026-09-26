/**
 * Sends a bare URL to the right language.
 *
 * Only a path WITHOUT a locale prefix is touched: `/` → `/fa`, `/pricing` →
 * `/fa/pricing`. The choice is, in order, the language someone picked with the
 * switcher (a cookie), their browser's Accept-Language, then Dari.
 *
 * Every page under a locale is static, so this is the only per-request code on
 * the whole site, and it runs only on the handful of requests that arrive
 * without a language. (Next 16 renamed middleware to proxy; same thing.)
 */

import { NextResponse, type NextRequest } from 'next/server';

import { isLocale, LOCALE_COOKIE, negotiateLocale } from './lib/i18n';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split('/')[1];
  if (isLocale(first)) return;

  const remembered = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(remembered)
    ? remembered
    : negotiateLocale(request.headers.get('accept-language'));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  // 307: the target depends on who is asking, so no one should cache it.
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Not Next's own files, not the metadata routes, not anything with a dot
  // (fonts, icons, images) — those are served as they are, for every language.
  matcher: [
    '/((?!_next|api|sitemap.xml|robots.txt|manifest.webmanifest|icon|apple-icon|opengraph-image|.*\\..*).*)',
  ],
};
