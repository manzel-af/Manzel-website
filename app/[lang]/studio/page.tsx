/**
 * The ad studio: every social media artwork for one language, laid out at
 * its exact size, for scripts/generate-ads.mts to capture.
 *
 * Development only. In a production build this page is a 404 — it holds the
 * launch-day artwork, which shows the product — and the proxy never lets a
 * visitor reach it while the site is coming soon.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  ComingSoonPortrait,
  ComingSoonPosts,
  ComingSoonStories,
  FacebookCover,
  LaunchCarousel,
  LaunchPost,
  LaunchStory,
  ProfilePicture,
} from '@/components/ads/artworks';
import { getDictionary, localeFrom } from '@/lib/dictionary';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Ad studio',
  robots: { index: false, follow: false },
};

export default async function StudioPage({ params }: PageProps<'/[lang]/studio'>) {
  if (process.env.NODE_ENV === 'production') notFound();

  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  // The address people should type, whatever machine this runs on.
  const host = new URL(site.url).host.replace(/^localhost(:\d+)?$/, 'manzel.af');
  const props = { locale, dict, host };

  return (
    <main className="flex flex-col gap-20 bg-surface-sunken p-12">
      <h1 className="font-mono text-lg text-fg-muted" dir="ltr">
        Ad studio · {locale} — run `npm run ads` to export
      </h1>

      <section className="flex flex-wrap items-start gap-12">
        {locale === 'fa' ? <ProfilePicture /> : null}
        <ComingSoonPosts {...props} />
        <ComingSoonPortrait {...props} />
        <ComingSoonStories {...props} />
        <FacebookCover {...props} />
      </section>

      <section className="flex flex-wrap items-start gap-12">
        <LaunchPost {...props} />
        <LaunchStory {...props} />
        <LaunchCarousel {...props} />
      </section>
    </main>
  );
}
