'use client';

/**
 * Light / dark. The page starts in whatever the phone or computer is set to
 * (the inline script in the root layout applies it before the first paint);
 * pressing this stores an explicit choice.
 *
 * Both icons are rendered and CSS shows the right one, so the button looks
 * correct from the first frame and never mismatches during hydration.
 */

import { Icon } from '@/components/ui/icon';

export function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    root.classList.toggle('dark', next === 'dark');
    root.style.colorScheme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Private mode: the choice lasts for this page only, which is fine.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      <span className="sr-only">{label}</span>
      {/* In light mode the button offers dark, and the other way round. */}
      <Icon name="moon" size={18} className="dark:hidden" />
      <Icon name="sun" size={18} className="hidden dark:block" />
    </button>
  );
}
