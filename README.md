# منزل — Manzel website

The public website for the Manzel app: what it does, what it costs, how it
protects people's data, and how to get it. Dari (default), Pashto and English,
right-to-left done properly, light and dark, in the app's own Lapis & Saffron
brand and fonts.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · no analytics, no trackers.

## Running it

```bash
cp .env.example .env.local   # then fill it in, see below
npm install
npm run dev                   # http://localhost:3000
```

| Script              | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Development server                                                  |
| `npm run build`     | Production build — every page is prerendered to static HTML         |
| `npm start`         | Serve the production build                                          |
| `npm run lint`      | ESLint                                                              |
| `npm run typecheck` | TypeScript, no output                                               |
| `npm run images`    | Re-render the social cards and app icons (needs Chrome or Edge)     |

## Environment

| Variable               | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | The public origin, e.g. `https://www.example.af`. Canonical URLs, hreflang, the sitemap and social cards are built from it — **set it before deploying.** |
| `SUPABASE_URL`         | The app's Supabase project URL.                                        |
| `SUPABASE_ANON_KEY`    | The app's public anon key. Used only to read `platform_settings`.      |

**Never put the service-role key here.** The website needs nothing but public,
anon-readable data.

## Live data from the app

The monthly platform fee, the grace period and the support phone, WhatsApp and
email are read from the same `platform_settings` row the operator console edits
(`lib/platform.ts`). Pages are static and revalidated hourly, so a change in the
console reaches the website within the hour, with no redeploy. If Supabase
cannot be reached, the V025 defaults are shown (500 ؋, 15 days) and the contact
page says contacts are coming soon.

## Where things are

```
app/[lang]/            one folder per page; [lang] is fa | ps | en
  layout.tsx           <html lang dir>, fonts, theme script, header, footer, JSON-LD
  not-found.tsx        404 in the visitor's language
  [...rest]/           any unknown path under a language → that 404
app/global-not-found   404 for paths outside every language
app/sitemap.ts         every page × every language, with hreflang
app/robots.ts, manifest.ts, icon.svg, apple-icon.png
proxy.ts               / → /fa | /ps | /en  (cookie, then Accept-Language, then Dari)

dictionaries/en.ts     the shape every language must match — fa.ts and ps.ts are
                       typed against it, so a missing string fails the build
components/sections/   page sections (hero, home sections, page header, legal)
components/interactive/ the only client islands: role tabs, offline demo, fee calculator
components/mockups/    the app's screens drawn in HTML — localized, sharp, tiny
lib/format.ts          numbers and money exactly as the app prints them (۱٬۵۰۰ ؋)
lib/seo.ts             titles, canonical, hreflang, Open Graph for every page
lib/site.ts            name, URL, store links, brand colours
scripts/generate-images.mts   social cards (public/og) and icons
```

## Things to fill in before launch

- **`NEXT_PUBLIC_SITE_URL`** — the real domain.
- **Store links** — `site.links.playStore` / `apk` in `lib/site.ts`. While they
  are `null`, every "Get the app" button leads to the download page, which
  offers early access through the support contacts instead of a dead badge.
- **Legal review** — the privacy policy and terms (`dictionaries/*.ts`, `legal`)
  describe what the app really does, but have not been reviewed by a lawyer.
  Update the date in `components/sections/legal.tsx` when they change.
- **The name** — "Manzel" is still the build spec's codename. It lives in
  `lib/site.ts` and the dictionaries.

## Conventions

- Logical Tailwind utilities only (`ms-*`, `pe-*`, `start-*`, `text-start`) —
  never `ml-*` / `left-*` — so every page works in both directions.
- Colours come from the semantic tokens in `app/globals.css` (`bg-surface`,
  `text-fg-muted`, …); light and dark differ only there.
- Numbers and money go through `lib/format.ts`, never `toLocaleString`.
- Language links are plain `<a>`, not `<Link>`: a new language is a new
  document (see `components/layout/language-switcher.tsx`).
