/**
 * The app's screens, drawn in HTML.
 *
 * Not screenshots, on purpose: these are a few kilobytes instead of several
 * hundred, perfectly sharp at any size, follow the page into dark mode, and —
 * the real reason — speak the page's language. The Dari page shows the app in
 * Dari with Eastern digits; the English page shows it in English. A screenshot
 * could only ever show one.
 *
 * Everything inside is decorative: the phone is `aria-hidden`, and the page
 * says what it shows in words nearby.
 */

import type { ReactNode } from 'react';

import { LogoMark } from '@/components/brand/logo';
import { Icon, type IconName } from '@/components/ui/icon';
import type { Dictionary } from '@/lib/dictionary';
import { formatMoney, localizeDigits } from '@/lib/format';
import type { Locale } from '@/lib/i18n';

type Mock = Dictionary['mockup'];

/** The handset: bezel, island, and a screen in the app's paper colour. */
export function Phone({
  children,
  className = '',
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      className={`relative w-[272px] shrink-0 rounded-[2.9rem] bg-[#15181d] p-[9px] shadow-[0_40px_80px_-24px_rgba(12,27,49,0.55),0_0_0_1px_rgba(255,255,255,0.06)_inset] ${className}`}
    >
      <div className="relative h-[560px] overflow-hidden rounded-[2.35rem] bg-bg">
        {/* The island, where the camera is. */}
        <div className="absolute inset-x-0 top-2.5 z-20 mx-auto h-6 w-24 rounded-full bg-[#15181d]" />
        <div className="flex h-full flex-col pt-11">{children}</div>
      </div>
    </div>
  );
}

function StatusRow({ title, locale }: { title: string; locale: Locale }) {
  return (
    <div className="flex items-center justify-between px-4 pb-3">
      <div className="flex items-center gap-2">
        <LogoMark size={26} />
        <div className="leading-tight">
          <p className="text-[13px] font-extrabold text-fg">{title}</p>
          <p className="text-[10px] text-fg-subtle">{localizeDigits('1405', locale)}</p>
        </div>
      </div>
      <div className="relative grid h-8 w-8 place-items-center rounded-full bg-surface text-fg-muted shadow-sm">
        <Icon name="bell" size={16} />
        <span className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-danger" />
      </div>
    </div>
  );
}

function TabBar({ active = 0 }: { active?: number }) {
  const icons: IconName[] = ['building', 'bills', 'receipt', 'chat'];
  return (
    <div className="mt-auto flex items-center justify-around border-t border-line bg-surface px-2 pb-5 pt-2.5">
      {icons.map((name, index) => (
        <span
          key={name}
          className={`grid h-9 w-12 place-items-center rounded-2xl ${
            index === active ? 'bg-primary-soft text-primary' : 'text-fg-subtle'
          }`}
        >
          <Icon name={name} size={18} />
        </span>
      ))}
    </div>
  );
}

function Avatar({ name, tone }: { name: string; tone: number }) {
  const tones = [
    'bg-lapis-100 text-lapis-700',
    'bg-saffron-100 text-saffron-600',
    'bg-[#D2EDDD] text-pistachio-500',
    'bg-[#FAD8D4] text-pomegranate-500',
  ];
  return (
    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-extrabold ${tones[tone % 4]}`}>
      {name.trim().charAt(0)}
    </span>
  );
}

/* ------------------------------------------------------------------------ */

/** The manager's home: what came in this month, and from whom. */
export function ManagerScreen({ locale, m }: { locale: Locale; m: Mock }) {
  const payments = [
    { name: m.names[0], flat: '304', amount: 250000 },
    { name: m.names[1], flat: '112', amount: 250000 },
    { name: m.names[2], flat: '207', amount: 320000 },
  ];
  return (
    <>
      <StatusRow title={m.building} locale={locale} />
      <div className="px-4">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-lapis-500 to-lapis-800 p-4 text-white">
          <div className="pointer-events-none absolute -end-8 -top-10 h-32 w-32 rounded-full bg-saffron-300/25 blur-2xl" />
          <p className="text-[11px] text-white/75">{m.collected}</p>
          <p className="mt-1 text-[24px] font-black leading-none">{formatMoney(18450000, locale)}</p>
          <p className="mt-1.5 text-[10px] text-white/65">
            {m.of} {formatMoney(24000000, locale)}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[77%] rounded-full bg-saffron-300" />
          </div>
        </div>
      </div>

      <p className="px-4 pb-2 pt-4 text-[11px] font-bold text-fg-muted">{m.recent}</p>
      <div className="mx-4 divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-sm">
        {payments.map((row, index) => (
          <div key={row.flat} className="flex items-center gap-2.5 px-3 py-2.5">
            <Avatar name={row.name} tone={index} />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[12px] font-bold text-fg">{row.name}</p>
              <p className="text-[10px] text-fg-subtle">
                {m.flat} <bdi>{localizeDigits(row.flat, locale)}</bdi> · {m.cash}
              </p>
            </div>
            <p className="text-[12px] font-extrabold text-success">{formatMoney(row.amount, locale)}</p>
          </div>
        ))}
      </div>
      <TabBar active={0} />
    </>
  );
}

/** The accountant's ledger: where each afghani went. */
export function AccountantScreen({ locale, m }: { locale: Locale; m: Mock }) {
  const lines = [
    { label: m.maintenance, month: m.month, amount: 250000, state: 'allocated' as const },
    { label: m.water, month: m.month, amount: 45000, state: 'allocated' as const },
    { label: m.maintenance, month: m.month, amount: 25000, state: 'credit' as const },
  ];
  return (
    <>
      <StatusRow title={m.ledger} locale={locale} />
      <div className="mx-4 rounded-2xl bg-surface p-3.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Avatar name={m.names[0]} tone={0} />
          <div className="leading-tight">
            <p className="text-[12px] font-bold text-fg">{m.names[0]}</p>
            <p className="text-[10px] text-fg-subtle">
              {m.flat} <bdi>{localizeDigits('304', locale)}</bdi>
            </p>
          </div>
          <span className="ms-auto rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold text-success">
            {m.cash}
          </span>
        </div>
        <p className="mt-3 text-[26px] font-black leading-none text-fg">{formatMoney(320000, locale)}</p>
      </div>

      <div className="mx-4 mt-3 flex flex-col gap-2">
        {lines.map((line, index) => (
          <div
            key={index}
            className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 ${
              line.state === 'credit' ? 'border-dashed border-accent-bright bg-accent-soft/60' : 'border-line bg-surface'
            }`}
          >
            <span
              className={`grid h-7 w-7 place-items-center rounded-full ${
                line.state === 'credit' ? 'bg-saffron-300 text-lapis-950' : 'bg-success-soft text-success'
              }`}
            >
              <Icon name={line.state === 'credit' ? 'sparkle' : 'check'} size={14} strokeWidth={2.4} />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-[12px] font-bold text-fg">{line.state === 'credit' ? m.credit : line.label}</p>
              <p className="text-[10px] text-fg-subtle">
                {line.state === 'credit' ? m.names[0] : `${line.month} · ${m.allocated}`}
              </p>
            </div>
            <p className="text-[12px] font-extrabold text-fg">{formatMoney(line.amount, locale)}</p>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-3 rounded-2xl bg-surface-sunken px-3 py-2.5">
        <p className="text-[10px] text-fg-subtle">{m.receiptNo}</p>
        <p dir="ltr" className="text-start text-[13px] font-extrabold tracking-wide text-fg">BAGH-1405-0042</p>
      </div>
      <TabBar active={2} />
    </>
  );
}

/** A resident's view: all paid, and what the building has said. */
export function ResidentScreen({ locale, m }: { locale: Locale; m: Mock }) {
  return (
    <>
      <StatusRow title={m.building} locale={locale} />
      <div className="px-4">
        <div className="rounded-3xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-[11px] text-fg-muted">{m.balance}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-success text-bg">
              <Icon name="check" size={16} strokeWidth={2.6} />
            </span>
            <p className="text-[18px] font-black text-fg">{m.settled}</p>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-surface-sunken px-3 py-2">
            <span className="text-[10px] text-fg-subtle">{m.nextBill}</span>
            <span className="text-[11px] font-bold text-fg">
              {localizeDigits('1', locale)} {m.month} · {formatMoney(250000, locale)}
            </span>
          </div>
        </div>
      </div>

      <p className="px-4 pb-2 pt-4 text-[11px] font-bold text-fg-muted">{m.notices}</p>
      <div className="mx-4 flex flex-col gap-2">
        {[m.notice1, m.notice2].map((text, index) => (
          <div key={text} className="flex items-start gap-2.5 rounded-2xl bg-surface p-3 shadow-sm">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Icon name="bell" size={15} />
            </span>
            <p className="flex-1 text-[11.5px] font-semibold leading-snug text-fg">{localizeDigits(text, locale)}</p>
            {index === 0 ? (
              <span className="rounded-full bg-danger px-1.5 py-0.5 text-[9px] font-bold text-bg">{m.unread}</span>
            ) : null}
          </div>
        ))}
      </div>
      <TabBar active={1} />
    </>
  );
}

/** The guard's gate: a pass that is expected, and one button. */
export function GuardScreen({ locale, m }: { locale: Locale; m: Mock }) {
  const code = localizeDigits('482719', locale);
  return (
    <>
      <StatusRow title={m.gate} locale={locale} />
      <div className="mx-4 overflow-hidden rounded-3xl border border-line bg-surface shadow-sm">
        <div className="bg-linear-to-br from-lapis-600 to-lapis-900 px-4 pb-5 pt-4 text-white">
          <p className="text-[11px] text-white/70">{m.passCode}</p>
          <p dir="ltr" className="mt-1 text-center text-[30px] font-black tracking-[0.3em]">
            {code}
          </p>
        </div>
        <div className="flex flex-col gap-2.5 p-4">
          <div className="flex items-center gap-2.5">
            <Avatar name={m.names[3]} tone={3} />
            <div className="leading-tight">
              <p className="text-[12px] font-bold text-fg">{m.names[3]}</p>
              <p className="text-[10px] text-fg-subtle">
                {m.flat} <bdi>{localizeDigits('112', locale)}</bdi> · {m.expected}
              </p>
            </div>
            <span className="ms-auto rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold text-success">
              {m.valid}
            </span>
          </div>
          <div className="mt-1 grid h-11 place-items-center rounded-2xl bg-success text-[13px] font-extrabold text-bg">
            {m.checkIn}
          </div>
        </div>
      </div>
      <div className="mx-4 mt-3 divide-y divide-line overflow-hidden rounded-2xl bg-surface-sunken">
        {[
          { time: '09:40', flat: '207' },
          { time: '08:15', flat: '304' },
        ].map((entry) => (
          <div key={entry.time} className="flex items-center gap-2 px-3 py-2 text-fg-muted">
            <Icon name="clock" size={14} />
            <bdi dir="ltr" className="text-[11px] font-bold text-fg">{localizeDigits(entry.time, locale)}</bdi>
            <span className="text-[10.5px]">
              {m.flat} <bdi>{localizeDigits(entry.flat, locale)}</bdi>
            </span>
            <Icon name="check" size={14} strokeWidth={2.4} className="ms-auto text-success" />
          </div>
        ))}
      </div>
      <TabBar active={3} />
    </>
  );
}

/* ------------------------------------------------------------------------ */

/** The receipt that floats beside the hero phone: the product, in one card. */
export function ReceiptCard({ locale, m, className = '' }: { locale: Locale; m: Mock; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`w-[230px] rounded-3xl border border-line bg-surface p-4 shadow-[0_24px_50px_-18px_rgba(12,27,49,0.45)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12px] font-extrabold text-fg">
          <Icon name="receipt" size={16} className="text-primary" />
          {m.receipt}
        </span>
        <span dir="ltr" className="text-[10px] font-bold tracking-wide text-fg-subtle">BAGH-1405-0042</span>
      </div>
      <div className="my-3 border-t border-dashed border-line-strong" />
      <p className="text-[10px] text-fg-subtle">
        {m.flat} <bdi>{localizeDigits('304', locale)}</bdi> · {m.names[0]}
      </p>
      <p className="mt-1 text-[26px] font-black leading-none text-fg">{formatMoney(250000, locale)}</p>
      <div className="mt-3 flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-bold text-success">
        <Icon name="check" size={13} strokeWidth={2.6} />
        {m.paid} · {m.cash}
      </div>
    </div>
  );
}

/** The chip that says the app is fine without a connection. */
export function OfflineChip({ m, className = '' }: { m: Mock; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-[12px] font-bold text-fg shadow-[0_18px_40px_-16px_rgba(12,27,49,0.45)] ${className}`}
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-saffron-100 text-saffron-600">
        <Icon name="wifiOff" size={14} />
      </span>
      {m.offlineChip}
    </div>
  );
}

/**
 * A printed receipt, as the app's PDF draws it: the building, the number,
 * what the money paid off, and a torn edge at the bottom.
 */
export function ReceiptPaper({ locale, m, className = '' }: { locale: Locale; m: Mock; className?: string }) {
  const lines = [
    { label: `${m.maintenance} · ${m.month}`, amount: 250000 },
    { label: `${m.water} · ${m.month}`, amount: 45000 },
  ];
  return (
    // The shadow is a filter on a wrapper: the torn edge is a mask, and a
    // mask would clip an ordinary box-shadow.
    <div aria-hidden="true" className={`drop-shadow-[0_28px_36px_rgba(12,27,49,0.28)] ${className}`}>
    <div className="receipt-edge w-[300px] bg-surface px-6 pb-10 pt-6">
      <div className="flex items-center gap-2.5">
        <LogoMark size={30} />
        <div className="leading-tight">
          <p className="text-[13px] font-extrabold text-fg">{m.building}</p>
          <p className="text-[11px] text-fg-subtle">
            {localizeDigits('12', locale)} {m.month} {localizeDigits('1405', locale)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl bg-surface-sunken px-3 py-2">
        <span className="text-[11px] font-bold text-fg-muted">
          {m.receipt} {m.receiptNo}
        </span>
        <span dir="ltr" className="text-[12px] font-extrabold tracking-wide text-fg">BAGH-1405-0042</span>
      </div>

      <p className="mt-4 text-[12px] text-fg-muted">
        {m.names[0]} · {m.flat} <bdi>{localizeDigits('304', locale)}</bdi>
      </p>

      <div className="mt-3 flex flex-col gap-2.5 border-y border-dashed border-line-strong py-3.5">
        {lines.map((line) => (
          <div key={line.label} className="flex items-center justify-between gap-3 text-[12.5px]">
            <span className="text-fg-muted">{line.label}</span>
            <span className="font-bold text-fg">{formatMoney(line.amount, locale)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex items-center justify-between">
        <span className="text-[13px] font-extrabold text-fg">{m.total}</span>
        <span className="text-[22px] font-black text-fg">{formatMoney(295000, locale)}</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-bold text-success">
          <Icon name="check" size={13} strokeWidth={2.6} />
          {m.paid} · {m.cash}
        </span>
        <span className="grid h-11 w-11 place-items-center rounded-lg border border-line text-fg-muted">
          <Icon name="qr" size={24} />
        </span>
      </div>
    </div>
    </div>
  );
}
