import { NextResponse, type NextRequest } from 'next/server';

import { isLocale, LOCALE_COOKIE, negotiateLocale, type Locale } from '@/lib/i18n';
import { isLive, SOON_OG_PREFIX, SOON_SEGMENT } from '@/lib/mode';

/**
 * Every request passes through here first.
 *
 * 1. `/` and paths without a language go to one: the remembered choice, then
 *    the browser's Accept-Language, then Dari.
 * 2. The launch switch (lib/mode.ts). Until SITE_MODE=live:
 *    - `/fa`, `/ps`, `/en` show the coming-soon page, with the URL unchanged;
 *    - every other page — /fa/pricing, /en/features… — redirects to its
 *      language's coming-soon page, so none of the full site is reachable;
 *    - the full site's social cards (/og/fa.jpg…) answer 404: they carry the
 *      site's headline.
 *    Once live, the coming-soon route itself is hidden instead.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const live = isLive();

  if (pathname.startsWith('/og/')) {
    if (live || pathname.startsWith(SOON_OG_PREFIX)) return;
    return new NextResponse(null, { status: 404 });
  }

  const [, first, ...rest] = pathname.split('/');
  const subpath = rest.filter(Boolean);

  if (isLocale(first)) {
    // The ad studio, for exporting social media artwork — development only;
    // in a production build the page itself is a 404.
    if (process.env.NODE_ENV !== 'production' && subpath[0] === 'studio') return;
    if (live) {
      // The coming-soon page does not exist on the live site.
      if (subpath[0] === SOON_SEGMENT) return redirectTo(request, `/${first}`);
      return;
    }
    if (subpath.length === 0) {
      const url = request.nextUrl.clone();
      url.pathname = `/${first}/${SOON_SEGMENT}`;
      return NextResponse.rewrite(url);
    }
    return redirectTo(request, `/${first}`);
  }

  const remembered = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(remembered) ? remembered : negotiateLocale(request.headers.get('accept-language'));
  // While coming soon, a deep link like /pricing lands on the page that exists.
  const target = live && pathname !== '/' ? `/${locale}${pathname}` : `/${locale}`;
  return redirectTo(request, target);
}

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  // Temporary: at launch the same URLs come back.
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    // Pages: everything except Next's internals, metadata routes and files.
    '/((?!_next|api|sitemap.xml|robots.txt|manifest.webmanifest|icon|apple-icon|opengraph-image|.*\\..*).*)',
    // Social cards, which the launch switch gates.
    '/og/:path*',
  ],
};
