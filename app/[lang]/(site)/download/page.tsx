import type { Metadata } from 'next';

import { OfflineChip, Phone, ResidentScreen } from '@/components/mockups/phone';
import { ContactOptions } from '@/components/sections/contact-options';
import { PageHero } from '@/components/sections/page-hero';
import { ButtonLink } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Container, Heading, Section } from '@/components/ui/section';
import { getDictionary, localeFrom } from '@/lib/dictionary';
import { getPlatformInfo } from '@/lib/platform';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[lang]/download'>): Promise<Metadata> {
  return pageMetadata(await localeFrom(params), 'download');
}

export default async function DownloadPage({ params }: PageProps<'/[lang]/download'>) {
  const locale = await localeFrom(params);
  const dict = getDictionary(locale);
  const page = dict.downloadPage;
  const platform = await getPlatformInfo();
  const { playStore, apk } = site.links;
  const published = Boolean(playStore || apk);
  const requirementIcons: IconName[] = ['android', 'phone', 'wifi'];
  const pathIcons: IconName[] = ['building', 'users'];

  return (
    <>
      <PageHero
        locale={locale}
        home={dict.nav.home}
        breadcrumbLabel={dict.nav.breadcrumb}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        path="/download"
        crumb={dict.nav.download}
        aside={
          <div className="relative mx-auto flex w-full max-w-sm justify-center py-4">
            <div aria-hidden="true" className="arch absolute inset-y-0 inset-x-[6%] bg-linear-to-b from-lapis-500 to-lapis-800 dark:from-lapis-600 dark:to-lapis-950" />
            <div aria-hidden="true" className="absolute inset-x-[22%] top-[20%] h-1/2 rounded-full bg-saffron-300/45 blur-[70px]" />
            <Phone className="relative z-10 mt-8 scale-90 sm:scale-100">
              <ResidentScreen locale={locale} m={dict.mockup} />
            </Phone>
            <OfflineChip m={dict.mockup} className="absolute bottom-16 start-0 z-20 animate-float [--tilt:-3deg]" />
          </div>
        }
      >
        {published ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            {playStore ? (
              <ButtonLink href={playStore} external size="lg" icon="android">
                {dict.common.getItOn} {dict.common.googlePlay}
              </ButtonLink>
            ) : null}
            {apk ? (
              <ButtonLink href={apk} external size="lg" variant="secondary" icon="download">
                {dict.common.downloadApk}
              </ButtonLink>
            ) : null}
          </div>
        ) : (
          <div className="flex max-w-xl items-start gap-3 rounded-2xl border border-accent-bright/50 bg-accent-soft/60 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-saffron-300 text-lapis-950">
              <Icon name="sparkle" size={20} />
            </span>
            <div>
              <p className="font-extrabold text-fg">{dict.common.comingSoon}</p>
              <p className="mt-1 leading-relaxed text-fg-muted">{page.notYet}</p>
            </div>
          </div>
        )}
      </PageHero>

      {published ? null : (
        <Section>
          <Container>
            <Heading title={dict.common.earlyAccess} />
            <div className="reveal mt-8">
              <ContactOptions locale={locale} dict={dict} platform={platform} />
            </div>
          </Container>
        </Section>
      )}

      <Section tone="sunken">
        <Container>
          <Heading title={page.pathsTitle} align="center" />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {page.paths.map((path, index) => (
              <article key={path.title} className="reveal rounded-[1.75rem] border border-line bg-surface p-8 sm:p-10">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-fg-on-primary">
                  <Icon name={pathIcons[index]} size={26} />
                </span>
                <h3 className="mt-6 text-2xl font-black text-fg">{path.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-fg-muted">{path.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading title={page.requirementsTitle} align="center" />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {page.requirements.map((item, index) => (
              <li key={item} className="reveal flex flex-col items-center gap-4 rounded-card border border-line bg-surface p-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <Icon name={requirementIcons[index]} size={23} />
                </span>
                <span className="font-bold leading-relaxed text-fg">{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
