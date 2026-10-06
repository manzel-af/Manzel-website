/**
 * English. This file defines the SHAPE every language must match: `fa.ts` and
 * `ps.ts` are typed as `Dictionary`, so a key missing in either fails the
 * build rather than rendering a blank.
 *
 * Every claim here is about something the app actually does — see
 * docs/THREAT-MODEL.md and docs/database/CHANGELOG.md in the app. No invented
 * numbers, no testimonials from people who do not exist.
 *
 * `{name}` placeholders are filled by `fill()` in lib/dictionary.ts.
 */

export const en = {
  meta: {
    siteTitle: 'Manzel — apartment building accounts, made simple',
    siteDescription:
      'Manzel runs an apartment building in Afghanistan: bills, cash receipts, arrears, notices, repairs and the gate — in Dari, Pashto and English, on the Shamsi calendar, and it keeps working without internet.',
    keywords: [
      'apartment management Afghanistan', 'building management app Kabul', 'residential complex app',
      'maintenance fee receipts', 'Dari building app', 'Pashto building app', 'Shamsi calendar billing',
      'offline building management',
    ],
    pages: {
      home: { title: 'Apartment building accounts, made simple', description: '' },
      features: {
        title: 'Features',
        description: 'Everything Manzel does for a building: automatic bills, cash receipts in seconds, arrears, notices, repairs, visitor passes, the building chat and more.',
      },
      pricing: {
        title: 'Pricing',
        description: 'One flat monthly fee per building, shared across its flats. Every feature included, for every resident, manager and guard.',
      },
      security: {
        title: 'Security & privacy',
        description: 'Manzel collects a name and a phone number and nothing else it does not need. Encrypted on the phone, locked by PIN, and no tracking of any kind.',
      },
      download: {
        title: 'Get the app',
        description: 'Get Manzel for Android. Register your building in minutes, or join the one you live in with an invite code or its QR poster.',
      },
      contact: {
        title: 'Contact',
        description: 'Talk to the people who run Manzel — by phone, WhatsApp, email, or the support chat inside the app.',
      },
      privacy: { title: 'Privacy policy', description: 'What Manzel collects, why, how long it keeps it, and who can see it.' },
      terms: { title: 'Terms of use', description: 'The terms for using Manzel.' },
      deleteAccount: { title: 'Delete your account', description: 'How to delete your Manzel account and what is deleted — in the app, or by asking us.' },
    },
  },

  nav: {
    skip: 'Skip to content',
    home: 'Home',
    features: 'Features',
    pricing: 'Pricing',
    security: 'Security',
    download: 'Download',
    contact: 'Contact',
    getApp: 'Get the app',
    menu: 'Menu',
    close: 'Close',
    breadcrumb: 'Breadcrumb',
    language: 'Language',
    theme: { label: 'Theme', light: 'Light', dark: 'Dark', system: 'Automatic' },
  },

  common: {
    perMonth: 'a month',
    perBuilding: 'per building',
    perFlat: 'per flat',
    learnMore: 'Learn more',
    seeAll: 'See every feature',
    comingSoon: 'Coming soon',
    earlyAccess: 'Ask for early access',
    getItOn: 'Get it on',
    googlePlay: 'Google Play',
    appStore: 'App Store',
    downloadApk: 'Download the APK',
    call: 'Call',
    whatsapp: 'WhatsApp',
    email: 'Email',
    illustrative: 'Illustration — names and amounts are examples.',
  },

  /* ---------------------------------------------------------------------- */

  home: {
    hero: {
      eyebrow: 'For apartment buildings in Afghanistan',
      title: 'Every afghani your building collects,',
      titleAccent: 'accounted for.',
      lead:
        'Manzel replaces the notebook, the lost receipts and the arguments about who paid. Bills go out on their own, cash is recorded in seconds, and every resident sees exactly what they owe — even when the internet is down.',
      primary: 'Get the app',
      secondary: 'See how it works',
      chips: ['Works offline', 'Dari · Pashto · English', 'Shamsi calendar', 'Cash first'],
    },

    problem: {
      eyebrow: 'Sound familiar?',
      title: 'A building runs on trust. A notebook is a poor place to keep it.',
      items: [
        {
          title: 'Who paid, and who did not?',
          body: 'Payments live in one person’s notebook. When they are away, nobody knows — and when there is a dispute, it is one memory against another.',
        },
        {
          title: 'Receipts that go missing',
          body: 'A handwritten slip is lost by the end of the month. A resident who paid has no way to prove it, and a manager has no way to check.',
        },
        {
          title: 'Notices nobody saw',
          body: 'The water will be off on Thursday. It went to a WhatsApp group of two hundred messages, and half the building missed it.',
        },
      ],
      turn: 'Manzel keeps the record, so people do not have to.',
    },

    roles: {
      eyebrow: 'One app, four roles',
      title: 'Everyone in the building sees exactly what they need.',
      lead: 'One app for the whole building. Each person sees what their role needs, and nothing that belongs to someone else.',
      tabs: {
        manager: {
          name: 'Building manager',
          headline: 'The whole building, on one screen.',
          points: [
            'Bills generated for every flat on the day you choose each Shamsi month',
            'Record a cash payment in seconds — a numbered receipt goes out at once',
            'See who is behind, by how much and for how long',
            'Post notices, answer repairs, approve people who ask to join',
          ],
        },
        accountant: {
          name: 'Accountant',
          headline: 'Books that add up, every time.',
          points: [
            'Every payment allocated to the oldest bill first, automatically',
            'Gapless receipt numbers, so nothing can go missing quietly',
            'Mistakes are corrected with a reversal, never erased',
            'A full history of who changed what, and when',
          ],
        },
        resident: {
          name: 'Resident',
          headline: 'What you owe, and proof of what you paid.',
          points: [
            'Your balance and every bill, in your own language',
            'A receipt for every payment, saved on your phone',
            'Building notices, with the ones you have not read marked',
            'Report a repair and follow it until it is fixed',
          ],
        },
        guard: {
          name: 'Guard',
          headline: 'A gate that knows who is expected.',
          points: [
            'Check a visitor’s pass code at the gate',
            'Log who came and went, with no photographs taken',
            'The gate log is kept for 30 days, then deleted',
            'The guard’s phone holds almost nothing else',
          ],
        },
      },
    },

    money: {
      eyebrow: 'The money, done right',
      title: 'Cash is recorded in seconds. The receipt is instant.',
      lead: 'Most buildings are paid in cash, so that is what Manzel is built around. The manager picks the flat and the amount; the resident gets a numbered receipt on their phone before the money is in the drawer.',
      steps: [
        { title: 'Bills go out on their own', body: 'On the day you set each Shamsi month, a bill is created for every flat — service charge, water, generator fuel, lift, cleaning, parking.' },
        { title: 'Record the cash', body: 'Choose the flat, type the amount. Manzel pays off the oldest bill first and keeps anything extra as credit.' },
        { title: 'Everyone has the receipt', body: 'A numbered receipt the resident keeps, and a record the manager can never quietly lose. Share it as a PDF in one tap.' },
      ],
    },

    offline: {
      eyebrow: 'Built for how the internet really is',
      title: 'Works without internet. For a week, if it has to.',
      lead: 'Manzel keeps everything on the phone and syncs when it can. Record payments, read bills and check the gate with no connection at all — nothing is lost, and nothing is entered twice.',
      points: [
        'Everything works offline — bills, receipts, notices, the gate',
        'Payments recorded offline are queued, then uploaded once the connection is back',
        'Each one is sent exactly once, even if it is retried',
      ],
      demo: {
        title: 'Try it',
        internet: 'Internet',
        on: 'On',
        off: 'Off',
        record: 'Record a payment',
        waiting: 'Waiting to sync',
        synced: 'Synced',
        empty: 'Record a payment, then switch the internet on and off.',
        flat: 'Flat',
      },
    },

    features: {
      eyebrow: 'Everything a building needs',
      title: 'Far more than a receipt book.',
      items: [
        { key: 'bills', title: 'Automatic bills', body: 'Fixed, per-square-metre or shared charges, generated on the Shamsi month you choose.' },
        { key: 'receipts', title: 'Receipts & statements', body: 'Numbered receipts and full statements as PDFs, in the resident’s language.' },
        { key: 'arrears', title: 'Arrears at a glance', body: 'Who is behind, by how much and how long — sorted, so you know who to call first.' },
        { key: 'notices', title: 'Notices that are read', body: 'Post to the whole building and see who has read it. Schedule them ahead of time.' },
        { key: 'repairs', title: 'Repairs, tracked', body: 'Residents report a problem; the manager answers and marks progress until it is done.' },
        { key: 'gate', title: 'Visitor passes', body: 'Residents create a pass with a code; the guard checks it at the gate.' },
        { key: 'chat', title: 'Building chat', body: 'One room for everyone in the building — messages, photos and voice notes.' },
        { key: 'join', title: 'Join with a QR code', body: 'Print the building’s QR poster. New residents scan it and ask to join; the manager approves.' },
      ],
    },

    privacy: {
      eyebrow: 'Private by design',
      title: 'We collect a name and a phone number. That is all.',
      lead: 'No ID numbers, no photographs of people, no location, no tracking. Data that was never collected can never be misused.',
      items: [
        'Encrypted on the phone, and locked with a PIN',
        'Each building sees only its own records',
        'Signing out erases everything from the phone',
        'No advertising, no analytics, no trackers — in the app or on this site',
      ],
      cta: 'How we protect your building',
    },

    steps: {
      eyebrow: 'Getting started',
      title: 'Your building, running in an afternoon.',
      items: [
        { title: 'Register the building', body: 'Add its name, its flats and what each one pays. It takes minutes, and Manzel checks it before it goes live.' },
        { title: 'Invite everyone', body: 'Share invite codes, or put the building’s QR poster in the entrance. People join in their own language.' },
        { title: 'Collect and relax', body: 'Bills go out every month on their own. You record the cash; Manzel keeps the books.' },
      ],
    },

    pricing: {
      eyebrow: 'Simple pricing',
      title: 'One fee for the whole building, shared between the flats.',
      lead: 'Every feature, for every person in the building. No per-user charges and no surprises.',
      cta: 'See pricing',
    },

    faq: {
      eyebrow: 'Questions',
      title: 'What people ask us first',
      items: [
        { q: 'Does it really work without internet?', a: 'Yes. Everything is kept on the phone and works offline — recording payments, reading bills, checking visitor passes. When the connection comes back, Manzel syncs on its own, and each payment is uploaded exactly once.' },
        { q: 'Which languages does it support?', a: 'Dari, Pashto and English, fully — including right-to-left layout, Eastern digits if you prefer them, and dates on the Shamsi calendar.' },
        { q: 'Can residents pay online?', a: 'Cash is the main way buildings are paid, so recording cash is the fastest thing in the app. Online payment is being prepared for when providers are ready.' },
        { q: 'Who can see a resident’s information?', a: 'Only the people who run that building — the manager and accountant — and only for their own building. Residents see their own flat, never their neighbours’.' },
        { q: 'What does it cost?', a: 'One monthly fee per building, shared between its flats. Everything is included. See the pricing page for the current amount.' },
        { q: 'What phones does it run on?', a: 'Android phones, including older and inexpensive ones. It is built to be small and to work well on modest hardware.' },
      ],
    },

    cta: {
      title: 'Give your building the books it deserves.',
      lead: 'Register in minutes. Your residents will thank you at the end of the month.',
      primary: 'Get the app',
      secondary: 'Talk to us',
    },
  },

  /* ---------------------------------------------------------------------- */

  calculator: {
    title: 'What each flat pays',
    flats: 'Flats in the building',
    building: 'The building pays',
    perFlat: 'Each flat’s share',
    note: 'The fee is for the whole building. Manzel shows each flat its share, rounded up, so the building is never short.',
  },

  featuresPage: {
    eyebrow: 'Features',
    title: 'Everything your building runs on, in one app.',
    lead: 'Manzel started with the money, because that is where buildings struggle most. Then it grew into everything else a building needs — and all of it works offline, in your language.',
    groups: [
      {
        key: 'money',
        title: 'Money',
        body: 'The heart of Manzel: bills, payments and receipts that always add up.',
        items: [
          { title: 'Automatic monthly bills', body: 'Charges per flat, per square metre, or split across the building, generated on the Shamsi day you choose.' },
          { title: 'Cash payments in seconds', body: 'Pick the flat, type the amount. The oldest bill is paid first; anything over is kept as credit.' },
          { title: 'Numbered receipts', body: 'Gapless numbering per building and year, so a missing receipt is impossible to hide.' },
          { title: 'Corrections that leave a trail', body: 'A mistaken payment is reversed, never deleted — the history stays honest.' },
          { title: 'Arrears report', body: 'Who owes, how much, and for how long, with a call button beside each name.' },
          { title: 'Statements and PDFs', body: 'Receipts, bills and full statements as PDFs to share or print, in the reader’s language.' },
        ],
      },
      {
        key: 'community',
        title: 'Communication',
        body: 'The building talks to itself — clearly, and in one place.',
        items: [
          { title: 'Notices with read receipts', body: 'Post to everyone, see who has read it, schedule ahead, pin what matters.' },
          { title: 'Building chat', body: 'A group chat for everyone in the building, with photos and voice messages. Mute it when you need quiet.' },
          { title: 'Repairs', body: 'Residents report a problem with a photo; the manager replies and marks it done.' },
          { title: 'Notifications', body: 'New bills, receipts, notices and replies reach the phone as they happen.' },
        ],
      },
      {
        key: 'gate',
        title: 'Gate & people',
        body: 'Knowing who belongs, without collecting more than you should.',
        items: [
          { title: 'Visitor passes', body: 'A resident creates a pass; the guard checks the code at the gate. No photographs.' },
          { title: 'Join by QR code', body: 'Print the building’s QR poster. People scan it, say who they are and which flat, and the manager approves.' },
          { title: 'Roles and permissions', body: 'Manager, accountant, guard and resident each see only what their role needs.' },
          { title: 'Many buildings, one account', body: 'Manage two buildings and live in a third — switch between them in one tap.' },
        ],
      },
      {
        key: 'platform',
        title: 'Built for here',
        body: 'Made for the way buildings in Afghanistan actually work.',
        items: [
          { title: 'Offline first', body: 'Works for days without a connection, and syncs on its own when it can.' },
          { title: 'Dari, Pashto and English', body: 'Right-to-left done properly, with the digits you prefer.' },
          { title: 'Shamsi calendar', body: 'Every date you see is Solar Hijri — Hamal, Sawr, Jawza — as people really count them.' },
          { title: 'Support from real people', body: 'Chat with the Manzel team inside the app, send a screenshot, and hear back.' },
        ],
      },
    ],
  },

  pricingPage: {
    eyebrow: 'Pricing',
    title: 'One simple fee, for the whole building.',
    lead: 'Manzel charges each building one monthly fee. Its flats share it — so in a building of any real size, each flat pays very little.',
    planName: 'Everything',
    planBody: 'Every feature, for every resident, manager, accountant and guard.',
    includesTitle: 'Included for every building',
    includes: [
      'Unlimited flats, residents and staff',
      'Automatic bills and cash receipts',
      'Arrears, statements and PDF receipts',
      'Notices, repairs and the building chat',
      'Visitor passes and the guard app',
      'Works offline, in Dari, Pashto and English',
      'Support from the Manzel team',
    ],
    howTitle: 'How paying for Manzel works',
    how: [
      { title: 'Once a month', body: 'A fee is issued for the building at the start of each month. Everyone in the building can see it, and what their flat’s share is.' },
      { title: '{grace} days to pay', body: 'The building has {grace} days from when the fee is issued. The app shows how many are left.' },
      { title: 'Pay the way you already do', body: 'Cash, transfer or mobile wallet — contact us and the payment is recorded straight away.' },
    ],
    faq: [
      { q: 'Does every resident pay Manzel separately?', a: 'No. The fee is for the building. Manzel shows each flat its share so it is clear and fair, but the building pays one amount.' },
      { q: 'Is anything extra?', a: 'No. Every feature is included, and there is no charge per person, per message or per receipt.' },
      { q: 'What happens if the fee is late?', a: 'The app shows the days remaining well in advance. If a fee goes unpaid past its due date, the building is paused until it is settled — and it opens again the moment the payment is recorded.' },
    ],
  },

  securityPage: {
    eyebrow: 'Security & privacy',
    title: 'The safest data is the data we never collect.',
    lead: 'Manzel handles people’s money and their homes. We take that seriously — so we collect as little as possible, protect what we do keep, and never track anyone.',
    collectTitle: 'What we collect',
    collectBody: 'A name and a phone number. That is enough to send someone a bill and to call them about it, which is all Manzel does with a person.',
    neverTitle: 'What we never collect',
    never: [
      'National ID or tazkira numbers',
      'Dates of birth',
      'Photographs of people — residents or visitors',
      'Lists of family members',
      'Your location',
      'Visitors’ phone numbers or ID documents',
      'Vehicle number plates',
    ],
    pillars: [
      { title: 'Encrypted on the phone', body: 'The database on each phone is encrypted, with a key kept in the phone’s secure storage. A copied file is useless on its own.' },
      { title: 'Locked with a PIN', body: 'Managers and accountants — who can see everyone’s balance — have a PIN lock on by default. It locks again after two minutes away.' },
      { title: 'Sign out, and it is gone', body: 'Signing out erases everything from the phone, so a shared handset never shows one person’s data to the next.' },
      { title: 'Each building is sealed off', body: 'Every record belongs to one building, and the database itself refuses to show it to anyone outside it.' },
      { title: 'Short memories', body: 'The gate log keeps 30 days, then deletes itself. A log that grows for years is surveillance, not security.' },
      { title: 'No trackers. Anywhere.', body: 'No advertising, no analytics and no third-party trackers — in the app, and on this website.' },
    ],
  },

  downloadPage: {
    eyebrow: 'Get Manzel',
    title: 'Get your building on Manzel.',
    lead: 'Manzel is for Android phones, including older and inexpensive ones.',
    notYet: 'Manzel is opening to buildings now. Contact us and we will get yours set up.',
    requirementsTitle: 'What you need',
    requirements: ['An Android phone', 'A phone number to sign in', 'A connection now and then — not all the time'],
    pathsTitle: 'Two ways to begin',
    paths: [
      { title: 'I run a building', body: 'Register your building from the app: its name, its flats and what each one pays. We check it, and you are live.' },
      { title: 'I live in a building', body: 'Ask your manager for an invite code, or scan the QR poster in your entrance and ask to join.' },
    ],
  },

  contactPage: {
    eyebrow: 'Contact',
    title: 'Talk to the people who run Manzel.',
    lead: 'Questions about getting started, about pricing, or about your building — we answer every one.',
    inApp: 'Already using Manzel? Open Settings → Manzel support to chat with us directly, and send a screenshot if it helps.',
    noContacts: 'Our contact details will be published here shortly. Until then, please use the support chat inside the app.',
  },

  legal: {
    updated: 'Last updated',
    privacy: [
      { title: 'Who we are', body: 'Manzel is an app for running apartment buildings. This policy explains what information Manzel handles, why, and what control you have over it.' },
      { title: 'What we collect', body: 'Your name and phone number (and an email address if you add one), the building and flat you belong to and your role there, and the building’s records — bills, payments, receipts, notices, repair requests, visitor passes, and the messages, photos and voice messages sent in the building chat or to Manzel support. We do not collect ID numbers, dates of birth, family lists or your location: on an iPhone, the weather card can use your location if you allow it, but it stays on your phone and only a rough area of about 10 km is sent to look up the forecast.' },
      { title: 'Why we use it', body: 'Only to run your building: to send bills, record payments, issue receipts, deliver notices and messages, and let the right people in at the gate. We do not sell your information, show you advertising, or use it to profile you.' },
      { title: 'Who can see it', body: 'Your building’s manager and accountant can see the records of their own building. Residents see their own flat. Guards see visitor passes. The Manzel team can access records only to provide support and run the service.' },
      { title: 'Services we use', body: 'Supabase stores the building’s records and files. Expo’s push service, Google Firebase Cloud Messaging and Apple Push Notification service deliver notifications to phones. Open-Meteo looks up the weather. These services handle information only to provide Manzel. Voice and video calls travel directly between phones, or through an encrypted relay when they cannot, and are never recorded.' },
      { title: 'Reports and blocks', body: 'If you report a message, the building’s managers and the Manzel team see the report and what the message said; the writer is not told who reported it. If you block someone, you stop seeing their messages and they cannot call you; they are not told.' },
      { title: 'How long we keep it', body: 'For as long as you are part of the building and the building uses Manzel. The gate log is deleted after 30 days. Sign-in codes are deleted within an hour of expiring.' },
      { title: 'On your phone', body: 'Manzel keeps a copy of your building’s records on your phone so it works offline. That copy is encrypted, and signing out erases it.' },
      { title: 'This website', body: 'This website uses no analytics, no advertising and no tracking cookies. It remembers only your chosen language and theme, on your own device.' },
      { title: 'Your choices', body: 'You can ask to see or correct your information by contacting us, and delete your account at any time (below).' },
      { title: 'Deleting your account', body: 'In the app: Settings → Privacy and safety → Delete account. Without the app: follow the steps on the Delete your account page. We remove your name, phone number and email, your sign-in, your place in every building, what you wrote and sent in building chats, your support conversations, devices and notifications. Payments you recorded, notices you posted, repairs you reported and visitor passes you made stay in the building’s records without your name, because the building’s accounts need them; a record of what was done in the app may be kept for security.' },
      { title: 'Contact', body: 'Questions about privacy can be sent to us using the details on the contact page.' },
    ],
    terms: [
      { title: 'Using Manzel', body: 'Manzel is provided to help apartment buildings manage their accounts, communication and gate. By using it you agree to use it lawfully and only for your building.' },
      { title: 'Accounts', body: 'You are responsible for keeping your phone and sign-in secure. Managers are responsible for the accuracy of the bills and payments they record.' },
      { title: 'The building’s records', body: 'Records belong to the building. Manzel keeps them and makes them available to the people the building has given access to.' },
      { title: 'Fees', body: 'Each building pays a monthly fee, shown in the app and on the pricing page. If a fee remains unpaid after its due date, the building’s access may be paused until it is settled.' },
      { title: 'Acceptable use', body: 'Do not use Manzel to harass anyone, to share unlawful content, or to try to reach records you have not been given. We may suspend accounts that do.' },
      { title: 'Building chat rules', body: 'Be respectful. No insults, threats, hate, sexual content, spam or advertising. Hold a message to report it or to block its writer. Managers remove messages that break these rules, and we may suspend accounts that keep breaking them.' },
      { title: 'Availability', body: 'We work to keep Manzel available and to protect your data, but we cannot promise it will never be interrupted. The app is designed to keep working offline during outages.' },
      { title: 'Changes', body: 'We may update these terms. If a change is significant, we will say so in the app before it takes effect.' },
      { title: 'Contact', body: 'Questions about these terms can be sent to us using the details on the contact page.' },
    ],
    deleteAccount: [
      { title: 'In the app', body: 'Open Manzel and go to Settings → Privacy and safety → Delete account. Read what is deleted, then confirm. It happens at once.' },
      { title: 'Without the app', body: 'Contact us using the details below — by phone, WhatsApp or email — from the phone number or email address of the account, and say that you want it deleted. We delete it as soon as we have confirmed that it is yours.' },
      { title: 'What is deleted', body: 'Your name, phone number and email, your sign-in, your place in every building and office, what you wrote and sent in building chats, your conversations with Manzel’s support and your ideas, and your devices, notifications and call history.' },
      { title: 'What stays', body: 'Payments you recorded, notices you posted, repairs you reported and visitor passes you made stay in the building’s records without your name, because the building’s accounts need them. Your flat’s bills and receipts belong to the building. A record of what was done in the app may be kept for security.' },
      { title: 'If you manage a building', body: 'If you are the only manager of a building or of a complex’s office, make someone else a manager first, so the building is not left without one.' },
    ],
  },

  footer: {
    tagline: 'Apartment accounts, made simple.',
    product: 'Product',
    company: 'Manzel',
    legal: 'Legal',
    rights: 'All rights reserved.',
    noTrackers: 'This site uses no trackers.',
    madeFor: 'Made for the buildings of Afghanistan.',
  },

  notFound: {
    title: 'This page is not in the building.',
    body: 'The page you were looking for does not exist, or has moved.',
    home: 'Back to the home page',
  },

  /**
   * The coming-soon page, shown until launch (lib/mode.ts). It says what the
   * brand is and who it is for — nothing about how the product works.
   */
  soon: {
    metaTitle: 'Manzel — coming soon',
    metaDescription: 'Manzel is coming soon: a new app for the people who live in Afghanistan’s apartment buildings, in Dari, Pashto and English.',
    eyebrow: 'Coming soon',
    title: 'Soon, every home',
    titleAccent: 'lights up.',
    lead: 'We are putting the finishing touches on a new app for the people who live in Afghanistan’s apartment buildings. It opens soon — in Dari, Pashto and English.',
    storesTitle: 'Coming soon to',
    contactTitle: 'Want to be among the first?',
    contactBody: 'We are opening to a small number of buildings first. Get in touch and we will tell you more.',
    noContacts: 'Our contact details will be here shortly.',
    game: {
      label: 'An apartment building at night. Each window is a home.',
      window: 'Home {n}',
      hint: 'Tap a window to switch on its light.',
      progress: '{lit} of {total} homes lit',
      done: 'Every home is lit. That is what we are building.',
      reset: 'Turn the lights off',
    },
  },

  /** Social media artwork (scripts/generate-ads.mts). Never rendered on the site. */
  ads: {
    teaser1: 'Something new is coming home.',
    teaser2: 'The lights are coming on.',
    follow: 'Follow us for the launch',
    earlyAccess: 'Be among the first — message us on WhatsApp',
    nowAvailable: 'Now available',
    slide: 'Slide',
  },

  /** The words inside the illustrated phone screens. */
  mockup: {
    building: 'Bagh-e Bala Residence',
    collected: 'Collected this month',
    of: 'of',
    recent: 'Recent payments',
    receipt: 'Receipt',
    receiptNo: 'No.',
    paid: 'Paid',
    cash: 'Cash',
    flat: 'Flat',
    maintenance: 'Service charge',
    water: 'Water',
    offlineChip: 'Offline — 3 payments waiting',
    balance: 'Your balance',
    settled: 'All paid up',
    nextBill: 'Next bill',
    notices: 'Notices',
    notice1: 'Water off on Thursday, 9–12',
    notice2: 'Generator fuel delivered',
    unread: 'New',
    gate: 'Visitor pass',
    passCode: 'Pass code',
    valid: 'Valid',
    checkIn: 'Let in',
    expected: 'Expected today',
    arrears: 'Behind on payments',
    months: 'months',
    ledger: 'Ledger',
    allocated: 'Paid off',
    credit: 'Credit',
    names: ['Ahmad Rahimi', 'Maryam Noori', 'Farid Sadiqi', 'Zahra Karimi'],
    month: 'Hamal',
    total: 'Total',
  },
};

export type Dictionary = typeof en;
