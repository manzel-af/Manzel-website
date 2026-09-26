'use client';

/**
 * Re-applies the theme whenever the root layout mounts on the client.
 *
 * The inline script in <head> sets the theme before the first paint of a
 * document, but it only runs once per document. When React renders the root
 * layout on the client instead — a 404, for instance — it resets the
 * attributes on <html>, and the `dark` class would be lost. A layout effect
 * runs after that reset and before the browser paints, so nothing flashes.
 */

import { useLayoutEffect } from 'react';

export function ThemeSync() {
  useLayoutEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('theme');
    } catch {
      // Storage blocked: follow the system.
    }
    const dark = stored === 'dark' || (stored !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    root.style.colorScheme = dark ? 'dark' : 'light';
  }, []);
  return null;
}
