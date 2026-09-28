/**
 * The launch switch.
 *
 *   SITE_MODE=live          the full website
 *   anything else, or unset the coming-soon page, and nothing else
 *
 * Fail-closed on purpose: a deployment that forgets the variable shows the
 * coming-soon page, never the unreleased site. The switch is enforced in
 * proxy.ts, before any page or file is served; sitemap.ts and robots.ts
 * follow it too. Changing it needs a redeploy (or a restart with
 * `next start`), not a rebuild of anything else.
 */

export type SiteMode = 'live' | 'coming-soon';

export function siteMode(): SiteMode {
  return process.env.SITE_MODE === 'live' ? 'live' : 'coming-soon';
}

export function isLive(): boolean {
  return siteMode() === 'live';
}

/** The coming-soon page's own route. Visitors never see this path. */
export const SOON_SEGMENT = 'soon';

/** Social cards the coming-soon page may serve; every other /og/ file is the full site's. */
export const SOON_OG_PREFIX = '/og/soon-';
