/**
 * Every social media artwork, drawn at its exact size.
 *
 *   coming-soon/   post now: brand and "coming soon" only — nothing about
 *                  how the product works (the same rule as the website)
 *   launch-day/    for the day the apps are in the stores: features, screens
 *
 * Sizes: 1080×1080 feed post (Facebook, Instagram, WhatsApp), 1080×1350
 * Instagram portrait post, 1080×1920 story / WhatsApp status, 1640×924
 * Facebook cover, 1080×1080 profile picture.
 */

import type { ReactNode } from 'react';

import { LogoMark } from '@/components/brand/logo';
import {
  ManagerScreen,
  OfflineChip,
  Phone,
  ReceiptCard,
  ReceiptPaper,
  ResidentScreen,
} from '@/components/mockups/phone';
import { Icon, type IconName } from '@/components/ui/icon';
import type { Dictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';

import { Artboard, Brand, Building, Chip, Headline, LIT, levelsFrom, Night, Stores } from './scene';
import { STORY_DURATION, StoryScene, type StoryLabels } from './story';
import { StoryAnimated } from './story-animated';

interface Props {
  locale: Locale;
  dict: Dictionary;
  host: string;
}

function storeNames(dict: Dictionary) {
  return { play: dict.common.googlePlay, apple: dict.common.appStore };
}

/* ======================================================================== */
/* Coming soon                                                               */
/* ======================================================================== */

export function ProfilePicture() {
  return (
    <Artboard file="coming-soon/profile-picture.png" width={1080} height={1080}>
      <Night stars={40} moon="none" mountains={false} seed={7}>
        <div className="absolute inset-[18%] rounded-full bg-saffron-300/25 blur-[120px]" />
        {/* Everything inside the middle circle, so the round crop never cuts it. */}
        <div className="absolute inset-0 grid place-items-center">
          <LogoMark size={560} className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]" />
        </div>
      </Night>
    </Artboard>
  );
}

function TeaserSquare({
  file,
  lit,
  title,
  accent,
  finale = false,
  locale,
  dict,
  host,
  seed,
}: Props & { file: string; lit: readonly number[]; title: string; accent?: string; finale?: boolean; seed: number }) {
  return (
    <Artboard file={file} width={1080} height={1080}>
      <Night seed={seed} moon={seed % 2 ? 'end' : 'start'}>
        <div className="absolute inset-x-0 top-[60px] flex flex-col items-center px-[80px] text-center">
          <Brand zoom={1.45} latin={locale === 'en'} />
          <Chip className="mt-[30px]">{dict.soon.eyebrow}</Chip>
          <Headline className="mt-[24px] text-[64px] leading-[1.22]" title={title} accent={accent} />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div className="absolute bottom-0 h-[60%] w-[70%] rounded-full bg-saffron-300/20 blur-[100px]" style={{ opacity: 0.25 + lit.length / 26 }} />
          <Building levels={levelsFrom(lit)} lamps={finale ? 1 : 0} glow={finale ? 1 : 0} style={{ zoom: 0.93 }} />
        </div>
        {finale ? (
          <div className="absolute inset-x-[44px] bottom-[40px] flex items-end justify-between">
            <StorePill icon="android" name={dict.common.googlePlay} />
            <StorePill icon="apple" name={dict.common.appStore} />
          </div>
        ) : (
          <p dir="ltr" className="absolute bottom-[40px] start-[50px] text-[26px] font-extrabold text-saffron-300">
            {host}
          </p>
        )}
      </Night>
    </Artboard>
  );
}

function StorePill({ icon, name }: { icon: IconName; name: string }) {
  return (
    <span className="inline-flex h-[64px] items-center gap-3 rounded-[20px] border border-white/20 bg-black/35 px-5 text-[22px] font-bold text-white">
      <Icon name={icon} size={28} />
      {name}
    </span>
  );
}

export function ComingSoonPosts(props: Props) {
  const { locale, dict } = props;
  return (
    <>
      <TeaserSquare {...props} seed={11} file={`coming-soon/${locale}/post-1-teaser.png`} lit={LIT.few} title={dict.ads.teaser1} />
      <TeaserSquare {...props} seed={12} file={`coming-soon/${locale}/post-2-teaser.png`} lit={LIT.some} title={dict.ads.teaser2} />
      <TeaserSquare
        {...props}
        seed={13}
        file={`coming-soon/${locale}/post-3-coming-soon.png`}
        lit={LIT.all}
        title={dict.soon.title}
        accent={dict.soon.titleAccent}
        finale
      />
    </>
  );
}

export function ComingSoonPortrait({ locale, dict, host }: Props) {
  return (
    <Artboard file={`coming-soon/${locale}/post-portrait.png`} width={1080} height={1350}>
      <Night seed={21}>
        <div className="absolute inset-x-0 top-[70px] flex flex-col items-center px-[80px] text-center">
          <Brand zoom={1.6} latin={locale === 'en'} />
          <Chip className="mt-[34px]">{dict.soon.eyebrow}</Chip>
          <Headline className="mt-[28px] text-[72px] leading-[1.2]" title={dict.soon.title} accent={dict.soon.titleAccent} />
          <p dir="ltr" className="mt-[22px] text-[28px] font-extrabold text-saffron-300">
            {host}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div className="absolute bottom-0 h-[60%] w-[70%] rounded-full bg-saffron-300/25 blur-[110px]" />
          <Building levels={levelsFrom(LIT.most)} style={{ zoom: 1.12 }} />
        </div>
        <div className="absolute inset-x-[44px] bottom-[44px] flex items-end justify-between">
          <StorePill icon="android" name={dict.common.googlePlay} />
          <StorePill icon="apple" name={dict.common.appStore} />
        </div>
      </Night>
    </Artboard>
  );
}

function storyLabels(dict: Dictionary, host: string): StoryLabels {
  return {
    eyebrow: dict.soon.eyebrow,
    title: dict.soon.title,
    titleAccent: dict.soon.titleAccent,
    follow: dict.ads.follow,
    stores: storeNames(dict),
    host,
  };
}

export function ComingSoonStories({ locale, dict, host }: Props) {
  const labels = storyLabels(dict, host);
  const latin = locale === 'en';
  return (
    <>
      <Artboard file={`coming-soon/${locale}/story.png`} width={1080} height={1920}>
        <StoryScene t={STORY_DURATION} labels={labels} latin={latin} />
      </Artboard>
      {/* The video: the generator draws every frame through window.__adFrame. */}
      <div data-ad-video={`coming-soon/${locale}/story-animated.mp4`} data-duration={STORY_DURATION}>
        <Artboard file={`coming-soon/${locale}/story-animated.mp4`} width={1080} height={1920}>
          <StoryAnimated file={`coming-soon/${locale}/story-animated.mp4`} labels={labels} latin={latin} />
        </Artboard>
      </div>
    </>
  );
}

export function FacebookCover({ locale, dict, host }: Props) {
  return (
    <Artboard file={`coming-soon/${locale}/facebook-cover.png`} width={1640} height={924}>
      <Night seed={31} moon="start">
        {/* Facebook crops the sides on phones: everything that matters sits in the middle 1200px. */}
        <div className="absolute inset-y-0 start-[230px] flex w-[680px] flex-col justify-center">
          <Brand zoom={1.6} latin={locale === 'en'} />
          <div className="mt-[34px]">
            <Chip>{dict.soon.eyebrow}</Chip>
          </div>
          <Headline className="mt-[26px] text-[72px] leading-[1.2]" title={dict.soon.title} accent={dict.soon.titleAccent} />
          <div className="mt-[36px] flex items-center gap-5">
            <StorePill icon="android" name={dict.common.googlePlay} />
            <StorePill icon="apple" name={dict.common.appStore} />
            <span dir="ltr" className="ms-2 text-[26px] font-extrabold text-saffron-300">
              {host}
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 end-[250px]">
          <div className="absolute bottom-0 h-[70%] w-full rounded-full bg-saffron-300/25 blur-[100px]" />
          <Building levels={levelsFrom(LIT.most)} style={{ zoom: 1.2 }} />
        </div>
      </Night>
    </Artboard>
  );
}

/* ======================================================================== */
/* Launch day                                                                */
/* ======================================================================== */

/** Warm paper, the girih, and the two lights — the website's own backdrop. */
function Paper({ children, tone = 'paper' }: { children: ReactNode; tone?: 'paper' | 'band' }) {
  if (tone === 'band') {
    return (
      <div className="girih absolute inset-0 overflow-hidden bg-[#132A4B] text-white [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.06]">
        <div className="absolute -top-[200px] end-[-150px] size-[700px] rounded-full bg-lapis-500/40 blur-[140px]" />
        <div className="absolute -bottom-[260px] start-[-120px] size-[640px] rounded-full bg-saffron-300/20 blur-[140px]" />
        {children}
      </div>
    );
  }
  return (
    <div className="girih absolute inset-0 overflow-hidden bg-[#FBF8F3] text-fg [--girih-opacity:0.05]">
      <div className="absolute -top-[220px] end-[-160px] size-[760px] rounded-full bg-saffron-300/30 blur-[150px]" />
      <div className="absolute -bottom-[260px] start-[-180px] size-[700px] rounded-full bg-lapis-400/20 blur-[150px]" />
      {children}
    </div>
  );
}

/** The phone standing in the lit arch, as on the website's hero. */
function PhoneInArch({ children, zoom }: { children: ReactNode; zoom: number }) {
  return (
    <div className="relative flex justify-center px-[40px] pt-[36px]" style={{ zoom }}>
      <div className="arch absolute inset-x-0 bottom-[-40px] top-0 bg-linear-to-b from-lapis-500 to-lapis-800" />
      <div className="arch girih absolute inset-x-0 bottom-[-40px] top-0 [--girih-color:var(--color-saffron-300)] [--girih-opacity:0.14]" />
      <div className="absolute inset-x-[18%] top-[16%] h-1/2 rounded-full bg-saffron-300/45 blur-[70px]" />
      <Phone className="relative">{children}</Phone>
    </div>
  );
}

function Dots({ index, total = 5, tone = 'paper' }: { index: number; total?: number; tone?: 'paper' | 'band' }) {
  return (
    <div className="absolute inset-x-0 bottom-[44px] flex items-center justify-center gap-3" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-3 rounded-full ${i === index ? 'w-10 bg-saffron-300' : `w-3 ${tone === 'band' ? 'bg-white/30' : 'bg-lapis-200'}`}`}
        />
      ))}
    </div>
  );
}

function Swipe({ tone = 'paper' }: { tone?: 'paper' | 'band' }) {
  return (
    <span
      className={`absolute bottom-[30px] end-[44px] grid size-[64px] place-items-center rounded-full ${
        tone === 'band' ? 'bg-saffron-300 text-lapis-950' : 'bg-[#1E4E8C] text-white'
      }`}
    >
      <Icon name="arrow" size={32} strokeWidth={2.2} />
    </span>
  );
}

function LaunchHero({ locale, dict, host, file, index }: Props & { file: string; index?: number }) {
  return (
    <Artboard file={file} width={1080} height={1080}>
      <Paper>
        <div className="absolute start-[64px] top-[60px]">
          <Brand zoom={1.4} latin={locale === 'en'} light={false} />
        </div>
        <div className="absolute start-[64px] top-[180px] w-[540px]">
          <Chip tone="paper">{dict.ads.nowAvailable}</Chip>
          <Headline tone="paper" className="mt-[28px] text-[60px] leading-[1.24]" title={dict.home.hero.title} accent={dict.home.hero.titleAccent} />
        </div>
        <div className="absolute bottom-[-150px] end-[34px]">
          <PhoneInArch zoom={1.25}>
            <ManagerScreen locale={locale} m={dict.mockup} />
          </PhoneInArch>
        </div>
        <div className="absolute bottom-[240px] end-[405px]">
          <div style={{ zoom: 1.2 }}>
            <ReceiptCard locale={locale} m={dict.mockup} className="rotate-[-5deg]" />
          </div>
        </div>
        {index === undefined ? (
          <div className="absolute bottom-[56px] start-[64px] flex flex-col items-start gap-4">
            <p className="text-[24px] font-bold text-fg-muted">{dict.common.getItOn}</p>
            <div className="flex gap-3">
              <StorePillPaper icon="android" name={dict.common.googlePlay} />
              <StorePillPaper icon="apple" name={dict.common.appStore} />
            </div>
            <p dir="ltr" className="text-[26px] font-extrabold text-[#1E4E8C]">
              {host}
            </p>
          </div>
        ) : (
          <>
            <Dots index={index} />
            <Swipe />
          </>
        )}
      </Paper>
    </Artboard>
  );
}

function StorePillPaper({ icon, name, large = false }: { icon: IconName; name: string; large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-[18px] bg-[#0E1116] font-bold text-white ${
        large ? 'h-[84px] gap-4 px-8 text-[30px]' : 'h-[64px] gap-3 px-5 text-[22px]'
      }`}
    >
      <Icon name={icon} size={large ? 38 : 28} />
      {name}
    </span>
  );
}

export function LaunchPost(props: Props) {
  return <LaunchHero {...props} file={`launch-day/${props.locale}/post.png`} />;
}

export function LaunchStory({ locale, dict, host }: Props) {
  return (
    <Artboard file={`launch-day/${locale}/story.png`} width={1080} height={1920}>
      <Paper>
        <div className="absolute inset-x-0 top-[210px] flex justify-center">
          <Brand zoom={1.8} latin={locale === 'en'} light={false} />
        </div>
        <div className="absolute inset-x-0 top-[340px] flex justify-center">
          <Chip tone="paper">{dict.ads.nowAvailable}</Chip>
        </div>
        <div className="absolute inset-x-[70px] top-[440px] text-center">
          <Headline tone="paper" className="text-[76px] leading-[1.22]" title={dict.home.hero.title} accent={dict.home.hero.titleAccent} />
        </div>
        <div className="absolute inset-x-0 top-[770px] flex justify-center">
          <PhoneInArch zoom={1.6}>
            <ManagerScreen locale={locale} m={dict.mockup} />
          </PhoneInArch>
        </div>
        <div className="absolute start-[36px] top-[1180px]">
          <div style={{ zoom: 1.45 }}>
            <ReceiptCard locale={locale} m={dict.mockup} className="rotate-[-5deg]" />
          </div>
        </div>
        <div className="absolute end-[36px] top-[900px]">
          <div style={{ zoom: 1.5 }}>
            <OfflineChip m={dict.mockup} className="rotate-[3deg]" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-[360px] flex-col items-center justify-center gap-6 bg-linear-to-t from-[#FBF8F3] from-55% to-transparent pt-16">
          <div className="flex gap-4">
            <StorePillPaper icon="android" name={dict.common.googlePlay} large />
            <StorePillPaper icon="apple" name={dict.common.appStore} large />
          </div>
          <p dir="ltr" className="text-[30px] font-extrabold text-[#1E4E8C]">
            {host}
          </p>
        </div>
      </Paper>
    </Artboard>
  );
}

const ROLE_ICONS: IconName[] = ['building', 'chart', 'users', 'gate'];

export function LaunchCarousel(props: Props) {
  const { locale, dict, host } = props;
  const { home } = dict;
  const roles = [home.roles.tabs.manager, home.roles.tabs.accountant, home.roles.tabs.resident, home.roles.tabs.guard];
  const file = (n: number) => `launch-day/${locale}/carousel-${n}.png`;

  return (
    <>
      {/* 1 — the promise */}
      <LaunchHero {...props} file={file(1)} index={0} />

      {/* 2 — cash and receipts */}
      <Artboard file={file(2)} width={1080} height={1080}>
        <Paper>
          <div className="absolute inset-x-[80px] top-[70px] text-center">
            <Chip tone="paper">{home.money.eyebrow}</Chip>
            <Headline tone="paper" className="mt-[26px] text-[58px] leading-[1.25]" title={home.money.title} />
          </div>
          <div className="absolute inset-x-0 bottom-[110px] flex justify-center">
            <div style={{ zoom: 1.5 }}>
              <ReceiptPaper locale={locale} m={dict.mockup} className="rotate-[-3deg]" />
            </div>
          </div>
          <Dots index={1} />
          <Swipe />
        </Paper>
      </Artboard>

      {/* 3 — works offline */}
      <Artboard file={file(3)} width={1080} height={1080}>
        <Paper tone="band">
          <div className="absolute start-[70px] top-[80px] w-[520px]">
            <Chip>{home.offline.eyebrow}</Chip>
            <Headline className="mt-[28px] text-[60px] leading-[1.25]" title={home.offline.title} />
            <ul className="mt-[34px] flex flex-col gap-5">
              {home.offline.points.slice(0, 2).map((point) => (
                <li key={point} className="flex items-start gap-4 text-[26px] leading-snug text-white/80">
                  <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-saffron-300 text-lapis-950">
                    <Icon name="check" size={20} strokeWidth={2.8} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute bottom-[-230px] end-[60px]">
            <div style={{ zoom: 1.2 }}>
              <Phone>
                <ResidentScreen locale={locale} m={dict.mockup} />
              </Phone>
            </div>
          </div>
          <div className="absolute bottom-[190px] end-[250px]">
            <div style={{ zoom: 1.45 }}>
              <OfflineChip m={dict.mockup} className="rotate-[-3deg]" />
            </div>
          </div>
          <Dots index={2} tone="band" />
          <Swipe tone="band" />
        </Paper>
      </Artboard>

      {/* 4 — one app, four roles */}
      <Artboard file={file(4)} width={1080} height={1080}>
        <Paper>
          <div className="absolute inset-x-[80px] top-[64px] text-center">
            <Chip tone="paper">{home.roles.eyebrow}</Chip>
            <Headline tone="paper" className="mt-[24px] text-[54px] leading-[1.25]" title={home.roles.title} />
          </div>
          <div className="absolute inset-x-[70px] top-[400px] grid grid-cols-2 gap-6">
            {roles.map((role, i) => (
              <div key={role.name} className="rounded-[32px] border border-line bg-white p-7 shadow-[0_24px_50px_-30px_rgba(12,27,49,0.4)]">
                <span className="grid size-[64px] place-items-center rounded-[20px] bg-[#1E4E8C] text-white">
                  <Icon name={ROLE_ICONS[i]} size={32} />
                </span>
                <p className="mt-5 text-[30px] font-black text-fg">{role.name}</p>
                <p className="mt-2 text-[22px] leading-snug text-fg-muted">{role.headline}</p>
              </div>
            ))}
          </div>
          <Dots index={3} />
          <Swipe />
        </Paper>
      </Artboard>

      {/* 5 — get it */}
      <Artboard file={file(5)} width={1080} height={1080}>
        <Paper tone="band">
          <div className="absolute inset-x-[90px] top-[110px] flex flex-col items-center text-center">
            <LogoMark size={150} className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]" />
            <Headline className="mt-[40px] text-[64px] leading-[1.22]" title={home.cta.title} />
            <p className="mt-[24px] text-[28px] leading-relaxed text-white/75">{home.cta.lead}</p>
            <div className="mt-[44px]">
              <Stores names={storeNames(dict)} size="lg" />
            </div>
            <p dir="ltr" className="mt-[30px] text-[32px] font-extrabold text-saffron-300">
              {host}
            </p>
          </div>
          <Dots index={4} tone="band" />
        </Paper>
      </Artboard>
    </>
  );
}
