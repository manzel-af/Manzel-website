/**
 * The platform's support contacts, as the operator console has them — the
 * same numbers a suspended building is shown in the app. Only the ones that
 * are set appear.
 */

import { Icon, type IconName } from '@/components/ui/icon';
import type { Dictionary } from '@/lib/dictionary';
import { localizeDigits } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import { whatsappLink, type PlatformInfo } from '@/lib/platform';

export function ContactOptions({
  locale,
  dict,
  platform,
}: {
  locale: Locale;
  dict: Dictionary;
  platform: PlatformInfo;
}) {
  const options: { icon: IconName; label: string; value: string; href: string; external?: boolean }[] = [];
  if (platform.supportPhone) {
    options.push({
      icon: 'phone',
      label: dict.common.call,
      value: platform.supportPhone,
      href: `tel:${platform.supportPhone.replace(/[^\d+]/g, '')}`,
    });
  }
  if (platform.supportWhatsapp) {
    options.push({
      icon: 'whatsapp',
      label: dict.common.whatsapp,
      value: platform.supportWhatsapp,
      href: whatsappLink(platform.supportWhatsapp),
      external: true,
    });
  }
  if (platform.supportEmail) {
    options.push({
      icon: 'mail',
      label: dict.common.email,
      value: platform.supportEmail,
      href: `mailto:${platform.supportEmail}`,
    });
  }

  if (options.length === 0) {
    return (
      <p className="flex items-start gap-3 rounded-card border border-dashed border-line-strong bg-surface p-6 leading-relaxed text-fg-muted">
        <Icon name="support" size={22} className="mt-0.5 shrink-0 text-accent" />
        {dict.contactPage.noContacts}
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
        <li key={option.icon}>
          <a
            href={option.href}
            {...(option.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group flex h-full flex-col gap-4 rounded-card border border-line bg-surface p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_24px_48px_-28px_rgba(12,27,49,0.35)]"
          >
            <span
              className={`grid h-12 w-12 place-items-center rounded-2xl ${
                option.icon === 'whatsapp' ? 'bg-success-soft text-success' : 'bg-primary-soft text-primary'
              }`}
            >
              <Icon name={option.icon} size={23} />
            </span>
            <span className="text-sm font-bold text-fg-muted">{option.label}</span>
            <bdi dir="ltr" className="block text-start text-lg font-extrabold text-fg group-hover:text-primary rtl:text-end">
              {option.icon === 'mail' ? option.value : localizeDigits(option.value, locale)}
            </bdi>
          </a>
        </li>
      ))}
    </ul>
  );
}
