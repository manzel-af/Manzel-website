import type { MetadataRoute } from 'next';

import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.wordmark} — ${site.name}`,
    short_name: site.wordmark,
    description: 'Apartment building accounts for Afghanistan — Dari, Pashto and English, offline first.',
    start_url: '/',
    display: 'browser',
    dir: 'rtl',
    lang: 'fa-AF',
    background_color: site.colors.paper,
    theme_color: site.colors.lapis600,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
