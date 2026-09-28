import type { Metadata } from 'next';

import { FinalCta } from '@/components/sections/home';
import { PageHero } from '@/components/sections/page-hero';
import { Icon, type IconName } from '@/components/ui/icon';
import { Container, Section } from '@/components/ui/section';
import { getDictionary, localeFrom } from '@/lib/dictionary';
import { localizeDigits } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]/features'>): Promise<Metadata> {
  return pageMetadata(await localeFrom(params), 'features');
}

/** One icon per group, and one per feature inside it, in dictionary order. */
const GROUP_ICONS: Record<string, { icon: IconName; items: IconName[] }> = {
  money: { icon: 'money', items: ['bills', 'money', 'receipt', 'eraser', 'chart', 'download'] },
  community: { icon: 'chat', items: ['bell', 'chat', 'wrench', 'sparkle'] },
  gate: { icon: 'gate', items: ['gate', 'qr', 'users', 'building'] },
  platform: { icon: 'wifiOff', items: ['wifiOff', 'language', 'calendar', 'support'] },
};

export default async function FeaturesPage({ params }: PageProps<'/[lang]/features'>) {
  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  const page = dict.featuresPage;

  return (
    <>
      <PageHero
        locale={locale}
        home={dict.nav.home}
        breadcrumbLabel={dict.nav.breadcrumb}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        path="/features"
        crumb={dict.nav.features}
      >
        {/* Jump links to each group. */}
        <ul className="flex flex-wrap gap-2">
          {page.groups.map((group) => (
            <li key={group.key}>
              <a
                href={`#${group.key}`}
                className="inline-flex items-center gap-2 rounded-pill border border-line bg-surface px-4 py-2 text-sm font-bold text-fg-muted transition-colors hover:border-primary hover:text-primary"
              >
                <Icon name={GROUP_ICONS[group.key].icon} size={16} />
                {group.title}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      {page.groups.map((group, groupIndex) => {
        const icons = GROUP_ICONS[group.key];
        return (
          <Section key={group.key} id={group.key} tone={groupIndex % 2 === 1 ? 'sunken' : 'default'}>
            <Container className="grid gap-10 lg:grid-cols-[1fr_2.2fr] lg:gap-16">
              <div className="reveal lg:sticky lg:top-28 lg:self-start">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-fg-on-primary shadow-[0_14px_30px_-14px_var(--primary)]">
                  <Icon name={icons.icon} size={26} />
                </span>
                <p className="mt-6 text-sm font-extrabold text-accent">
                  {localizeDigits(String(groupIndex + 1).padStart(2, '0'), locale)}
                </p>
                <h2 className="mt-1 text-3xl font-black leading-tight text-fg sm:text-4xl">{group.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-fg-muted">{group.body}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.items.map((item, index) => (
                  <article
                    key={item.title}
                    className="reveal group rounded-card border border-line bg-surface p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_24px_48px_-28px_rgba(12,27,49,0.35)]"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                      <Icon name={icons.items[index] ?? 'check'} size={21} />
                    </span>
                    <h3 className="mt-4 text-lg font-extrabold text-fg">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-fg-muted">{item.body}</p>
                  </article>
                ))}
              </div>
            </Container>
          </Section>
        );
      })}

      <div className="pt-20 sm:pt-28">
        <FinalCta locale={locale} dict={dict} />
      </div>
    </>
  );
}
