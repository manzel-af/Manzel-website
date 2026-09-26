import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';

import './globals.css';

const vazirmatn = localFont({
  src: './fonts/Vazirmatn-Variable.woff2',
  variable: '--font-vazirmatn',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '404 — منزل Manzel',
  robots: { index: false },
};

/**
 * The 404 for a URL outside every language. It cannot know which language
 * the visitor reads, so it says it in both Dari and English and offers all
 * three.
 */
export default function GlobalNotFound() {
  return (
    // The font is set inline: the stylesheet's stacks also name the afghani
    // and Sansation faces, which this page does not load.
    <html
      lang="fa-AF"
      dir="rtl"
      className={vazirmatn.variable}
      style={{ fontFamily: 'var(--font-vazirmatn), "Segoe UI", Tahoma, system-ui, sans-serif' }}
    >
      <body className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
        <main className="flex max-w-md flex-col items-center">
          <p className="text-sm font-extrabold tracking-[0.3em] text-accent">۴۰۴</p>
          <h1 className="mt-3 text-3xl font-black leading-snug">این صفحه در ساختمان نیست.</h1>
          <p lang="en" dir="ltr" className="mt-2 text-lg text-fg-muted">
            This page is not in the building.
          </p>
          <nav className="mt-8 flex gap-2">
            <Link href="/fa" hrefLang="fa-AF" className="rounded-full bg-primary px-5 py-2.5 font-bold text-fg-on-primary">دری</Link>
            <Link href="/ps" hrefLang="ps-AF" className="rounded-full border border-line px-5 py-2.5 font-bold">پښتو</Link>
            <Link href="/en" hrefLang="en" className="rounded-full border border-line px-5 py-2.5 font-bold">English</Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
