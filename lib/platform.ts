/**
 * The platform's own settings, read live from the same table the operator
 * console edits.
 *
 * The monthly fee and the support contacts are not copy — an operator changes
 * them in the app, and a website that still quoted last month's price would be
 * making a promise the platform no longer keeps. So they are read from
 * `platform_settings`, which RLS lets anon read (V022), with the public anon
 * key the app already ships.
 *
 * Revalidated hourly: every page stays static and instant, and a change in the
 * console reaches the website within the hour without a redeploy. If Supabase
 * is unreachable at build time, the defaults below are used — a slightly stale
 * price beats a failed build.
 */

import 'server-only';

export interface PlatformInfo {
  /** Minor units: 50000 is 500 ؋. */
  monthlyFeeMinor: number;
  currency: string;
  graceDays: number;
  billingEnabled: boolean;
  supportPhone: string | null;
  supportWhatsapp: string | null;
  supportEmail: string | null;
  /** Whether this came from the database or the fallback. */
  live: boolean;
}

/** The V025 defaults, used only when the database cannot be read. */
const FALLBACK: PlatformInfo = {
  monthlyFeeMinor: 50000,
  currency: 'AFN',
  graceDays: 15,
  billingEnabled: true,
  supportPhone: null,
  supportWhatsapp: null,
  supportEmail: null,
  live: false,
};

interface SettingsRow {
  monthly_fee_minor: number | null;
  fee_currency: string | null;
  grace_days: number | null;
  billing_enabled: boolean | null;
  support_phone: string | null;
  support_whatsapp: string | null;
  support_email: string | null;
}

export async function getPlatformInfo(): Promise<PlatformInfo> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return FALLBACK;

  const query = new URLSearchParams({
    select: 'monthly_fee_minor,fee_currency,grace_days,billing_enabled,support_phone,support_whatsapp,support_email',
    id: 'eq.true',
  });

  try {
    const response = await fetch(`${url}/rest/v1/platform_settings?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
      next: { revalidate: 3600, tags: ['platform-settings'] },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return FALLBACK;

    const rows = (await response.json()) as SettingsRow[];
    const row = rows[0];
    if (!row) return FALLBACK;

    return {
      monthlyFeeMinor: row.monthly_fee_minor ?? FALLBACK.monthlyFeeMinor,
      currency: row.fee_currency ?? FALLBACK.currency,
      graceDays: row.grace_days ?? FALLBACK.graceDays,
      billingEnabled: row.billing_enabled ?? FALLBACK.billingEnabled,
      supportPhone: row.support_phone,
      supportWhatsapp: row.support_whatsapp,
      supportEmail: row.support_email,
      live: true,
    };
  } catch {
    return FALLBACK;
  }
}

/** `+93799123456` → a wa.me link, which is what opens WhatsApp on every phone. */
export function whatsappLink(number: string): string {
  return `https://wa.me/${number.replace(/\D/g, '')}`;
}
